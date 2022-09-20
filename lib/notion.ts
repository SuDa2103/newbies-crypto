import { NotionAPI } from "notion-client";
import { ExtendedRecordMap } from "notion-types";

export const notion = new NotionAPI({
  authToken: process.env.NOTION_TOKEN
});

export async function getPage(pageId: string): Promise<ExtendedRecordMap> {
  const recordMap = await notion.getPage(pageId);
  return recordMap;
}
