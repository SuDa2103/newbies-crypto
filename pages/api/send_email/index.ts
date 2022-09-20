import { NextApiResponse } from "next";
import nextConnect from "next-connect";
import nodemailer from "nodemailer";
import {
  NotionPaywallApiRequest,
  withPrisma
} from "../../../utils/api-middleware";
import { EMAIL_TYPES, generateEmail } from "../../../utils/email-utils";

const FROM_SENDER = process.env.EMAIL_SENDER;

const mailerTransport = nodemailer.createTransport(
  process.env.EMAIL_SMTP_SERVER
);

export default nextConnect()
  .use(withPrisma)
  .get(async (req: NotionPaywallApiRequest, res: NextApiResponse) => {
    try {
      const { email: recipient, email_type, signin_url } = req.query;

      if (!recipient) {
        throw new Error("No email provided!");
      }

      if (!email_type) {
        throw new Error("No email_type provided!");
      }

      let subject = "",
        html = "";

      switch (email_type) {
        case EMAIL_TYPES.PAYMENT_SUCCEEDED:
          ({ subject, html } = generateEmail({
            emailType: EMAIL_TYPES.PAYMENT_SUCCEEDED,
            recipient: recipient as string,
            props: {
              subject: "Purchase Confirmation",
              title: `Welcome to ${process.env.NEXT_PUBLIC_BRAND_NAME}`,

              contentBeforeCta:
                "Thank you for your purchase! Your receipt will follow in a separate email.",

              ctaText: "Download Template Source",
              ctaHref: process.env.PAYWALL_TEMPLATE_SOURCE,

              contentAfterCta: `Go build something great! ✨<br>— Joe from ${process.env.NEXT_PUBLIC_BRAND_NAME}`
            }
          }));
          break;
        case EMAIL_TYPES.SIGNIN:
          ({ subject, html } = generateEmail({
            emailType: EMAIL_TYPES.SIGNIN,
            recipient: recipient as string,
            props: {
              subject: `Sign in to access ${process.env.NEXT_PUBLIC_BRAND_NAME}`,
              title: `Sign in to access ${process.env.NEXT_PUBLIC_BRAND_NAME}`,

              ctaText: "Sign in",
              ctaHref: signin_url as string,

              contentAfterCta: `Enjoy!<br>— Joe from ${process.env.NEXT_PUBLIC_BRAND_NAME}`
            }
          }));
          break;
      }

      if (!subject.length || !html.length) {
        throw new Error("NotImplementedYet!");
      }

      const response = await mailerTransport.sendMail({
        to: recipient,
        from: FROM_SENDER,
        subject,
        html
      });
      console.info(
        `Successfuly sent an email to '${recipient}' with the subject '${subject}'`,
        { response }
      );

      res.status(200).end("OK");
    } catch (err) {
      console.error("Could not send email", { reqQuery: req.query, err });
      res.status(500).end("Something failed.");
    }
  });
