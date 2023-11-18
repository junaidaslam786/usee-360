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
      console.error('Error fetching config by key:', error.message);
      // Return null or handle the error as appropriate for your application
      return null;
    }
  },

  createCustomer: async (email, token, userId) => {
    // const headers = generateStripeHeaders();
    try {
        const response = await httpPost("create-customer", { email, token, userId });

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


  createInvoice: async (customerId, productId, priceId, quantity, amount) => {
    const response = await httpPost(`create-invoice`, {
      customerId,
      productId,
      priceId,
      quantity,
      amount,
    });

    if (response?.error) {
      // Handle error appropriately
      response.error.message =
        response.error.message || "Failed to create invoice";
    }

    return response;
  },
};

export default StripeService;
