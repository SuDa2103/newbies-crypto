import { HrefAndText } from "./email-utils";

const fontFamily = `'Avenir Next', 'Inter', Nunito, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'`;
const fontColor = `#282828`;
const colorPrimary = process.env.NEXT_PUBLIC_BRAND_COLOR || "#282828";

export const textDefs = {
  title: {
    className: "paywall_h1",
    classDef: `
        <mj-class 
            name="paywall_h1"
            padding="4px 0px"
            align="left"
            font-family="${fontFamily}"
            font-weight="bold"
            color="${fontColor}"
            line-height="28px"
            font-size="21px" />`
  },
  normalText: {
    className: "paywall_text",
    classDef: `
        <mj-class
            name="paywall_text"
            padding="4px 0px"
            line-height="28px"
            font-family="${fontFamily}"
            color="${fontColor}"
            font-weight="normal"
            font-size="16px" />`
  },
  link: {
    className: "paywall_link",
    classDef: `
        <mj-class
            name="paywall_link"
            padding="4px 0px"
            line-height="28px"
            font-family="${fontFamily}"
            color="${colorPrimary}"
            font-weight="semibold"
            font-size="16px" />`
  },
  cta: {
    className: "paywall_cta",
    classDef: `
        <mj-class
            name="paywall_cta"
            padding="4px 0px"
            line-height="26px"
            font-family="${fontFamily}"
            background-color="${colorPrimary}"
            line-height="38px"
            font-weight="600"
            width="100%"
            border-radius="6px"
            color="#FFFFFF"
            font-size="16px" />`
  },
  // P.S. in the email
  psText: {
    className: "paywall_ps_text",
    classDef: `
        <mj-class
            name="paywall_ps_text"
            padding="4px 0px"
            line-height="28px"
            font-family="${fontFamily}"
            color="${fontColor}"
            font-weight="normal"
            font-style="italic"
            font-size="16px" />`
  }
};

export const logo = `<mj-image padding="0 0 10px 0" width="58px" align="left" src="${process.env.NEXT_PUBLIC_BRAND_LOGO_URL}" />`;

export const generateMjmlElement = (
  type: keyof typeof textDefs,
  content: HrefAndText
) => {
  switch (type) {
    case "title":
    case "normalText":
    case "psText":
      return `
            <mj-text mj-class="${textDefs[type].className}">${content.text}</mj-text>
        `;
    case "link":
      return `
            <mj-text padding="4px 0px" mj-class="${textDefs.normalText.className}">
              ${content.prelude}
                <a style="text-decoration: underline !important; font-weight: 500 !important; color: ${colorPrimary} !important;" href="${content.href}">
                  ${content.text}
                </a>
            </mj-text>
            
        `;
    case "cta":
      return `
            <mj-button padding="4px 0px" mj-class="${textDefs[type].className}" href="${content.href}">
                ${content.text}
            </mj-button>
        `;
  }
};
