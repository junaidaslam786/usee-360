import { httpGet, httpPost, httpPut } from "../rest-api";

const apiUrlPrefix = 'home';

const HomepageService = {
  bookDemo: async () => {
    const response = await httpPost(`${apiUrlPrefix}/book-demo`);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to book demo, please try again later"];
      }
      
      return response;
    }

    if (response?.status !== 200) {
      return { error: true, message: ["Unable to book demo, please try again later"] };
    }

    return response.data;
  },

  propertyDetail: async (id) => {
    const response = await httpGet(`${apiUrlPrefix}/property/${id}`);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to get property details, please try again later"];
      }
      
      return response;
    }

    return response.data;
  },

  listProperties: async (id, reqBody) => {
    const response = await httpPost(`${apiUrlPrefix}/property/list${id ? `?agentId=${id}` : ""}`, reqBody);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to list properties, please try again later"];
      }
      
      return response;
    }

    return response.data;
  },

  chatAttachment: async (reqBody) => {
    const response = await httpPut(`${apiUrlPrefix}/property/chat-attachment`, reqBody, true);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to list properties, please try again later"];
      }
      
      return response;
    }

    return response.data;
  },

  searchByPolygon: async (reqBody) => {
    const response = await httpPost(`${apiUrlPrefix}/property/search-polygon`, reqBody);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to search by polygon, please try again later"];
      }
      
      return response;
    }

    return response.data;
  },

  searchByCircle: async (reqBody) => {
    const response = await httpPost(`${apiUrlPrefix}/property/search-circle`, reqBody);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to search by circle, please try again later"];
      }
      
      return response;
    }

    return response.data;
  },
};

export default HomepageService;