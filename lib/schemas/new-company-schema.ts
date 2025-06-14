import { z } from "zod";
import { company } from "../db/schema";

export const newCompanySchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  type: z.enum(company.type.enumValues, {
    message: "Type is required",
  }),
  industry: z.enum(company.industry.enumValues, {
    message: "Industry is required",
  }),
  website: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  description: z.string().min(1, {
    message: "Description is required",
  }),
});
