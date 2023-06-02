import { httpGet, httpPost } from "../rest-api";

const apiUrlPrefix = 'cms';

const CmsService = {
  list: async (formData) => {
    const response = await httpPost(`${apiUrlPrefix}/all-pages`, formData);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to list data, please try again later"];
      }
      
      return response;
    }

    return response.data;
  },

  detail: async (id) => {
    const response = await httpGet(`${apiUrlPrefix}/single-page/${id}`);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to get details, please try again later"];
      }
      
      return response;
    }

    return response.data;
  },

  listCommunities: async (formData) => {
    const response = await httpPost(`${apiUrlPrefix}/community/list`, formData);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to list data, please try again later"];
      }
      
      return response;
    }

    return response.data;
  },

  listCommunityPosts: async (formData) => {
    const response = await httpPost(`${apiUrlPrefix}/community/post/list`, formData);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to list data, please try again later"];
      }
      
      return response;
    }

    return response.data;
  },

  detailCommunityPost: async (id) => {
    const response = await httpGet(`${apiUrlPrefix}/community/post/${id}`);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to get details, please try again later"];
      }
      
      return response;
    }

    return response.data;
  },

  addCommunityPost: async (reqBody) => {
    const response = await httpPost(`${apiUrlPrefix}/community/post/create`, reqBody, true);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to create post, please try again later"];
      }
      
      return response;
    }

    return response.data;
  },

  addCommunityPostComment: async (reqBody) => {
    const response = await httpPost(`${apiUrlPrefix}/community/post/create-comment`, reqBody);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to create post comment, please try again later"];
      }
      
      return response;
    }

    return response.data;
  },
};

export default CmsService;