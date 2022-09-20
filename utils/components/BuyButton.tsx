import Link from "next/link";
import React, { useState } from "react";
import { fetchPostJSON } from "../api-helpers";
import getStripe from "../get-stripejs";
import { CURRENCIES, RETAIL_PRICE } from "./Shared";

const currency = '$';

const BuyButton = ({
  text = `Purchase the Newbies Guide to Crypto — ${currency}${RETAIL_PRICE}`,
  doShowSecurity = false,
  extraClasses = "",
  totalSoldThisMonth = 0,
  doShowPaymentOptions = false,
  promotion = true,
  doShowSignIn = true
}: {
  [key: string]: any;
}) => {
  const [loading, setLoading] = useState(false);

  const handleStripe = async (e: any) => {
    e.preventDefault();

    setLoading(true);

    // Create a Checkout Session.
    const response = await fetchPostJSON("/api/checkout_sessions", {
      amount: RETAIL_PRICE,
      currency: CURRENCIES.options.filter((c) => c.active)[0].iso
    });

    if (response.statusCode === 500) {
      console.error(response.message);
      setLoading(false);
      return;
    }

    // Redirect to Checkout.
    const stripe = await getStripe();
    setLoading(false);

    const { error } = await stripe!.redirectToCheckout({
      // Make the id field from the Checkout Session creation API response
      // available to this file, so you can provide it as parameter here
      // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
      sessionId: response.id
    });
    // If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `error.message`.
    console.warn(error.message);
  };

  return (
    <div>
      <div className={"buy-btn-flex"}>
        <button
          aria-label={text}
          type="button"
          disabled={loading}
          onClick={handleStripe}
          className={`buy-button ${extraClasses ? extraClasses : ""}`}
        >
          <span dangerouslySetInnerHTML={{ __html: text }}></span>
          {doShowPaymentOptions && (
            <span className="payment-options">
              <i
                aria-label="Pay with Apple Pay"
                title="Pay with Apple Pay"
                className="apple-pay"
              ></i>
              <i
                aria-label="Pay with Google Pay"
                title="Pay with Google Pay"
                className="google-pay"
              ></i>
              <i
                aria-label="Pay with Visa"
                title="Pay with Visa"
                className="visa"
              ></i>
              <i
                aria-label="Pay with Mastercard"
                title="Pay with Mastercard"
                className="mastercard"
              ></i>
              <i
                aria-label="Pay with AMEX"
                title="Pay with Apple AMEX"
                className="amex"
              ></i>
            </span>
          )}
          {!loading ? (
            ""
          ) : (
            <span className="loading-dots_loading">
              <span></span>
              <span></span>
              <span></span>&nbsp;
            </span>
          )}
        </button>
      </div>
      {doShowSecurity && (
        <span style={{ color: "transparent" }} className="security">
          🔐&nbsp;&nbsp;Secured through Stripe
        </span>
      )}
      {totalSoldThisMonth > 0 && (
        <span className="totals">
          <strong>{totalSoldThisMonth}</strong> people got access this month.
        </span>
      )}
      {promotion && (
        <strong className="promotion">
          50% off for ✨ {new Date().getFullYear()} New Year
        </strong>
      )}
      {doShowSignIn && (
        <p style={{ zIndex: 5000 }}>
          Already purchased? <Link href="/auth/signin">Sign in here.</Link>
        </p>
      )}
    </div>
  );
};

export default BuyButton;
