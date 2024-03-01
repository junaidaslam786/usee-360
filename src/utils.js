import jwt from 'jsonwebtoken';
import moment from "moment";
import 'moment-timezone';
import AuthService from './services/auth';
import {
  PROPERTY_TYPES, 
  PROPERTY_CATEGORY_TYPES,
  BEDROOMS,
  UNITS,
  RESIDENTIAL_PROPERTY,
  COMMERCIAL_PROPERTY,
  PRICE_TYPE,
  DEFAULT_CURRENCY,
} from './constants';
import UserService from './services/agent/user';

export const checkTimeOver = (date, time) => {
    const difdate = date;
    const parts = difdate.split("-");
    const fpdate = parts[0]+'-'+parts[1]+'-'+parts[2];
    
    const givenDate = moment.tz(`${fpdate}${time}`, 'YYYY-MM-DD HH:mm:ss', getUserTimezone()).format("ddd MMM D YYYY HH:mm:00 [GMT]ZZ (zz)");
    const currentDate = moment(new Date()).tz(getUserTimezone()).format("ddd MMM D YYYY HH:mm:00 [GMT]ZZ (zz)");
    
    return givenDate < currentDate;
}

export const findCurrentTimeSlot = (timeslots) => {
    const currentTime = currentTimezoneBasedTime().split(":");
    const currentHours = parseInt(currentTime[0]);
    const currentMinutes = parseInt(currentTime[1]);
    const currentTimeInMinutes = (currentHours * 60) + currentMinutes;

    for (let slot of timeslots) {
      const [fromHours, fromMinutes] = slot.fromTime.split(':');
      const [toHours, toMinutes] = slot.toTime.split(':');

      const fromTimeInMinutes = parseInt(fromHours) * 60 + parseInt(fromMinutes);
      const toTimeInMinutes = parseInt(toHours) * 60 + parseInt(toMinutes);

      if (currentTimeInMinutes >= fromTimeInMinutes && currentTimeInMinutes < toTimeInMinutes) {
        return slot;
      }
    }

  return null;
}


export const checkAgentDetails = async () => {
  try {
    const token = getLoginToken();
    if (!token) {
      throw new Error('No token found');
    }

    const userDetails = getUserDetailsFromJwt(token);
    if (!userDetails || !userDetails.id) {
      throw new Error('Failed to decode token or no user ID found');
    }

    // Use UserService.detail to fetch user details by ID
    const agentDetails = await UserService.detail(userDetails.id);
    if (agentDetails.error) {
      throw new Error(agentDetails.error.message || 'Failed to fetch agent details');
    }

    return agentDetails; // Successfully fetched agent details
  } catch (error) {
    console.error('Error fetching agent details:', error);
    return null; // Or handle the error as needed
  }
};




export const getUserDetailsFromJwt = (token) => {
  try {
    let tokenToDecode = token;
    if (!tokenToDecode) {
      tokenToDecode = getLoginToken();
    }
    
    const decoded = jwt.verify(tokenToDecode, process.env.REACT_APP_JWT_SECRET_KEY);
    return decoded;
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      console.log('Token has expired:', err.message);
    } else {
      console.log('Error decoding token:', err.message);
    }
    return "";
  }
}

export const getUserDetailsFromJwt2 = async (token) => {
  try {
    let tokenToDecode = token;
    if (!tokenToDecode) {
      // If there's no token, attempt to refresh it
      const refreshToken = localStorage.getItem('refreshToken'); // Get the stored refresh token
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      const refreshResponse = await AuthService.refreshToken(refreshToken);
      if (refreshResponse.error) {
        throw new Error(refreshResponse.message);
      }
      // Store the new access token and use it to decode the user details
      localStorage.setItem('userToken', refreshResponse.accessToken);
      tokenToDecode = refreshResponse.accessToken;
    }
    
    const decoded = jwt.verify(tokenToDecode, process.env.REACT_APP_JWT_SECRET_KEY);
    return decoded;
  } catch (err) {
    // Handle errors, including token expiration
    console.error('Error getting user details:', err.message);
    return null;
  }
};

export const convertTimestampToDateTime = (timestamp, format) => {
  return timestamp ? moment.unix(timestamp / 1000).format(format ? format : "HH:mm") : "-";
}

export const setMomentDefaultTimezone = () => {
  moment.tz.setDefault(getUserTimezone());
}

export const getMomentDefaultTimezone = () => {
  return moment().tz();
}

export const formatSlotFromTime = (fromTime, sourceFormat, targetFromat) => {
  return fromTime ? moment(fromTime, (sourceFormat ? sourceFormat : "hh:mm:ss")).format(targetFromat ? targetFromat : "HH:mm") : "-";
}

export const formatCreatedAtTimestamp = (createdAt, format) => {
  return createdAt ? moment.utc(createdAt).format(format ? format : "D/MM/YYYY") : "-";
}

export const formatAppointmentDate = (appointmentDate, format) => {
  return appointmentDate ? moment(appointmentDate).format(format ? format : "D/MM/YYYY") : "-";
}

export const addTimeInTimestamp = (timestamp, time, type) => {
  return timestamp ? (moment.unix(timestamp / 1000).add(time ? time : 0, type ? type : 'minutes').unix() * 1000) : "-";
}

export const convertTimeToTimezoneBasedTime = (time) => {
  return time ? moment.tz(time, "HH:mm", getUserTimezone()).format("HH:mm") : "-";
}

export const currentTimezoneBasedDate = () => {
  return moment(new Date()).format("YYYY-MM-DD");
}

export const currentTimezoneBasedTime = () => {
  return moment(new Date()).format("HH:mm");
}

export const convertGmtToTime = (time, format) => {
  return time ? moment.tz(time, "HH:mm:ss", "GMT").tz(getUserTimezone()).format(format ? format : "HH:mm") : "-";
}

export const getUserType = () => {
  return JSON.parse(localStorage.getItem("userType"));
}

export const setUserType = (type) => {
  localStorage.setItem("userType", JSON.stringify(type));
}

export const getLoginToken = () => {
  return JSON.parse(localStorage.getItem("userToken"));
}
// export const getLoginToken = () => {
//   // Directly return the token string from localStorage without JSON parsing
//   return localStorage.getItem("userToken");
// };


export const removeLoginToken = () => {
  localStorage.removeItem("userToken");
  localStorage.removeItem("userTimezone");
  localStorage.removeItem("userType");
  return true;
}

export const setLoginToken = (token) => {
  localStorage.setItem("userToken", JSON.stringify(token));
}

export const getUserTimezone = () => {
  return JSON.parse(localStorage.getItem("userTimezone"));
}

export const setUserTimezone = (timezone) => {
  localStorage.setItem("userTimezone", JSON.stringify(timezone));
}

export const setResponseHandler = (responseMessage, isSuccess = false) => {
  let response = { errors: responseMessage, success: "" };

  if (isSuccess) {
    response.errors = [];
    response.success = responseMessage;
  }

  return response;
}

export const formatPrice = (price) => {
  const formatter = new Intl.NumberFormat('en-US');
  return `${DEFAULT_CURRENCY} ${formatter.format(price)}`;
}

export const loadPropertyMetaData = (property, type) => {
  let metaData = "";
  let metaTag;
  const productMetaTags = property?.productMetaTags ? property.productMetaTags : [];

  if (productMetaTags.length > 0) {
    switch (type) {
      case "categoryType":
        metaTag = productMetaTags.find(
          (meta) => meta.categoryField.id === 2
        );
        if (metaTag) {
          metaData = PROPERTY_CATEGORY_TYPES.find(
            (property) => property.value == metaTag.value
          );
          metaData = metaData?.value === "sale" ? "Buy" : "Rent";
        } else {
          metaData = "Rent";
        }

        break;

      case "unit":
        metaTag = productMetaTags.find(
          (meta) => meta.categoryField.id === 3
        );
        if (metaTag) {
          metaData = UNITS.find(
            (property) => property.value == metaTag.value
          );
          metaData = metaData?.label ? metaData.label : "Square Ft";
        } else {
          metaData = "Square Ft";
        }
        break;

      case "area":
        metaTag = productMetaTags.find(
          (meta) => meta.categoryField.id === 4
        );
        metaData = metaTag ? metaTag.value : 0;
        break;

      case "bedroom":
        metaTag = productMetaTags.find(
          (meta) => meta.categoryField.id === 5
        );
        if (metaTag) {
          metaData = BEDROOMS.find(
            (property) => property.value == metaTag.value
          );
          metaData = metaData?.label ? metaData.label : "No";
        } else {
          metaData = "No";
        }
        break;
    }
  }

  return metaData;
}

export const setPropertyMetaData = (productMetaTags) => {
  let typeMetaTag;
  let categoryTypeMetaTag;
  let unitMetaTag;
  let areaMetaTag;
  let bedroomsMetaTag;
  let subTypeMetaTag;
  let priceTypeMetaTag;
  let deedTitleMetaTag;

  if (productMetaTags.length > 0) {
    productMetaTags.forEach((metaTag) => {
      switch (metaTag.categoryField.id) {
        case 1:
          typeMetaTag = PROPERTY_TYPES.find(
            (property) => property.value == metaTag.value
          );
          break;
        case 2:
          categoryTypeMetaTag = PROPERTY_CATEGORY_TYPES.find(
            (category) => category.value == metaTag.value
          );
          break;
        case 3:
          unitMetaTag = UNITS.find((unit) => unit.value == metaTag.value);
          break;
        case 4:
          areaMetaTag = metaTag.value;
          break;
        case 5:
          bedroomsMetaTag = BEDROOMS.find((bedroom) => bedroom.value == metaTag.value);
          break;
        case 6:
          if (typeMetaTag && typeMetaTag.value === 'residential') {
            subTypeMetaTag = RESIDENTIAL_PROPERTY.find(
              (subType) => subType.value == metaTag.value
            );
          }
          break;
        case 7:
          if (typeMetaTag && typeMetaTag.value === 'commercial') {
            subTypeMetaTag = COMMERCIAL_PROPERTY.find(
              (subType) => subType.value == metaTag.value
            );
          }
          break;
        case 8:
          if (categoryTypeMetaTag && categoryTypeMetaTag.value === 'rent') {
            priceTypeMetaTag = PRICE_TYPE.find((priceType) => priceType.value == metaTag.value);
          }

          break;
        case 9:
          deedTitleMetaTag = metaTag.value;
          break;
      }
    });
  }

  return {
    typeMetaTag,
    categoryTypeMetaTag,
    unitMetaTag,
    areaMetaTag,
    bedroomsMetaTag,
    subTypeMetaTag,
    priceTypeMetaTag,
    deedTitleMetaTag
  }
}