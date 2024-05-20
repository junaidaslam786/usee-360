import { httpDelete, httpGet, httpPost, httpPut } from "../rest-api";

const apiUrlPrefix = "user";

const ProfileService = {
  getProfile: async () => {
    const response = await httpGet(`${apiUrlPrefix}/profile`);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = [
          "Unable to get profile, please try again later",
        ];
      }

      return response;
    }

    return response.data;
  },

  updateProfile: async (reqBody) => {
    const response = await httpPut(`${apiUrlPrefix}/profile`, reqBody, true);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = [
          "Unable to update profile, please try again later",
        ];
      }

      return response;
    }

    return response.data;
  },

  updatePassword: async ({ currentPassword, newPassword }) => {
    let formdata = new FormData();
    formdata.append("current", currentPassword);
    formdata.append("password", newPassword);

    const response = await httpPut(
      `${apiUrlPrefix}/update-password`,
      formdata,
      true
    );

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = [
          "Unable to update password, please try again later",
        ];
      }

      return response;
    }

    return response.data;
  },

  updateTimezone: async (timezone) => {
    let formdata = new FormData();
    formdata.append("timezone", timezone);

    const response = await httpPut(
      `${apiUrlPrefix}/update-timezone`,
      formdata,
      true
    );

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = [
          "Unable to update timezone, please try again later",
        ];
      }

      return response;
    }

    if (response?.status && response.status !== 200) {
      return {
        error: true,
        message: ["Unable to update timezone, please try again later"],
      };
    }

    return response.data;
  },

  uploadCallBackgroundImage: async (reqBody) => {
    const response = await httpPost(
      `${apiUrlPrefix}/call-background-image`,
      reqBody,
      true
    );

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = [
          "Unable to upload call background images, please try again later",
        ];
      }

      return response;
    }

    if (response?.status !== 200) {
      return {
        error: true,
        message: [
          "Unable to upload call background images, please try again later",
        ],
      };
    }

    return response.data;
  },

  deleteCallBackgroundImage: async (reqBody) => {
    const response = await httpDelete(
      `${apiUrlPrefix}/call-background-image`,
      reqBody
    );

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = [
          "Unable to delete call background image, please try again later",
        ];
      }

      return response;
    }

    if (response?.status !== 200) {
      return {
        error: true,
        message: [
          "Unable to delete call background image, please try again later",
        ],
      };
    }

    return response.data;
  },

  getUserBasicDetail: async (id) => {
    const response = await httpGet(`${apiUrlPrefix}/${id}`);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = [
          "Unable to get user basic detail, please try again later",
        ];
      }

      return response;
    }

    return response.data;
  }
};

export default ProfileService;
