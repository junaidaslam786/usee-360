import React, { useState, useEffect } from "react";
import StripeService from "../../../services/agent/stripe-service";
import { useHistory } from "react-router-dom";
import profileImg from "../../../logo192.png";
import { getUserDetailsFromJwt } from "../../../utils";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEye } from '@fortawesome/free-solid-svg-icons';

const Wallet = () => {
  const [tokens, setTokens] = useState([]);
  const [totalTokens, setTotalTokens] = useState(0);
  const [error, setError] = useState(null);
  const userDetails = getUserDetailsFromJwt();
  const userId = userDetails.id;
  console.log(userId);
  const history = useHistory();

  const viewInvoice = (stripeInvoiceId) => {
    // Redirect to the InvoicePage component with the stripeInvoiceId
    if (stripeInvoiceId) {
      history.push(`/agent/invoice/${stripeInvoiceId}`);
    } else {
      console.error("No invoice ID available");
    }
  };

  useEffect(() => {
    if (!userId) {
      console.error("User ID is undefined");
      return;
    }
    const fetchTokens = async () => {
      try {
        const tokenResponse = await StripeService.getUserTokens(userId);
        if (tokenResponse.error) {
          throw new Error(tokenResponse.message);
        }
        setTokens(tokenResponse.tokens);
        setTotalTokens(tokenResponse.totalTokensRemaining);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchTokens();
  }, [userId]);

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  };

  const thStyle = {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 15px",
    textAlign: "left",
    fontSize: "16px",
  };

  const tdStyle = {
    padding: "10px 15px",
    borderBottom: "1px solid #ddd",
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <i
          className="fa fa-wallet"
          style={{ fontSize: "24px", marginRight: "10px" }}
        ></i>
        <h2>My Wallet</h2>
      </div>
      <h3>Total Tokens: {totalTokens}</h3>
      {error && <p>Error: {error}</p>}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Quantity</th>
            <th style={thStyle}>Price</th>
            <th style={thStyle}>Total Amount</th>
            <th style={thStyle}>Remaining Amount</th>
            <th style={thStyle}>Acquired Date</th>
            <th style={thStyle}>Action</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token) => (
            <tr key={token.id}>
              <td style={tdStyle}>{token.quantity}</td>
              <td style={tdStyle}>{token.price}</td>
              <td style={tdStyle}>{token.totalAmount}</td>
              <td style={tdStyle}>{token.remainingAmount}</td>
              <td style={tdStyle}>
                {new Date(token.acquiredDate).toLocaleDateString()}
              </td>
              <td style={tdStyle}>
                {token.stripeInvoiceId && (
                  <button onClick={() => viewInvoice(token.stripeInvoiceId)}>
                    {/* <i className="fa fa-eye"></i> */}
                    view invoice
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Wallet;
