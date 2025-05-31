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
import { openaiClient } from "@/lib/ai/providers";
import { ExcelLoader } from "@/lib/excel-loader";
import { revalidatePath } from "next/cache";

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

    // Process based on file type
    if (fileType === "application/pdf") {
      // Process PDF
      const pdfLoader = new PDFLoader();
      content = await pdfLoader.loadFromBuffer(buffer);
      kind = "pdf";
    } else if (
      fileType === "application/vnd.ms-excel" ||
      fileType ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      // Process Excel
      const excelLoader = new ExcelLoader();
      sheets = await excelLoader.loadExcelFromBuffer(buffer);
      kind = "excel";
    } else if (
      fileType === "application/msword" ||
      fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      // Process DOC/DOCX
      const docxLoader = new DocxLoader();
      content = await docxLoader.loadFromBuffer(buffer);
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
      content = response.output_text;
      kind = "image";
      console.log("*****************");
    } else if (fileType === "text/plain") {
      content = await file.text();
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
      content = embeddingInput.join("\n\n");
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
