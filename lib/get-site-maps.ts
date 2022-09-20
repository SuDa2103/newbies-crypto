import pMap from "p-map";
import { sleep } from "../utils/constants";
import { getAllPages } from "./get-all-pages";
import { getSites } from "./get-sites";
import * as types from "./types";

export async function getSiteMaps(): Promise<types.SiteMap[]> {
  const sites = await getSites();

  const siteMaps = await pMap(
    sites,
    async (site, index) => {
      try {
        console.log(
          "getSiteMap",
          `${index + 1}/${sites.length}`,
          `(${(((index + 1) / sites.length) * 100) | 0}%)`,
          site
        );

        if (process.env.NODE_ENV !== "development") {
          await sleep(1e3);
        }

        return {
          site,
          ...(await getAllPages(site.rootNotionPageId, site.rootNotionSpaceId))
        } as types.SiteMap;
      } catch (err) {
        console.warn("site build error", index, site, err);
      }
    },
    {
      concurrency: 1
    }
  );

  return siteMaps.filter(Boolean);
}
