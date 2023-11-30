import React, { useEffect, useState } from "react";
import "./PaidServices.css"; // Importing the CSS file
import StripeService from "../../../services/agent/stripe-service";
import { getUserDetailsFromJwt } from "../../../utils";

const PaidServices = () => {
  const [services, setServices] = useState([]);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState({});

  const userDetails = getUserDetailsFromJwt();

  useEffect(() => {
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
        console.error("Errir fetching services", error.message);
      }
    };
    fetchServices();
  }, []);

  const handleSubscribe = async (serviceId) => {
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
    console.log("Purchasing", service);

    try {
      // Assuming 'service.id' is the tokenId and 'service.quantity' is the quantity
      const totalAmount = service.tokenPrice * service.quantity;
      const response = await StripeService.createTransaction(
        userDetails.id,
        service.id,
        service.quantity,
        totalAmount,
        `Used for ${service.name}` // Example description
      );

      if (response?.success) {
        console.log("Purchase successful", response);
        setPurchaseSuccess(true);
        setSuccessMessage("You have purchased the service successfully.");
      } else {
        console.error("Purchase failed", response.message);
        // Handle the failed purchase here (e.g., show an error message)
      }
    } catch (error) {
      console.error("Error during purchase", error.message);
      // Handle any errors here
    }
  };

  return (
    <div className="paid-services">
      <h2>Services</h2>
      {purchaseSuccess && (
        <div className="success-message">{successMessage}</div>
      )}
      <div className="paid-services-table-wrapper">
        <table>
          <thead>
            <tr>
              {/* <th>ID</th> */}
              <th>Subscription Status</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Price In Token</th>
              <th>Total Tokens</th>
              <th>Remaining Free Units</th>
              <th>Remaining Paid Units</th>
              <th>Auto Renew</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, index) => (
              <tr key={service.id}>
                {/* <td>{service.id}</td> */}
                <td>
                  <button
                    onClick={() => handleSubscribe(service.id)}
                    disabled={subscriptionStatus[service.id]}
                  >
                    {subscriptionStatus[service.id]
                      ? "Subscribed"
                      : "Subscribe"}
                  </button>
                </td>
                <td>{service.name}</td>
                <td>
                  <input
                    type="number"
                    value={service.quantity}
                    onChange={(e) =>
                      handleQuantityChange(index, parseInt(e.target.value, 10))
                    }
                    min="1"
                  />
                </td>
                <td>{service.tokenPrice}</td>
                <td>{service.tokenPrice * service.quantity}</td>
                <td>{service.remainingFreeUnits}</td>
                <td>{service.remainingPaidUnits}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={service.autoRenew}
                    onChange={() => handleAutoRenewToggle(index)}
                  />
                </td>
                <td>
                  <button onClick={() => handlePurchase(service)}>Buy</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
