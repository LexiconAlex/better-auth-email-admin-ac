import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin as adminPlugin } from "better-auth/plugins";
import { ac, admin, user, writer } from "@/lib/premissions";

import prisma from "./prisma";
import { sendMail } from "./mail";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,

    sendResetPassword: async ({ user, url }) => {
      void sendMail(
        user.email,
        "Reset your password",
        `Click the link to reset your password: ${url}`,
      );
    },
    onPasswordReset: async ({ user }) => {
      console.log(`Password for user ${user.email} has been reset.`);
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendMail(
        user.email,
        "Verify your email address",
        `Click the link to verify your email: ${url}`,
      );
    },
  },
  plugins: [
    adminPlugin({
      ac,
      roles: {
        admin,
        user,
        writer,
      },
    }),
  ],
});
