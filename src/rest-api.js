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

export const httpPost = async (url, reqBody, isMultipart = false, token = "") => {
  try {
    return await axios.post(
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

  if (loginToken) {
    requestHeaders['Authorization'] = `Bearer ${loginToken}`;
  }
  requestHeaders["Content-Type"] = isMultipart ? "multipart/form-data" : "application/json";

  return requestHeaders;
}