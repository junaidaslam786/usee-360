import React, { useEffect, useState } from "react";
import "./PaidServices.css"; // Importing the CSS file
import StripeService from "../../../services/agent/stripe-service";
import { getUserDetailsFromJwt } from "../../../utils";
import { toast } from "react-toastify";
import { Card, Button, Form, Row, Col, } from "react-bootstrap";
import { useHistory } from "react-router-dom";

const PaidServices = () => {
  const [services, setServices] = useState([]);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState({});
  const [userSubscriptions, setUserSubscriptions] = useState({});
  const [subscriptionId, setSubscriptionId] = useState(null);
  const [autoRenewValue, setAutoRenewValue] = useState({});

  const userDetails = getUserDetailsFromJwt();

  const fetchSubscriptionDetails = async () => {
    try {
      const response = await StripeService.getUserSubscriptionDetails(
        userDetails.id
      );
      setSubscriptionId(response?.data?.subscription?.id);
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
                monthlyFreeUnits: subscription.feature.freeUnits,
                autoRenew: subscription.autoRenew,
                autoRenewUnits: subscription.autoRenewUnits,
              };
            }
            return service;
          })
        );

        setUserSubscriptions(subscriptionMap);
        setSubscriptionStatus(updatedSubscriptionStatus);
      }
    } catch (error) {
      toast(`Error fetching subscription details: ${error.message}`);
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
          quantity: 0,
          autoRenew: false,
          monthlyFreeUnits: service.freeUnits,

          remainingFreeUnits: "-",
          remainingPaidUnits: "-",
        }));
        setServices(formattedServices);
      }
    } catch (error) {
      toast(`Error fetching services: ${error.message}`);
    }
  };

  const handleAutoRenewValueChange = (index, value) => {
    const newAutoRenewValue = { ...autoRenewValue };
    newAutoRenewValue[services[index].id] = value;
    setAutoRenewValue(newAutoRenewValue);
  };

  const handleSaveAutoRenewValue = async (serviceId) => {
    const autoRenewUnits = autoRenewValue[serviceId] || 0;
    const autoRenew = services.find(
      (service) => service.id === serviceId
    ).autoRenew;
    const featureId = serviceId;
    const response = await StripeService.autoRenewSubscriptions(
      userDetails.id, // userId
      subscriptionId,
      featureId,
      autoRenew,
      autoRenewUnits
    );

    if (response.success) {
      toast.success(
        response.message || `Auto-renew settings saved for ${serviceId}`
      );
      // Update your state as needed here
    } else {
      toast.error(response.message || "Failed to save auto-renew settings");
    }
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
        serviceId // Assuming serviceId can be used as featureId
      );

      if (response?.success) {
        toast("Subscription successful", true);
        setSubscriptionStatus((prevStatus) => ({
          ...prevStatus,
          serviceId: true, // Update status to true for the subscribed service
        }));
        // history.push('/agent/subscription')
        window.location.reload();
      } else {
        // console.error("Subscription failed", response.message);
        toast(`Subscription failed: ${response.message}`);
        // Handle the failed subscription here
      }
    } catch (error) {
      // console.error("Error during subscription", error.message);
      toast(`Error during subscription: ${error?.message}`);
      // Handle any errors here
    }
  };

  const handleQuantityChange = (index, quantity) => {
    const numQuantity = Number(quantity); // Convert to number
    if (!isNaN(numQuantity) && numQuantity > 0) {
      // Check if it's a valid number
      const updatedServices = services.map((service, idx) => {
        if (idx === index) {
          return { ...service, quantity: numQuantity };
        }
        return service;
      });
      setServices(updatedServices);
    }
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
    const totalAmount = service.tokenPrice * service.quantity;
    try {
      const response = await StripeService.createTransaction(
        userDetails.id,
        service.id,
        service.quantity,
        totalAmount,
        `Used for ${service.name}`
      );

      if (response?.data?.message) {
        // console.log("Purchase successful", response?.message);
        setPurchaseSuccess(true);
        // setSuccessMessage(`You have successfully purchased ${service.name}.`);
        toast.success(`You have successfully purchased ${service.name}.`);
      } else {
        console.log(
          "Purchase response received but not successful",
          response?.data?.message
        );
        toast.error(
          `Purchase failed: ${
            response?.data?.message || "An unknown error occurred."
          }`
        );
      }
    } catch (error) {
      // console.error("Error during purchase", error);
      toast.error(`Error during purchase: ${error.message}`);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      await fetchServices();
      await fetchSubscriptionDetails();
    };

    initializeData();
  }, []);

  return (
    <div className="paid-services">
      <h2>Services</h2>

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
                      {!["Video Call", "Video Call Recording"].includes(service.name) && (
                        <>
                          <Card.Text>
                            Monthly Free Units: {service.monthlyFreeUnits}
                          </Card.Text>
                          <Card.Text>
                            Remaining Free Units: {service.remainingFreeUnits}
                          </Card.Text>
                        </>
                      )}
                      <Card.Text>
                        Remaining Paid Units: {service.remainingPaidUnits}
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
                                  USEE-360 Coins Per Unit:{" "}
                                  <strong>{service.tokenPrice}</strong>
                                </p>
                                <p>
                                  Total USEE-360 Coins:{" "}
                                  <strong>
                                    {service.tokenPrice * service.quantity}
                                  </strong>
                                </p>
                                <Button
                                  size="sm"
                                  variant="success"
                                  onClick={() => handlePurchase(service)}
                                  className="w-100"
                                  disabled={service.quantity <= 0}
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
                                  disabled={!subscriptionStatus[service.id]} // Disable if not subscribed
                                />
                              </Form.Group>
                              <Form.Group className="mb-2 flex-grow-1 d-flex flex-column justify-content-end">
                                <Form.Control
                                  size="sm"
                                  type="number"
                                  value={
                                    service.autoRenew
                                      ? autoRenewValue[service.id] ||
                                        service.autoRenewUnits ||
                                        ""
                                      : ""
                                  }
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
                                    handleSaveAutoRenewValue(service.id)
                                  }
                                  disabled={
                                    !service.autoRenew ||
                                    !(autoRenewValue[service.id] > 0)
                                  }
                                  className="w-100 mt-2"
                                >
                                  {service.autoRenew &&
                                  (autoRenewValue[service.id] > 0 ||
                                    service.autoRenewUnits > 0)
                                    ? "Update"
                                    : "Save"}
                                </Button>
                              </Form.Group>
                            </Col>
                          </Row>
                        </div>
                      </Form>
                    </Col>
                          {["Video Call"].includes(service.name) && (
                            <Row>
                              <Col>
                                <p className="footnote mt-2" style={{fontStyle: 'italic'}}>
                                  To view free video call slots for each property go to <a href="/agent/properties"> My Properties</a>
                                </p>
                              </Col>
                            </Row>
                          )}
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
