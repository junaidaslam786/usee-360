import { httpGet, httpPost } from '../../rest-api'; // Assuming rest-api is in the same directory

const apiUrlPrefix = 'your-backend-endpoint-prefix'; // Replace with the actual endpoint prefix

const StripeService = {
  createPaymentIntent: async (amount, currency) => {
    const response = await httpPost(`/create-payment-intent`, { amount, currency });

    if (response?.error) {
      // Handle error appropriately
      response.error.message = response.error.message || "Failed to create payment intent";
    }

    return response;
  },

  createCharge: async (amount, stripeToken) => {
    const response = await httpPost(`/charge`, { amount, stripeToken });

    if (response?.error) {
      // Handle error appropriately
      response.error.message = response.error.message || "Failed to create charge";
    }

    return response;
  },

  createCustomer: async (email, token, userId) => {
    const response = await httpPost(`create-customer`, { email, token, userId });

    if (response?.error) {
      // Handle error appropriately
      response.error.message = response.error.message || "Failed to create customer";
    }

    return response;
  },

  createInvoice: async (customerId, productId, priceId, quantity, amount) => {
    const response = await httpPost(`create-invoice`, {
      customerId,
      productId,
      priceId,
      quantity,
      amount
    });

    if (response?.error) {
      // Handle error appropriately
      response.error.message = response.error.message || "Failed to create invoice";
    }

    return response;
  }
};

export default StripeService;
