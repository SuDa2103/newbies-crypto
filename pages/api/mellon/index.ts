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
      if (!req.query.email) {
        throw new Error("No email provided!");
      }

      const email = req.query.email as string;

      const count = await req.prisma.user.count({ where: { email } });

      return endWithSuccess({
        res,
        statusCode: 200,
        allowed: count > 0
      });
    } catch (err) {
      console.error({ err });
      return endWithError({
        res,
        code: 500
      });
    }
  });
