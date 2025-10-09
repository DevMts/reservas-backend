import z from "zod";

export const bodySchema = z.object({
  user: z.string(),
  house: z.string(),
  check_in: z.string(),
  check_out: z.string(),
});

export const responseSchema = bodySchema.extend({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string()
})