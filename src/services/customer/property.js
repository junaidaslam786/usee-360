import { httpPost, httpDelete } from "../../rest-api";

const apiUrlPrefix = 'property/customer';

const PropertyService = {
  makeOffer: async (reqBody) => {
    const response = await httpPost(`${apiUrlPrefix}/make-offer`, reqBody);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to make offer, please try again later"];
      }
      
      return response;
    }

    if (response?.status !== 200) {
      return { error: true, message: ["Unable to make offer, please try again later"] };
    }

    return response.data;
  },

  deleteOffer: async (offerId) => {
    const response = await httpDelete(`${apiUrlPrefix}/offer/${offerId}`);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to delete offer, please try again later"];
      }
      
      return response;
    }

    if (response?.status !== 200) {
      return { error: true, message: ["Unable to delete offer, please try again later"] };
    }

    return response.data;
  },

  updateSnagList: async (reqBody) => {
    const response = await httpPost(`${apiUrlPrefix}/snag-list`, reqBody);

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
};

export default PropertyService;