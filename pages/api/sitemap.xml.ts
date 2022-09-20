import { NextApiRequest, NextApiResponse } from "next";
import { host } from "../../lib/config";
import { getSiteMaps } from "../../lib/get-site-maps";
import { SiteMap } from "../../lib/types";

const createSitemap = (
  siteMap: SiteMap
) => `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${host}</loc>
      </url>

      <url>
        <loc>${host}/</loc>
      </url>

      ${Object.keys(siteMap.canonicalPageMap)
        .map((canonicalPagePath) =>
          `
            <url>
              <loc>${host}/${canonicalPagePath}</loc>
            </url>
          `.trim()
        )
        .join("")}
    </urlset>
    `;

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
  res.setHeader("Content-Type", "text/xml");
  console.warn(JSON.stringify(Object.keys(siteMaps[0].canonicalPageMap)));
  res.write(createSitemap(siteMaps[0]));
  res.end();
};
