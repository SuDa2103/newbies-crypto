import { nanoid } from "nanoid";
import { NextApiResponse } from "next";
import nextConnect from "next-connect";
import { endWithError, endWithSuccess } from "../../../utils/api-helpers";
import {
  NotionPaywallApiRequest,
  withPrisma
} from "../../../utils/api-middleware";

export default nextConnect()
  .use(withPrisma)
  .get(async (req: NotionPaywallApiRequest, res: NextApiResponse) => {
    try {
      const { query, headers } = req;
      if (!query?.email) {
        throw new Error("No email provided!");
      }

      if (!headers || headers["x-auth-secret"] !== process.env.AUTH_SECRET) {
        throw new Error("Unauthorized!");
      }

      const email = query.email as string;

      const upsertion = await req.prisma.user.upsert({
        where: {
          email
        },
        create: {
          id: nanoid(),
          email
        },
        // noop
        update: {}
      });

      return endWithSuccess({
        res,
        statusCode: 200,
        email: upsertion?.email
      });
    } catch (err) {
      console.error({ err });
      return endWithError({
        res,
        code: 500
      });
    }
  });
