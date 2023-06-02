import { httpGet, httpPost } from "../rest-api";

const apiUrlPrefix = 'iframe';

const IframeService = {
    listSlots: async (agent) => {
        const response = await httpGet(`${apiUrlPrefix}/list-slots?agent=${agent}`);
    
        if (response?.error) {
          if (response?.error?.message && response?.error?.message.length < 0) {
            response.error.message = ["Unable to list slots, please try again later"];
          }
          
          return response;
        }
    
        return response.data;
    },

    toAllocate: async (user) => {
        const response = await httpGet(`${apiUrlPrefix}/to-allocate?user=${user}`);
    
        if (response?.error) {
          if (response?.error?.message && response?.error?.message.length < 0) {
            response.error.message = ["Unable to list users to allocate, please try again later"];
          }
          
          return response;
        }
    
        return response.data;
    },

    createAppointment: async (reqBody) => {
        const response = await httpPost(`${apiUrlPrefix}/appointment`, reqBody);
    
        if (response?.error) {
          if (response?.error?.message && response?.error?.message.length < 0) {
            response.error.message = ["Unable to create appointment, please try again later"];
          }
          
          return response;
        }
    
        return response.data;
    },

    checkAvailability: async (reqBody) => {
        const response = await httpPost(`${apiUrlPrefix}/check-availability`, reqBody);
    
        if (response?.error) {
          if (response?.error?.message && response?.error?.message.length < 0) {
            response.error.message = ["Unable to check availability, please try again later"];
          }
          
          return response;
        }
    
        return response.data;
    },

    addToWishlist: async (reqBody) => {
        const response = await httpPost(`${apiUrlPrefix}/wishlist`, reqBody);
    
        if (response?.error) {
          if (response?.error?.message && response?.error?.message.length < 0) {
            response.error.message = ["Unable to add property to wishlist, please try again later"];
          }
          
          return response;
        }
    
        return response.data;
    },
};

export default IframeService;