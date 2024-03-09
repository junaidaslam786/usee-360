import jwt from "jsonwebtoken";
import moment from "moment";
import "moment-timezone";
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
      const refreshResponse = await AuthService.refreshToken(refreshToken);
      if (refreshResponse.error) {
        throw new Error(refreshResponse.message);
      }
      // Store the new access token and use it to decode the user details
      localStorage.setItem("userToken", refreshResponse.accessToken);
      tokenToDecode = refreshResponse.accessToken;
    }

    const decoded = jwt.verify(
      tokenToDecode,
      process.env.REACT_APP_JWT_SECRET_KEY
    );
    return decoded;
  } catch (err) {
    // Handle errors, including token expiration
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

export const getUserType = () => {
  return JSON.parse(localStorage.getItem("userType"));
};

export const setUserType = (type) => {
  localStorage.setItem("userType", JSON.stringify(type));
};

export const getLoginToken = () => {
  return JSON.parse(localStorage.getItem("userToken"));
};
// export const getLoginToken = () => {
//   // Directly return the token string from localStorage without JSON parsing
//   return localStorage.getItem("userToken");
// };

export const removeLoginToken = () => {
  localStorage.removeItem("userToken");
  localStorage.removeItem("userTimezone");
  localStorage.removeItem("userType");
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

export const iconsMap = {
  "Property Type": "fas fa-building", // FontAwesome equivalent
  "Property Category Type": "fas fa-tags", // General tag icon, as specific category icon might not be available
  "Unit": "fas fa-th-large", // General representation of units
  "Area": "fas fa-vector-square", // Represents area/space
  "No. of bedrooms": "fas fa-bed", // FontAwesome
  "Commercial Properties Sub Type": "fas fa-store", // Represents commercial properties
  "Price Type": "fas fa-tag", // FontAwesome
  "Layout": "fas fa-object-group", // Represents layout/design
  "Conference Room": "fas fa-chalkboard-teacher", // Represents teaching/conference space
  "Conference Room Capacity": "fas fa-users", // Represents group/capacity
  "Kitchen": "fas fa-utensils", // FontAwesome
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
  "View": "fas fa-eye", // Represents view/visibility
  "Balcony/Terrace": "fas fa-tree", // Use nature-related icon for outdoor space
  "Security Features": "fas fa-lock", // Represents security
  "Security Features Value": "fas fa-shield-alt", // Represents protection/value
  "Disability Access": "fas fa-wheelchair", // FontAwesome
  "Parking Facility": "fas fa-parking", // FontAwesome
  "Parking Facility(Number of Spaces)": "fas fa-car", // Represents vehicles/parking
  "Public Transport Access": "fas fa-bus", // Represents public transport
  "Year Built": "fas fa-calendar-alt", // Represents date/calendar
  "Condition": "fas fa-thermometer-half", // General condition/temperature icon
  "Availability Date": "fas fa-calendar-check", // Represents availability/scheduling
  "Pet Friendliness": "fas fa-paw", // Represents pets
  "Additional Features": "fas fa-plus-square", // Represents additional options/features
  "Building Amenities": "fas fa-building", // Duplicate of Property Type, as amenities icon might not be specific
  "Fireplace": "fas fa-fire", // Represents fireplace
  "Fireplace Value": "fas fa-fire-alt", // Alternative fire icon for value
  "Number of Floors": "fas fa-layer-group", // Represents layers/floors
  "Basement": "fas fa-warehouse", // Represents storage/lower levels
  "Parking": "fas fa-parking", // Duplicate of Parking Facility
  "Parking Option": "fas fa-cogs", // Represents options/settings
  "Garage/Carport(No. of Spaces)": "fas fa-car", // Use car icon, as specific garage icon might not be available
  "Outdoor Spaces": "fas fa-tree", // Represents outdoor spaces/nature
  "Number of Bathrooms": "fas fa-bath", // Represents bathroom facilities
  "Furnished": "fas fa-couch", // Represents furniture/living space
};


export const tagsOrder = [
  "typeMetaTag",
  "categoryTypeMetaTag",
  "unitMetaTag",
  "areaMetaTag",
  "bedroomsMetaTag",
  "subTypeMetaTag",
  "priceTypeMetaTag",
  "deedTitleMetaTag",
  "layout",
  "conferenceRoom",
  "conferenceRoomCapacity",
  "kitchen",
  "displayWindowArea",
  "displayWindowType",
  "numberOfStores",
  "foodCourt",
  "restRooms",
  "numberOfPools",
  "poolTypes",
  "numberOfRooms",
  "barArea",
  "loungeArea",
  "vipSectionCapacity",
  "numberOfDanceFloors",
  "numberOfPrivateRooms",
  "kitchenArea",
  "outdoorSeating",
  "outdoorSeatingArea",
  "roomSize",
  "numberOfBeds",
  "roomType",
  "floorLevel",
  "view",
  "balconyTerrace",
  "securityFeatures",
  "securityFeaturesValue",
  "disabilityAccess",
  "parkingFacility",
  "parkingSpaces",
  "publicTransportAccess",
  "yearBuilt",
  "condition",
  "availabilityDate",
  "petFriendliness",
  "additionalFeatures",
  "buildingAmenities",
  "fireplace",
  "fireplaceValue",
  "numberOfFloors",
  "basement",
  "parking",
  "parkingOption",
  "garageCarportSpaces",
  "outdoorSpaces",
  "numberOfBathrooms",
  "furnished",
];

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
            (property) => property.value == metaTag.value
          );
          metaData = metaData?.value === "sale" ? "Buy" : "Rent";
        } else {
          metaData = "Rent";
        }

        break;

      case "unit":
        metaTag = productMetaTags.find((meta) => meta.categoryField.id === 3);
        if (metaTag) {
          metaData = UNITS.find((property) => property.value == metaTag.value);
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
            (property) => property.value == metaTag.value
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

      case "availabilityDate":
        metaTag = productMetaTags.find((meta) => meta.categoryField.id === 45);
        metaData = metaTag ? metaTag.value : "Not Specified";
        break;

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
      }
    });
  }

  return metaData;
};
