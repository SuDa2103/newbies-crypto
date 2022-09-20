import * as types from "notion-types";

/**
 * Gets the raw, unformatted text content of a block's content value.
 *
 * This is useful, for instance, for extracting a block's `title` without any
 * rich text formatting.
 */
export const getTextContent = (text?: types.Decoration[]): string => {
  if (!text) {
    return "";
  } else if (Array.isArray(text)) {
    return (
      text?.reduce(
        (prev, current) =>
          prev + (current[0] !== "⁍" && current[0] !== "‣" ? current[0] : ""),

        ""
      ) ?? ""
    );
  } else {
    return text;
  }
};

export type CodeWithReplacements = {
  content: string;
  replacements: { [key: string]: string };
};

export const getCodeContent = (block?: types.Block): CodeWithReplacements => {
  const resp: CodeWithReplacements = {
    content: "",
    replacements: {}
  };

  const text: types.Decoration[] = block?.properties?.title;
  if (!text) {
    return resp;
  }

  if (Array.isArray(text)) {
    const content = text?.reduce((prev, current) => {
      const [actualText, decorations] = current;

      if (decorations?.length === 1 && decorations?.[0]?.[1]) {
        resp.replacements[
          actualText
        ] = `<span class="notion-decor-code notion-${decorations[0][1]}">${actualText}</span>`;
      }
      return prev + actualText;
    }, "");

    resp.content = content;
  }

  return resp;
};
