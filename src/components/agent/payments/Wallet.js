import React, { useState, useEffect } from "react";
import StripeService from "../../../services/agent/stripe-service";
import { useHistory } from "react-router-dom";
import profileImg from "../../../logo192.png";
import { getUserDetailsFromJwt } from "../../../utils";
import { Container, Table, Button, Alert } from "react-bootstrap";
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
    <Container className="text-center mt-4">
      {/* <img src={profileImg} alt="Profile" style={{ borderRadius: "50%" }} /> */}
      <h2 className="mt-2">My Wallet</h2>
      <h3>Total Tokens: {totalTokens}</h3>
      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total Amount</th>
            <th>Remaining Amount</th>
            <th>Acquired Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token) => (
            <tr key={token.id}>
              <td>{token.quantity}</td>
              <td>{token.price}</td>
              <td>{token.totalAmount}</td>
              <td>{token.remainingAmount}</td>
              <td>{new Date(token.acquiredDate).toLocaleDateString()}</td>
              <td>
                {token.stripeInvoiceId && (
                  <Button
                    variant="primary"
                    onClick={() => viewInvoice(token.stripeInvoiceId)}
                  >
                    View Invoice
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Wallet;
