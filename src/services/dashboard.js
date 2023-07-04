import { httpPost } from "../rest-api";

const DashboardService = {
  loadData: async (type, reqBody) => {
    const response = await httpPost(`${type}/dashboard`, reqBody);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = [
          "Unable to load dashboard data, please try again later",
        ];
      }

      return response;
    }

    return response.data;
  },
};

export default DashboardService;
