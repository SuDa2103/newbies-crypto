import { NextApiRequest, NextApiResponse } from "next";
import { getSiteMaps } from "../../lib/get-site-maps";

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== "GET") {
    return res.status(405).send({ error: "method not allowed" });
  }

  const siteMaps = await getSiteMaps();

  if (!siteMaps?.length) {
    return res.json({});
  }

  // cache sitemap for up to one hour
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=108000, max-age=108000, stale-while-revalidate=108000"
  );

  return res.json(Object.keys(siteMaps[0].canonicalPageMap));
};
