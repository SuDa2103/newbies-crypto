import cs from "classnames";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";
import BodyClassName from "react-body-classname";
import { useSearchParam } from "react-use";
import useDarkMode from "use-dark-mode";
import * as config from "../lib/config";
import { mapNotionImageUrl } from "../lib/map-image-url";
import { mapPageUrl } from "../lib/map-page-url";
// utils
import { getBlockTitle } from "../lib/notion-utils/src/get-block-title";
// core notion renderer
import {
  Code,
  Collection,
  CollectionRow,
  NotionRenderer
} from "../lib/react-notion-x";
import { SHARED_SEO } from "../lib/seo-utils";
import * as types from "../lib/types";
import Layout from "../utils/components/Layout";
import Shared from "../utils/components/Shared";
import { Loading } from ".//Loading";
import { Page404 } from ".//Page404";

export const NotionPage: React.FC<types.PageProps> = ({
  site,
  recordMap,
  error,
  pageId
}) => {
  const { status } = useSession();

  const router = useRouter();
  const lite = useSearchParam("lite");

  const params: any = {};
  if (lite) params.lite = lite;

  // lite mode is for oembed
  const isLiteMode = lite === "true";
  const searchParams = new URLSearchParams(params);

  const darkMode = useDarkMode(false, { classNameDark: "dark-mode" });

  if (router.isFallback) {
    return <Loading />;
  }

  const keys = Object.keys(recordMap?.block || {});
  const block = recordMap?.block?.[keys[0]]?.value;

  if (error || !site || !keys.length || !block) {
    return <Page404 site={site} pageId={pageId} error={error} />;
  }

  let title = getBlockTitle(block, recordMap);
  if (pageId === site.rootNotionPageId) {
    title = "Start here";
  }

  // console.log("notion page", {
  //   isDev: config.isDev,
  //   title,
  //   pageId,
  //   rootNotionPageId: site.rootNotionPageId,
  //   recordMap
  // });

  // if (!config.isServer) {
  //   // add important objects to the window global for easy debugging
  //   const g = window as any;
  //   g.pageId = pageId;
  //   g.recordMap = recordMap;
  //   g.block = block;
  // }

  const siteMapPageUrl = mapPageUrl(site, recordMap, searchParams);

  return (
    <>
      <Layout
        title={title}
        nextSeo={
          <>
            <NextSeo
              title={title}
              titleTemplate={`%s - ${process.env.NEXT_PUBLIC_BRAND_NAME}`}
              // the desc will be determined by google
              openGraph={{
                url: process.env.NEXT_PUBLIC_BASE_URL,
                title,
                ...SHARED_SEO.og
              }}
            />
          </>
        }
      >
        {isLiteMode && <BodyClassName className="notion-lite" />}

        <Shared isChapter={true}>
          <NotionRenderer
            bodyClassName={cs(pageId === site.rootNotionPageId && "index-page")}
            components={{
              pageLink: ({
                href,
                as,
                passHref,
                prefetch,
                replace,
                scroll,
                shallow,
                locale,
                ...props
              }) => (
                <Link
                  href={href}
                  as={as}
                  passHref={passHref}
                  prefetch={prefetch}
                  replace={replace}
                  scroll={scroll}
                  shallow={shallow}
                  locale={locale}
                >
                  <a {...props} />
                </Link>
              ),
              code: Code,
              collection: Collection,
              collectionRow: CollectionRow
            }}
            recordMap={recordMap}
            rootPageId={site.rootNotionPageId}
            fullPage={!isLiteMode}
            darkMode={darkMode.value}
            previewImages={site.previewImages !== false}
            defaultPageIcon={config.defaultPageIcon}
            defaultPageCover={config.defaultPageCover}
            defaultPageCoverPosition={config.defaultPageCoverPosition}
            mapPageUrl={siteMapPageUrl}
            mapImageUrl={mapNotionImageUrl}
            willRedact={status !== "authenticated"}
          />
        </Shared>
      </Layout>
    </>
  );
};
