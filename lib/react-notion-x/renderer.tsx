import mediumZoom from "medium-zoom";
import * as notionTypes from "notion-types";
import { ExtendedRecordMap } from "notion-types";
import React from "react";
import siteConfig, { rootNotionPageId } from "../../site.config";
import BuyButton from "../../utils/components/BuyButton";
import { uuidToId } from "../notion-utils/src";
import { Block } from "./block";
import { NotionContextProvider, useNotionContext } from "./context";
import {
  MapImageUrl,
  MapPageUrl,
  NotionComponents,
  SearchNotion
} from "./types";

export interface NotionRendererProps {
  recordMap: ExtendedRecordMap;
  components?: Partial<NotionComponents>;

  mapPageUrl?: MapPageUrl;
  mapImageUrl?: MapImageUrl;
  searchNotion?: SearchNotion;

  rootPageId?: string;
  rootDomain?: string;
  fullPage?: boolean;
  darkMode?: boolean;
  previewImages?: boolean;
  customImages?: boolean;
  showCollectionViewDropdown?: boolean;

  showTableOfContents?: boolean;
  minTableOfContentsItems?: number;

  defaultPageIcon?: string;
  defaultPageCover?: string;
  defaultPageCoverPosition?: number;

  className?: string;
  bodyClassName?: string;

  header?: React.ElementType;
  footer?: React.ReactNode;
  pageHeader?: React.ReactNode;
  pageFooter?: React.ReactNode;
  pageAside?: React.ReactNode;
  pageCover?: React.ReactNode;

  blockId?: string;
  hideBlockId?: boolean;
  disableHeader?: boolean;

  willRedact?: boolean;
  stp?: { order: string[]; stopAtInd: number };
}

interface NotionBlockRendererProps {
  className?: string;
  bodyClassName?: string;
  header?: React.ElementType;
  footer?: React.ReactNode;
  disableHeader?: boolean;

  blockId?: string;
  hideBlockId?: boolean;
  level?: number;
  zoom?: any;

  willRedact?: boolean;
  stp?: { order: string[]; stopAtInd: number };
}

const figureOutWhereToStopTraversing = ({
  recordMap
}: {
  recordMap: notionTypes.ExtendedRecordMap;
}) => {
  const blockRenderOrder: string[] = [];

  const id = Object.keys(recordMap.block)[0];
  const block = recordMap.block[id]?.value;

  const traverse = (b: notionTypes.Block) => {
    if (!b?.id) {
      return;
    }
    blockRenderOrder.push(b?.id);

    b?.content?.map((contentBlockId) => {
      traverse(recordMap.block?.[contentBlockId]?.value);
    });
  };

  traverse(block);

  const blockCount = blockRenderOrder.length;

  const stopAtInd = blockRenderOrder.indexOf(
    blockRenderOrder
      .slice(
        0,
        Math.round(
          (blockCount > 50
            ? // don't show too much of large content
              0.9
            : // don't show too little of shorter content
              0.5) * blockCount
        )
      )
      .pop()
  );

  const prunedId = uuidToId(id);

  return {
    order: blockRenderOrder,
    stopAtInd:
      // display CTA at the bottom for the root page and for the `safePageIds`
      prunedId === rootNotionPageId || siteConfig.safePageIds.includes(prunedId)
        ? blockCount - 1
        : stopAtInd
  };
};

export const NotionRenderer: React.FC<NotionRendererProps> = ({
  components,
  recordMap,
  mapPageUrl,
  mapImageUrl,
  searchNotion,
  fullPage,
  rootPageId,
  rootDomain,
  darkMode,
  previewImages,
  customImages,
  showCollectionViewDropdown,
  showTableOfContents,
  minTableOfContentsItems,
  defaultPageIcon,
  defaultPageCover,
  defaultPageCoverPosition,
  ...rest
}) => {
  const zoom =
    typeof window !== "undefined" &&
    mediumZoom({
      container: ".notion-viewport",
      background: "rgba(0, 0, 0, 0.8)",
      margin: getMediumZoomMargin()
    });

  rest.stp = rest.willRedact
    ? figureOutWhereToStopTraversing({ recordMap })
    : undefined;

  return (
    <NotionContextProvider
      components={components}
      recordMap={recordMap}
      mapPageUrl={mapPageUrl}
      mapImageUrl={mapImageUrl}
      searchNotion={searchNotion}
      fullPage={fullPage}
      rootPageId={rootPageId}
      rootDomain={rootDomain}
      darkMode={darkMode}
      previewImages={previewImages}
      customImages={customImages}
      showCollectionViewDropdown={showCollectionViewDropdown}
      showTableOfContents={showTableOfContents}
      minTableOfContentsItems={minTableOfContentsItems}
      defaultPageIcon={defaultPageIcon}
      defaultPageCover={defaultPageCover}
      defaultPageCoverPosition={defaultPageCoverPosition}
      zoom={zoom}
    >
      <NotionBlockRenderer {...rest} />
      {rest.willRedact && (
        <section className="gateway">
          <BuyButton
            doShowPaymentOptions={true}
            onCurrencyChangedCallback={() => {}}
            promotion={false}
          />
          <div className="blur"></div>
        </section>
      )}
    </NotionContextProvider>
  );
};

export const NotionBlockRenderer: React.FC<NotionBlockRendererProps> = ({
  level = 0,
  blockId,
  ...props
}) => {
  const { recordMap } = useNotionContext();
  const id = blockId || Object.keys(recordMap.block)[0];
  const block = recordMap.block[id]?.value;

  if (!block) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("missing block", blockId);
    }

    return null;
  }

  if (props.stp) {
    const { order, stopAtInd } = props.stp;
    if (order.indexOf(id) >= stopAtInd) {
      return null;
    }
  }

  return (
    <Block key={id} level={level} block={block} {...props}>
      {block?.content?.map((contentBlockId) => (
        <NotionBlockRenderer
          key={contentBlockId}
          blockId={contentBlockId}
          level={level + 1}
          {...props}
        />
      ))}
    </Block>
  );
};

function getMediumZoomMargin() {
  const width = window.innerWidth;

  if (width < 500) {
    return 8;
  } else if (width < 800) {
    return 20;
  } else if (width < 1280) {
    return 30;
  } else if (width < 1600) {
    return 40;
  } else if (width < 1920) {
    return 48;
  } else {
    return 72;
  }
}
