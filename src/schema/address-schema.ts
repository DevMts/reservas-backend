import z from "zod";

export const bodySchema = z.object({
  cep: z.string(),
  road: z.string(),
  neighborhood: z.string(),
  house_number: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
});

export const responseSchema = bodySchema.extend({
  id: z.string(),
});