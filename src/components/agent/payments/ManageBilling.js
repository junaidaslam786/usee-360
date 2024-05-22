import React, { useState, useEffect } from "react";
import StripeService from "../../../services/agent/stripe-service";
import AgentService from "../../../services/agent/user";
import { useHistory } from "react-router-dom";
import { getUserDetailsFromJwt } from "../../../utils";
import { Container, Button, Alert } from "react-bootstrap";

const ManageBilling = () => {
  const [billingSession, setBillingSession] = useState(null);
  const [error, setError] = useState(null);
  const userDetails = getUserDetailsFromJwt();
  const userId = userDetails.id;
  const history = useHistory();

  useEffect(() => {
    if (!userId) {
      console.error("User ID is undefined");
      return;
    }

    const fetchAgentDetailsAndCreateBillingSession = async () => {
      try {
        // Fetch agent details
        const agentResponse = await AgentService.detail(userId);
        if (agentResponse.error) {
          throw new Error(agentResponse.message);
        }
        console.log(agentResponse);
        const customerId = agentResponse.user.stripeCustomerId;

        // Create billing session
        const billingSessionResponse = await StripeService.createBilingSession(
          customerId
        );
        if (billingSessionResponse.error) {
          throw new Error(billingSessionResponse.message);
        }

        setBillingSession(billingSessionResponse.session);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchAgentDetailsAndCreateBillingSession();
  }, [userId]);

  const handleBillingButtonClick = () => {
    if (billingSession && billingSession.url) {
      window.location.href = billingSession.url;
    } else {
      console.error("Billing session URL is not available");
    }
  };

  return (
    <Container className="text-center mt-4">
      
      {error && <Alert variant="danger">{error}</Alert>}
      <p>
        Payment Method & Invoices The "Payment Methods & Invoices" section lets
        you manage payment options and view your transaction history, ensuring
        secure and accessible billing information.
      </p>
      <Button
        variant="primary"
        onClick={handleBillingButtonClick}
        disabled={!billingSession}
        className="btn theme-btn-2"
      >
        Manage
      </Button>
    </Container>
  );
};

export default ManageBilling;
