import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { formatAmountForStripe } from "../../../utils/stripe-helpers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2020-08-27"
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const amount: number = req.body.amount;
    const currency: string = req.body.currency;
    try {
      // Create Checkout Sessions from body params.
      const params: Stripe.Checkout.SessionCreateParams = {
        submit_type: "pay",
        mode: "payment",
        line_items: [
          ...[
            "✅ Full Access to E-Book, Lifetime Updates, Newsletter & Bonuses"
          ].map((chapter) => {
            return {
              name: chapter,
              // equally distribute across all chapters
              amount: formatAmountForStripe(amount, currency),
              currency: "USD",
              quantity: 1
            };
          })
        ],
        success_url: `${req.headers.origin}/thanks?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/`
      };

      const checkoutSession: Stripe.Checkout.Session =
        await stripe.checkout.sessions.create(params);

      res.status(200).json(checkoutSession);
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
