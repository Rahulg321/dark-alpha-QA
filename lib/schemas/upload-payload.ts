// lib/schemas/upload-payload.ts
import { z } from 'zod';

export const uploadPayloadSchema = z.object({
  jobId: z.string(),
  url: z.string().url().optional(),
  userId: z.string().optional(),
  userEmail: z.string().email().optional(),
  currentFile: z.number().int().positive(),
  totalFiles: z.number().int().positive(),
  fileName: z.string(),
  fileSize: z.number().int().nonnegative(),
  fileType: z.string(),
  status: z.enum(['pending', 'processing', 'completed', 'failed']),
  progress: z.number().min(0).max(100),
  timestamp: z.number().int().positive(),
});

export type UploadPayload = z.infer<typeof uploadPayloadSchema>;

// Validation helper
export function validateUploadPayload(data: unknown): UploadPayload {
  return uploadPayloadSchema.parse(data);
}
