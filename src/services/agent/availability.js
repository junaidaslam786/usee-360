import { httpGet, httpPut } from "../../rest-api";

const apiUrlPrefix = 'agent/availability';

const AvailabilityService = {
  list: async () => {
    const response = await httpGet(`${apiUrlPrefix}/list`);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to list availability, please try again later"];
      }
      
      return response;
    }

    return response.data;
  },

  listSlots: async ({ agent = "", all = false } = {}) => {
    const response = await httpGet(`${apiUrlPrefix}/list-slots?agent=${agent}${all ? "&all=true": ""}`);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to list slots, please try again later"];
      }
      
      return response;
    }

    return response.data;
  },

  update: async (reqBody) => {
    const response = await httpPut(`${apiUrlPrefix}/update`, reqBody);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to update availability, please try again later"];
      }
      
      return response;
    }

    return response.data;
  },
};

export default AvailabilityService;