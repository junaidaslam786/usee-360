import React, { useEffect, useState } from "react";
import "./PaidServices.css"; // Importing the CSS file
import StripeService from "../../../services/agent/stripe-service";
import { getUserDetailsFromJwt } from "../../../utils";
import { toast } from "react-toastify";
import { Card, Button, Form, Row, Col, ToggleButton } from "react-bootstrap";

const PaidServices = () => {
  const [services, setServices] = useState([]);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState({});
  const [userSubscriptions, setUserSubscriptions] = useState({});
  const [autoRenewValue, setAutoRenewValue] = useState({});

  const userDetails = getUserDetailsFromJwt();

  const fetchSubscriptionDetails = async () => {
    try {
      const response = await StripeService.getUserSubscriptionDetails(
        userDetails.id
      );
      console.log("Subscriptions Detail", response);
      if (response.data && response.data.userSubscriptions) {
        const subscriptionMap = {};
        const updatedSubscriptionStatus = {};

        response.data.userSubscriptions.forEach((subscription) => {
          const featureId = subscription.feature.id;
          subscriptionMap[featureId] = subscription;

          // Update subscription status based on active status
          updatedSubscriptionStatus[featureId] =
            subscription.status === "active";
        });

        // Merge subscription details into services and update subscription status
        setServices((prevServices) =>
          prevServices.map((service) => {
            const subscription = subscriptionMap[service.id];
            if (subscription) {
              return {
                ...service,
                remainingFreeUnits: subscription.freeRemainingUnits,
                remainingPaidUnits: subscription.paidRemainingUnits,
              };
            }
            return service;
          })
        );

        setUserSubscriptions(subscriptionMap);
        setSubscriptionStatus(updatedSubscriptionStatus);
      }
    } catch (error) {
      console.error("Error fetching subscription details", error.message);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await StripeService.getAllFeatures();
      console.log("Response", response);
      if (response.data) {
        const formattedServices = response.data.map((service) => ({
          id: service.id,
          name: service.name,
          tokenPrice: service.tokensPerUnit,
          quantity: 1, // Default quantity
          autoRenew: false,
          remainingFreeUnits: service.freeUnits,
          remainingPaidUnits: service.totalUnits - service.freeUnits,
        }));
        setServices(formattedServices);
      }
    } catch (error) {
      console.error("Error fetching services", error.message);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      await fetchServices();
      await fetchSubscriptionDetails(); // Fetch and set subscription status on mount
    };

    initializeData();
  }, []);

  const handleAutoRenewValueChange = (index, value) => {
    const newAutoRenewValue = { ...autoRenewValue };
    newAutoRenewValue[services[index].id] = value;
    setAutoRenewValue(newAutoRenewValue);
  };

  const handleSaveAutoRenewValue = (serviceId) => {
    console.log(
      "Saving auto-renew value for service:",
      serviceId,
      "Value:",
      autoRenewValue[serviceId]
    );
    toast.success(`Auto-renew value saved for ${serviceId}`);
    // Implement the logic to save the auto-renew value in your backend
  };

  const handleSubscribe = async (serviceId) => {
    // Check if already subscribed
    if (subscriptionStatus[serviceId]) {
      console.log("Already subscribed to this feature");
      return;
    }
    try {
      const response = await StripeService.subscribeUserToFeatures(
        userDetails.id,
        "35e0b998-53bc-4777-a207-261fff3489aa",
        [serviceId] // Assuming serviceId can be used as featureId
      );

      if (response?.success) {
        console.log("Subscription successful", response);
        setSubscriptionStatus((prevStatus) => ({
          ...prevStatus,
          [serviceId]: true, // Update status to true for the subscribed service
        }));
      } else {
        console.error("Subscription failed", response.message);
        // Handle the failed subscription here
      }
    } catch (error) {
      console.error("Error during subscription", error.message);
      // Handle any errors here
    }
  };

  const handleQuantityChange = (index, quantity) => {
    const updatedServices = services.map((service, idx) => {
      if (idx === index) {
        return { ...service, quantity: quantity };
      }
      return service;
    });
    setServices(updatedServices);
  };

  const handleAutoRenewToggle = (index) => {
    const updatedServices = services.map((service, idx) => {
      if (idx === index) {
        return { ...service, autoRenew: !service.autoRenew };
      }
      return service;
    });
    setServices(updatedServices);
  };

  const handlePurchase = async (service) => {
    try {
      const totalAmount = service.tokenPrice * service.quantity;
      const response = await StripeService.createTransaction(
        userDetails.id,
        service.id,
        service.quantity,
        totalAmount,
        `Used for ${service.name}` // Example description
      );

      // Check if response contains the expected data (e.g., 'id' field)
      if (response) {
        console.log("Purchase successful", response);
        setPurchaseSuccess(true);
        setSuccessMessage(`You have successfully purchased ${service.name}.`);
        toast.success(`You have successfully purchased ${service.name}.`);
      } else {
        console.error(
          "Purchase failed",
          "Response does not contain expected data"
        );
        toast.error(`Purchase failed: Response does not contain expected data`);
      }
    } catch (error) {
      console.error("Error during purchase", error.message);
      toast.error(`Error during purchase: ${error.message}`);
    }
  };

  return (
    <div className="paid-services">
      <h2>Services</h2>
      {purchaseSuccess && (
        <div className="success-message">{successMessage}</div>
      )}
      {services.map((service, index) => {
        const isSubscribed =
          subscriptionStatus[service.id] ||
          (userSubscriptions[service.id] &&
            userSubscriptions[service.id].status === "active");

        return (
          <Row key={service.id} className="mb-3">
            <Col>
              <Card>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <Card.Title>{service.name}</Card.Title>
                      <Card.Text>Monthly Free Units: 10</Card.Text>
                      <Card.Text>
                        Remaining Free Units: {service.remainingFreeUnits}
                      </Card.Text>
                      <Button
                        variant={isSubscribed ? "secondary" : "primary"}
                        onClick={() => handleSubscribe(service.id)}
                        disabled={isSubscribed}
                        className="mb-2"
                      >
                        {isSubscribed ? "Subscribed" : "Subscribe"}
                      </Button>
                    </Col>

                    <Col md={6}>
                      <Form>
                        <div className="d-flex flex-column mb-3">
                          <Row className="mb-2">
                            <Col xs={12}>
                              <Form.Group className="mb-0">
                                <Form.Label>Quantity:</Form.Label>
                                <Form.Control
                                  size="sm"
                                  type="number"
                                  value={service.quantity}
                                  onChange={(e) =>
                                    handleQuantityChange(
                                      index,
                                      parseInt(e.target.value, 10)
                                    )
                                  }
                                  min="1"
                                />
                              </Form.Group>
                            </Col>
                          </Row>

                          <Row className="mb-2">
                            <Col xs={12}>
                              <div className="d-flex flex-column justify-content-end">
                                <p className="mb-2">
                                  USEE Coins Per Unit:{" "}
                                  <strong>{service.tokenPrice}</strong>
                                </p>
                                <p>
                                  Total USEE Coins:{" "}
                                  <strong>
                                    {service.tokenPrice * service.quantity}
                                  </strong>
                                </p>
                                <Button
                                  size="sm"
                                  variant="success"
                                  onClick={() => handlePurchase(service)}
                                  className="w-100"
                                >
                                  Buy
                                </Button>
                              </div>
                            </Col>
                          </Row>

                          <Row className="mb-2">
                            <Col xs={12} className="d-flex flex-column">
                              <Form.Group className="mb-2">
                                <Form.Check
                                  type="switch"
                                  id={`auto-renew-${service.id}`}
                                  label="Auto Renew"
                                  checked={service.autoRenew}
                                  onChange={() => handleAutoRenewToggle(index)}
                                />
                              </Form.Group>
                              <Form.Group className="mb-2 flex-grow-1 d-flex flex-column justify-content-end">
                                <Form.Control
                                  size="sm"
                                  type="number"
                                  value={autoRenewValue[service.id] || ""}
                                  onChange={(e) =>
                                    handleAutoRenewValueChange(
                                      index,
                                      e.target.value
                                    )
                                  }
                                  disabled={!service.autoRenew}
                                />
                                <Button
                                  size="sm"
                                  variant="primary"
                                  onClick={() =>
                                    handleSaveAutoRenewValue(
                                      service.id,
                                      service.name
                                    )
                                  }
                                  disabled={!service.autoRenew}
                                  className="w-100 mt-2"
                                >
                                  Save
                                </Button>
                              </Form.Group>
                            </Col>
                          </Row>
                        </div>
                      </Form>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        );
      })}
      {/* Footnotes section */}
      <div className="service-footnotes">
        <h3>Units Measurements for Paid Services</h3>
        <ul>
          <li>
            <strong>Video Calling Services:</strong> Units for video calling
            services are quantified in minutes, with 1 unit equating to 30
            minutes of video calling service.
          </li>
          <li>
            <strong>Property Listings:</strong> Each unit for property signifies
            the inclusion of 1 property listing within the virtual service
            platform.
          </li>
          <li>
            <strong>Reports and Analytics:</strong> 1 unit for reports and
            analytics denotes the accessibility of 1 downloadable report,
            formatted in XLS (Excel Spreadsheet) for enhanced data manipulation
            and analysis.
          </li>
          <li>
            <strong>API Services:</strong> 1 unit for API service corresponds to
            the authorization for 1 API call, enabling seamless integration and
            interaction with the platform's functionalities.
          </li>
        </ul>
        <p>
          Note: The defined units serve as a modern and technical approach to
          streamline billing and access to specific services on the virtual
          platform.
        </p>
      </div>
    </div>
  );
};

export default PaidServices;
