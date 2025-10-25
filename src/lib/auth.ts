// auth.ts

import { PrismaClient } from "@prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { env } from "@/env";
import { sendEmail } from "./mailser";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }, _request) => {
      console.log(url)
      await sendEmail({
        to: user.email,
        subject: "Redefinição de senha - reservas",
        text: `Clique no link para redefinir sua senha: ${url}`, // fallback simples
        html: `
  <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 24px;">
    <div style="max-width: 480px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden;">
      
      <!-- Cabeçalho -->
      <div style="background-color: #00BC7D; color: white; text-align: center; padding: 20px 0;">
        <h1 style="margin: 0; font-size: 22px;">Redefinir Senha</h1>
      </div>

      <!-- Corpo -->
      <div style="padding: 28px; color: #333333; line-height: 1.6;">
        <p>Olá <strong>${user.name ?? "usuário"}</strong>,</p>
        <p>Recebemos uma solicitação para redefinir sua senha em <strong>reservas.com.br</strong>.</p>
        <p>Para continuar, clique no botão abaixo:</p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${url}" style="
            display: inline-block;
            background-color: #00BC7D;
            color: #ffffff;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 6px;
            font-weight: bold;
            font-size: 15px;
          ">Redefinir Senha</a>
        </div>

        <p>Se você não fez essa solicitação, pode ignorar este e-mail com segurança.</p>
        <p>Por motivos de segurança, o link expira em 30 minutos.</p>

        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 32px 0;" />

        <p style="margin-top: 16px; color: #777; font-size: 12px; text-align: center;">
          © ${new Date().getFullYear()} <strong>reservas.com.br</strong> — Todos os direitos reservados.
        </p>
      </div>
    </div>
  </div>
  `,
      });
    },
    resetPasswordTokenExpiresIn: 30 * 60, // 30 minutos

    onPasswordReset: async ({ user }, _request) => {
      await sendEmail({
        to: user.email,
        subject: "Senha alterada com sucesso",
        text: "Sua senha foi alterada recentemente. Se não foi você, contate nosso suporte imediatamente.",
      });

      console.log(`Password for user ${user.email} has been reset.`);
    },
  },
  trustedOrigins: ["http://localhost:3000"],
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      prompt: "select_account",
    }
  },
  logger: {
    level: "debug" // Adicione isso para ver logs detalhados
  }

});
