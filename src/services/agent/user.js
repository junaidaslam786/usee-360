import { httpGet, httpPost, httpDelete, httpPut } from "../../rest-api";

const apiUrlPrefix = 'agent/user';

const UserService = {
  list: async ({ page = 1, size = 10, search = "" }) => {
    const response = await httpGet(`${apiUrlPrefix}/list?search=${search}&page=${page}&size=${size}`);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to list users, please try again later"];
      }
      
      return response;
    }

    return response.data;
  },

  toAllocate: async (user) => {
    const response = await httpGet(`${apiUrlPrefix}/to-allocate${user ? `?user=${user}` : ""}`);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to list users to allocate, please try again later"];
      }
      
      return response;
    }

    return response.data;
  },

  detail: async (id) => {
    const response = await httpGet(`${apiUrlPrefix}/${id}`);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to get user details, please try again later"];
      }
      
      return response;
    }

    return response.data;
  },

  add: async (reqBody) => {
    const response = await httpPost(`${apiUrlPrefix}/create`, reqBody, true);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to add user, please try again later"];
      }
      
      return response;
    }

    if (response?.status !== 201) {
      return { error: true, message: ["Unable to create user, please try again later"] };
    }

    return response.data;
  },

  update: async (reqBody) => {
    const response = await httpPut(`${apiUrlPrefix}/update`, reqBody, true);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to update user, please try again later"];
      }
      
      return response;
    }

    return response.data;
  },

  delete: async (id) => {
    const response = await httpDelete(`${apiUrlPrefix}/${id}`);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to delete user, please try again later"];
      }
      
      return response;
    }

    if (response?.status !== 200) {
      return { error: true, message: ["Unable to delete agent user, please try again later"] };
    }

    return response.data;
  },
  deleteUser: async (id) => {
    const response = await httpDelete(`${apiUrlPrefix}/${id}`);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to delete user, please try again later"];
      }
      
      return response;
    }

    if (response?.status !== 200) {
      return { error: true, message: ["Unable to delete agent user, please try again later"] };
    }

    return response.data;
  },
};

export default UserService;