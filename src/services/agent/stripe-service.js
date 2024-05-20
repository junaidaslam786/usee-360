import { httpGet, httpPost, generateStripeHeaders, httpPut } from "../../rest-api"; // Assuming rest-api is in the same directory


const StripeService = {
  createPaymentIntent: async (amount, currency) => {
    const response = await httpPost(`/create-payment-intent`, {
      amount,
      currency,
    });

    if (response?.error) {
      // Handle error appropriately
      response.error.message =
        response.error.message || "Failed to create payment intent";
    }

    return response;
  },

  createCharge: async (amount, stripeToken) => {
    const response = await httpPost(`/charge`, { amount, stripeToken });

    if (response?.error) {
      // Handle error appropriately
      response.error.message =
        response.error.message || "Failed to create charge";
    }

    return response;
  },

  getConfigByKey: async (configKey) => {
    try {
      const response = await httpGet(`config/${configKey}`);
      // Assuming the response data structure is { data: configValue }
      return response.data;
    } catch (error) {
      console.error("Error fetching config by key:", error.message);
      // Return null or handle the error as appropriate for your application
      return null;
    }
  },

  createCustomer: async (email, token, userId) => {
    // const headers = generateStripeHeaders();
    try {
      const response = await httpPost("create-customer", {
        email,
        token,
        userId,
      });

      // Assuming the response will have an error field only when there's an error
      if (response?.error) {
        throw new Error(response.error.message || "Failed to create customer");
      }

      return response;
    } catch (error) {
      // Log the error or handle it as needed
      console.error("Error creating Stripe customer:", error.message);
      // Return an error object or throw it depending on how you want to handle errors
      return { success: false, message: error.message };
    }
  },

  createCheckoutSession: async (customerId, priceId, quantity) => {
    const response = await httpPost(`create-checkout-session`, {
      customerId,
      priceId,
      quantity,
    });

    if (response?.error) {
      // Handle error appropriately
      response.error.message =
        response.error.message || "Failed to create checkout session";
    }

    return response;
  },


  createPaymentIntent: async (data) => {
    try {
      const response = await httpPost("/create-payment-intent", data);
      return response.data;
    } catch (error) {
      console.error(
        "Error creating payment intent:",
        error.response?.data || error.message
      );
      return {
        error: true,
        message:
          error.response?.data?.error || "Failed to create payment intent",
      };
    }
  },

  confirmPaymentIntent: async (data) => {
    try {
      const response = await httpPost("/confirm-payment-intent", data);
      return response.data;
    } catch (error) {
      console.error(
        "Error confirming payment intent:",
        error.response?.data || error.message
      );
      return {
        error: true,
        message:
          error.response?.data?.error || "Failed to confirm payment intent",
      };
    }
  },

  capturePaymentIntent: async (data) => {
    try {
      const response = await httpPost("/capture-payment-intent", data);
      return response.data;
    } catch (error) {
      console.error(
        "Error capturing payment intent:",
        error.response?.data || error.message
      );
      return {
        error: true,
        message:
          error.response?.data?.error || "Failed to capture payment intent",
      };
    }
  },

  cancelPaymentIntent: async (data) => {
    try {
      const response = await httpPost("/cancel-payment-intent", data);
      return response.data;
    } catch (error) {
      console.error(
        "Error cancelling payment intent:",
        error.response?.data || error.message
      );
      return {
        error: true,
        message:
          error.response?.data?.error || "Failed to cancel payment intent",
      };
    }
  },

  finalizeInvoice: async (data) => {
    try {
      const response = await httpPost("/finalize-invoice", data);
      return response.data;
    } catch (error) {
      console.error(
        "Error finalizing invoice:",
        error.response?.data || error.message
      );
      return {
        error: true,
        message: error.response?.data?.error || "Failed to finalize invoice",
      };
    }
  },

  getInvoiceDetails: async (invoiceId) => {
    try {
      const response = await httpGet(`fetch-customer-invoice/${invoiceId}`);
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching invoice details:",
        error.response?.data || error.message
      );
      return {
        error: true,
        message:
          error.response?.data?.error || "Failed to fetch invoice details",
      };
    }
  },

  fetchCheckoutSessions: async (customerId) => {
    try {
      const response = await httpGet(`fetch-checkout-sessions`, { customerId });
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching checkout sessions:",
        error.response?.data || error.message
      );
      return {
        error: true,
        message:
          error.response?.data?.error || "Failed to fetch checkout sessions",
      };
    }
  },

  fetchCheckoutSessionLineItems: async (sessionId) => {
    try {
      const response = await httpGet(`fetch-checkout-session-line-items`, {
        sessionId,
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching checkout session line items:",
        error.response?.data || error.message
      );
      return {
        error: true,
        message:
          error.response?.data?.error ||
          "Failed to fetch checkout session line items",
      };
    }
  },

  payInvoice: async (data) => {
    try {
      const response = await httpPost("/pay-invoice", data);
      return response.data;
    } catch (error) {
      console.error(
        "Error paying invoice:",
        error.response?.data || error.message
      );
      return {
        error: true,
        message: error.response?.data?.error || "Failed to pay invoice",
      };
    }
  },

  sendInvoice: async (data) => {
    try {
      const response = await httpPost("/send-invoice", data);
      return response.data;
    } catch (error) {
      console.error(
        "Error sending invoice:",
        error.response?.data || error.message
      );
      return {
        error: true,
        message: error.response?.data?.error || "Failed to send invoice",
      };
    }
  },

  fetchStripeProductDetails: async (productId) => {
    try {
      const response = await httpPost("fetch-stripe-product-details", {
        productId,
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching product details:",
        error.response?.data || error.message
      );
      return {
        error: true,
        message:
          error.response?.data?.error || "Failed to fetch product details",
      };
    }
  },

  getAllFeatures: async () => {
    try {
      const response = await httpGet(`feature/list`);
      return response.data;
    } catch (error) {
      console.error("Error fetching features:", error.message);
      return {
        error: true,
        message: error.message || "Failed to fetch features",
      };
    }
  },

  createTransaction: async (
    userId,
    featureId,
    quantity,
    amount,
    description
  ) => {
    try {
      const response = await httpPost(
        `agent/user/${userId}/token-transaction`,
        {
          userId,
          featureId,
          quantity,
          amount,
          description,
        }
      );

      if (response?.error) {
        // Handle error appropriately
        response.error.message =
          response.error.message || "Failed to create token transaction";
      }

      return response;
    } catch (error) {
      console.error("Error creating token transaction:", error.message);
      // Return an error object or throw it depending on how you want to handle errors
      return { success: false, message: error.message };
    }
  },

  getTokenTransactions: async (userId) => {
    try {
      const response = await httpGet(`agent/user/${userId}/token-transactions`);
      return response.data;
    } catch (error) {
      console.error("Error fetching token transactions:", error.message);
      return {
        error: true,
        message: error.message || "Failed to fetch token transactions",
      };
    }
  },

  getUserSubscriptionDetails: async (userId) => {
    try {
      
      const response = await httpGet(`agent/user/${userId}/subscriptions`);
      if (response?.error) {
        // Handle error appropriately
        return {
          error: true,
          message:
            response.error.message ||
            "Failed to fetch user subscription details",
        };
      }
      return response;
    } catch (error) {
      console.error("Error fetching user subscription details:", error);
      return {
        error: true,
        message: "Failed to fetch user subscription details",
      };
    }
  },

  getUserTokens: async (userId) => {
    try {
      const response = await httpGet(`agent/user/${userId}/tokens`);
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching user tokens:",
        error.response?.data || error.message
      );
      return {
        error: true,
        message: error.response?.data?.error || "Failed to fetch user tokens",
      };
    }
  },

  fetchStripeProductActivePrices: async (productId) => {
    try {
      const response = await httpGet(
        `fetch-stripe-product-active-prices?productId=${productId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching product prices:",
        error.response?.data || error.message
      );
      return {
        error: true,
        message:
          error.response?.data?.error || "Failed to fetch product prices",
      };
    }
  },

  fetchStripePriceDetails: async (priceId) => {
    try {
      const response = await httpGet(
        `/fetch-stripe-price-details?priceId=${priceId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching price:",
        error.response?.data || error.message
      );
      return {
        error: true,
        message: error.response?.data?.error || "Failed to fetch price details",
      };
    }
  },

  subscribeUserToFeatures: async (userId, subscriptionId, featureIds) => {
    try {
      const response = await httpPost(`agent/user/${userId}/subscribe`, {
        subscriptionId,
        featureIds,
      });

      if (response?.error) {
        // Handle error appropriately
        console.error(
          "Error in subscribing user to features:",
          response.message
        );
        return { success: false, message: response.message };
      }

      console.log("User subscribed successfully:", response);
      return { success: true, message: "User subscribed successfully" };
    } catch (error) {
      console.error("Error in subscribing user to features:", error);
      return {
        success: false,
        message: "An error occurred during subscription.",
      };
    }
  },

  autoRenewSubscriptions: async (userId, subscriptionId, featureId, autoRenew, autoRenewUnits) => {
    try {
      const response = await httpPut(`agent/user/${userId}/subscription`, {
        subscriptionId,
        featureId,
        autoRenew,
        autoRenewUnits
      });

      if (response?.error) {
        // Handle error appropriately
        console.error(
          "Error in auto-renewing subscription:",
          response.message
        );
        return { success: false, message: response.message };
      }

      console.log("Subscription auto-renewed successfully:", response);
      return { success: true, message: "Subscription auto-renewed successfully" };
    } catch (error) {
      console.error("Error in auto-renewing subscription:", error);
      return {
        success: false,
        message: "An error occurred during auto-renewal.",
      };
    }
  },

  createBilingSession: async (customerId) => {
    try {
      const response = await httpPost(`create-billing-session`, {
        customerId,
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error creating billing session:",
        error.response?.data || error.message
      );
      return {
        error: true,
        message:
          error.response?.data?.error || "Failed to create billing session",
      };
    }
  },
  

};

export default StripeService;
