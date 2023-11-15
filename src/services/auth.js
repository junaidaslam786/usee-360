import { httpGet, httpPost } from '../rest-api';

const apiUrlPrefix = 'auth';

const AuthService = {
  register: async (formData, type) => {
    const response = await httpPost(`${apiUrlPrefix}/register-${type}`, formData, true);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to register, please try again later"];
      }
      
      return response;
    }

    return response.data;
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
      const response = await httpPost(`${apiUrlPrefix}/refresh`, { refreshToken });

      if (response?.error) {
        // Handle any errors that occurred during the refresh token process
        console.error('Error refreshing token:', response.error);
        return { error: true, message: response.error.message };
      }

      // Assuming the new access token is in the response data
      return { error: false, accessToken: response.data.accessToken };
    } catch (error) {
      console.error('Error refreshing token:', error);
      return { error: true, message: 'Failed to refresh token' };
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
    const response = await httpPost('user/validate-otp', formData, false, token);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Invalid OTP"];
      }
      
      return response;
    }

    return response.data;
  },

  forgotPassword: async (email, type) => {
    const response = await httpGet(`${apiUrlPrefix}/forgot-password?email=${encodeURIComponent(email)}&type=${type}`);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to reset password, please try again later"];
      }
      
      return response;
    }

    return response.data;
  },

  resetPassword: async (formData) => {
    const response = await httpPost(`${apiUrlPrefix}/reset-password`, formData);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to reset password, please try again later"];
      }
      
      return response;
    }

    if (response?.status !== 200) {
      return { error: true, message: ["Unable to reset password, please try again later"] };
    }

    return response.data;
  },

  checkFieldExist: async (url) => {
    const response = await httpGet(`${apiUrlPrefix}/check-field-exist${url}`);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to check field, please try again later"];
      }
      
      return response;
    }

    return response.data;
  },
};

export default AuthService;