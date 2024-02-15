import { httpGet, httpPost } from "../rest-api";

const apiUrlPrefix = "auth";

const AuthService = {
  register: async (formData, type) => {
    const response = await httpPost(
      `${apiUrlPrefix}/register-${type}`,
      formData,
      true
    );

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to register, please try again later"];
      }

      return response;
    }

    return response.data;
  },

  agentOnboarding: async (formData) => {
    try {
      const response = await httpPost(
        `${apiUrlPrefix}/agent-onboarding`,
        formData,
        true // Assuming this endpoint requires authentication; set to false if not
      );

      // Check for errors in the response
      if (response?.error) {
        // Optionally, handle specific error messages or statuses
        console.error("Error during agent onboarding:", response.error);
        return {
          error: true,
          message: response.error.message || "Error during agent onboarding.",
        };
      }

      // If the response is successful and contains the expected data, return it
      return { error: false, data: response.data };
    } catch (error) {
      console.error("Error during agent onboarding:", error);
      // Handle any exceptions thrown during the request
      return { error: true, message: "Failed to complete agent onboarding." };
    }
  },


  login: async (reqBody) => {
    const response = await httpPost(`${apiUrlPrefix}/login`, reqBody);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to login, please try again later"];
      }

      return response;
    }

    return response.data;
  },

  refreshToken: async (refreshToken) => {
    try {
      const response = await httpPost(`${apiUrlPrefix}/refresh`, {
        refreshToken,
      });

      if (response?.error) {
        // Handle any errors that occurred during the refresh token process
        console.error("Error refreshing token:", response.error);
        return { error: true, message: response.error.message };
      }

      // Assuming the new access token is in the response data
      return { error: false, accessToken: response.data.accessToken };
    } catch (error) {
      console.error("Error refreshing token:", error);
      return { error: true, message: "Failed to refresh token" };
    }
  },

  sendOtp: async (formData) => {
    const response = await httpPost(`${apiUrlPrefix}/send-otp`, formData);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to send OTP, please try again later"];
      }

      return response;
    }

    return response.data;
  },

  validateOtp: async (formData, token) => {
    const response = await httpPost(
      "user/validate-otp",
      formData,
      false,
      token
    );

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Invalid OTP"];
      }

      return response;
    }

    return response.data;
  },

  forgotPassword: async (email, type) => {
    const response = await httpGet(
      `${apiUrlPrefix}/forgot-password?email=${encodeURIComponent(
        email
      )}&type=${type}`
    );

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = [
          "Unable to reset password, please try again later",
        ];
      }

      return response;
    }

    return response.data;
  },

  resetPassword: async (formData) => {
    const response = await httpPost(`${apiUrlPrefix}/reset-password`, formData);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = [
          "Unable to reset password, please try again later",
        ];
      }

      return response;
    }

    if (response?.status !== 200) {
      return {
        error: true,
        message: ["Unable to reset password, please try again later"],
      };
    }

    return response.data;
  },

  checkFieldExist: async (url) => {
    const response = await httpGet(`${apiUrlPrefix}/check-field-exist${url}`);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = [
          "Unable to check field, please try again later",
        ];
      }

      return response;
    }

    return response.data;
  },

  getCurrentUserDetails: async () => {
    try {
      const response = await httpGet('user/profile');
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const userDetails = await response.json();
      return userDetails;
    } catch (error) {
      console.error('Failed to fetch current user details:', error);
      return { error: true, message: 'Failed to fetch user details.' };
    }
  },

  // Modify the getFacebookAuthUrl function to accept userType
  getFacebookAuthUrl: async (userType) => {
    try {
      // Include the userType in the body of the request
      const response = await httpPost(`${apiUrlPrefix}/facebook`, {
        userType: userType,
      });
      return response.data.url; // assuming the URL is returned in this structure
    } catch (error) {
      console.error("Error fetching Facebook auth URL:", error);
      return null;
    }
  },

  // Add this method to your AuthService object

  exchangeCodeForToken: async (code, state) => {
    try {
      // Construct the request body with code (and optionally state if your backend needs it)
      const requestBody = {
        code: code,
        state: state, // Include state if it's part of your flow, otherwise omit this line
      };

      // Make the POST request to your backend endpoint responsible for handling the code exchange
      const response = await httpPost(
        `${apiUrlPrefix}/facebook/callback`,
        requestBody
      );

      // Check for errors in the response
      if (response?.error) {
        console.error("Error exchanging code for token:", response.error);
        // Optionally, handle specific error messages or statuses
        return {
          error: true,
          message: response.error.message || "Error exchanging code for token.",
        };
      }

      // If the response contains the expected data (e.g., access token, user details), return it
      return { error: false, data: response.data };
    } catch (error) {
      console.error("Error exchanging code for token:", error);
      // Handle any exceptions thrown during the request
      return { error: true, message: "Failed to exchange code for token." };
    }
  },
};

export default AuthService;
