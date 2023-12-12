import { httpGet, httpPost, httpPut, httpDelete } from "../../rest-api";

const apiUrlPrefix = 'property';

const PropertyService = {
  list: async ({ page = 1, size = 10, search = "", user = "" }) => {
    const response = await httpGet(`${apiUrlPrefix}/list?search=${search}&page=${page}&size=${size}&user=${user}`);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to list properties, please try again later"];
      }
      
      return response;
    }

    return response.data;
  },

  detail: async (id) => {
    const response = await httpGet(`${apiUrlPrefix}/${id}`);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to get property details, please try again later"];
      }
      
      return response;
    }

    return response.data;
  },

  add: async (reqBody) => {
    const response = await httpPost(`${apiUrlPrefix}/create`, reqBody, true);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to create property, please try again later"];
      }
      
      return response;
    }

    return response.data;
  },

  addPropertyLog: async (reqBody) => {
    const response = await httpPost(`${apiUrlPrefix}/log`, reqBody, true);
    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message =
          ["Unable to create property log, please try again later"];
      }
      return response;
    }
    return response.data;
  },

  update: async (reqBody) => {
    const response = await httpPut(`${apiUrlPrefix}/update`, reqBody, true);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to update property, please try again later"];
      }
      
      return response;
    }

    return response.data;
  },

  uploadDocument: async (reqBody) => {
    const response = await httpPost(`${apiUrlPrefix}/document`, reqBody, true);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to upload document, please try again later"];
      }
      
      return response;
    }

    if (response?.status !== 200) {
      return { error: true, message: ["Unable to upload documents, please try again later"] };
    }

    return response.data;
  },

  deleteDocument: async (reqBody) => {
    const response = await httpDelete(`${apiUrlPrefix}/document`, reqBody);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to delete document, please try again later"];
      }
      
      return response;
    }

    if (response?.status !== 200) {
      return { error: true, message: ["Unable to delete document, please try again later"] };
    }

    return response.data;
  },

  uploadImage: async (reqBody) => {
    const response = await httpPost(`${apiUrlPrefix}/image`, reqBody, true);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to upload image, please try again later"];
      }
      
      return response;
    }

    if (response?.status !== 200) {
      return { error: true, message: ["Unable to upload images, please try again later"] };
    }

    return response.data;
  },

  deleteImage: async (reqBody) => {
    const response = await httpDelete(`${apiUrlPrefix}/image`, reqBody);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to delete image, please try again later"];
      }
      
      return response;
    }

    if (response?.status !== 200) {
      return { error: true, message: ["Unable to delete image, please try again later"] };
    }

    return response.data;
  },

  offerDetail: async (id) => {
    const response = await httpGet(`${apiUrlPrefix}/offer/${id}`);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to get offer details, please try again later"];
      }
      
      return response;
    }

    return response.data;
  },

  updateOffer: async (reqBody) => {
    const response = await httpPost(`${apiUrlPrefix}/agent/update-offer`, reqBody);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to update offer, please try again later"];
      }
      
      return response;
    }

    if (response?.status !== 200) {
      return { error: true, message: ["Unable to update offer status, please try again later"] };
    }

    return response.data;
  },

  updateSnagList: async (reqBody) => {
    const response = await httpPost(`${apiUrlPrefix}/agent/snag-list`, reqBody);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to update snag list, please try again later"];
      }
      
      return response;
    }

    if (response?.status !== 200) {
      return { error: true, message: ["Unable to update snag list, please try again later"] };
    }

    return response.data;
  },

  toAllocate: async () => {
    const response = await httpGet(`${apiUrlPrefix}/to-allocate`);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to get properties to allocate, please try again later"];
      }
      
      return response;
    }

    return response.data;
  },

  toAllocateCustomer: async (searchQuery) => {
    const response = await httpGet(`${apiUrlPrefix}/to-allocate-customer?q=${searchQuery}`);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to get customers to allocate, please try again later"];
      }
      
      return response;
    }

    return response.data;
  },

  listRemovalReasons: async () => {
    const response = await httpGet(`${apiUrlPrefix}/list-removal-reasons`);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to list property remove reasons, please try again later"];
      }
      
      return response;
    }

    return response.data;
  },

  removalRequest: async (reqBody) => {
    const response = await httpPost(`${apiUrlPrefix}/removal-request`, reqBody);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to submit removal request property, please try again later"];
      }
      
      return response;
    }

    if (response?.status !== 200) {
      return { error: true, message: ["Unable to submit removal request property, please try again later"] };
    }

    return response.data;
  },

  removeAllocatedProperty: async (reqBody) => {
    const response = await httpDelete(`${apiUrlPrefix}/allocated`, reqBody);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to delete allocated property, please try again later"];
      }
      
      return response;
    }

    if (response?.status !== 200) {
      return { error: true, message: ["Unable to delete allocated property, please try again later"] };
    }

    return response.data;
  },

  log: async (reqBody) => {
    const response = await httpPost(`${apiUrlPrefix}/log`, reqBody);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to create property log, please try again later"];
      }
      
      return response;
    }

    return response.data;
  },
};

export default PropertyService;