// PaymentPage.js
import React, { useState } from "react";
import { getUserDetailsFromJwt } from "../../../utils";
import CardForm from "./CardForm"; // Make sure the path is correct
import { Link } from "react-router-dom";



const PaymentPage = () => {
  const [showCardForm, setShowCardForm] = useState(false);

  // Get user details using the getUserDetailsFromJwt utility function
  const userDetails = getUserDetailsFromJwt(localStorage.getItem("token"));

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
          <li><Link to="/agent/purchase-token">Purchase Tokens</Link></li>
          <li><Link to="/agent/wallet">Wallet</Link></li>
          <li><Link to="/paid-services">Paid Services</Link></li>
        </ul>
      </nav>
      
      {/* Button to show CardForm */}
      {!showCardForm && (
        <button className="btn theme-btn-1 btn-effect-1 text-uppercase" onClick={handleConnectWithStripe}>
          Connect with Stripe
        </button>
      )}
      
      {/* Show CardForm when showCardForm is true */}
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
