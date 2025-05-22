import { NextRequest, NextResponse } from "next/server";
import { PDFLoader } from "@/lib/pdf-loader";
import { DocxLoader } from "@/lib/docx-loader";
import { split } from "sentence-splitter";
import {
  generateChunksFromText,
  generateEmbeddingsFromChunks,
} from "@/lib/ai/embedding";
import { db } from "@/lib/db/queries";
import { embeddings as embeddingsTable, resources } from "@/lib/db/schema";

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

    // Process based on file type
    if (fileType === "application/pdf") {
      // Process PDF
      const pdfLoader = new PDFLoader();
      const content = await pdfLoader.loadFromBuffer(buffer);
      //   const sentences = split(content)
      //     .filter((node) => node.type === "Sentence")
      //     .map((node) => node.raw);

      const chunks = await generateChunksFromText(content);
      console.log("Chunks length", chunks.chunks.length);
      const embeddings = await generateEmbeddingsFromChunks(
        chunks.chunks.map((chunk) => chunk.pageContent)
      );

      console.log("Embeddings length", embeddings.length);

      console.log("creating a resource");
      const [resource] = await db
        .insert(resources)
        .values({ content })
        .returning();

      console.log("Resource created", resource);

      console.log("Embeddings generated");
      await db.insert(embeddingsTable).values(
        embeddings.map((embedding) => ({
          resourceId: resource.id,
          ...embedding,
        }))
      );

      return NextResponse.json({ content, chunks }, { status: 200 });
    } else if (
      fileType === "application/msword" ||
      fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      // Process DOC/DOCX
      const docxLoader = new DocxLoader();
      const content = await docxLoader.loadFromBuffer(buffer);

      return NextResponse.json({ content }, { status: 200 });
    } else {
      throw new Error("Unsupported file type");
    }
  } catch (error) {
    console.error("Error processing file:", error);
    return NextResponse.json(
      { error: "Failed to process file" },
      { status: 500 }
    );
  }
}
