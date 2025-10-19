// lib/mailer.ts

import nodemailer from "nodemailer";
import { env } from "@/env";

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) {
  // Configure seu serviço de SMTP
  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT),
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Reservas" <${env.SMTP_USER}>`,
    to,
    subject,
    text,
    html,
  });
}
