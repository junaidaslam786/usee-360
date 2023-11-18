import React from "react";
import ReactDOM from "react-dom";
import App from "./app";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
const stripePromise = loadStripe('pk_test_51NaCXEJ6zXdtc21ylnd4a3YiKJvYLfJbVxlQrIV9wgPSvzbdxW5m3H2TNJSgSFpfb6ScQrANKmotWiPeSwQZPxCp00JUTkpLLC');

ReactDOM.render(
  <Elements stripe={stripePromise}>
    <App />
  </Elements>,
  document.getElementById("quarter")
);
