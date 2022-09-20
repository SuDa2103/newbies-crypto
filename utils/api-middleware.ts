import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { endWithError } from "./api-helpers";

export interface NotionPaywallApiRequest extends NextApiRequest {
  prisma: PrismaClient;
}

export const withPrisma = (
  req: NotionPaywallApiRequest,
  res: NextApiResponse,
  next: any
) => {
  /**
   * Global is used here to maintain a cached connection across hot reloads
   * in development. This prevents connections growing exponentiatlly
   * during API Route usage.
   * https://github.com/vercel/next.js/pull/17666
   */

  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient();
  }

  (req as any).prisma = (global as any).prisma;

  if (!req.prisma) {
    return endWithError({
      res,
      code: 500,
      msg: "se"
    });
  }

  return next();
};
