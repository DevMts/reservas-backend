import z from "zod";

export const bodySchema = z.object({
  date_birth: z.coerce.date(),
  cpf: z.string().length(11).regex(/^\d{11}$/),
  ddd: z.string().length(2).regex(/^\d{2}$/),
  phone: z.string().min(8).max(15),
  id_address: z.string().optional().nullable(),
});

export const userResponse = bodySchema.extend({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  name: z.string(),
  email: z.email(),
  emailVerified: z.boolean(),
});