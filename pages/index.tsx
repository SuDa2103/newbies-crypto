import { GetStaticProps } from "next";
import React from "react";
import { NotionPage } from "../components/NotionPage";
import { domain } from "../lib/config";
import { resolveNotionPage } from "../lib/resolve-notion-page";
import { rootNotionPageId } from "../site.config";

export const getStaticProps: GetStaticProps = async () => {
  try {
    const props = await resolveNotionPage(domain, rootNotionPageId);

    return { props, revalidate: 10 };
  } catch (err) {
    console.error("page error", domain, rootNotionPageId, err);

    // we don't want to publish the error version of this page, so
    // let next.js know explicitly that incremental SSG failed
    throw err;
  }
};

export default function NotionDomainDynamicPage(props) {
  return <NotionPage {...props} />;
}
