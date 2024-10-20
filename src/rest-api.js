import axios from "axios";
import { getLoginToken } from "./utils";

const appBaseUrl = process.env.REACT_APP_API_URL;

export const httpGet = async (url) => {
  try {
    return await axios.get(`${appBaseUrl}/${url}`, {
      headers: generateHeaders(),
    });
  } catch(error) {
    let messageArray = [];
      
    if (error?.response?.data?.errors) {
      messageArray = error.response.data.errors;
    } else if (error?.response?.data?.message) {
      messageArray.push(error.response.data.message);
    }

    return { error: true, message: messageArray };
  }
}

// export const httpPost = async (url, reqBody, isMultipart = false, token = "") => {
//   try {
//     return await axios.post(
//       `${appBaseUrl}/${url}`, 
//       reqBody, 
//       {
//         headers: generateHeaders(token, isMultipart),
//       }
//     );
//   } catch(error) {
//     let messageArray = [];
      
//     if (error?.response?.data?.errors) {
//       messageArray = error.response.data.errors;
//     } else if (error?.response?.data?.message) {
//       messageArray.push(error.response.data.message);
//     }

//     return { error: true, message: messageArray };
//   }
// }

// Updated to include onUploadProgress as an optional parameter
export const httpPost = async (url, reqBody, isMultipart = false, token = "", onUploadProgress = null) => {
  try {
    const config = {
      headers: generateHeaders(token, isMultipart),
    };

    // Safely include the onUploadProgress callback if it's a function
    if (typeof onUploadProgress === 'function') {
      config.onUploadProgress = progressEvent => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log('Percent complete', percentCompleted);
        onUploadProgress(percentCompleted);
      };
    }

    return await axios.post(`${appBaseUrl}/${url}`, reqBody, config);
  } catch (error) {
    let messageArray = [];
      
    if (error?.response?.data?.errors) {
      messageArray = error.response.data.errors;
    } else if (error?.response?.data?.message) {
      messageArray.push(error.response.data.message);
    }

    return { error: true, message: messageArray };
  }
};

// export const httpPost = async (url, reqBody, isMultipart = false, token = "") => {
//   // Setting up the Axios config
//   const config = {
//     headers: {},
//   };

//   if (token) {
//     config.headers["Authorization"] = `Bearer ${token}`;
//   }

//   // If isMultipart is true, do not manually set the 'Content-Type'
//   // Let Axios handle it based on the FormData object
//   if (!isMultipart) {
//     config.headers["Content-Type"] = "application/json";
//   }

//   try {
//     const response = await axios.post(`${appBaseUrl}/${url}`, reqBody, config);
//     return response.data; // Assuming the server response includes the data directly
//   } catch (error) {
//     let messageArray = [];
    
//     if (error?.response?.data?.errors) {
//       messageArray = error.response.data.errors;
//     } else if (error?.response?.data?.message) {
//       messageArray.push(error.response.data.message);
//     }

//     return { error: true, message: messageArray };
//   }
// };


export const httpPut = async (url, reqBody, isMultipart = false, token = "") => {
  try {
    return await axios.put(
      `${appBaseUrl}/${url}`, 
      reqBody, 
      {
        headers: generateHeaders(token, isMultipart),
      }
    );
  } catch(error) {
    let messageArray = [];
      
    if (error?.response?.data?.errors) {
      messageArray = error.response.data.errors;
    } else if (error?.response?.data?.message) {
      messageArray.push(error.response.data.message);
    }

    return { error: true, message: messageArray };
  }
}

export const httpDelete = async (url, reqBody) => {
  try {
    return await axios.delete(
      `${appBaseUrl}/${url}`, 
      {
        data: reqBody,
        headers: generateHeaders(),
      }
    );
  } catch(error) {
    let messageArray = [];
      
    if (error?.response?.data?.errors) {
      messageArray = error.response.data.errors;
    } else if (error?.response?.data?.message) {
      messageArray.push(error.response.data.message);
    }

    return { error: true, message: messageArray };
  }
}

export const generateHeaders = (token = "", isMultipart = false) => {
  let requestHeaders = {};
  let loginToken = token ? token : getLoginToken();
  const apiCode = process.env.INTERNAL_API_CODE;

  if (loginToken) {
    requestHeaders['Authorization'] = `Bearer ${loginToken}`;
  }
  requestHeaders["Content-Type"] = isMultipart ? "multipart/form-data" : "application/json";
  requestHeaders["Apicode"] = apiCode;

  return requestHeaders;
};

// Add a new function in rest-api.js to generate headers for Stripe requests
export const generateStripeHeaders = () => {
  return {
    "Authorization": `Bearer ${process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}`,
    "Content-Type": "application/x-www-form-urlencoded"
  };
}
