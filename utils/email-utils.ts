import mjml2html from "mjml";
import { BRAND_FONT_URL } from "./constants";
import { generateMjmlElement, logo, textDefs } from "./email-renderer";

export enum EMAIL_TYPES {
  PAYMENT_SUCCEEDED = "PAYMENT_SUCCEEDED",
  SIGNIN = "SIGNIN"
}

export interface EMAIL_API_PAYLOAD<T extends EMAIL_TYPES> {
  emailType: T;
  recipient: string;
  props: {
    subject: string;
    title?: string;

    contentBeforeCta?: string;

    ctaText: string;
    ctaHref: string;

    contentAfterCta?: string;
  };
}

export type HrefAndText = {
  prelude?: string;
  href?: string;
  text: string;
};

export interface PLATFORM_EMAIL {
  type: string;
  subject: string;
  title?: string;
  contentBeforeCta: string;
  cta: HrefAndText;
  ctaBackupLink: HrefAndText;
  contentAfterCta?: string;
}

/**
 * Run the email props thru translation.
 * @param param0
 * @returns
 */
const prepareEmail = <T extends EMAIL_TYPES>({
  payload
}: {
  payload: EMAIL_API_PAYLOAD<T>;
}): PLATFORM_EMAIL => {
  const { emailType, props } = payload;

  return {
    type: emailType,

    subject: props.subject,
    title: props.title,

    contentBeforeCta: props.contentBeforeCta,

    cta: {
      text: props.ctaText,
      href: props.ctaHref
    },
    ctaBackupLink: {
      href: props.ctaHref,
      prelude: "Button not showing?",
      text: "Click here"
    },

    contentAfterCta: props.contentAfterCta
  };
};

/**
 * Add `ViewAction` schema for every email -- because
 * every emails contains some sort of CTA.
 * @param param0
 * @returns
 */
const enrichWithSchemaContent = ({
  emailType,
  content
}: {
  emailType: EMAIL_TYPES;
  content: PLATFORM_EMAIL;
}) => {
  const { title, cta, ctaBackupLink } = content;

  if (!cta || emailType !== EMAIL_TYPES.SIGNIN) {
    // no performable action
    return "";
  }

  // The sign in link is (so far) the only one-click action -- `ConfirmAction`.
  // https://developers.google.com/gmail/markup/reference/one-click-action#json-ld
  return `
      <mj-raw>
        <script type="application/ld+json">
          {
            "@context": "http://schema.org",
            "@type": "EmailMessage",
            "potentialAction": {
              "@type": "ConfirmAction",
              "name": "${cta.text}",
              "handler": {
                "@type": "HttpActionHandler",
                "url": "${ctaBackupLink.href}"
              }
            },
            "description": "${title}"
          }
        </script>
      </mj-raw>
    `;
};

/**
 * Run email content thru mjml and generate HTML.
 * @param param0
 * @returns
 */
export const generateEmail = <T extends EMAIL_TYPES>({
  ...payload
}: EMAIL_API_PAYLOAD<T>) => {
  const { emailType } = payload;
  const content = prepareEmail<T>({ payload });
  const {
    subject,
    title,
    contentBeforeCta,
    cta,
    ctaBackupLink,
    contentAfterCta
  } = content;

  const { html, errors } = mjml2html(
    `<mjml>
        <mj-head>
            ${enrichWithSchemaContent({ emailType, content })}
            <mj-font name="BrandFont" href="${BRAND_FONT_URL}" />
            <mj-attributes>
                ${textDefs.title.classDef}
                ${textDefs.normalText.classDef}
                ${textDefs.link.classDef}
                ${textDefs.cta.classDef}
                ${textDefs.psText.classDef}
            </mj-attributes>
            <mj-title>${title}</mj-title>
        </mj-head>
        <mj-body width="480px" background-color="#FFFFFF">
            <mj-wrapper padding="16px 16px 0">
              <mj-section background-color="#FFFFFF">
                  <mj-column>
                      ${logo}
                      ${
                        title &&
                        generateMjmlElement("title", {
                          text: title
                        })
                      }
                      
                      ${
                        contentBeforeCta &&
                        `
                        <mj-spacer height="24px" />
                        ${generateMjmlElement("normalText", {
                          text: contentBeforeCta
                        })}`
                      }
                      
                      ${
                        cta?.href &&
                        `
                          <mj-spacer height="8px" />
                          ${generateMjmlElement("cta", cta)}
                          <mj-spacer height="16px" />
                          ${generateMjmlElement("link", {
                            prelude: ctaBackupLink.prelude,
                            text: ctaBackupLink.text,
                            href: ctaBackupLink.href
                          })}
                        `
                      }
                  
                      ${
                        contentAfterCta &&
                        `
                        <mj-spacer height="20px" />
                        ${generateMjmlElement("psText", {
                          text: contentAfterCta
                        })}
                        `
                      }
                  </mj-column>
              </mj-section>
            </mj-wrapper>
        </mj-body>
      </mjml>`,
    {
      keepComments: false,
      validationLevel: "soft",
      fonts: {
        BrandFont: BRAND_FONT_URL
      }
    }
  );

  if (errors?.length) {
    console.warn(
      `Generating mjml email succeeded because of 'soft' validation level but there are errors.`,
      { errors }
    );
  }

  return { subject, html };
};
