import { z } from "zod";
import { handleBetterAuth } from "@/handlers/auth.handler";
import {
  ChangePasswordResponseSchema,
  ChangePasswordSchema,
  EmailPasswordSchema,
  ErrorResponseSchema,
  SessionResponseSchema,
  SessionSchema,
  SignInResponseSchema,
  SignUpResponseSchema,
  SignUpSchema,
  SuccessResponseSchema,
} from "@/schema/auth-schema";
import type { FastifyTypedInstance } from "@/types";

export async function authRoutes(app: FastifyTypedInstance) {
  // Sign Up
  app.post("/api/auth/sign-up/email", {
    schema: {
      description: "Registers a new user",
      tags: ["Auth"],
      body: SignUpSchema,
      response: {
        200: SignUpResponseSchema,
        400: ErrorResponseSchema,
      },
    },
    handler: handleBetterAuth,
  });

  // Sign In
  app.post("/api/auth/sign-in/email", {
    schema: {
      description: "Logs in with email and password",
      tags: ["Auth"],
      body: EmailPasswordSchema,
      response: {
        200: SignInResponseSchema,
        // 401: ErrorResponseSchema,
      },
    },
    handler: handleBetterAuth,
  });

  // Sign Out
  app.post("/api/auth/sign-out", {
    schema: {
      description: "Logs out the user",
      tags: ["Auth"],
      security: [{ bearerAuth: [] }],
      response: {
        200: SuccessResponseSchema,
      },
    },
    handler: handleBetterAuth,
  });

  // Get Session
  app.get("/api/auth/get-session", {
    schema: {
      description: "Returns the current user session",
      tags: ["Auth"],
      security: [{ bearerAuth: [] }],
      response: {
        200: SessionResponseSchema,
        401: ErrorResponseSchema,
      },
    },
    handler: handleBetterAuth,
  });

  // Change Password
  app.post("/api/auth/change-password", {
    schema: {
      description: "Changes the user's password",
      tags: ["Auth"],
      security: [{ bearerAuth: [] }],
      body: ChangePasswordSchema,
      response: {
        200: ChangePasswordResponseSchema,
        400: ErrorResponseSchema,
        401: ErrorResponseSchema,
      },
    },
    handler: handleBetterAuth,
  });

  // Reset Password Request
  // app.post("/api/auth/forget-password", {
  //   schema: {
  //     description: "Requests a password reset",
  //     tags: ["Autenticação"],
  //     body: ResetPasswordSchema,
  //     // response: {
  //     //   200: SuccessResponseSchema,
  //     //   400: ErrorResponseSchema,
  //     // },
  //   },
  //   handler: handleBetterAuth,
  // });
  //TODO

  // Verify Email
  // app.get("/api/auth/verify-email", {
  //   schema: {
  //     description: "Verifies the user's email",
  //     tags: ["Autenticação"],
  //     querystring: VerifyEmailSchema,
  //     response: {
  //       200: SuccessResponseSchema,
  //       400: ErrorResponseSchema,
  //     },
  //   },
  //   handler: handleBetterAuth,
  // });



  // Update User
  app.patch("/api/auth/update-user", {
    schema: {
      description: "Updates user data",
      tags: ["Auth"],
      security: [{ bearerAuth: [] }],
      body: z.object({
        name: z.string().optional(),
        image: z.url().optional(),
      }),
      response: {
        200: z.object({
          sucess: z.boolean()
        }),
        401: ErrorResponseSchema,
      },
    },
    handler: handleBetterAuth,
  });

  // List Sessions
  app.get("/api/auth/list-sessions", {
    schema: {
      description: "Lists all active user sessions",
      tags: ["Auth"],
      security: [{ bearerAuth: [] }],
      response: {
        200: z.array(SessionSchema),
        401: ErrorResponseSchema,
      },
    },
    handler: handleBetterAuth,
  });

  // Revoke Session
  app.post("/api/auth/revoke-session", {
    schema: {
      description: "Revokes a specific session",
      tags: ["Auth"],
      security: [{ bearerAuth: [] }],
      body: z.object({
        sessionId: z.string(),
      }),
      response: {
        200: SuccessResponseSchema,
        401: ErrorResponseSchema,
      },
    },
    handler: handleBetterAuth,
  });

  // Revoke Other Sessions
  app.post("/api/auth/revoke-other-sessions", {
    schema: {
      description: "Revokes all other sessions except the current one",
      tags: ["Auth"],
      security: [{ bearerAuth: [] }],
      response: {
        200: z.object({
          status: z.boolean(),
        }),
        401: ErrorResponseSchema,
      },
    },
    handler: handleBetterAuth,
  });

  // Catch-all para outras rotas do Better Auth
  app.route({
    method: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    url: "/api/auth/*",
    handler: handleBetterAuth,
  });
}
