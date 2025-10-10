import z from "zod";

export const bodySchema = z.object({
  price: z.number(),
  description: z.string(),
  id_owner: z.string(),
  id_address: z.string(),
});

export const responseSchema = bodySchema.extend({
  id: z.string(),
  createdAt: z.string(), // valida que é ISO 8601
  updatedAt: z.string(),
  price: z.string(),

})