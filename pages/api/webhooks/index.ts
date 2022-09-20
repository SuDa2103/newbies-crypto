import { buffer } from "micro";
import Cors from "micro-cors";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { EMAIL_TYPES } from "../../../utils/email-utils";
import restClient from "../../../utils/rest-module";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2020-08-27"
});

const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!;

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false
  }
};

const cors = Cors({
  allowMethods: ["POST", "HEAD"]
});

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"]!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        buf.toString(),
        sig,
        webhookSecret
      );
    } catch (err) {
      // On error, log and return the error message.
      console.log(`❌ Error message: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Successfully constructed event.
    console.log("✅ Success:", event.id);

    // Cast event data to Stripe object.
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`💰 PaymentIntent status: ${paymentIntent.status}`);
    } else if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(
        `❌ Payment failed: ${paymentIntent.last_payment_error?.message}`
      );
    } else if (event.type === "charge.succeeded") {
      const charge = event.data.object as Stripe.Charge;
      console.log(`💵 Charge id: ${charge.id}`);

      let auto_invited = false;
      const email = charge.billing_details.email;

      try {
        const upsertion = await restClient().get(`/api/upsert_user`, {
          // prevent unauthorized user upserts
          headers: {
            "x-auth-secret": process.env.AUTH_SECRET
          },
          params: {
            email: charge.billing_details.email
          }
        });
        if (upsertion?.data?.email === email) {
          auto_invited = true;
        }
      } catch (inviterErr) {
        console.error({ inviterErr });
      }

      try {
        await restClient().get(`/api/notify_slack`, {
          params: {
            name: charge.billing_details.name,
            email: charge.billing_details.email,
            payment_method: charge.payment_method_details.type,
            receipt_url: charge.receipt_url,
            auto_invited: auto_invited === true ? "yes" : "no"
          }
        });
      } catch (slackErr) {
        console.error({ slackErr });
      }

      try {
        await restClient().get(`/api/send_email`, {
          params: {
            email: charge.billing_details.email,
            email_type: EMAIL_TYPES.PAYMENT_SUCCEEDED,
            receipt_url: charge.receipt_url
          }
        });
      } catch (emailErr) {
        console.error({ emailErr });
      }
    } else {
      console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event.
    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default cors(webhookHandler as any);
