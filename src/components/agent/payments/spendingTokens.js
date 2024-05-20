import React, { useState, useEffect } from "react";
import StripeService from "../../../services/agent/stripe-service";
import { useHistory } from "react-router-dom";
import { getUserDetailsFromJwt } from "../../../utils";
import { Container, Table, Button, Alert } from "react-bootstrap";

const SpendingTokens = () => {
  const [tokenTransactions, setTokenTransactions] = useState([]);
  const [error, setError] = useState(null);
  const userDetails = getUserDetailsFromJwt();
  const userId = userDetails.id;
  const history = useHistory();

  useEffect(() => {
    if (!userId) {
      console.error("User ID is undefined");
      return;
    }
    const fetchTokenTransactions = async () => {
      try {
        const response = await StripeService.getTokenTransactions(userId);
        if (response.error) {
          throw new Error(response.message);
        }
        setTokenTransactions(response);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchTokenTransactions();
  }, [userId]);

  const tableWrapperStyle = {
    height: "400px", // Adjust the height as needed
    overflowY: "auto",
  };

  return (
    <Container className="text-center mt-4">
      <h3>Spending USEE Coins</h3>
      {error && <Alert variant="danger">{error}</Alert>}

      <div style={tableWrapperStyle}>
        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th>Quantity</th>
              <th>Description</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {tokenTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.quantity}</td>
                <td>{transaction.description}</td>
                <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default SpendingTokens;
