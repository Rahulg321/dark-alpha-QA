import { createClient } from 'redis';
import { v4 as uuidv4 } from 'uuid';

export interface BulkUploadJob {
  id: string;
  companyId: string;
  categoryId: string;
  files: Array<{
    name: string;
    buffer: Buffer;
    type: string;
    size: number;
  }>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  createdAt: Date;
  updatedAt: Date;
  results?: Array<{
    fileName: string;
    status: 'success' | 'error';
    resourceId?: string;
    error?: string;
  }>;
}

class JobQueue {
  private client;
  private subscriber;

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
    this.subscriber = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
  }

  async connect() {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
    if (!this.subscriber.isOpen) {
      await this.subscriber.connect();
    }
  }

  async addBulkUploadJob(
    companyId: string,
    categoryId: string,
    files: Array<{ name: string; buffer: Buffer; type: string; size: number }>
  ): Promise<string> {
    await this.connect();

    const jobId = uuidv4();
    const job: BulkUploadJob = {
      id: jobId,
      companyId,
      categoryId,
      files,
      status: 'pending',
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Store job data
    await this.client.hSet(`job:${jobId}`, {
      data: JSON.stringify(job)
    });

    // Add to processing queue
    await this.client.lPush('bulk-upload-queue', jobId);

    // Set expiration (24 hours)
    await this.client.expire(`job:${jobId}`, 24 * 60 * 60);

    return jobId;
  }

  async getJob(jobId: string): Promise<BulkUploadJob | null> {
    await this.connect();

    const jobData = await this.client.hGet(`job:${jobId}`, 'data');
    if (!jobData) return null;

    return JSON.parse(jobData);
  }

  async updateJobStatus(
    jobId: string,
    status: BulkUploadJob['status'],
    progress?: number,
    results?: BulkUploadJob['results']
  ) {
    await this.connect();

    const job = await this.getJob(jobId);
    if (!job) return;

    job.status = status;
    job.updatedAt = new Date();
    if (progress !== undefined) job.progress = progress;
    if (results) job.results = results;

    await this.client.hSet(`job:${jobId}`, {
      data: JSON.stringify(job)
    });

    // Publish status update for real-time updates
    await this.client.publish(`job-status:${jobId}`, JSON.stringify({
      status,
      progress: job.progress,
      results: job.results
    }));
  }

  async getNextJob(): Promise<string | null> {
    await this.connect();

    const jobId = await this.client.brPop({ key: 'bulk-upload-queue', timeout: 10 });
    return jobId?.element || null;
  }

  async subscribeToJobUpdates(jobId: string, callback: (update: any) => void) {
    await this.connect();

    await this.subscriber.subscribe(`job-status:${jobId}`, (message) => {
      callback(JSON.parse(message));
    });
  }

  async unsubscribeFromJobUpdates(jobId: string) {
    await this.subscriber.unsubscribe(`job-status:${jobId}`);
  }

  async disconnect() {
    await this.client.disconnect();
    await this.subscriber.disconnect();
  }
}

export const jobQueue = new JobQueue();