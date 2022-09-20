import { PrismaClient } from ".prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import pickBy from "lodash/pickBy";
import { nanoid } from "nanoid";
import { Account } from "next-auth";
import type {
  Adapter,
  AdapterUser,
  VerificationToken
} from "next-auth/adapters";

// https://github.com/nextauthjs/adapters/blob/canary/packages/prisma/src/index.ts
// and after v4: https://github.com/nextauthjs/adapters/blob/next/packages/prisma/src/index.ts

export const PrismaAdapter = (prisma: PrismaClient) => {
  return {
    displayName: "PRISMA",
    async createUser(profile: AdapterUser) {
      return prisma.user.create({
        data: {
          id: nanoid(),
          name: profile.name,
          email: profile.email,
          image: profile.image,
          emailVerified: profile.emailVerified?.toISOString() ?? null
        }
      });
    },

    getUser(id: string) {
      return prisma.user.findUnique({
        where: { id }
      });
    },

    getUserByEmail(email: string) {
      if (!email) return Promise.resolve(null);
      return prisma.user.findUnique({ where: { email } });
    },

    async getUserByAccount(
      provider_providerAccountId: Pick<
        Account,
        "provider" | "providerAccountId"
      >
    ) {
      const account = await prisma.account.findUnique({
        where: {
          provider_providerAccountId
        },
        select: { user: true }
      });
      return account?.user ?? null;
    },

    updateUser(data: Partial<AdapterUser>) {
      return prisma.user.update({
        where: { id: data.id },
        data: pickBy<Partial<AdapterUser>>(data, (_, key) => key !== "id")
      });
    },

    async deleteUser(userId: string) {
      await prisma.user.delete({
        where: { id: userId }
      });
    },

    async linkAccount(account: Account) {
      await prisma.account.create({
        data: {
          ...account,
          id: nanoid()
        }
      });
    },

    async unlinkAccount(
      provider_providerAccountId: Pick<
        Account,
        "provider" | "providerAccountId"
      >
    ) {
      try {
        return await prisma.account.delete({
          where: {
            provider_providerAccountId
          }
        });
      } catch (error) {
        // If token already used/deleted, just return null
        // https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
        if ((error as PrismaClientKnownRequestError).code === "P2025")
          return null;
        throw error;
      }
    },

    async getSessionAndUser(sessionToken: string) {
      const userAndSession = await prisma.session.findUnique({
        where: { sessionToken },
        include: { user: true }
      });
      if (!userAndSession) return null;
      const { user, ...session } = userAndSession;
      return { user, session };
    },

    createSession(session: Parameters<Adapter["createSession"]>[0]) {
      return prisma.session.create({
        data: {
          ...session,
          id: nanoid()
        }
      });
    },

    updateSession: (session: Parameters<Adapter["updateSession"]>[0]) =>
      prisma.session.update({
        data: pickBy<typeof session>(session, (_, key) => key !== "id"),
        where: { sessionToken: session.sessionToken }
      }),

    async deleteSession(sessionToken: string) {
      await prisma.session.delete({ where: { sessionToken } });
    },

    async createVerificationToken(verificationToken: VerificationToken) {
      await prisma.verificationToken.create({
        data: {
          ...verificationToken,
          id: nanoid()
        }
      });
    },

    async useVerificationToken(params: { identifier: string; token: string }) {
      try {
        return await prisma.verificationToken.delete({
          where: { identifier_token: params }
        });
      } catch (error) {
        // If token already used/deleted, just return null
        // https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
        if ((error as PrismaClientKnownRequestError).code === "P2025")
          return null;
        throw error;
      }
    }
  };
};
