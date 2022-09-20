/**
 * This is a singleton to ensure we only instantiate Stripe once.
 */
import { Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;
const getStripe = async () => {
  if (!stripePromise) {
    const importedStripe = await import("@stripe/stripe-js");
    stripePromise = importedStripe.loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    );
  }

  return stripePromise;
};

export default getStripe;
