import { NextRequest, NextResponse } from "next/server";
import { PDFLoader } from "@/lib/pdf-loader";
import { DocxLoader } from "@/lib/docx-loader";
import {
  generateChunksFromText,
  generateEmbeddingsFromChunks,
} from "@/lib/ai/embedding";
import { db } from "@/lib/db/queries";
import { embeddings as embeddingsTable, resources } from "@/lib/db/schema";
import { openaiClient } from "@/lib/ai/providers";

export async function POST(request: NextRequest) {
  try {
    console.log("inside api add resource");

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      throw new Error("No file provided");
    }

    // Get file type
    const fileType = file.type;
    const buffer = await file.arrayBuffer();

    let content: string;

    // Process based on file type
    if (fileType === "application/pdf") {
      // Process PDF
      const pdfLoader = new PDFLoader();
      content = await pdfLoader.loadFromBuffer(buffer);
    } else if (
      fileType === "application/msword" ||
      fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      // Process DOC/DOCX
      const docxLoader = new DocxLoader();
      content = await docxLoader.loadFromBuffer(buffer);
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
      console.log("*****************");
    } else if (fileType === "text/plain") {
      content = await file.text();
    } else {
      throw new Error("Unsupported file type");
    }

    const chunks = await generateChunksFromText(content);
    console.log("Chunks length", chunks.chunks.length);
    const embeddings = await generateEmbeddingsFromChunks(
      chunks.chunks.map((chunk) => chunk.pageContent)
    );

    const [resource] = await db
      .insert(resources)
      .values({ content })
      .returning();

    await db.insert(embeddingsTable).values(
      embeddings.map((embedding) => ({
        resourceId: resource.id,
        ...embedding,
      }))
    );

    console.log("Resource and embeddings were created successfully!!!");

    return NextResponse.json({ content, chunks }, { status: 200 });
  } catch (error) {
    console.error("Error processing file:", error);
    return NextResponse.json(
      { error: "Failed to process file" },
      { status: 500 }
    );
  }
}
