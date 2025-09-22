import { jobQueue, BulkUploadJob } from './job-queue';
import { PDFLoader } from "@/lib/pdf-loader";
import { DocxLoader } from "@/lib/docx-loader";
import { ExcelLoader } from "@/lib/excel-loader";
import {
  rowsToTextChunks,
  generateChunksFromText,
  generateEmbeddingsFromChunks,
} from "./worker-embedding";
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { embeddings as embeddingsTable, resources } from "@/lib/db/schema";
import { openaiProvider, openaiClient } from "@/lib/ai/providers";
import { generateText } from "ai";

// Initialize database connection for worker
const connectionString = process.env.POSTGRES_URL!;
const client = postgres(connectionString);
const db = drizzle(client);

class BulkUploadWorker {
  private isRunning = false;

  async start() {
    this.isRunning = true;
    console.log('🚀 Bulk upload worker started');

    while (this.isRunning) {
      try {
        const jobId = await jobQueue.getNextJob();
        if (jobId) {
          await this.processJob(jobId);
        }
      } catch (error) {
        console.error('❌ Worker error:', error);
        // Continue processing other jobs
      }
    }
  }

  stop() {
    this.isRunning = false;
    console.log('⏹️ Bulk upload worker stopped');
  }

  private async processJob(jobId: string) {
    console.log(`📝 Processing job ${jobId}`);

    const job = await jobQueue.getJob(jobId);
    if (!job) {
      console.log(`❌ Job ${jobId} not found`);
      return;
    }

    await jobQueue.updateJobStatus(jobId, 'processing', 0);

    const results: BulkUploadJob['results'] = [];
    const totalFiles = job.files.length;

    for (let i = 0; i < job.files.length; i++) {
      const file = job.files[i];
      const progress = Math.round(((i + 1) / totalFiles) * 100);

      try {
        console.log(`📁 Processing file ${i + 1}/${totalFiles}: ${file.name}`);

        const resourceId = await this.processFile(
          file,
          job.companyId,
          job.categoryId
        );

        results.push({
          fileName: file.name,
          status: 'success',
          resourceId
        });

        await jobQueue.updateJobStatus(jobId, 'processing', progress, results);

      } catch (error) {
        console.error(`❌ Error processing file ${file.name}:`, error);

        results.push({
          fileName: file.name,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });

        await jobQueue.updateJobStatus(jobId, 'processing', progress, results);
      }
    }

    await jobQueue.updateJobStatus(jobId, 'completed', 100, results);
    console.log(`✅ Job ${jobId} completed`);
  }

  private async processFile(
    file: { name: string; buffer: Buffer; type: string; size: number },
    companyId: string,
    categoryId: string
  ): Promise<string> {
    const { name, buffer, type } = file;

    // Generate auto description from filename
    const description = `Auto-uploaded file: ${name}`;

    let content: string = "";
    let sheets: Record<string, any[][]> | undefined;
    let chunks: any;
    let embeddingInput: string[];
    let kind: string = "";

    // Process file based on type - same logic as single upload
    if (type === "application/pdf") {
      const pdfLoader = new PDFLoader();
      const rawContent = await pdfLoader.loadFromBuffer(buffer);

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
                filename: name,
              },
            ],
          },
        ],
      });

      content = `Name: ${name}\nDescription: ${description}\n\n Original Content:\n\n${rawContent}\n\nAI Analysis:\n\n${result.text}`;
      kind = "pdf";
    } else if (
      type === "application/vnd.ms-excel" ||
      type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      const excelLoader = new ExcelLoader();
      sheets = await excelLoader.loadExcelFromBuffer(buffer);
      kind = "excel";
    } else if (type === "application/msword") {
      throw new Error("We do not support .doc files. Please upload a .docx file instead.");
    } else if (
      type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const docxLoader = new DocxLoader();
      const rawContent = await docxLoader.loadFromBuffer(buffer);
      content = `Name: ${name}\nDescription: ${description}\n\n Original Content:\n\n${rawContent}\n\nAI `;
      kind = "docx";
    } else if (type === "image/png" || type === "image/jpeg") {
      const base64Image = buffer.toString("base64");
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
                image_url: `data:${type};base64,${base64Image}`,
                detail: "auto",
              },
            ],
          },
        ],
      });
      content = `Name: ${name}\nDescription: ${description}\n\n Original Content:\n\n${response.output_text}\n\nAI Analysis:\n\n${response.output_text}`;
      kind = "image";
    } else if (type === "text/plain") {
      content = `Name: ${name}\nDescription: ${description}\n\n Original Content:\n\n${buffer.toString()}\n\n`;
      kind = "txt";
    } else {
      throw new Error(`Unsupported file type: ${type}`);
    }

    // Generate chunks and embeddings
    if (
      type === "application/vnd.ms-excel" ||
      type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      chunks = rowsToTextChunks(sheets!);
      embeddingInput = chunks.map(
        (chunk: { sheet: string; text: string }) => chunk.text
      );
      content = `Name: ${name}\nDescription: ${description}\n\n Original Content:\n\n${embeddingInput.join(
        "\n\n"
      )}\n\n`;
    } else {
      chunks = await generateChunksFromText(content!);
      embeddingInput = chunks.chunks.map((chunk: any) => chunk.pageContent);
    }

    const embeddings = await generateEmbeddingsFromChunks(embeddingInput);

    // Save to database
    const [resource] = await db
      .insert(resources)
      .values({
        content,
        name,
        description,
        companyId,
        kind: kind as any,
        categoryId,
      })
      .returning();

    await db.insert(embeddingsTable).values(
      embeddings.map((embedding) => ({
        resourceId: resource.id,
        ...embedding,
      }))
    );

    return resource.id;
  }
}

export const bulkUploadWorker = new BulkUploadWorker();