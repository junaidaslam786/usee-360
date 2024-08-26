import { httpGet, httpPost, httpPut, httpDelete } from "../../rest-api";


const apiUrlPrefix = "property";

const PropertyService = {
  list: async ({ page = 1, size = 10, search = "", user = "" }) => {
    const response = await httpGet(
      `${apiUrlPrefix}/list?search=${search}&page=${page}&size=${size}&user=${user}`
    );

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = [
          "Unable to list properties, please try again later",
        ];
      }

      return response;
    }

    return response.data;
  },

  detail: async (id) => {
    const response = await httpGet(`${apiUrlPrefix}/${id}`);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = [
          "Unable to get property details, please try again later",
        ];
      }

      return response;
    }

    return response.data;
  },

  

  add: async (reqBody) => {
    try {
      const response = await httpPost(`${apiUrlPrefix}/create`, reqBody, true);
  
      if (response?.error) {
        console.error("Error in creating property:", response.message);
        return {
          success: false,
          message: response.message || "Unable to create property, please try again later.",
        };
      }
  
      console.log("Property created successfully:", response);
      return {
        success: true,
        data: response.data,
        message: "Property created successfully",
      };
    } catch (error) {
      console.error("Error in creating property:", error);
      return {
        success: false,
        message: "An error occurred while creating the property.",
      };
    }
  },
  
  

  addPropertyLog: async (reqBody) => {
    const response = await httpPost(`${apiUrlPrefix}/log`, reqBody, true);
    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = [
          "Unable to create property log, please try again later",
        ];
      }
      return response;
    }
    return response.data;
  },

  update: async (reqBody) => {
    const response = await httpPut(`${apiUrlPrefix}/update`, reqBody, true);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = [
          "Unable to update property, please try again later",
        ];
      }

      return response;
    }

    return response.data;
  },

  uploadDocument: async (reqBody) => {
    const response = await httpPost(`${apiUrlPrefix}/document`, reqBody, true);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = [
          "Unable to upload document, please try again later",
        ];
      }

      return response;
    }

    if (response?.status !== 200) {
      return {
        error: true,
        message: ["Unable to upload documents, please try again later"],
      };
    }

    return response.data;
  },

  deleteDocument: async (reqBody) => {
    const response = await httpDelete(`${apiUrlPrefix}/document`, reqBody);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = [
          "Unable to delete document, please try again later",
        ];
      }

      return response;
    }

    if (response?.status !== 200) {
      return {
        error: true,
        message: ["Unable to delete document, please try again later"],
      };
    }

    return response.data;
  },

  // uploadImage: async (reqBody) => {
  //   const response = await httpPost(`${apiUrlPrefix}/image`, reqBody, true);

  //   if (response?.error) {
  //     if (response?.error?.message && response?.error?.message.length < 0) {
  //       response.error.message = [
  //         "Unable to upload image, please try again later",
  //       ];
  //     }

  //     return response;
  //   }

  //   if (response?.status !== 200) {
  //     return {
  //       error: true,
  //       message: ["Unable to upload images, please try again later"],
  //     };
  //   }

  //   return response.data;
  // },
  uploadImage : async (formData, onUploadProgress) => {
    try {
      const response = await httpPost(
        `${apiUrlPrefix}/image`,
        formData,
        true, // Assuming isMultipart is always true for this service
        "", // Assuming a token is not required or is handled inside httpPost
        onUploadProgress // Correctly passing the callback
      );
  
      // Assuming response.data structure correctly indicates success/error
      if (response.error) {
        // Provide a default error message if none is specified
        const errorMessage = response.message || "Unable to upload image, please try again later";
        return { error: true, message: errorMessage };
      }
  
      // Optionally check for HTTP status code if your httpPost implementation wraps the Axios response
      // and includes status codes or other metadata
      if (response.status !== 200) {
        return {
          error: true,
          message: "Unable to upload images, please try again later",
        };
      }
  
      return response.data; // Assuming this contains the uploaded image data on success
    } catch (error) {
      console.error("Error uploading image:", error.response || error);
      return {
        error: true,
        message: error.response?.data?.message || "An error occurred while uploading the image.",
      };
    }
  },
  

  uploadFeatureImage: async (formData, onUploadProgress) => {
    try {
      const response = await httpPost(
        `${apiUrlPrefix}/featured-image`,
        formData,
        true, // Assuming isMultipart is always true for this service
        "", // Assuming a token is not required or is handled inside httpPost
        onUploadProgress // Correctly passing the callback
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading featured image:", error.response || error);
      if (error.response && error.response.data) {
        return {
          error: true,
          message:
            error.response.data.message ||
            "Unable to upload featured image, please try again later",
        };
      } else {
        return {
          error: true,
          message: "An error occurred while uploading the featured image.",
        };
      }
    }
  },

  uploadVirtualTour: async (formData, onUploadProgress) => {
    try {
      const response = await httpPost(
        `${apiUrlPrefix}/virtual-tour`,
        formData,
        true, // Assuming isMultipart is always true for this service
        "", // Assuming a token is not required or is handled inside httpPost
        onUploadProgress // Correctly passing the callback
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading virtual tour:", error.response || error);
      if (error.response && error.response.data) {
        return {
          error: true,
          message:
            error.response.data.message ||
            "Unable to upload virtual tour, please try again later",
        };
      } else {
        return {
          error: true,
          message: "An error occurred while uploading the virtual tour.",
        };
      }
    }
  },

  uploadQRCode: async (formData, onUploadProgress) => {
    try {
      const response = await httpPost(
        `${apiUrlPrefix}/qrcode`, // Adjusted endpoint for QR code upload
        formData,
        true, // Assuming isMultipart is always true for this service
        "", // Assuming a token is not required or is handled inside httpPost
        onUploadProgress 
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading qrCode:", error.response || error);
      if (error.response && error.response.data) {
        return {
          error: true,
          message:
            error.response.data.message ||
            "Unable to upload qrCode, please try again later",
        };
      } else {
        return {
          error: true,
          message: "An error occurred while uploading the qrCode.",
        };
      }
    }
  },

  deleteImage: async (reqBody) => {
    const response = await httpDelete(`${apiUrlPrefix}/image`, reqBody);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = [
          "Unable to delete image, please try again later",
        ];
      }

      return response;
    }

    if (response?.status !== 200) {
      return {
        error: true,
        message: ["Unable to delete image, please try again later"],
      };
    }

    return response.data;
  },

  offerDetail: async (id) => {
    const response = await httpGet(`${apiUrlPrefix}/offer/${id}`);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = [
          "Unable to get offer details, please try again later",
        ];
      }

      return response;
    }

    return response.data;
  },

  updateOffer: async (reqBody) => {
    const response = await httpPost(
      `${apiUrlPrefix}/agent/update-offer`,
      reqBody
    );

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = [
          "Unable to update offer, please try again later",
        ];
      }

      return response;
    }

    if (response?.status !== 200) {
      return {
        error: true,
        message: ["Unable to update offer status, please try again later"],
      };
    }

    return response.data;
  },

  updateSnagList: async (reqBody) => {
    const response = await httpPost(`${apiUrlPrefix}/agent/snag-list`, reqBody);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = [
          "Unable to update snag list, please try again later",
        ];
      }

      return response;
    }

    if (response?.status !== 200) {
      return {
        error: true,
        message: ["Unable to update snag list, please try again later"],
      };
    }

    return response.data;
  },

  enableSnagList: async (productId, userSubscriptionId) => {
    try {
      const response = await httpPost(`${apiUrlPrefix}/agent/enable-snaglist`, {
        productId,
        userSubscriptionId,
      });
      return response.data;
    } catch (error) {
      console.error('Error enabling snag list:', error);
      return {
        error: true,
        message: 'Failed to enable snag list. Please try again later.',
      };
    }
  },

  toAllocate: async () => {
    const response = await httpGet(`${apiUrlPrefix}/to-allocate`);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = [
          "Unable to get properties to allocate, please try again later",
        ];
      }

      return response;
    }

    return response.data;
  },

  toAllocateCustomer: async (searchQuery) => {
    const response = await httpGet(
      `${apiUrlPrefix}/to-allocate-customer?q=${searchQuery}`
    );

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = [
          "Unable to get customers to allocate, please try again later",
        ];
      }

      return response;
    }

    return response.data;
  },

  listRemovalReasons: async () => {
    const response = await httpGet(`${apiUrlPrefix}/list-removal-reasons`);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = [
          "Unable to list property remove reasons, please try again later",
        ];
      }

      return response;
    }

    return response.data;
  },

  removalRequest: async (reqBody) => {
    const response = await httpPost(`${apiUrlPrefix}/removal-request`, reqBody);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = [
          "Unable to submit removal request property, please try again later",
        ];
      }

      return response;
    }

    if (response?.status !== 200) {
      return {
        error: true,
        message: [
          "Unable to submit removal request property, please try again later",
        ],
      };
    }

    return response.data;
  },

  removeAllocatedProperty: async (reqBody) => {
    const response = await httpDelete(`${apiUrlPrefix}/allocated`, reqBody);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = [
          "Unable to delete allocated property, please try again later",
        ];
      }

      return response;
    }

    if (response?.status !== 200) {
      return {
        error: true,
        message: [
          "Unable to delete allocated property, please try again later",
        ],
      };
    }

    return response.data;
  },

  log: async (reqBody) => {
    const response = await httpPost(`${apiUrlPrefix}/log`, reqBody);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = [
          "Unable to create property log, please try again later",
        ];
      }

      return response;
    }

    return response.data;
  },

  carbonFootprint: async (id) => {
    const response = await httpGet(`${apiUrlPrefix}/${id}/carbon-footprint`);

    if (response?.error) {
      if (response?.error?.message && response?.error?.message.length < 0) {
        response.error.message = ["Unable to list carbon footprint of the property"];
      }

      return response;
    }

    return response.data;
  },
};

export default PropertyService;
