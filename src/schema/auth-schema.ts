// schema/auth-schema.ts
import { z } from "zod";

// Schemas de entrada
export const SignUpSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  image: z.url().optional(),
});

export const EmailPasswordSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  rememberMe: z.boolean().optional(),
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
  revokeOtherSessions: z.boolean().optional(),
});

export const ResetPasswordSchema = z.object({
  email: z.email("Email inválido"),
});

export const VerifyEmailSchema = z.object({
  token: z.string(),
});

// Schemas de resposta
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  image: z.string().url().nullable(),
  emailVerified: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const SessionSchema = z.object({
  id: z.string(),
  token: z.string(),
  expiresAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  ipAddress: z.string(),
  userAgent: z.string(),
  userId: z.string(),
});

export const SignUpResponseSchema = z.object({
  token: z.string(),
  user: UserSchema,
});

export const SignInResponseSchema = z.object({
  redirect: z.boolean(),
  token: z.string(),
  user: UserSchema,
});

export const SessionResponseSchema = z
  .object({
    session: SessionSchema,
    user: UserSchema,
  })
  .nullable();

export const ChangePasswordResponseSchema = z.object({
  token: z.string(),
  user: UserSchema,
});

export const SuccessResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
});


export const ErrorResponseSchema = z.object({
  error: z.string(),
  message: z.string().optional(),
});