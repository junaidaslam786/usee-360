import { httpGet, httpPost, generateStripeHeaders } from "../../rest-api"; // Assuming rest-api is in the same directory

const apiUrlPrefix = "your-backend-endpoint-prefix"; // Replace with the actual endpoint prefix

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

  // Add new services according to your backend routes
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

  // createCustomer: async (data) => {
  //   try {
  //     const response = await httpPost('/create-customer', data);
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error creating customer:', error.response?.data || error.message);
  //     return { error: true, message: error.response?.data?.error || 'Failed to create customer' };
  //   }
  // },

  // createInvoice: async (data) => {
  //   try {
  //     const response = await httpPost('/create-invoice', data);
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error creating invoice:', error.response?.data || error.message);
  //     return { error: true, message: error.response?.data?.error || 'Failed to create invoice' };
  //   }
  // },

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
      const response = await httpPost('fetch-stripe-product-details', { productId });
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
};

export default StripeService;
