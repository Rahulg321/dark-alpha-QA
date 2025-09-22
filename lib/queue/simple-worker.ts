import { jobQueue, BulkUploadJob } from './job-queue';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { resources } from "@/lib/db/schema";

// Initialize database connection for worker
const connectionString = process.env.POSTGRES_URL!;
const client = postgres(connectionString);
const db = drizzle(client);

class SimpleBulkUploadWorker {
  private isRunning = false;

  async start() {
    this.isRunning = true;
    console.log('🚀 Simple bulk upload worker started (demo mode)');

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
    console.log('⏹️ Simple bulk upload worker stopped');
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

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 2000));

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
    const { name, type } = file;

    // Generate auto description from filename
    const description = `Auto-uploaded file: ${name} (${type})`;

    // Simple content without AI processing
    const content = `Name: ${name}\nDescription: ${description}\nFile Type: ${type}\nSize: ${file.size} bytes\n\nNote: This is a demo upload without AI processing.`;

    // Determine file kind based on type
    let kind: string = "unknown";
    if (type.includes('pdf')) kind = "pdf";
    else if (type.includes('word') || type.includes('document')) kind = "docx";
    else if (type.includes('excel') || type.includes('spreadsheet')) kind = "excel";
    else if (type.includes('image')) kind = "image";
    else if (type.includes('text')) kind = "txt";

    // Save to database (without embeddings for demo)
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

    return resource.id;
  }
}

export const simpleBulkUploadWorker = new SimpleBulkUploadWorker();