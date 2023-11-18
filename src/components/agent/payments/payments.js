// PaymentPage.js
import React, { useState } from "react";
import { getUserDetailsFromJwt } from "../../../utils";
import CardForm from "./CardForm"; // Make sure the path is correct
import { Link } from "react-router-dom";



const PaymentPage = () => {
  const [showCardForm, setShowCardForm] = useState(false);

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
          <li style={{listStyleType:'none'}}><Link to="/agent/purchase-token"><i style={{marginRight:'1vmin'}} class="fa-solid fa-coins"></i>Purchase Tokens</Link></li>
          <li style={{listStyleType:'none'}}><Link to="/agent/wallet"><i style={{marginRight:'1vmin'}} class="fa-solid fa-wallet"></i>Wallet</Link></li>
          <li style={{listStyleType:'none'}}><Link to="/agent/paid-services"><i style={{marginRight:'1vmin'}} class="fa-solid fa-dollar-sign"></i>Paid Services</Link></li>
        </ul>
      </nav>
      
      {/* Button to show CardForm */}
      {!showCardForm && (
        <button className="btn theme-btn-1 btn-effect-1 text-uppercase" onClick={handleConnectWithStripe}>
          Connect with Stripe
        </button>
      )}
      
      
        <CardForm
          userDetails={userDetails}
          onSuccessfulPayment={handleSuccessfulPayment}
        />
      
    </div>
  );
};

export default PaymentPage;
