// import 'bootstrap/dist/css/bootstrap.min.css';
import "filepond/dist/filepond.min.css";

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import Modal from "react-modal";
import { Provider } from "react-redux";
import store from "./store/store";

Modal.setAppElement("#quarter");

// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
const stripePromise = loadStripe(
  "pk_test_51NaCXEJ6zXdtc21ylnd4a3YiKJvYLfJbVxlQrIV9wgPSvzbdxW5m3H2TNJSgSFpfb6ScQrANKmotWiPeSwQZPxCp00JUTkpLLC"
);

const container = document.getElementById("quarter");
const root = createRoot(container); // Create a root for the container

// Render the Elements provider and App within it
root.render(
  <Elements stripe={stripePromise}>
    <Provider store={store}>
      <App />
    </Provider>
  </Elements>
);
