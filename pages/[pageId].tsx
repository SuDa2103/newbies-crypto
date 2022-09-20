import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import React from "react";
import { NotionPage } from "../components/NotionPage";
import { domain, isDev } from "../lib/config";
import { getSiteMaps } from "../lib/get-site-maps";
import { resolveNotionPage } from "../lib/resolve-notion-page";

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const rawPageId = context.params.pageId as string;

  try {
    const props = await resolveNotionPage(domain, rawPageId);

    return { props, revalidate: 10 };
  } catch (err) {
    console.error("page error", domain, rawPageId, err);

    // we don't want to publish the error version of this page, so
    // let next.js know explicitly that incremental SSG failed
    throw err;
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  if (isDev) {
    return {
      paths: [],
      fallback: true
    };
  }

  const siteMaps = await getSiteMaps();

  const ret = {
    paths: siteMaps.flatMap((siteMap) =>
      Object.keys(siteMap.canonicalPageMap)
        .filter(Boolean)
        .map((pageId) => ({
          params: {
            pageId
          }
        }))
    ),
    fallback: true
  };

  return ret;
};

export default function NotionDomainDynamicPage(props) {
  return <NotionPage {...props} />;
}
