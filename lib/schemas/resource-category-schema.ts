import { z } from "zod";

export const resourceCategorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export type ResourceCategorySchema = z.infer<typeof resourceCategorySchema>;
