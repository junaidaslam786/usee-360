// PaymentPage.js
import React, { useState, useEffect } from "react";
import { getUserDetailsFromJwt } from "../../../utils";
import CardForm from "./CardForm";
import UserService from "../../../services/agent/user";
import { Link } from "react-router-dom";

const PaymentPage = () => {
  const [showCardForm, setShowCardForm] = useState(false);
  const [customerId, setCustomerId] = useState(null);

  useEffect(() => {
    // Fetch user details on component mount
    const fetchUserDetails = async () => {
      try {
        // Assuming you are storing the user ID in local storage or you get it from the auth context
        const userId = getUserDetailsFromJwt();
        const response = await UserService.detail(userId.id);
        // const customerId = response.user.stripeCustomerId;
        console.log('response', response);
        console.log(response.user.stripeCustomerId);
        if (!response.error && response.user.stripeCustomerId) {
          setCustomerId(response.user.stripeCustomerId);
        } else {
          console.error("Failed to fetch user details:", response.error);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  // Get user details using the getUserDetailsFromJwt utility function
  const userDetails = getUserDetailsFromJwt();

  const handleConnectWithStripe = () => {
    setShowCardForm(true); // This will display the CardForm
  };

  // The handleSuccessfulPayment function will be passed to CardForm
  // and called upon successful payment
  const handleSuccessfulPayment = (response) => {
    console.log(response);
    // Handle the successful payment here (e.g., update UI, show confirmation)
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Payment and Services</h1>
      <nav>
        {/* Other navigation links */}
        <ul>
          <li style={{ listStyleType: "none" }}>
            <Link to="/agent/purchase-token">
              <i style={{ marginRight: "1vmin" }} class="fa-solid fa-coins"></i>
              Purchase Tokens
            </Link>
          </li>
          <li style={{ listStyleType: "none" }}>
            <Link to="/agent/wallet">
              <i
                style={{ marginRight: "1vmin" }}
                class="fa-solid fa-wallet"
              ></i>
              Wallet
            </Link>
          </li>
          {/* <li style={{ listStyleType: "none" }}>
            <Link to="/agent/paid-services">
              <i
                style={{ marginRight: "1vmin" }}
                class="fa-solid fa-dollar-sign"
              ></i>
              Paid Services
            </Link>
          </li> */}
        </ul>
      </nav>

      {/* Button to show CardForm */}
      {!showCardForm &&
        (customerId ? (
          <button
            disabled
            className="btn theme-btn-1 btn-effect-1 text-uppercase"
          >
            Connected with Stripe
          </button>
        ) : (
          <button
            className="btn theme-btn-1 btn-effect-1 text-uppercase"
            onClick={handleConnectWithStripe}
          >
            Connect with Stripe
          </button>
        ))}

      {showCardForm && (
        <CardForm
          userDetails={userDetails}
          onSuccessfulPayment={handleSuccessfulPayment}
        />
      )}
    </div>
  );
};

export default PaymentPage;
