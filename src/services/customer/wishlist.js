import { httpGet, httpDelete } from "../../rest-api";

const apiUrlPrefix = 'customer/wishlist';

const WishlistService = {
  list: async () => {
    const response = await httpGet(`${apiUrlPrefix}/list`);

    if (response?.error) {
        if (response?.error?.message && response?.error?.message.length < 0) {
            response.error.message = ["Unable to list wishlist, please try again later"];
        }
        
        return response;
    }

    return response.data;
  },

  removeFromWishlist: async (id) => {
    const response = await httpDelete(`${apiUrlPrefix}/remove/${id}`);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to remove from wishlist, please try again later"];
      }
      
      return response;
    }

    return response.data;
  },

  addToWishlist: async (id) => {
    const response = await httpGet(`${apiUrlPrefix}/add/${id}`);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to add property to wishlist, please try again later"];
      }
      
      return response;
    }

    if (response?.status !== 201) {
      return { error: true, message: ["Unable to add property to wishlist, please try again later"] };
    }

    return response.data;
  },
};

export default WishlistService;