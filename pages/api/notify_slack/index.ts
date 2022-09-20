import { WebClient } from "@slack/web-api";
import { NextApiRequest, NextApiResponse } from "next";

// This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID
const conversationId = process.env.SLACK_CHANNEL_ID;

// An access token (from your Slack app or custom integration - xoxp, xoxb)
const token = process.env.SLACK_BOT_TOKEN;

const web = new WebClient(token);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (!req.query.email) {
      throw new Error("No email provided!");
    }

    // See: https://api.slack.com/methods/chat.postMessage
    const resp = await web.chat.postMessage({
      channel: conversationId,
      text: `💰 New purchase!`,
      attachments: [
        {
          color: "#1EC55F",
          fields: [
            {
              title: "Name & Email",
              short: true,
              value: (((req.query.name as string) || "N/A") +
                " / " +
                `\`${req.query.email}\``) as string
            },
            {
              title: "Payment Method",
              short: true,
              value: (req.query.payment_method as string) || "N/A"
            },
            {
              title: "Invited?",
              short: true,
              value: req.query.auto_invited === "yes" ? "🎉" : "❌"
            },
            {
              title: "Receipt URL",
              short: false,
              value: (req.query.receipt_url as string) || "N/A"
            }
          ]
        }
      ]
    });

    // `res` contains information about the posted message
    console.log("Message sent: ", { resp });
    res.status(200).end("OK");
  } catch (err) {
    console.error({ err });
    res.status(500).end("Something failed.");
  }
}
