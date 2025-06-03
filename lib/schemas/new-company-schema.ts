import { z } from "zod";

export const newCompanySchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  type: z.enum(["enterprise", "consultancy", "agency", "research", "other"], {
    message: "Type is required",
  }),
  website: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  description: z.string().min(1, {
    message: "Description is required",
  }),
});
