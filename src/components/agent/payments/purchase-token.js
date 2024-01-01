import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { getUserDetailsFromJwt } from "../../../utils";
import StripeService from "../../../services/agent/stripe-service";
import UserService from "../../../services/agent/user";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Spinner,
  Alert,
} from "react-bootstrap";

const PurchaseToken = () => {
  const [tokenQuantity, setTokenQuantity] = useState(1);
  const [customerId, setCustomerId] = useState(null);
  const [priceId, setPriceId] = useState(null);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      try {
        await fetchUserDetails();
        await fetchConfig();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const fetchUserDetails = async () => {
    const userId = getUserDetailsFromJwt();
    const response = await UserService.detail(userId.id);
    if (!response.error) {
      setCustomerId(response.user.stripeCustomerId);
    } else {
      throw new Error("Failed to fetch user details");
    }
  };

  const fetchConfig = async () => {
    const configKey = "tokenPrice";
    const configValue = await StripeService.getConfigByKey(configKey);
    console.log("Fetched config value:", configValue);
    if (configValue && !configValue.error) {
      setPriceId(configValue.stripePriceId);
      setConfig(configValue);
    } else {
      throw new Error("Failed to fetch configuration");
    }
  };

  const handleTokenQuantityChange = (event) => {
    // Parse the input as an integer
    const value = parseInt(event.target.value, 10);

    // Check if the value is NaN (happens when the input is empty) and set state accordingly
    if (isNaN(value)) {
      setTokenQuantity(""); // Set to empty string to allow clearing the input
    } else {
      setTokenQuantity(value);
    }
  };

  const handlePurchase = async () => {
    if (!customerId || !priceId) {
      setError("Required information missing for purchase.");
      return;
    }

    try {
      setLoading(true);
      const purchaseResponse = await StripeService.createCheckoutSession(
        customerId,
        priceId,
        tokenQuantity
      );

      if (purchaseResponse && !purchaseResponse.error) {
        window.location.href = purchaseResponse.data.session.url;
      } else {
        throw new Error("Purchase failed");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Container className="mt-5">
      {/* <h2>Purchase USEE Coins</h2> */}
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Form>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="4">
              Token Quantity:
            </Form.Label>
            <Col sm="8">
              <Form.Control
                type="number"
                value={tokenQuantity}
                onChange={handleTokenQuantityChange}
                min="1"
              />
            </Col>
          </Form.Group>
          <p>Price Per USEE Coin: AED {config?.configValue || "Loading..."}</p>
          <Row>
            <Col>
              <Button
                variant="primary"
                onClick={handlePurchase}
                disabled={loading}
                style={{backgroundColor: "#00C800", color: "white"}}
              >
                Purchase
              </Button>
            </Col>
            {/* <Col>
              <Link to="/agent/dashboard" className="btn btn-outline-secondary">
                Cancel
              </Link>
            </Col> */}
          </Row>
        </Form>
      )}
    </Container>
  );
};

export default PurchaseToken;
