// lib/redis-publisher.ts
import Redis from 'ioredis';
import { UploadPayload, validateUploadPayload } from './schemas/upload-payload';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
});

const publisher = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
});

/**
 * Publishes upload progress to Redis using:
 * 1. HSET - Stores in hash for backup/history (persistent)
 * 2. PUBLISH - Broadcasts to pub/sub channel for WebSocket (real-time)
 */
export async function publishUploadProgress(payload: UploadPayload) {
  // Validate payload with Zod
  const validatedPayload = validateUploadPayload(payload);

  const { jobId } = validatedPayload;

  // 1. HSET: Store in Redis hash for backup/history
  await redis.hset(
    `job:${jobId}`,
    {
      jobId: validatedPayload.jobId,
      currentFile: validatedPayload.currentFile,
      totalFiles: validatedPayload.totalFiles,
      fileName: validatedPayload.fileName,
      fileSize: validatedPayload.fileSize,
      fileType: validatedPayload.fileType,
      status: validatedPayload.status,
      progress: validatedPayload.progress,
      timestamp: validatedPayload.timestamp,
      url: validatedPayload.url || '',
      userId: validatedPayload.userId || '',
      userEmail: validatedPayload.userEmail || '',
    }
  );

  // Set expiry (1 hour)
  await redis.expire(`job:${jobId}`, 3600);

  // 2. PUBLISH: Broadcast to pub/sub channel for real-time updates
  await publisher.publish(
    'job-updates',
    JSON.stringify(validatedPayload)
  );

  console.log(`📡 Published progress for job ${jobId}: ${validatedPayload.currentFile}/${validatedPayload.totalFiles}`);
}

/**
 * Get job progress from Redis hash (backup store)
 */
export async function getJobProgress(jobId: string) {
  const data = await redis.hgetall(`job:${jobId}`);

  if (!data || Object.keys(data).length === 0) {
    return null;
  }

  return {
    jobId: data.jobId,
    currentFile: parseInt(data.currentFile),
    totalFiles: parseInt(data.totalFiles),
    fileName: data.fileName,
    fileSize: parseInt(data.fileSize),
    fileType: data.fileType,
    status: data.status as 'pending' | 'processing' | 'completed' | 'failed',
    progress: parseFloat(data.progress),
    timestamp: parseInt(data.timestamp),
    url: data.url || undefined,
    userId: data.userId || undefined,
    userEmail: data.userEmail || undefined,
  };
}

export { redis, publisher };
