import { httpGet } from '../../rest-api';

const apiUrlPrefix = "agent/alert";

const AlertService = {
  list: async () => {
    const response = await httpGet(`${apiUrlPrefix}/list`);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to list alerts, please try again later"];
      }
      
      return response;
    }

    return response.data;
  },

  unReadCount: async () => {
    const response = await httpGet(`${apiUrlPrefix}/unread-count`);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to list alert count, please try again later"];
      }
      
      return response;
    }

    return response.data;
  },
};

export default AlertService;