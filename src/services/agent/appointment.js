import { httpGet, httpPost, httpPut } from "../../rest-api";

const apiUrlPrefix = 'agent/appointment';

const AppointmentService = {
  list: async ({ type = "", page = 1, size = 10, appendQuery = "" }) => {
    const response = await httpGet(`${apiUrlPrefix}/list?page=${page}&size=${size}&type=${type}${appendQuery}`);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to list appointment, please try again later"];
      }
      
      return response;
    }

    return response.data;
  },

  detail: async (id) => {
    const response = await httpGet(`${apiUrlPrefix}/${id}`);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to get appointment details, please try again later"];
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

  add: async (reqBody) => {
    const response = await httpPost(`${apiUrlPrefix}/create`, reqBody);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to create appointment, please try again later"];
      }
      
      return response;
    }

    if (response?.status !== 201) {
      return { error: true, message: ["Unable to create appointment, please try again later"] };
    }

    return response.data;
  },

  addNote: async (reqBody) => {
    const response = await httpPost(`${apiUrlPrefix}/note`, reqBody);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to add note, please try again later"];
      }
      
      return response;
    }

    return response.data;
  },
  
  updateStatus: async (reqBody) => {
    const response = await httpPut(`${apiUrlPrefix}/status`, reqBody);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to update status, please try again later"];
      }
      
      return response;
    }

    return response.data;
  },

  sessionToken: async (id) => {
    const response = await httpGet(`${apiUrlPrefix}/session-token/${id}`);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to get session token details, please try again later"];
      }
      
      return response;
    }

    return response.data;
  },

  log: async (reqBody) => {
    const response = await httpPost(`${apiUrlPrefix}/log`, reqBody);

    if (response?.error) {
      if (response?.error?.message?.length === 0) {
        response.error.message = ["Unable to list appointment, please try again later"];
      }
      return response;
    }

    return response.data;
  },
};

export default AppointmentService;