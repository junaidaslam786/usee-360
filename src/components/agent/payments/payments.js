import React, { useState, useEffect } from "react";
import { getUserDetailsFromJwt } from "../../../utils";
import CardForm from "./CardForm";
import UserService from "../../../services/agent/user";
import PurchaseToken from "./purchase-token";
import Wallet from "./Wallet";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

const PaymentPage = () => {
  const [showCardForm, setShowCardForm] = useState(false);
  const [customerId, setCustomerId] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userId = getUserDetailsFromJwt();
        const response = await UserService.detail(userId.id);
        console.log("response", response);
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

  const userDetails = getUserDetailsFromJwt();

  const handleConnectWithStripe = () => {
    setShowCardForm(true);
  };

  const handleSuccessfulPayment = (response) => {
    console.log(response);
    setShowCardForm(false);
  };

  return (
    <Container fluid style={{ padding: "20px" }}>
      <h1>Payment and Services</h1>

      {/* Stripe Connection Card */}
      <Card className="mb-3">
        <Card.Body>
          <Card.Title>Stripe Connection</Card.Title>
          {!showCardForm && (
            customerId ? (
              <Button disabled variant="primary">
                Connected with Stripe
              </Button>
            ) : (
              <Button variant="primary" onClick={handleConnectWithStripe}>
                Connect with Stripe
              </Button>
            )
          )}
          {showCardForm && (
            <CardForm
              userDetails={userDetails}
              onSuccessfulPayment={handleSuccessfulPayment}
            />
          )}
        </Card.Body>
      </Card>

      {/* Purchase Token Card */}
      <Card className="mb-3">
        <Card.Body>
          <Card.Title>Purchase Tokens</Card.Title>
          <PurchaseToken />
        </Card.Body>
      </Card>

      {/* Wallet Card */}
      <Card className="mb-3">
        <Card.Body>
          <Card.Title>Wallet</Card.Title>
          <Wallet />
        </Card.Body>
      </Card>
      </Container>
  );
};

export default PaymentPage;
