import z from "zod";

export const bodySchema = z.object({
  price: z.number(),
  description: z.string(),
  id_owner: z.string(),
  id_address: z.string(),
});