// InvoicePage.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import { fetchUserDetailsFromJwt } from '../utils'; // Update the import path as needed

const InvoicePage = () => {
  const location = useLocation();
  const userDetails = fetchUserDetailsFromJwt(localStorage.getItem('token'));

  // You would also pass the invoice details to this page after the purchase
  const { invoiceDetails } = location.state || {};

  return (
    <div>
      <h1>Invoice</h1>
      <p>Trader Name: {userDetails?.name}</p>
      <p>Trader ID: {userDetails?.id}</p>
      <p>Email: {userDetails?.email}</p>
      {/* ...Other details... */}
      <p>Total Amount Paid: ${invoiceDetails?.totalAmount}</p>
      {/* Include a Link to go back to the dashboard or another relevant page */}
      <Link to="/agent/dashboard">Back to Dashboard</Link>
    </div>
  );
};

export default InvoicePage;
