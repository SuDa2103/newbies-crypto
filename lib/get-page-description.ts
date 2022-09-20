import { getPageProperty } from "./notion-utils/src";
import * as types from "./types";

export function getPageDescription(
  block: types.Block,
  recordMap: types.ExtendedRecordMap
): string | null {
  return getPageProperty("Description", block, recordMap);
}
