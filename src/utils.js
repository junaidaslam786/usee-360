import jwt from "jsonwebtoken";
import moment from "moment-timezone";
import AuthService from "./services/auth";
import {
  PROPERTY_TYPES,
  PROPERTY_CATEGORY_TYPES,
  BEDROOMS,
  UNITS,
  RESIDENTIAL_PROPERTY,
  COMMERCIAL_PROPERTY,
  PRICE_TYPE,
  DEFAULT_CURRENCY,
  LAYOUT_OPTIONS,
  YES_NO_OPTIONS,
  SECURITY_FEATURES_OPTIONS,
  ROOM_TYPE_OPTIONS,
  DISPLAY_WINDOW_OPTIONS,
  KITCHEN_OPTIONS,
  POOL_TYPE_OPTIONS,
  VIEW_OPTIONS,
  CONDITION_OPTIONS,
  FURNISHED_OPTIONS,
  OUTDOOR_SPACES_OPTIONS,
  PARKING_OPTION_TYPES,
  FIREPLACE_VALUE_OPTIONS,
  BUILDING_AMENITIES_OPTIONS,
} from "./constants";
import UserService from "./services/agent/user";

export const checkTimeOver = (date, time) => {
  const difdate = date;
  const parts = difdate.split("-");
  const fpdate = parts[0] + "-" + parts[1] + "-" + parts[2];

  const givenDate = moment
    .tz(`${fpdate}${time}`, "YYYY-MM-DD HH:mm:ss", getUserTimezone())
    .format("ddd MMM D YYYY HH:mm:00 [GMT]ZZ (zz)");
  const currentDate = moment(new Date())
    .tz(getUserTimezone())
    .format("ddd MMM D YYYY HH:mm:00 [GMT]ZZ (zz)");

  return givenDate < currentDate;
};

export const findCurrentTimeSlot = (timeslots) => {
  const currentTime = currentTimezoneBasedTime().split(":");
  const currentHours = parseInt(currentTime[0]);
  const currentMinutes = parseInt(currentTime[1]);
  const currentTimeInMinutes = currentHours * 60 + currentMinutes;

  for (let slot of timeslots) {
    const [fromHours, fromMinutes] = slot.fromTime.split(":");
    const [toHours, toMinutes] = slot.toTime.split(":");

    const fromTimeInMinutes = parseInt(fromHours) * 60 + parseInt(fromMinutes);
    const toTimeInMinutes = parseInt(toHours) * 60 + parseInt(toMinutes);

    if (
      currentTimeInMinutes >= fromTimeInMinutes &&
      currentTimeInMinutes < toTimeInMinutes
    ) {
      return slot;
    }
  }

  return null;
};

export const checkAgentDetails = async () => {
  try {
    const token = getLoginToken();
    if (!token) {
      throw new Error("No token found");
    }

    const userDetails = getUserDetailsFromJwt(token);
    if (!userDetails || !userDetails.id) {
      throw new Error("Failed to decode token or no user ID found");
    }

    // Use UserService.detail to fetch user details by ID
    const agentDetails = await UserService.detail(userDetails.id);
    if (agentDetails.error) {
      throw new Error(
        agentDetails.error.message || "Failed to fetch agent details"
      );
    }

    return agentDetails; // Successfully fetched agent details
  } catch (error) {
    console.error("Error fetching agent details:", error);
    return null; // Or handle the error as needed
  }
};

export const getUserDetailsFromJwt3 = (token) => {
  try {
    // Decode the token without verifying the signature
    const decoded = jwt.decode(token);
    return decoded;
  } catch (err) {
    console.error("Error decoding token:", err.message);
    return null;
  }
};

export const getUserDetailsFromJwt = (token) => {
  try {
    let tokenToDecode = token;
    if (!tokenToDecode) {
      tokenToDecode = getLoginToken();
    }

    const decoded = jwt.verify(
      tokenToDecode,
      process.env.REACT_APP_JWT_SECRET_KEY
    );
    return decoded;
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      console.log("Token has expired:", err.message);
    } else {
      console.log("Error decoding token:", err.message);
    }
    return "";
  }
};

export const getUserDetailsFromJwt2 = async (token) => {
  try {
    let tokenToDecode = token;
    
    if (!tokenToDecode) {
      // If there's no token, attempt to refresh it
      const refreshToken = localStorage.getItem("refreshToken"); // Get the stored refresh token
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      // Attempt to refresh the token
      const refreshResponse = await AuthService.refreshToken(refreshToken);
      if (refreshResponse.error) {
        throw new Error(refreshResponse.message);
      }

      // Store the new access token and use it to decode the user details
      localStorage.setItem("userToken", refreshResponse.accessToken);
      tokenToDecode = refreshResponse.accessToken;
    }

    // Decode the token to check if it's expired
    const decodedToken = jwt.decode(tokenToDecode);

    if (decodedToken && decodedToken.exp && Date.now() >= decodedToken.exp * 1000) {
      // If token is expired, try to refresh it
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("Token expired and no refresh token available");
      }

      const refreshResponse = await AuthService.refreshToken(refreshToken);
      if (refreshResponse.error) {
        throw new Error(refreshResponse.message);
      }

      // Store new access token and decode it
      localStorage.setItem("userToken", refreshResponse.accessToken);
      tokenToDecode = refreshResponse.accessToken;
    }

    // Now verify the valid token
    const decoded = jwt.verify(tokenToDecode, process.env.REACT_APP_JWT_SECRET_KEY);
    return decoded;

  } catch (err) {
    // Handle token expiration or other errors
    console.error("Error getting user details:", err.message);
    return null;
  }
};

export const convertTimestampToDateTime = (timestamp, format) => {
  return timestamp
    ? moment.unix(timestamp / 1000).format(format ? format : "HH:mm")
    : "-";
};

export const setMomentDefaultTimezone = () => {
  moment.tz.setDefault(getUserTimezone());
};

export const getMomentDefaultTimezone = () => {
  return moment().tz();
};

export const formatSlotFromTime = (fromTime, sourceFormat, targetFromat) => {
  return fromTime
    ? moment(fromTime, sourceFormat ? sourceFormat : "hh:mm:ss").format(
        targetFromat ? targetFromat : "HH:mm"
      )
    : "-";
};

export const formatCreatedAtTimestamp = (createdAt, format) => {
  return createdAt
    ? moment.utc(createdAt).format(format ? format : "D/MM/YYYY")
    : "-";
};

export const formatAppointmentDate = (appointmentDate, format) => {
  return appointmentDate
    ? moment(appointmentDate).format(format ? format : "D/MM/YYYY")
    : "-";
};

export const addTimeInTimestamp = (timestamp, time, type) => {
  return timestamp
    ? moment
        .unix(timestamp / 1000)
        .add(time ? time : 0, type ? type : "minutes")
        .unix() * 1000
    : "-";
};

export const convertTimeToTimezoneBasedTime = (time) => {
  return time
    ? moment.tz(time, "HH:mm", getUserTimezone()).format("HH:mm")
    : "-";
};

export const currentTimezoneBasedDate = () => {
  return moment(new Date()).format("YYYY-MM-DD");
};

export const currentTimezoneBasedTime = () => {
  return moment(new Date()).format("HH:mm");
};

export const convertGmtToTime = (time, format) => {
  return time
    ? moment
        .tz(time, "HH:mm:ss", "GMT")
        .tz(getUserTimezone())
        .format(format ? format : "HH:mm")
    : "-";
};
// export function convertGmtToTime(gmtTime) {
//   return moment.tz(gmtTime, "GMT").format("HH:mm:ss");
// }

export const getUserType = () => {
  return JSON.parse(localStorage.getItem("userType"));
};

export const setUserType = (type) => {
  localStorage.setItem("userType", JSON.stringify(type));
};

// export const getLoginToken = () => {
//   return JSON.parse(localStorage.getItem("userToken"));
// };
export const getLoginToken = () => {
  const token = localStorage.getItem("userToken");
  if (token) {
    try {
      return JSON.parse(token);
    } catch (error) {
      console.error("Failed to parse user token:", error);
      return null;
    }
  }
  return null;
};

export const removeLoginToken = () => {
  localStorage.removeItem("userToken");
  localStorage.removeItem("userTimezone");
  localStorage.removeItem("userType");
  localStorage.removeItem("searchFilters");
  return true;
};

export const setLoginToken = (token) => {
  localStorage.setItem("userToken", JSON.stringify(token));
};

export const getUserTimezone = () => {
  return JSON.parse(localStorage.getItem("userTimezone"));
};

export const setUserTimezone = (timezone) => {
  localStorage.setItem("userTimezone", JSON.stringify(timezone));
};

export const setResponseHandler = (responseMessage, isSuccess = false) => {
  let response = { errors: responseMessage, success: "" };

  if (isSuccess) {
    response.errors = [];
    response.success = responseMessage;
  }

  return response;
};

export const formatPrice = (price) => {
  const formatter = new Intl.NumberFormat("en-US");
  return `${DEFAULT_CURRENCY} ${formatter.format(price)}`;
};

// Utility function to convert "yes" or "no" strings to boolean values
export const stringToBoolean = (value) => value === "yes";

// Utility function to convert boolean values back to "yes" or "no" strings for consistency
export const booleanToString = (booleanValue) => {
  return booleanValue ? "yes" : "no";
};

export const iconsMap = {
  "Property Type": "fas fa-building", // FontAwesome equivalent
  "Property Category Type": "fas fa-tags", // General tag icon, as specific category icon might not be available
  Unit: "fas fa-th-large", // General representation of units
  Area: "fas fa-vector-square", // Represents area/space
  "No. of bedrooms": "fas fa-bed", // FontAwesome
  "Commercial Property Type": "fas fa-store",
  "Residential Property Type": "fas fa-store",
  "Price Type": "fas fa-tag", // FontAwesome
  Layout: "fas fa-object-group", // Represents layout/design
  "Conference Room": "fas fa-chalkboard-teacher", // Represents teaching/conference space
  "Conference Room Capacity": "fas fa-users", // Represents group/capacity
  Kitchen: "fas fa-utensils", // FontAwesome
  "Display Window Type Value(Other)": "fas fa-tv", // Represents display screens/windows
  "Display Window Type": "fas fa-window-maximize", // Represents windows
  "Number of Stores": "fas fa-shopping-cart", // General shopping/store icon
  "Food Court": "fas fa-pizza-slice", // Represents food options
  "Rest Rooms": "fas fa-restroom", // FontAwesome
  "Number Of Pools": "fas fa-swimming-pool", // FontAwesome
  "Pool Types": "fas fa-swimmer", // Represents swimming activity
  "Number of Rooms": "fas fa-door-closed", // General representation of rooms
  "Area of Bar(m²)": "fas fa-glass-martini-alt", // Represents bar area
  "Area of Lounge(m²)": "fas fa-couch", // Represents lounge area
  "Capacity of VIP Section": "fas fa-star", // VIP/star quality representation
  "Number of Dance Floors": "fas fa-music", // Represents music/dance
  "Number of Private Rooms": "fas fa-user-secret", // Represents privacy
  "Area of Kitchen": "fas fa-utensils", // Duplicate of Kitchen, as specific area icon might not be available
  "Outdoor Seating": "fas fa-tree", // Represents outdoor/nature
  "Area of Outdoor Seating(m²)": "fas fa-chair", // Represents seating
  "Room Size(m²)": "fas fa-expand-arrows-alt", // Represents size/expansion
  "Number of Beds": "fas fa-bed", // Duplicate of No. of bedrooms
  "Room Type": "fas fa-info", // General info icon, as specific room type might not be available
  "Floor Level": "fas fa-building", // Use building icon with levels indicated
  View: "fas fa-eye", // Represents view/visibility
  "Balcony/Terrace": "fas fa-tree", // Use nature-related icon for outdoor space
  "Security Features": "fas fa-lock", // Represents security
  "Security Features Value": "fas fa-shield-alt", // Represents protection/value
  "Disability Access": "fas fa-wheelchair", // FontAwesome
  "Parking Facility": "fas fa-parking", // FontAwesome
  "Parking Facility(Number of Spaces)": "fas fa-car", // Represents vehicles/parking
  "Public Transport Access": "fas fa-bus", // Represents public transport
  "Year Built": "fas fa-calendar-alt", // Represents date/calendar
  Condition: "fas fa-thermometer-half", // General condition/temperature icon
  "Availability Date": "fas fa-calendar-check", // Represents availability/scheduling
  "Pet Friendliness": "fas fa-paw", // Represents pets
  "Additional Features": "fas fa-plus-square", // Represents additional options/features
  "Building Amenities": "fas fa-building", // Duplicate of Property Type, as amenities icon might not be specific
  Fireplace: "fas fa-fire", // Represents fireplace
  "Fireplace Value": "fas fa-fire-alt", // Alternative fire icon for value
  "Number of Floors": "fas fa-layer-group", // Represents layers/floors
  Basement: "fas fa-warehouse", // Represents storage/lower levels
  Parking: "fas fa-parking", // Duplicate of Parking Facility
  "Parking Option": "fas fa-cogs", // Represents options/settings
  "Garage/Carport(No. of Spaces)": "fas fa-car", // Use car icon, as specific garage icon might not be available
  "Outdoor Spaces": "fas fa-tree", // Represents outdoor spaces/nature
  "Number of Bathrooms": "fas fa-bath", // Represents bathroom facilities
  Furnished: "fas fa-couch", // Represents furniture/living space
};

export const transformMetaTagsToFrontend = (productMetaTags) => {
  const initialState = {
    propertyType: "",
    propertyCategoryType: "",
    unit: "",
    area: "",
    bedrooms: "",
    propertySubType: "",
    priceType: "",
    layout: "",
    conferenceRoom: false,
    kitchen: "",
    displayWindowArea: "",
    displayWindow: "",
    numberOfStores: "",
    foodCourt: false,
    restRoom: false,
    pools: "",
    poolType: "",
    hotelRoom: "",
    areaBar: "",
    loungeArea: "",
    capacityOfVip: "",
    noOfDanceFloor: "",
    noOfPrivateRooms: "",
    kitchenArea: "",
    outdoorSeating: false,
    outdoorSeatingArea: "",
    roomSize: "",
    noOfBeds: "",
    roomType: "",
    floorLevel: "",
    view: "",
    balcony: false,
    securityFeatures: false,
    alaramCameraB: "",
    disabilityAccess: false,
    parkingFacility: false,
    noOfParkings: "",
    publicTransport: false,
    yearBuilt: "",
    condition: "",
    availabilityDate: "",
    petFreindliness: false,
    additionalFeatures: "",
    buildingAmenities: [],
    fireplace: false,
    woodBurning: "",
    noOfFloors: "",
    basement: false,
    parkingType: "",
    garageSpaces: "",
    outdoorSpaces: [],
    noOfBathrooms: "",
    furnished: "",
  };

  productMetaTags.forEach((tag) => {
    switch (tag.label) {
      case "Property Type":
        initialState.propertyType = tag.value;
        break;
      case "Property Category Type":
        initialState.propertyCategoryType = tag.value;
        break;
      case "Unit":
        initialState.unit = tag.value;
        break;
      case "Area":
        initialState.area = tag.value;
        break;
      case "No. of bedrooms":
        initialState.bedrooms = tag.value;
        break;
      case "Residential Property Type":
      case "Commercial Property Type":
        initialState.propertySubType = tag.value;
        break;
      case "Price Type":
        initialState.priceType = tag.value;
        break;
      case "Layout":
        initialState.layout = tag.value;
        break;
      case "Conference Room":
        initialState.conferenceRoom = tag.value === "yes";
        break;
      case "Kitchen":
        initialState.kitchen = tag.value;
        break;
      case "Area of Display Window":
        initialState.displayWindowArea = tag.value;
        break;
      case "Display Window Type":
        initialState.displayWindow = tag.value;
        break;
      case "Number of Stores":
        initialState.numberOfStores = tag.value;
        break;
      case "Food Court":
        initialState.foodCourt = tag.value === "yes";
        break;
      case "Rest Rooms":
        initialState.restRoom = tag.value === "yes";
        break;
      case "Number Of Pools":
        initialState.pools = tag.value;
        break;
      case "Pool Types":
        initialState.poolType = tag.value;
        break;
      case "Number of Rooms":
        initialState.hotelRoom = tag.value;
        break;
      case "Area of Bar(m²)":
        initialState.areaBar = tag.value;
        break;
      case "Area of Lounge(m²)":
        initialState.loungeArea = tag.value;
        break;
      case "Capacity of VIP Section":
        initialState.capacityOfVip = tag.value;
        break;
      case "Number of Dance Floors":
        initialState.noOfDanceFloor = tag.value;
        break;
      case "Number of Private Rooms":
        initialState.noOfPrivateRooms = tag.value;
        break;
      case "Area of Kitchen":
        initialState.kitchenArea = tag.value;
        break;
      case "Outdoor Seating":
        initialState.outdoorSeating = tag.value === "yes";
        break;
      case "Area of Outdoor Seating(m²)":
        initialState.outdoorSeatingArea = tag.value;
        break;
      case "Room Size(m²)":
        initialState.roomSize = tag.value;
        break;
      case "Number of Beds":
        initialState.noOfBeds = tag.value;
        break;
      case "Room Type":
        initialState.roomType = tag.value;
        break;
      case "Floor Level":
        initialState.floorLevel = tag.value;
        break;
      case "View":
        initialState.view = tag.value;
        break;
      case "Balcony/Terrace":
        initialState.balcony = tag.value === "yes";
        break;
      case "Security Features":
        initialState.securityFeatures = tag.value === "yes";
        break;
      case "Security Features Value":
        initialState.alaramCameraB = tag.value;
        break;
      case "Disability Access":
        initialState.disabilityAccess = tag.value === "yes";
        break;
      case "Parking Facility":
        initialState.parkingFacility = tag.value === "yes";
        break;
      case "Parking Facility (Number of Spaces)":
        initialState.noOfParkings = tag.value;
        break;
      case "Public Transport Access":
        initialState.publicTransport = tag.value === "yes";
        break;
      case "Year Built":
        initialState.yearBuilt = tag.value;
        break;
      case "Condition":
        initialState.condition = tag.value;
        break;
      case "Availability Date":
        initialState.availabilityDate = tag.value;
        break;
      case "Pet Friendliness":
        initialState.petFreindliness = tag.value === "yes";
        break;
      case "Additional Features":
        initialState.additionalFeatures = tag.value;
        break;
      case "Building Amenities":
        initialState.buildingAmenities = tag.value.split(",");
        break;
      case "Fireplace":
        initialState.fireplace = tag.value === "yes";
        break;
      case "Fireplace Value":
        initialState.woodBurning = tag.value;
        break;
      case "Number of Floors":
        initialState.noOfFloors = tag.value;
        break;
      case "Basement":
        initialState.basement = tag.value === "yes";
        break;
      case "Parking Option":
        initialState.parkingType = tag.value;
        break;
      case "Garage/Carport(No. of Spaces)":
        initialState.garageSpaces = tag.value;
        break;
      case "Outdoor Spaces":
        initialState.outdoorSpaces = tag.value.split(",");
        break;
      case "Number of Bathrooms":
        initialState.noOfBathrooms = tag.value;
        break;
      case "Furnished":
        initialState.furnished = tag.value;
        break;
      default:
        console.warn(`Unhandled tag label: ${tag.label}`);
        break;
    }
  });

  return initialState;
};

export const prepareFormDataForBackend = (formData) => {
  const backendData = [];

  // Property Type and other straightforward mappings
  backendData.push({ label: "Property Type", value: formData.propertyType });
  backendData.push({
    label: "Property Category Type",
    value: formData.propertyCategoryType,
  });
  backendData.push({ label: "Unit", value: formData.unit });
  backendData.push({ label: "Area", value: formData.area });
  backendData.push({ label: "No. of bedrooms", value: formData.bedrooms });
  backendData.push({
    label: "Residential Property Type",
    value: formData.propertySubType,
  });
  backendData.push({
    label: "Commercial Property Type",
    value: formData.propertySubType,
  });
  backendData.push({ label: "Price Type", value: formData.priceType });
  backendData.push({ label: "Layout", value: formData.layout });
  backendData.push({
    label: "Conference Room",
    value: formData.conferenceRoom ? "yes" : "no",
  });
  backendData.push({ label: "Kitchen", value: formData.kitchen });
  backendData.push({
    label: "Area of Display Window",
    value: formData.displayWindowArea,
  });
  backendData.push({
    label: "Display Window Type",
    value: formData.displayWindow,
  });
  backendData.push({
    label: "Number of Stores",
    value: formData.numberOfStores,
  });
  backendData.push({
    label: "Food Court",
    value: formData.foodCourt ? "yes" : "no",
  });
  backendData.push({
    label: "Rest Rooms",
    value: formData.restRoom ? "yes" : "no",
  });
  backendData.push({ label: "Number Of Pools", value: formData.pools });
  backendData.push({ label: "Pool Types", value: formData.poolType });
  backendData.push({ label: "Number of Rooms", value: formData.hotelRoom });
  backendData.push({ label: "Area of Bar(m²)", value: formData.areaBar });
  backendData.push({ label: "Area of Lounge(m²)", value: formData.loungeArea });
  backendData.push({
    label: "Capacity of VIP Section",
    value: formData.capacityOfVip,
  });
  backendData.push({
    label: "Number of Dance Floors",
    value: formData.noOfDanceFloor,
  });
  backendData.push({
    label: "Number of Private Rooms",
    value: formData.noOfPrivateRooms,
  });
  backendData.push({ label: "Area of Kitchen", value: formData.kitchenArea });
  backendData.push({
    label: "Outdoor Seating",
    value: formData.outdoorSeating ? "yes" : "no",
  });
  backendData.push({
    label: "Area of Outdoor Seating(m²)",
    value: formData.outdoorSeatingArea,
  });
  backendData.push({ label: "Room Size(m²)", value: formData.roomSize });
  backendData.push({ label: "Number of Beds", value: formData.noOfBeds });
  backendData.push({ label: "Room Type", value: formData.roomType });
  backendData.push({ label: "Floor Level", value: formData.floorLevel });
  backendData.push({ label: "View", value: formData.view });
  backendData.push({
    label: "Balcony/Terrace",
    value: formData.balcony ? "yes" : "no",
  });
  backendData.push({
    label: "Security Features",
    value: formData.securityFeatures ? "yes" : "no",
  });
  backendData.push({
    label: "Security Features Value",
    value: formData.alaramCameraB,
  });
  backendData.push({
    label: "Disability Access",
    value: formData.disabilityAccess ? "yes" : "no",
  });
  backendData.push({
    label: "Parking Facility",
    value: formData.parkingFacility ? "yes" : "no",
  });
  backendData.push({
    label: "Parking Facility (Number of Spaces)",
    value: formData.noOfParkings,
  });
  backendData.push({
    label: "Public Transport Access",
    value: formData.publicTransport ? "yes" : "no",
  });
  backendData.push({ label: "Year Built", value: formData.yearBuilt });
  backendData.push({ label: "Condition", value: formData.condition });
  backendData.push({
    label: "Availability Date",
    value: formData.availabilityDate,
  });
  backendData.push({
    label: "Pet Friendliness",
    value: formData.petFreindliness ? "yes" : "no",
  });
  backendData.push({
    label: "Additional Features",
    value: formData.additionalFeatures,
  });
  backendData.push({
    label: "Building Amenities",
    value: formData.buildingAmenities.join(","),
  });
  backendData.push({
    label: "Fireplace",
    value: formData.fireplace ? "yes" : "no",
  });
  backendData.push({ label: "Fireplace Value", value: formData.woodBurning });
  backendData.push({ label: "Number of Floors", value: formData.noOfFloors });
  backendData.push({
    label: "Basement",
    value: formData.basement ? "yes" : "no",
  });
  backendData.push({ label: "Parking Option", value: formData.parkingType });
  backendData.push({
    label: "Garage/Carport(No. of Spaces)",
    value: formData.garageSpaces,
  });
  backendData.push({
    label: "Outdoor Spaces",
    value: formData.outdoorSpaces.join(","),
  });
  backendData.push({
    label: "Number of Bathrooms",
    value: formData.noOfBathrooms,
  });
  backendData.push({ label: "Furnished", value: formData.furnished });

  // Transform to the required backend format, e.g., FormData or JSON
  const formdata = new FormData();
  backendData.forEach((data) => {
    formdata.append(data.label, data.value);
  });

  return formdata;
};

export const loadPropertyMetaData = (property, type) => {
  let metaData = "";
  let metaTag;
  const productMetaTags = property?.productMetaTags
    ? property.productMetaTags
    : [];

  if (productMetaTags.length > 0) {
    switch (type) {
      case "categoryType":
        metaTag = productMetaTags.find((meta) => meta.categoryField.id === 2);
        if (metaTag) {
          metaData = PROPERTY_CATEGORY_TYPES.find(
            (property) => property.value === metaTag.value
          );
          metaData = metaData?.value === "sale" ? "Buy" : "Rent";
        } else {
          metaData = "Rent";
        }

        break;

      case "unit":
        metaTag = productMetaTags.find((meta) => meta.categoryField.id === 3);
        if (metaTag) {
          metaData = UNITS.find((property) => property.value === metaTag.value);
          metaData = metaData?.label ? metaData.label : "Square Ft";
        } else {
          metaData = "Square Ft";
        }
        break;

      case "area":
        metaTag = productMetaTags.find((meta) => meta.categoryField.id === 4);
        metaData = metaTag ? metaTag.value : 0;
        break;

      case "bedroom":
        metaTag = productMetaTags.find((meta) => meta.categoryField.id === 5);
        if (metaTag) {
          metaData = BEDROOMS.find(
            (property) => property.value === metaTag.value
          );
          metaData = metaData?.label ? metaData.label : "No";
        } else {
          metaData = "No";
        }
        break;

      case "layout":
        metaTag = productMetaTags.find((meta) => meta.categoryField.id === 10);
        metaData = metaTag
          ? LAYOUT_OPTIONS.find((layout) => layout.value === metaTag.value)
              ?.label
          : "Not Specified";
        break;

      case "kitchen":
        metaTag = productMetaTags.find((meta) => meta.categoryField.id === 13);
        metaData = metaTag
          ? KITCHEN_OPTIONS.find((kitchen) => kitchen.value === metaTag.value)
              ?.label
          : "Not Specified";
        break;

      // Continuing with additional cases based on new fields
      case "conferenceRoom":
        metaTag = productMetaTags.find((meta) => meta.categoryField.id === 11);
        metaData = metaTag
          ? YES_NO_OPTIONS.find((option) => option.value === metaTag.value)
              ?.label
          : "No";
        break;

      case "displayWindowArea":
        metaTag = productMetaTags.find((meta) => meta.categoryField.id === 14);
        metaData = metaTag ? metaTag.value : "Not Specified";
        break;

      case "displayWindowType":
        metaTag = productMetaTags.find((meta) => meta.categoryField.id === 15);
        metaData = metaTag
          ? DISPLAY_WINDOW_OPTIONS.find(
              (option) => option.value === metaTag.value
            )?.label
          : "Not Specified";
        break;

      case "numberOfStores":
        metaTag = productMetaTags.find((meta) => meta.categoryField.id === 17);
        metaData = metaTag ? metaTag.value : "Not Specified";
        break;

      case "foodCourt":
        metaTag = productMetaTags.find((meta) => meta.categoryField.id === 18);
        metaData = metaTag
          ? YES_NO_OPTIONS.find((option) => option.value === metaTag.value)
              ?.label
          : "No";
        break;

      case "numberOfPools":
        metaTag = productMetaTags.find((meta) => meta.categoryField.id === 20);
        metaData = metaTag ? metaTag.value : "Not Specified";
        break;

      case "poolTypes":
        metaTag = productMetaTags.find((meta) => meta.categoryField.id === 21);
        metaData = metaTag
          ? metaTag.value
              .split(",")
              .map(
                (val) =>
                  POOL_TYPE_OPTIONS.find((option) => option.value === val)
                    ?.label
              )
              .join(", ")
          : "Not Specified";
        break;

      case "roomType":
        metaTag = productMetaTags.find((meta) => meta.categoryField.id === 33);
        metaData = metaTag
          ? ROOM_TYPE_OPTIONS.find((option) => option.value === metaTag.value)
              ?.label
          : "Not Specified";
        break;

      case "view":
        metaTag = productMetaTags.find((meta) => meta.categoryField.id === 35);
        metaData = metaTag
          ? VIEW_OPTIONS.find((option) => option.value === metaTag.value)?.label
          : "Not Specified";
        break;

      case "securityFeatures":
        metaTag = productMetaTags.find((meta) => meta.categoryField.id === 37);
        metaData = metaTag
          ? YES_NO_OPTIONS.find((option) => option.value === metaTag.value)
              ?.label
          : "No";
        break;

      case "condition":
        metaTag = productMetaTags.find((meta) => meta.categoryField.id === 44);
        metaData = metaTag
          ? CONDITION_OPTIONS.find((option) => option.value === metaTag.value)
              ?.label
          : "Not Specified";
        break;

      case "availabilityDate":
        metaTag = productMetaTags.find((meta) => meta.categoryField.id === 45);
        metaData = metaTag ? metaTag.value : "Not Specified";
        break;

      case "outdoorSeating":
        metaTag = productMetaTags.find((meta) => meta.categoryField.id === 29);
        metaData = metaTag
          ? YES_NO_OPTIONS.find((option) => option.value === metaTag.value)
              ?.label
          : "No";
        break;

      case "outdoorSeatingArea":
        metaTag = productMetaTags.find((meta) => meta.categoryField.id === 30);
        metaData = metaTag ? metaTag.value : "Not Specified";
        break;

      case "roomSize":
        metaTag = productMetaTags.find((meta) => meta.categoryField.id === 31);
        metaData = metaTag ? metaTag.value : "Not Specified";
        break;

      case "numberOfBeds":
        metaTag = productMetaTags.find((meta) => meta.categoryField.id === 32);
        metaData = metaTag ? metaTag.value : "Not Specified";
        break;

      case "floorLevel":
        metaTag = productMetaTags.find((meta) => meta.categoryField.id === 34);
        metaData = metaTag ? metaTag.value : "Not Specified";
        break;

      case "balconyTerrace":
        metaTag = productMetaTags.find((meta) => meta.categoryField.id === 36);
        metaData = metaTag
          ? YES_NO_OPTIONS.find((option) => option.value === metaTag.value)
              ?.label
          : "No";
        break;

      case "securityFeaturesValue":
        metaTag = productMetaTags.find((meta) => meta.categoryField.id === 38);
        if (metaTag) {
          const features = metaTag.value.split(",");
          metaData =
            features
              .map(
                (feature) =>
                  SECURITY_FEATURES_OPTIONS.find(
                    (option) => option.value === feature
                  )?.label
              )
              .join(", ") || "Not Specified";
        }
        break;

      case "disabilityAccess":
        metaTag = productMetaTags.find((meta) => meta.categoryField.id === 39);
        metaData = metaTag
          ? YES_NO_OPTIONS.find((option) => option.value === metaTag.value)
              ?.label
          : "No";
        break;

      case "parkingFacility":
        metaTag = productMetaTags.find((meta) => meta.categoryField.id === 40);
        metaData = metaTag
          ? YES_NO_OPTIONS.find((option) => option.value === metaTag.value)
              ?.label
          : "No";
        break;

      case "parkingSpaces":
        metaTag = productMetaTags.find((meta) => meta.categoryField.id === 41);
        metaData = metaTag ? metaTag.value : "Not Specified";
        break;

      case "publicTransportAccess":
        metaTag = productMetaTags.find((meta) => meta.categoryField.id === 42);
        metaData = metaTag
          ? YES_NO_OPTIONS.find((option) => option.value === metaTag.value)
              ?.label
          : "No";
        break;

      case "yearBuilt":
        metaTag = productMetaTags.find((meta) => meta.categoryField.id === 43);
        metaData = metaTag ? metaTag.value : "Not Specified";
        break;

      // case "availabilityDate":
      //   metaTag = productMetaTags.find((meta) => meta.categoryField.id === 45);
      //   metaData = metaTag ? metaTag.value : "Not Specified";
      //   break;

      case "petFriendliness":
        metaTag = productMetaTags.find((meta) => meta.categoryField.id === 46);
        metaData = metaTag
          ? YES_NO_OPTIONS.find((option) => option.value === metaTag.value)
              ?.label
          : "No";
        break;

      case "additionalFeatures":
        metaTag = productMetaTags.find((meta) => meta.categoryField.id === 47);
        metaData = metaTag ? metaTag.value : "Not Specified";
        break;

      // Assuming continuation from the previous "default" case
      case "buildingAmenities":
        metaTag = productMetaTags.find((meta) => meta.categoryField.id === 48);
        metaData = metaTag
          ? metaTag.value
              .split(",")
              .map(
                (value) =>
                  BUILDING_AMENITIES_OPTIONS.find(
                    (option) => option.value === value
                  )?.label || value
              )
              .join(", ")
          : "Not Specified";
        break;

      case "fireplace":
        metaTag = productMetaTags.find((meta) => meta.categoryField.id === 49);
        metaData = metaTag
          ? YES_NO_OPTIONS.find((option) => option.value === metaTag.value)
              ?.label
          : "No";
        break;

      case "fireplaceValue":
        metaTag = productMetaTags.find((meta) => meta.categoryField.id === 50);
        metaData = metaTag
          ? FIREPLACE_VALUE_OPTIONS.filter((option) =>
              metaTag.value.includes(option.value)
            )
              .map((option) => option.label)
              .join(", ")
          : "Not Specified";
        break;

      case "numberOfFloors":
        metaTag = productMetaTags.find((meta) => meta.categoryField.id === 51);
        metaData = metaTag ? metaTag.value : "Not Specified";
        break;

      case "basement":
        metaTag = productMetaTags.find((meta) => meta.categoryField.id === 52);
        metaData = metaTag
          ? YES_NO_OPTIONS.find((option) => option.value === metaTag.value)
              ?.label
          : "No";
        break;

      case "parking":
        metaTag = productMetaTags.find((meta) => meta.categoryField.id === 53);
        metaData = metaTag
          ? YES_NO_OPTIONS.find((option) => option.value === metaTag.value)
              ?.label
          : "No";
        break;

      case "parkingOption":
        metaTag = productMetaTags.find((meta) => meta.categoryField.id === 54);
        metaData = metaTag
          ? PARKING_OPTION_TYPES.find(
              (option) => option.value === metaTag.value
            )?.label
          : "Not Specified";
        break;

      case "garageCarportSpaces":
        metaTag = productMetaTags.find((meta) => meta.categoryField.id === 55);
        metaData = metaTag ? metaTag.value : "Not Specified";
        break;

      case "outdoorSpaces":
        metaTag = productMetaTags.find((meta) => meta.categoryField.id === 56);
        metaData = metaTag
          ? metaTag.value
              .split(",")
              .map(
                (value) =>
                  OUTDOOR_SPACES_OPTIONS.find(
                    (option) => option.value === value
                  )?.label || value
              )
              .join(", ")
          : "Not Specified";
        break;

      case "numberOfBathrooms":
        metaTag = productMetaTags.find((meta) => meta.categoryField.id === 57);
        metaData = metaTag ? metaTag.value : "Not Specified";
        break;

      case "furnished":
        metaTag = productMetaTags.find((meta) => meta.categoryField.id === 58);
        metaData = metaTag
          ? FURNISHED_OPTIONS.find((option) => option.value === metaTag.value)
              ?.label
          : "Not Specified";
        break;

      // Ensure to close the switch statement properly

      // Default case if no match found
      default:
        metaData = "Not Specified";
    }
  }

  return metaData;
};

export const setPropertyMetaData = (productMetaTags) => {
  let metaData = {
    typeMetaTag: null,
    categoryTypeMetaTag: null,
    unitMetaTag: null,
    areaMetaTag: null,
    bedroomsMetaTag: null,
    subTypeMetaTag: null,
    priceTypeMetaTag: null,
    deedTitleMetaTag: null,
    // Adding new fields
    layout: null,
    conferenceRoom: null,
    conferenceRoomCapacity: null,
    kitchen: null,
    displayWindowArea: null,
    displayWindowType: null,
    numberOfStores: null,
    foodCourt: null,
    restRooms: null,
    numberOfPools: null,
    poolTypes: null,
    numberOfRooms: null,
    barArea: null,
    loungeArea: null,
    vipSectionCapacity: null,
    numberOfDanceFloors: null,
    numberOfPrivateRooms: null,
    kitchenArea: null,
    outdoorSeating: null,
    outdoorSeatingArea: null,
    roomSize: null,
    numberOfBeds: null,
    roomType: null,
    floorLevel: null,
    view: null,
    balconyTerrace: null,
    securityFeatures: null,
    securityFeaturesValue: null,
    disabilityAccess: null,
    parkingFacility: null,
    parkingSpaces: null,
    publicTransportAccess: null,
    yearBuilt: null,
    condition: null,
    availabilityDate: null,
    petFriendliness: null,
    additionalFeatures: null,
    buildingAmenities: [],
    fireplace: null,
    fireplaceValue: [],
    numberOfFloors: null,
    basement: null,
    parking: null,
    parkingOption: null,
    garageCarportSpaces: null,
    outdoorSpaces: [],
    numberOfBathrooms: null,
    furnished: null,
  };

  if (productMetaTags.length > 0) {
    productMetaTags.forEach((metaTag) => {
      switch (metaTag.categoryField.id) {
        case 1:
          metaData.typeMetaTag =
            PROPERTY_TYPES.find((option) => option.value === metaTag.value)
              ?.label || "Not Specified";
          break;
        case 2:
          metaData.categoryTypeMetaTag =
            PROPERTY_CATEGORY_TYPES.find(
              (option) => option.value === metaTag.value
            )?.label || "Not Specified";
          break;
        case 3:
          metaData.unitMetaTag =
            UNITS.find((unit) => unit.value === metaTag.value)?.label ||
            "Not Specified";
          break;
        case 4:
          metaData.areaMetaTag = metaTag.value; // Assuming it's a direct assignment
          break;
        case 5:
          metaData.bedroomsMetaTag =
            BEDROOMS.find((bedroom) => bedroom.value === metaTag.value)
              ?.label || "Not Specified";
          break;
        case 6:
          if (metaData.typeMetaTag === "residential") {
            // Ensure this comparison is correct based on your actual data
            metaData.subTypeMetaTag =
              RESIDENTIAL_PROPERTY.find(
                (subType) => subType.value === metaTag.value
              )?.label || "Not Specified";
          }
          break;
        case 7:
          if (metaData.typeMetaTag === "commercial") {
            // Ensure this comparison is correct based on your actual data
            metaData.subTypeMetaTag =
              COMMERCIAL_PROPERTY.find(
                (subType) => subType.value === metaTag.value
              )?.label || "Not Specified";
          }
          break;
        case 8:
          if (metaData.categoryTypeMetaTag === "rent") {
            // Ensure this comparison is correct based on your actual data
            metaData.priceTypeMetaTag =
              PRICE_TYPE.find((priceType) => priceType.value === metaTag.value)
                ?.label || "Not Specified";
          }
          break;
        case 9:
          metaData.deedTitleMetaTag = metaTag.value; // Assuming it's a direct assignment
          break;

        case 10:
          metaData.layout =
            LAYOUT_OPTIONS.find((option) => option.value === metaTag.value)
              ?.label || "Not Specified";
          break;
        case 11:
          metaData.conferenceRoom =
            YES_NO_OPTIONS.find((option) => option.value === metaTag.value)
              ?.label || "Not Specified";
          break;
        case 12:
          metaData.conferenceRoomCapacity = metaTag.value; // Assuming it's a text field, direct assignment
          break;
        case 13:
          metaData.kitchen =
            KITCHEN_OPTIONS.find((option) => option.value === metaTag.value)
              ?.label || "Not Specified";
          break;
        case 14:
          metaData.displayWindowArea = metaTag.value;
          break;
        case 15:
          metaData.displayWindowType =
            DISPLAY_WINDOW_OPTIONS.find(
              (option) => option.value === metaTag.value
            )?.label || "Not Specified";
          break;
        case 16:
          metaData.displayWindowTypeOther = metaTag.value; // For 'Other' text input
          break;
        case 17:
          metaData.numberOfStores = metaTag.value;
          break;
        case 18:
          metaData.foodCourt =
            YES_NO_OPTIONS.find((option) => option.value === metaTag.value)
              ?.label || "Not Specified";
          break;
        case 19:
          metaData.restRooms =
            YES_NO_OPTIONS.find((option) => option.value === metaTag.value)
              ?.label || "Not Specified";
          break;
        case 20:
          metaData.numberOfPools = metaTag.value;
          break;
        case 21:
          metaData.poolTypes = metaTag.value
            .split(",")
            .map(
              (value) =>
                POOL_TYPE_OPTIONS.find((option) => option.value === value)
                  ?.label || "Not Specified"
            );
          break;
        case 22:
          metaData.numberOfRooms = metaTag.value;
          break;
        case 23:
          metaData.barArea = metaTag.value;
          break;
        case 24:
          metaData.loungeArea = metaTag.value;
          break;
        case 25:
          metaData.vipSectionCapacity = metaTag.value;
          break;
        case 26:
          metaData.numberOfDanceFloors = metaTag.value;
          break;
        case 27:
          metaData.numberOfPrivateRooms = metaTag.value;
          break;
        case 28:
          metaData.kitchenArea = metaTag.value;
          break;
        case 29:
          metaData.outdoorSeating =
            YES_NO_OPTIONS.find((option) => option.value === metaTag.value)
              ?.label || "Not Specified";
          break;
        case 30:
          metaData.outdoorSeatingArea = metaTag.value;
          break;
        case 31:
          metaData.roomSize = metaTag.value;
          break;
        case 32:
          metaData.numberOfBeds = metaTag.value;
          break;
        case 33:
          metaData.roomType =
            ROOM_TYPE_OPTIONS.find((option) => option.value === metaTag.value)
              ?.label || "Not Specified";
          break;
        case 34:
          metaData.floorLevel = metaTag.value;
          break;
        case 35:
          metaData.view =
            VIEW_OPTIONS.find((option) => option.value === metaTag.value)
              ?.label || "Not Specified";
          break;
        case 36:
          metaData.balconyTerrace =
            YES_NO_OPTIONS.find((option) => option.value === metaTag.value)
              ?.label || "Not Specified";
          break;
        case 37:
          metaData.securityFeatures =
            YES_NO_OPTIONS.find((option) => option.value === metaTag.value)
              ?.label || "Not Specified";
          break;
        case 38:
          metaData.securityFeaturesValue = metaTag.value
            .split(",")
            .map(
              (value) =>
                SECURITY_FEATURES_OPTIONS.find(
                  (option) => option.value === value
                )?.label || "Not Specified"
            );
          break;
        case 39:
          metaData.disabilityAccess =
            YES_NO_OPTIONS.find((option) => option.value === metaTag.value)
              ?.label || "Not Specified";
          break;
        case 40:
          metaData.parkingFacility =
            YES_NO_OPTIONS.find((option) => option.value === metaTag.value)
              ?.label || "Not Specified";
          break;
        case 41:
          metaData.parkingSpaces = metaTag.value;
          break;
        case 42:
          metaData.publicTransportAccess =
            YES_NO_OPTIONS.find((option) => option.value === metaTag.value)
              ?.label || "Not Specified";
          break;
        case 43:
          metaData.yearBuilt = metaTag.value;
          break;
        case 44:
          metaData.condition =
            CONDITION_OPTIONS.find((option) => option.value === metaTag.value)
              ?.label || "Not Specified";
          break;
        case 45:
          metaData.availabilityDate = metaTag.value; // Assuming direct assignment if it's a date or text
          break;
        case 46:
          metaData.petFriendliness =
            YES_NO_OPTIONS.find((option) => option.value === metaTag.value)
              ?.label || "Not Specified";
          break;
        case 47:
          metaData.additionalFeatures = metaTag.value; // Assuming this is a text/textarea field
          break;
        case 48: // Building Amenities
          metaData.buildingAmenities = metaTag.value
            .split(",")
            .map(
              (value) =>
                BUILDING_AMENITIES_OPTIONS.find(
                  (option) => option.value === value
                )?.label || value
            );
          break;

        case 49: // Fireplace presence
          metaData.fireplace =
            YES_NO_OPTIONS.find((option) => option.value === metaTag.value)
              ?.label || "No";
          break;

        case 50: // Fireplace Value
          // Assuming this is handled separately and only if fireplace is "yes"
          metaData.fireplaceValue = FIREPLACE_VALUE_OPTIONS.filter((option) =>
            metaTag.value.includes(option.value)
          ).map((option) => option.label);
          break;

        case 51: // Number of Floors
          metaData.numberOfFloors = metaTag.value;
          break;

        case 52: // Basement
          metaData.basement =
            YES_NO_OPTIONS.find((option) => option.value === metaTag.value)
              ?.label || "No";
          break;

        case 53: // Parking
          metaData.parking =
            YES_NO_OPTIONS.find((option) => option.value === metaTag.value)
              ?.label || "No";
          break;

        case 54: // Parking Option
          metaData.parkingOption =
            PARKING_OPTION_TYPES.find(
              (option) => option.value === metaTag.value
            )?.label || "Not Specified";
          break;

        case 55: // Garage/Carport Spaces
          metaData.garageCarportSpaces = metaTag.value;
          break;

        case 56: // Outdoor Spaces
          metaData.outdoorSpaces = metaTag.value
            .split(",")
            .map(
              (value) =>
                OUTDOOR_SPACES_OPTIONS.find((option) => option.value === value)
                  ?.label || value
            );
          break;

        case 57: // Number of Bathrooms
          metaData.numberOfBathrooms = metaTag.value;
          break;

        case 58: // Furnished
          metaData.furnished =
            FURNISHED_OPTIONS.find((option) => option.value === metaTag.value)
              ?.label || "Not Specified";
          break;

        default:
          console.warn(
            `Unhandled categoryField ID: ${metaTag.categoryField.id}`
          );
          break;
      }
    });
  }

  return metaData;
};
