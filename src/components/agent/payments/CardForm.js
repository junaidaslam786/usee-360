import React, { useState } from "react";
import {
  useStripe,
  useElements,
  CardElement,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import StripeService from "../../../services/agent/stripe-service";
import { getUserDetailsFromJwt } from "../../../utils";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#303238",
      fontSize: "16px",
      fontFamily: "sans-serif",
      fontSmoothing: "antialiased",
      "::placeholder": {
        color: "#CFD7DF",
      },
    },
    invalid: {
      color: "#e5424d",
      ":focus": {
        color: "#303238",
      },
    },
  },
};

const CardForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  // const [postalCode, setPostalCode] = useState("");

  const userDetails = getUserDetailsFromJwt();
  const userId = userDetails ? userDetails.id : null;
  console.log(userId)
  console.log("userDetails", userDetails);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if Stripe.js has loaded
    if (!stripe || !elements) {
      console.error("Stripe has not been initialized");
      return;
    }

    // Get the Stripe Element for the card
    const cardElement = elements.getElement(CardElement);

    // Create a token using the card element
    const { error, token } = await stripe.createToken(cardElement);
    console.log("Token created:", token);

    // Handle any errors from Stripe
    if (error) {
      console.error("Error creating Stripe token:", error);
      return;
    }

    // Use the token to create a customer
    try {
      const response = await StripeService.createCustomer(
        email,
        token.id,
        userId
      );

      // Check if the service call was successful
      if (response.success) {
        console.log("Stripe customer created successfully:", response.data);
        // Proceed with any follow-up action after successful customer creation
        // For example, update UI, navigate to a new page, show a success message, etc.
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      // Handle any errors from the createCustomer call
      console.error("Stripe customer creation failed:", error.message);
      // Show an error message to the user, update UI, etc.
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        background: "#f6f9fc",
        borderRadius: "4px",
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.08)",
      }}
    >
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              marginBottom: "10px",
              fontSize: "16px",
              borderRadius: "4px",
              border: "1px solid #ccd0d5",
            }}
          />
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              marginBottom: "10px",
              fontSize: "16px",
              borderRadius: "4px",
              border: "1px solid #ccd0d5",
            }}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <CardElement options={CARD_ELEMENT_OPTIONS} />
          {/* <CardNumberElement options={CARD_ELEMENT_OPTIONS} />
          <CardExpiryElement options={CARD_ELEMENT_OPTIONS} />
          <CardCvcElement options={CARD_ELEMENT_OPTIONS} /> */}
        </div>
        <button
          type="submit"
          disabled={!stripe}
          style={{
            width: "100%",
            padding: "12px 0",
            fontSize: "16px",
            color: "white",
            backgroundColor: "#6772e5",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Pay
        </button>
      </form>
    </div>
  );
};

export default CardForm;
