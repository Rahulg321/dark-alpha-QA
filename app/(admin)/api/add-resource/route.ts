import { NextRequest, NextResponse } from "next/server";
import { PDFLoader } from "@/lib/pdf-loader";
import { DocxLoader } from "@/lib/docx-loader";
import {
  rowsToTextChunks,
  generateChunksFromText,
  generateEmbeddingsFromChunks,
} from "@/lib/ai/embedding";
import { db } from "@/lib/db/queries";
import { embeddings as embeddingsTable, resources } from "@/lib/db/schema";
import { openaiProvider, openaiClient } from "@/lib/ai/providers";
import { ExcelLoader } from "@/lib/excel-loader";
import { revalidatePath } from "next/cache";
import { generateText } from "ai";

export async function POST(request: NextRequest) {
  try {
    console.log("inside api add resource");

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const companyId = formData.get("companyId") as string;

    if (!file) {
      throw new Error("No file provided");
    }

    if (!name) {
      throw new Error("No name provided");
    }

    if (!description) {
      throw new Error("No description provided");
    }

    if (!companyId) {
      throw new Error("No company ID provided");
    }

    // Get file type
    const fileType = file.type;
    const buffer = await file.arrayBuffer();

    let content: string = "";
    let sheets: Record<string, any[][]> | undefined;
    let chunks: any;
    let embeddingInput: string[];
    let kind: string = "";

    if (fileType === "application/pdf") {
      const pdfLoader = new PDFLoader();
      const rawContent = await pdfLoader.loadFromBuffer(buffer);

      console.log("analysing pdf using AI");
      const result = await generateText({
        model: openaiProvider.responses("gpt-4o"),
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Please analyze this PDF document and provide a comprehensive summary that includes:

      1. Main Topic and Purpose
    - Identify the primary subject matter
    - Determine the document's intended purpose and audience

    2. Key Points and Arguments
    - Extract and list the main arguments or findings
    - Highlight any significant data points or statistics
    - Note any conclusions or recommendations

    3. Structure and Organization
    - Describe how the document is organized
    - Identify major sections and their purposes

    4. Important Details
    - List any critical dates, names, or figures
    - Note any specific methodologies or approaches discussed
    - Highlight any unique or noteworthy elements

    5. Context and Implications
    - Discuss the broader context or background
    - Note any potential implications or applications

    Please format your response in a clear, structured manner that makes it easy to understand the document's key elements.`,
              },
              {
                type: "file",
                data: buffer,
                mimeType: "application/pdf",
                filename: file.name,
              },
            ],
          },
        ],
      });

      console.log("Result from analysing pdf using AI", result.text);

      // Combine raw content with AI summary
      content = `Name: ${name}\nDescription: ${description}\n\n Original Content:\n\n${rawContent}\n\nAI Analysis:\n\n${result.text}`;
      kind = "pdf";
    } else if (
      fileType === "application/vnd.ms-excel" ||
      fileType ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      const excelLoader = new ExcelLoader();
      sheets = await excelLoader.loadExcelFromBuffer(buffer);
      kind = "excel";
    } else if (fileType === "application/msword") {
      throw new Error(
        "We do not support .doc files. Please upload a .docx file instead."
      );
    } else if (
      fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      console.log("reading from a .docx document");
      const docxLoader = new DocxLoader();
      const rawContent = await docxLoader.loadFromBuffer(buffer);

      console.log("analysing docx using AI");
      content = `Name: ${name}\nDescription: ${description}\n\n Original Content:\n\n${rawContent}\n\nAI `;
      kind = "docx";
    } else if (fileType === "image/png" || fileType === "image/jpeg") {
      console.log("*****************");
      console.log("processing image");
      const base64Image = Buffer.from(buffer).toString("base64");
      const response = await openaiClient.responses.create({
        model: "gpt-4o-mini",
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: "Can you properly analyse this image for please. Extract any relevant text from the image which you may find relevant to the topic of the image. If you find any text, please extract it and return it as a string. If you don't find any text, please return an empty string. Apart from the text, give your detailed analysis of the image",
              },
              {
                type: "input_image",
                image_url: `data:${fileType};base64,${base64Image}`,
                detail: "auto", // or "low" or "high"
              },
            ],
          },
        ],
      });
      content = `Name: ${name}\nDescription: ${description}\n\n Original Content:\n\n${response.output_text}\n\nAI Analysis:\n\n${response.output_text}`;
      console.log("Result of analysing image using AI", response.output_text);
      kind = "image";
      console.log("*****************");
    } else if (fileType === "text/plain") {
      content = `Name: ${name}\nDescription: ${description}\n\n Original Content:\n\n${await file.text()}\n\n`;
      kind = "txt";
    } else {
      throw new Error("Unsupported file type");
    }

    if (
      fileType === "application/vnd.ms-excel" ||
      fileType ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      chunks = rowsToTextChunks(sheets!);
      embeddingInput = chunks.map(
        (chunk: { sheet: string; text: string }) => chunk.text
      );
      // For response, join all chunk texts
      content = `Name: ${name}\nDescription: ${description}\n\n Original Content:\n\n${embeddingInput.join(
        "\n\n"
      )}\n\n`;
      console.log("chunks", chunks);
    } else {
      chunks = await generateChunksFromText(content!);
      embeddingInput = chunks.chunks.map((chunk: any) => chunk.pageContent);
      console.log("Chunks length", chunks.chunks.length);
    }

    const embeddings = await generateEmbeddingsFromChunks(embeddingInput);
    const [resource] = await db
      .insert(resources)
      .values({ content, name, description, companyId, kind: kind as any })
      .returning();

    await db.insert(embeddingsTable).values(
      embeddings.map((embedding) => ({
        resourceId: resource.id,
        ...embedding,
      }))
    );

    revalidatePath(`/admin/companies/${companyId}`);

    console.log("Resource and embeddings were created successfully!!!");

    return NextResponse.json({ content }, { status: 200 });
  } catch (error) {
    console.error("Error processing file:", error);
    return NextResponse.json(
      { error: "Failed to process file" },
      { status: 500 }
    );
  }
}
