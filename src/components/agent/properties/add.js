import React, { useCallback, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Select from "react-select";
import UploadPropertyImage from "./upload-property-image";
import UploadFeaturedImage from "./upload-featured-image";
import UploadVirtualTour from "./upload-virtual-tour";
import UploadPropertyDocument from "./upload-property-document";
import {
  PROPERTY_TYPES,
  RESIDENTIAL_PROPERTY,
  COMMERCIAL_PROPERTY,
  PROPERTY_CATEGORY_TYPES,
  PRICE_TYPE,
  UNITS,
  BEDROOMS,
  AGENT_TYPE,
  LAYOUT_OPTIONS,
  YES_NO_OPTIONS,
  KITCHEN_OPTIONS,
  POOL_TYPE_OPTIONS,
  ROOM_TYPE_OPTIONS,
  VIEW_OPTIONS,
  DISPLAY_WINDOW_OPTIONS,
  BUILDING_AMENITIES_OPTIONS,
  SECURITY_FEATURES_OPTIONS,
  CONDITION_OPTIONS,
  OUTDOOR_SPACES_OPTIONS,
  FURNISHED_OPTIONS,
  PARKING_OPTION_TYPES,
  FIREPLACE_VALUE_OPTIONS,
} from "../../../constants";
import {
  getUserDetailsFromJwt,
  setPropertyMetaData,
  stringToBoolean,
} from "../../../utils";
import UserService from "../../../services/agent/user";
import PropertyService from "../../../services/agent/property";
import { useStateIfMounted } from "use-state-if-mounted";
import { toast } from "react-toastify";

import LocationForm from "./LocationForm";
import { set } from "lodash";
import UploadQrCode from "./upload-qrCode";

export default function Add(props) {
  const params = useParams();
  const userDetail = getUserDetailsFromJwt();

  const [id, setId] = useStateIfMounted();
  const [title, setTitle] = useStateIfMounted("");
  const [description, setDescription] = useStateIfMounted("");
  const [price, setPrice] = useStateIfMounted();
  const [propertyType, setPropertyType] = useStateIfMounted("");
  const [propertySubType, setPropertySubType] = useStateIfMounted("");
  const [propertyCategoryType, setPropertyCategoryType] = useStateIfMounted();
  const [priceType, setPriceType] = useStateIfMounted();
  const [unit, setUnit] = useStateIfMounted("");
  const [area, setArea] = useStateIfMounted("");
  const [bedrooms, setBedrooms] = useStateIfMounted();
  const [featuredImage, setFeaturedImage] = useStateIfMounted(null);
  const [featuredImagePreview, setFeaturedImagePreview] =
    useStateIfMounted(null);
  const [address, setAddress] = useStateIfMounted("");
  const [city, setCity] = useStateIfMounted("");
  const [postalCode, setPostalCode] = useStateIfMounted("");
  const [region, setRegion] = useStateIfMounted("");
  const [longitude, setLongitude] = useStateIfMounted("");
  const [latitude, setLatitude] = useStateIfMounted("");
  const [propertyImages, setPropertyImages] = useStateIfMounted([]);
  const [propertyDocuments, setPropertyDocuments] = useStateIfMounted([]);
  const [allotedToUsers, setAllotedToUsers] = useStateIfMounted([]);
  const [loading, setLoading] = useStateIfMounted();
  const [virtualTourType, setVirtualTourType] = useStateIfMounted("");
  const [virtualTourVideo, setVirtualTourVideo] = useStateIfMounted("");
  const [virtualTourUrl, setVirtualTourUrl] = useStateIfMounted("");
  const [isChecked, setIsChecked] = useStateIfMounted(false);

  const [permitNumber, setPermitNumber] = useStateIfMounted("");
  const [qrCode, setQrCode] = useStateIfMounted(null);
  const [qrCodePath, setQrCodePath] = useStateIfMounted("");
  const [jobTitle, setJobTitle] = useStateIfMounted("");
  const [propertySubTypeOptions, setPropertySubTypeOptions] =
    useStateIfMounted(null);
  const [deedTitle, setDeedTitle] = useStateIfMounted("");
  const [users, setUsers] = useStateIfMounted([]);
  const [userFullUser, setUserFullUser] = useStateIfMounted({});

  const [layout, setLayout] = useStateIfMounted("");
  const [conferenceRoom, setConferenceRoom] = useStateIfMounted("");
  const [capacity, setCapacity] = useStateIfMounted("");
  const [kitchen, setKitchen] = useStateIfMounted("");
  const [store, setStore] = useStateIfMounted("");
  const [foodCourt, setFoodCourt] = useStateIfMounted("");
  const [restRoom, setRestRoom] = useStateIfMounted("");
  const [pools, setPools] = useStateIfMounted("");
  const [poolType, setPoolType] = useStateIfMounted("");
  const [hotelRoom, setHotelRoom] = useStateIfMounted("");
  const [areaBar, setAreaBar] = useStateIfMounted("");
  const [loungeArea, setLoungeArea] = useStateIfMounted("");
  const [capacityOfVip, setCapacityOfVip] = useStateIfMounted("");
  const [noOfDanceFloor, setNoOfDanceFloor] = useStateIfMounted("");
  const [noOfPrivateRooms, setNoOfPrivateRooms] = useStateIfMounted("");

  const [kitchenArea, setKitchenArea] = useStateIfMounted("");
  const [outdoorSeating, setOutdoorSeating] = useStateIfMounted("");
  const [outdoorSeatingArea, setOutdoorSeatingArea] = useStateIfMounted("");

  const [roomSize, setRoomSize] = useStateIfMounted("");
  const [noOfBeds, setNoOfBeds] = useStateIfMounted("");
  const [noOfBedRooms, setNoOfBedRooms] = useStateIfMounted("");
  const [roomType, setRoomType] = useStateIfMounted("");
  const [floorLevel, setFloorLevel] = useStateIfMounted("");
  const [view, setView] = useStateIfMounted("");
  const [balcony, setBalcony] = useStateIfMounted("");

  const [displayWindowArea, setDisplayWindowArea] = useStateIfMounted("");
  const [displayWindow, setDisplayWindow] = useStateIfMounted("");
  const [displayWindowOther, setDisplayWindowOther] = useStateIfMounted("");

  const [residentialFloorLevel, setResidentialFloorLevel] =
    useStateIfMounted("");
  const [buildingAmenities, setBuildingAmenities] = useStateIfMounted([]);

  const [fireplace, setFireplace] = useStateIfMounted("");
  const [woodBurning, setWoodBurning] = useStateIfMounted("");
  const [gas, setGas] = useStateIfMounted("");
  const [noOfFloors, setNoOfFloors] = useStateIfMounted("");
  const [basement, setBasement] = useStateIfMounted("");
  const [residentialKitchen, setResidentialKitchen] = useStateIfMounted("");

  // common tags useState
  const [securityFeatures, setSecurityFeatures] = useStateIfMounted("");
  const [alaramCameraB, setAlaramCameraB] = useStateIfMounted("");
  const [disabilityAccess, setDisabilityAccess] = useStateIfMounted("");
  const [publicTransport, setPublicTransport] = useStateIfMounted("");
  const [yearBuilt, setYearBuilt] = useStateIfMounted("");
  const [condition, setCondition] = useStateIfMounted("");
  const [availabilityDate, setAvailabilityDate] = useStateIfMounted("");
  const [additionalFeatures, setAdditionalFeatures] = useStateIfMounted("");

  const [petFreindliness, setPetFreindliness] = useStateIfMounted("");
  const [commercialParking, setCommercialParking] = useStateIfMounted("");
  const [noOfSpacesCommercial, setNoOfSpacesCommercial] = useStateIfMounted("");

  const [outdoorSpaces, setOutdoorSpaces] = useStateIfMounted([]);
  const [noOfBathrooms, setNoOfBathrooms] = useStateIfMounted("");
  const [furnished, setFurnished] = useStateIfMounted("");
  const [parkingFacility, setParkingFacility] = useStateIfMounted("");
  const [noOfParkings, setNoOfParkings] = useStateIfMounted("");
  const [parkingType, setParkingType] = useStateIfMounted("");
  const [garageSpaces, setGarageSpaces] = useStateIfMounted("");

  const history = useHistory();

  const fetchUserDetails = useCallback(async () => {
    try {
      const response = await UserService.detail(userDetail.id);
      setUserFullUser(response.user);
      setJobTitle(response.jobTitle);
    } catch (error) {
      console.error("Error fetching user details:", error);
      // Optionally handle error state here
    }
  }, [userDetail.id]);

  const loadUsersToAllocate = async () => {
    const response = await UserService.toAllocate();
    if (response?.error) {
      props.responseHandler(
        response.error.message || "An unexpected error occurred"
      );
      return;
    }

    const formattedUsers = response.map((userDetail) => {
      return {
        label: `${userDetail.user.firstName} ${userDetail.user.lastName}`,
        value: userDetail.userId,
      };
    });
    setUsers(formattedUsers);

    return formattedUsers;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title | !price | !propertyType | !propertyCategoryType) {
      props.responseHandler(["Fill all required fields"]);
      return;
    }

    // Setting API endpoint dynamically
    // const apiUrl = id ? "/update" : "/create";
    // const successMsg = id
    //   ? "Property updated successfully."
    //   : "Your changes are saved successfully.";
    // const apiUrl = (() => id ? "/update" : "/create")();
    // const successMsg = (() => id ? "Property updated successfully." : "Your changes are saved successfully.")();

    let apiUrl = id ? "update" : "create";
    let successMsg = id
      ? "Property updated successfully."
      : "Your changes are saved successfully.";

    let formdata = new FormData();
    formdata.append("title", title);
    formdata.append("description", description);
    formdata.append("price", price);
    formdata.append("featuredImage", featuredImage);
    formdata.append("address", address);
    formdata.append("city", city);
    formdata.append("postalCode", postalCode);
    formdata.append("region", region);
    formdata.append("latitude", latitude);
    formdata.append("longitude", longitude);

    if (permitNumber) {
      formdata.append("permitNumber", permitNumber);
    }

    // Helper function to conditionally append meta tags
    const appendMetaTag = (key, value) => {
      if (Array.isArray(value)) {
        // Join array values with a comma for array types
        formdata.append(key, value.join(","));
      } else if (typeof value === "string") {
        // Trim the string before appending
        if (value.trim() !== "") formdata.append(key, value.trim());
      } else if (value !== null && value !== undefined) {
        // Directly append non-string and non-null/undefined values
        formdata.append(key, value.toString());
      }
    };

    // Conditional appending of meta tags
    appendMetaTag("metaTags[1]", propertyType?.value); // Example for property type
    appendMetaTag("metaTags[2]", propertyCategoryType?.value);
    appendMetaTag("metaTags[3]", unit?.value);
    appendMetaTag("metaTags[4]", area);
    appendMetaTag("metaTags[5]", bedrooms?.value);
    appendMetaTag("metaTags[8]", priceType?.value);

    // ... Continue for other specific meta tags

    // Example for appending meta tags based on conditionals (residential or commercial specifics)
    if (propertyType?.value === "residential") {
      appendMetaTag("metaTags[6]", propertySubType?.value);

      if (
        propertySubType?.value === "apartment" ||
        propertySubType?.value === "studio" ||
        propertySubType?.value === "room"
      ) {
        appendMetaTag("metaTags[48]", buildingAmenities?.join(","));
      } else if (
        propertySubType?.value === "house" ||
        propertySubType?.value === "bungalow" ||
        propertySubType?.value === "duplex" ||
        propertySubType?.value === "triplex" ||
        propertySubType?.value === "cottage"
      ) {
        appendMetaTag("metaTags[49]", fireplace);
        appendMetaTag("metaTags[50]", woodBurning);
        appendMetaTag("metaTags[51]", noOfFloors);
        appendMetaTag("metaTags[52]", basement);
        appendMetaTag("metaTags[13]", residentialKitchen);
      }

      appendMetaTag("metaTags[53]", parkingFacility);
      appendMetaTag("metaTags[54]", parkingType);
      appendMetaTag("metaTags[55]", garageSpaces);
      appendMetaTag("metaTags[56]", outdoorSpaces?.join(","));
      appendMetaTag("metaTags[57]", noOfBathrooms);
      appendMetaTag("metaTags[58]", furnished);
    } else if (propertyType?.value === "commercial") {
      appendMetaTag("metaTags[7]", propertySubType?.value); // Commercial property subtype
      // Example for office subtype
      if (propertySubType?.value === "office") {
        appendMetaTag("metaTags[10]", layout);
        appendMetaTag("metaTags[11]", conferenceRoom);
        appendMetaTag("metaTags[12]", capacity);
        appendMetaTag("metaTags[13]", kitchen);
      } else if (propertySubType?.value === "shopping_center") {
        appendMetaTag("metaTags[17]", store);
        appendMetaTag("metaTags[18]", foodCourt);
        appendMetaTag("metaTags[19]", restRoom);
      } else if (propertySubType?.value === "hotels") {
        appendMetaTag("metaTags[20]", pools);
        appendMetaTag("metaTags[21]", poolType);
        appendMetaTag("metaTags[22]", hotelRoom);
      } else if (propertySubType?.value === "club") {
        appendMetaTag("metaTags[23]", areaBar);
        appendMetaTag("metaTags[24]", loungeArea);
        appendMetaTag("metaTags[25]", capacityOfVip);
        appendMetaTag("metaTags[26]", noOfDanceFloor);
        appendMetaTag("metaTags[27]", noOfPrivateRooms);
      } else if (propertySubType?.value === "restaurant") {
        appendMetaTag("metaTags[28]", kitchenArea);
        appendMetaTag("metaTags[29]", outdoorSeating);
        appendMetaTag("metaTags[30]", outdoorSeatingArea);
      } else if (propertySubType?.value === "hotel_room") {
        appendMetaTag("metaTags[31]", roomSize);
        appendMetaTag("metaTags[32]", noOfBeds);
        appendMetaTag("metaTags[33]", roomType);
        appendMetaTag("metaTags[34]", floorLevel);
        appendMetaTag("metaTags[35]", view);
        appendMetaTag("metaTags[36]", balcony);
      } else if (
        propertySubType?.value === "retail" ||
        propertySubType?.value === "shop" ||
        propertySubType?.value === "store"
      ) {
        appendMetaTag("metaTags[14]", displayWindowArea);
        appendMetaTag("metaTags[15]", displayWindow);
        appendMetaTag("metaTags[16]", displayWindowOther);
      }

      appendMetaTag("metaTags[40]", commercialParking);
      appendMetaTag("metaTags[41]", noOfSpacesCommercial); // if parkingFacility is yes

      appendMetaTag("metaTags[46]", petFreindliness);

      // Add conditional append for other commercial property subtypes as needed
    }

    // Common meta tags for both residential and commercial properties
    appendMetaTag("metaTags[37]", securityFeatures);
    appendMetaTag("metaTags[38]", alaramCameraB);
    appendMetaTag("metaTags[39]", disabilityAccess);
    appendMetaTag("metaTags[42]", publicTransport);
    appendMetaTag("metaTags[43]", yearBuilt);
    appendMetaTag("metaTags[44]", condition);
    appendMetaTag("metaTags[45]", availabilityDate);
    appendMetaTag("metaTags[47]", additionalFeatures);

    // Continue with other meta tags, adapting the above logic to your application's specific meta tags

    if (id) {
      // apiUrl = "update";
      formdata.append("productId", id);
      // successMsg = "Property updated successfully.";
    }

    if (allotedToUsers && allotedToUsers.length > 0) {
      for (let i = 0; i < allotedToUsers.length; i++) {
        if (allotedToUsers[i]?.value) {
          formdata.append(`allocatedUser[${i}]`, allotedToUsers[i].value);
        }
      }
    }

    setLoading(true);
    try {
      // const formResponse = await PropertyService[
      //   apiUrl === "/update" ? "update" : "add"
      // ](formdata);

      // const formResponse = await (apiUrl === "/update" ? PropertyService.update(formdata) : PropertyService.add(formdata));
      const formResponse =
        apiUrl === "update"
          ? await PropertyService.update(formdata)
          : await PropertyService.add(formdata);

      setLoading(false);

      if (formResponse?.error) {
        props.responseHandler([formResponse?.message || "An error occurred."]);
        return;
      }

      if (!id && formResponse?.id) {
        // Check if creating a new property and response includes an ID
        setId(formResponse.id);
        toast.success(successMsg);
        if (formResponse?.id) {
          history.push(`/agent/edit-property/${formResponse.id}`);
        }
        // No need to redirect here; just update the state
      }
      // else if (id) {
      //   toast.success(successMsg);
      //   setTimeout(() => {
      //     if (formResponse?.id) {
      //       history.push(`/agent/edit-property/${formResponse.id}`);
      //     }
      //   }, 2000);
      // }

      // Redirect after success
      // if (id) {

      // }
    } catch (error) {
      props.responseHandler([
        "An error occurred while processing your request.",
      ]);
      setLoading(false);
    }
  };

  const handleOutdoorSpacesChange = (e) => {
    const { checked, value } = e.target;
    setOutdoorSpaces((currentSpaces) => {
      if (checked) {
        return [...currentSpaces, value];
      } else {
        return currentSpaces.filter((space) => space !== value);
      }
    });
  };

  const handleBuildingAmenitiesChange = (e) => {
    const { checked, value } = e.target;
    setBuildingAmenities((currentAmenities) => {
      if (checked) {
        return [...currentAmenities, value];
      } else {
        return currentAmenities.filter((amenity) => amenity !== value);
      }
    });
  };

  const handleImageSelect = (file) => {
    setFeaturedImage(file);
  };

  const setPropertyDetails = (updatedDetails) => {
    // Assuming you have a state or method to update the property details,
    // add or update the featuredImage key with the selected image.
  };

  const handleQrCodeUploadSuccess = (qrCodePath) => {
    setQrCodePath(qrCodePath); // Update the state with the new QR code path
    toast.success("QR Code uploaded successfully!");
    // You might want to do more here, like updating the form data that will be submitted
  };

  const setPropertyCategoryTypeHandler = (e) => {
    setPropertyCategoryType(e);
  };

  const setPropertyTypeHandler = (e) => {
    setPropertyType(e);
    setPropertySubType("");
  };

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  useEffect(() => {
    if (params?.id) {
      setId(params.id);

      const fetchPropertyDetails = async () => {
        const usersArray = await loadUsersToAllocate();
        console.log("usersArray", usersArray);

        const response = await PropertyService.detail(params.id);
        console.log("Property Details", response);
        if (response?.id) {
          setTitle(response.title);
          setDescription(response.description);
          setPrice(response.price);
          setAddress(response.address);
          setPostalCode(response.postalCode);
          setCity(response.city);
          setRegion(response.region);
          setLatitude(response.latitude);
          setLongitude(response.longitude);
          setVirtualTourType(response.virtualTourType);
          setPermitNumber(response.permitNumber);
          if (response?.featuredImage) {
            setFeaturedImagePreview(
              `${process.env.REACT_APP_API_URL}/${response.featuredImage}`
            );
          }

          if (response.virtualTourType == "slideshow") {
            setIsChecked(true);
          } else if (response.virtualTourType == "url") {
            setVirtualTourUrl(response.virtualTourUrl);
          }

          const metaTagsHandlers = {
            // Basic properties
            "Property Type": (value) => {
              const type = PROPERTY_TYPES.find((type) => type.value === value);
              setPropertyType(type);
              // Update subtypes based on property type
              setPropertySubType(
                type.value === "residential"
                  ? RESIDENTIAL_PROPERTY
                  : COMMERCIAL_PROPERTY
              );
            },
            "Property Category Type": (value) =>
              setPropertyCategoryType(
                PROPERTY_CATEGORY_TYPES.find((type) => type.value === value)
              ),
            Unit: (value) =>
              setUnit(UNITS.find((unit) => unit.value === value)),
            Area: setArea,
            "No. of bedrooms": (value) =>
              setBedrooms(BEDROOMS.find((bedroom) => bedroom.value === value)),
            "Price Type": (value) =>
              setPriceType(PRICE_TYPE.find((type) => type.value === value)),

            // Commercial-specific properties
            Layout: setLayout,
            "Conference Room": (value) => setConferenceRoom(value),
            "Conference Room Capacity": setCapacity,
            Kitchen: setKitchen,
            "Number of Stores": setStore,
            "Food Court": (value) => setFoodCourt(value),
            "Rest Room": (value) => setRestRoom(value),
            "Number of Pools": setPools,
            "Pool Type": setPoolType,
            "Number of Rooms": setHotelRoom,
            "Area of Bar (Square Meter)": setAreaBar,
            "Lounge Area (Square Meter)": setLoungeArea,
            "Capacity of VIP": setCapacityOfVip,
            "Number of Dance Floor": setNoOfDanceFloor,
            "Number of Private Rooms": setNoOfPrivateRooms,
            "Kitchen Area (Square Meter)": setKitchenArea,
            "Outdoor Seating": (value) => setOutdoorSeating(value),
            "Outdoor Seating Area (Square Meter)": setOutdoorSeatingArea,
            "Display Window Area": setDisplayWindowArea,
            "Display Window Type": setDisplayWindow,

            // Residential-specific properties
            "Building Amenities": (value) =>
              setBuildingAmenities(value.split(",")),
            "Number of Bathrooms": setNoOfBathrooms,
            Furnished: setFurnished,
            "Floor Level": setFloorLevel, // Might need to differentiate between residential and commercial
            "Balcony/Terrace": (value) => setBalcony(value),
            "Room Size(m²)": setRoomSize,
            "Number of Beds": setNoOfBeds,
            "Room Type": setRoomType,
            View: setView,

            // Common properties across types
            "Security Features": (value) => setSecurityFeatures(value),
            "Security Features Value": setAlaramCameraB,
            "Disability Access": (value) => setDisabilityAccess(value),
            "Parking Facility": (value) => setCommercialParking(value),
            "Parking Facility (Number of Spaces)": setNoOfParkings,
            "Public Transport Access": (value) => setPublicTransport(value),
            "Year Built": setYearBuilt,
            Condition: setCondition,
            "Availability Date": setAvailabilityDate,
            "Additional Features": setAdditionalFeatures,
            "Pet Friendliness": (value) => setPetFreindliness(value),
            "Outdoor Spaces": (value) => setOutdoorSpaces(value.split(",")),
            Parking: (value) => setParkingFacility(value),
            "Parking Option": setParkingType,
            "Garage/Carport(No. of Spaces)": setGarageSpaces,
            Fireplace: (value) => setFireplace(value),
            "Fireplace Value": setWoodBurning, // Assuming wood burning is a specific type of fireplace value
            "Number of Floors": setNoOfFloors,
            Basement: (value) => setBasement(value),
            "Kitchen (Residential)": setResidentialKitchen,
          };

          response.productMetaTags.forEach((metaTag) => {
            const handler = metaTagsHandlers[metaTag.categoryField.label];
            if (handler) {
              handler(metaTag.value);
            }
          });

          if (response.productImages) {
            setPropertyImages(response.productImages);
          }

          if (response.productDocuments) {
            setPropertyDocuments(response.productDocuments);
          }

          if (
            response?.productAllocations?.length > 0 &&
            usersArray.length > 0
          ) {
            const newAllotedUsers = [];
            response.productAllocations.forEach((productAllocation) => {
              newAllotedUsers.push(
                usersArray.find(
                  (user) => user.value == productAllocation.user.id
                )
              );
            });

            setAllotedToUsers(newAllotedUsers);
          }
        }
      };

      fetchPropertyDetails();
    }
  }, [params.id, COMMERCIAL_PROPERTY, RESIDENTIAL_PROPERTY]);

  useEffect(() => {
    setPropertySubTypeOptions(
      propertyType?.value == "residential"
        ? RESIDENTIAL_PROPERTY
        : COMMERCIAL_PROPERTY
    );
  }, [propertyType]);

  useEffect(() => {
    loadUsersToAllocate();
  }, []);

  return (
    <React.Fragment>
      <form
        encType="multipart/form-data"
        onSubmit={handleSubmit}
        className="ltn__myaccount-tab-content-inner mb-50"
      >
        <h4 className="title-2">Property Description</h4>
        <div className="row mb-custom">
          <div className="col-md-6">
            <div className="input-item">
              <label className="h6">Property Type *</label>
              <div className="input-item">
                <Select
                  classNamePrefix="custom-select"
                  options={PROPERTY_TYPES}
                  onChange={(e) => setPropertyTypeHandler(e)}
                  value={propertyType}
                  required
                />
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="input-item">
              <label className="h6">Property Sub Type *</label>
              <div className="input-item">
                <Select
                  classNamePrefix="custom-select"
                  options={propertySubTypeOptions}
                  onChange={(e) => setPropertySubType(e)}
                  value={propertySubType}
                  required
                />
              </div>
            </div>
          </div>
          <div className="col-md-12">
            <div className="input-item">
              <label className="h6">Property Category Type *</label>
              <div className="input-item">
                <Select
                  classNamePrefix="custom-select"
                  options={PROPERTY_CATEGORY_TYPES}
                  onChange={(e) => setPropertyCategoryTypeHandler(e)}
                  value={propertyCategoryType}
                  required
                />
              </div>
            </div>
          </div>
          <div className="col-md-12">
            <div className="input-item">
              <label className="h6">
                Property Name *- First line of address (for example: 30 Johns
                Road, SM1)
              </label>
              <input
                className="mb-custom"
                type="text"
                value={title}
                placeholder="Property Name"
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="col-md-12">
            <div className="input-item">
              <label className="h6">Description*</label>
              <textarea
                className="mb-custom"
                value={description}
                placeholder="Description"
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
          </div>
          {userDetail && userDetail.agent.jobTitle === "landlord" && (
            <div className="col-md-12">
              <div className="input-item">
                <label className="h6"> Deed Title *</label>
                <input
                  type="text"
                  value={deedTitle}
                  placeholder="Deed Title"
                  onChange={(e) => setDeedTitle(e.target.value)}
                />
              </div>
            </div>
          )}
          <div className="col-md-12">
            <div className="input-item">
              <label className="h6">Price *</label>
              <input
                min="1"
                type="number"
                value={price || ""}
                placeholder="Enter price"
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
          </div>
          {propertyCategoryType?.value === "rent" && (
            <div className="col-md-12">
              <div className="input-item">
                <label className="h6">Price Type</label>
                <Select
                  classNamePrefix="custom-select"
                  options={PRICE_TYPE}
                  onChange={(e) => setPriceType(e)}
                  value={priceType}
                  required
                />
              </div>
            </div>
          )}
          <div className="col-md-12">
            <div className="input-item">
              <label className="h6">No. of bedrooms</label>
              <div className="input-item">
                <Select
                  classNamePrefix="custom-select"
                  options={BEDROOMS}
                  onChange={(e) => setBedrooms(e)}
                  value={bedrooms}
                />
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="input-item">
              <label className="h6">Area *</label>
              <input
                type="number"
                placeholder="0"
                onChange={(e) => setArea(e.target.value)}
                value={area}
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="input-item">
              <label className="h6">Unit *</label>
              <div className="input-item">
                <Select
                  classNamePrefix="custom-select"
                  options={UNITS}
                  onChange={(e) => setUnit(e)}
                  value={unit}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/*Commercail Meta Tags */}
        {propertyType?.value === "commercial" &&
          propertySubType?.value === "office" && (
            <div className="row">
              <div className="col-md-12">
                <div className="input-item">
                  <label className="h6">Layout</label>
                  <div className="input-item">
                    <Select
                      classNamePrefix="custom-select"
                      options={LAYOUT_OPTIONS}
                      onChange={(selectedOption) =>
                        setLayout(selectedOption ? selectedOption.value : "")
                      }
                      value={LAYOUT_OPTIONS.find(
                        (option) => option.value === layout
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="input-item">
                  <label className="h6">Conference Room</label>
                  <div>
                    <label className="p-2">
                      <input
                        type="radio"
                        name="conferenceRoom"
                        value="yes"
                        checked={conferenceRoom === "yes"}
                        onChange={(e) => setConferenceRoom(e.target.value)}
                      />{" "}
                      Yes
                    </label>
                    <label className="p-2">
                      <input
                        type="radio"
                        name="conferenceRoom"
                        value="no"
                        checked={conferenceRoom === "no"}
                        onChange={(e) => setConferenceRoom(e.target.value)}
                      />{" "}
                      No
                    </label>
                  </div>
                </div>
              </div>

              {conferenceRoom === "yes" && (
                <div className="col-md-12">
                  <div className="input-item">
                    <label className="h6">Capacity</label>
                    <input
                      type="number"
                      placeholder="0"
                      onChange={(e) => setCapacity(e.target.value)}
                      value={capacity}
                    />
                  </div>
                </div>
              )}
              <div className="col-md-12">
                <div className="input-item">
                  <label className="h6">Kitchen</label>
                  <div className="input-item">
                    <Select
                      classNamePrefix="custom-select"
                      options={KITCHEN_OPTIONS}
                      onChange={(selectedOption) =>
                        setKitchen(selectedOption ? selectedOption.value : "")
                      }
                      value={KITCHEN_OPTIONS.find(
                        (option) => option.value === kitchen
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

        {propertyType?.value === "commercial" &&
          propertySubType?.value === "shopping_center" && (
            <div className="row">
              <div className="col-md-12">
                <div className="input-item">
                  <label className="h6">Number of Stores</label>
                  <div className="input-item">
                    <input
                      type="number"
                      placeholder="0"
                      onChange={(e) => setStore(e.target.value)}
                      value={store}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="input-item">
                  <label className="h6">Food Court</label>
                  <div>
                    <label className="p-2">
                      <input
                        type="radio"
                        name="foodCourt"
                        value="yes"
                        checked={foodCourt === "yes"}
                        onChange={(e) => setFoodCourt(e.target.value)}
                      />{" "}
                      Yes
                    </label>
                    <label className="p-2">
                      <input
                        type="radio"
                        name="foodCourt"
                        value="no"
                        checked={foodCourt === "no"}
                        onChange={(e) => setFoodCourt(e.target.value)}
                      />{" "}
                      No
                    </label>
                  </div>
                </div>
              </div>

              <div className="col-md-12">
                <div className="input-item">
                  <label className="h6">Rest Room</label>
                  <div>
                    <label className="p-2">
                      <input
                        type="radio"
                        name="restRoom"
                        value="yes"
                        checked={restRoom === "yes"}
                        onChange={(e) => setRestRoom(e.target.value)}
                      />{" "}
                      Yes
                    </label>
                    <label className="p-2">
                      <input
                        type="radio"
                        name="restRoom"
                        value="no"
                        checked={restRoom === "no"}
                        onChange={(e) => setRestRoom(e.target.value)}
                      />{" "}
                      No
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

        {propertyType?.value === "commercial" &&
          propertySubType?.value === "hotels" && (
            <div className="row">
              <div className="col-md-12">
                <div className="input-item">
                  <label className="h6">Number of Pools</label>
                  <input
                    type="number"
                    placeholder="0"
                    onChange={(e) => setPools(e.target.value)}
                    value={pools}
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="input-item">
                  <label className="h6">Pool Type</label>
                  <div className="input-item">
                    <Select
                      classNamePrefix="custom-select"
                      options={POOL_TYPE_OPTIONS}
                      onChange={(selectedOption) =>
                        setPoolType(selectedOption ? selectedOption.value : "")
                      }
                      value={POOL_TYPE_OPTIONS.find(
                        (option) => option.value === poolType
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="input-item">
                  <label className="h6">Number of Rooms</label>
                  <input
                    type="number"
                    placeholder="0"
                    onChange={(e) => setHotelRoom(e.target.value)}
                    value={hotelRoom}
                  />
                </div>
              </div>
            </div>
          )}

        {propertyType?.value === "commercial" &&
          propertySubType?.value === "club" && (
            <div className="row">
              <div className="col-md-12">
                <div className="input-item">
                  <label className="h6">Area of Bar (Square Meter)</label>
                  <input
                    type="number"
                    placeholder="0"
                    onChange={(e) => setAreaBar(e.target.value)}
                    value={areaBar}
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="input-item">
                  <label className="h6">Lounge Area (Square Meter)</label>
                  <input
                    type="number"
                    placeholder="0"
                    onChange={(e) => setLoungeArea(e.target.value)}
                    value={loungeArea}
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="input-item">
                  <label className="h6">Capacity of VIP</label>
                  <input
                    type="number"
                    placeholder="0"
                    onChange={(e) => setCapacityOfVip(e.target.value)}
                    value={capacityOfVip}
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="input-item">
                  <label className="h6">Number of Dance Floor</label>
                  <input
                    type="number"
                    placeholder="0"
                    onChange={(e) => setNoOfDanceFloor(e.target.value)}
                    value={noOfDanceFloor}
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="input-item">
                  <label className="h6">Number of Private Rooms</label>
                  <input
                    type="number"
                    placeholder="0"
                    onChange={(e) => setNoOfPrivateRooms(e.target.value)}
                    value={noOfPrivateRooms}
                  />
                </div>
              </div>
            </div>
          )}

        {propertyType?.value === "commercial" &&
          propertySubType?.value === "restaurant" && (
            <div className="row">
              <div className="col-md-12">
                <div className="input-item">
                  <label className="h6">Kitchen Area (Square Meter)</label>
                  <input
                    type="number"
                    placeholder="0"
                    onChange={(e) => setKitchenArea(e.target.value)}
                    value={kitchenArea}
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="input-item">
                  <label className="h6">Outdoor Seating</label>
                  <div>
                    <label className="p-2">
                      <input
                        type="radio"
                        name="outdoorSeating"
                        value="yes"
                        checked={outdoorSeating === "yes"}
                        onChange={(e) => setOutdoorSeating(e.target.value)}
                      />{" "}
                      Yes
                    </label>
                    <label className="p-2">
                      <input
                        type="radio"
                        name="outdoorSeating"
                        value="no"
                        checked={outdoorSeating === "no"}
                        onChange={(e) => setOutdoorSeating(e.target.value)}
                      />{" "}
                      No
                    </label>
                  </div>
                </div>
              </div>

              {outdoorSeating === "yes" && (
                <div className="col-md-12">
                  <div className="input-item">
                    <label className="h6">
                      Outdoor Seating Area (Square Meter)
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      onChange={(e) => setOutdoorSeatingArea(e.target.value)}
                      value={outdoorSeatingArea}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

        {propertyType?.value === "commercial" &&
          propertySubType?.value === "hotel_room" && (
            <div className="row">
              <div className="col-md-12">
                <div className="input-item">
                  <label className="h6">Room Size (Square Meter)</label>
                  <input
                    type="number"
                    placeholder="0"
                    onChange={(e) => setRoomSize(e.target.value)}
                    value={roomSize}
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="input-item">
                  <label className="h6">Number of Beds</label>
                  <input
                    type="number"
                    placeholder="0"
                    onChange={(e) => setNoOfBeds(e.target.value)}
                    value={noOfBeds}
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="input-item">
                  <label className="h6">Room Type</label>
                  <div className="input-item">
                    <Select
                      classNamePrefix="custom-select"
                      options={ROOM_TYPE_OPTIONS}
                      onChange={(selectedOption) =>
                        setRoomType(selectedOption ? selectedOption.value : "")
                      }
                      value={ROOM_TYPE_OPTIONS.find(
                        (option) => option.value === roomType
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="input-item">
                  <label className="h6">Floor Level</label>
                  <input
                    type="number"
                    placeholder="0"
                    onChange={(e) => setFloorLevel(e.target.value)}
                    value={floorLevel}
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="input-item">
                  <label className="h6">View</label>
                  <div className="input-item">
                    <Select
                      classNamePrefix="custom-select"
                      options={VIEW_OPTIONS}
                      onChange={(selectedOption) =>
                        setView(selectedOption ? selectedOption.value : "")
                      }
                      value={VIEW_OPTIONS.find(
                        (option) => option.value === view
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="input-item">
                  <label className="h6">Balcony/Terrace</label>
                  <div>
                    <label className="p-2">
                      <input
                        type="radio"
                        name="balconyTerrace"
                        value="yes"
                        checked={balcony === "yes"}
                        onChange={(e) => setBalcony(e.target.value)}
                      />{" "}
                      Yes
                    </label>
                    <label className="p-2">
                      <input
                        type="radio"
                        name="balconyTerrace"
                        value="no"
                        checked={balcony === "no"}
                        onChange={(e) => setBalcony(e.target.value)}
                      />{" "}
                      No
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

        {propertyType?.value === "commercial" &&
          (propertySubType?.value === "retail" ||
            propertySubType?.value === "shop" ||
            propertySubType?.value === "store") && (
            <div className="row">
              <div className="col-md-12">
                <div className="input-item">
                  <label className="h6">
                    Display Window Area (Square Meter)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    onChange={(e) => setDisplayWindowArea(e.target.value)}
                    value={displayWindowArea}
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="input-item">
                  <label className="h6">Display Window</label>
                  <div className="input-item">
                    <Select
                      classNamePrefix="custom-select"
                      options={DISPLAY_WINDOW_OPTIONS}
                      onChange={(selectedOption) =>
                        setDisplayWindow(
                          selectedOption ? selectedOption.value : ""
                        )
                      }
                      value={DISPLAY_WINDOW_OPTIONS.find(
                        (option) => option.value === displayWindow
                      )}
                    />
                  </div>
                </div>
              </div>
              {displayWindow?.value === "Other" && (
                <div className="col-md-12">
                  <div className="input-item">
                    <label className="h6">Other Display Window</label>
                    <input
                      type="text"
                      placeholder="Other Display Window"
                      onChange={(e) => setDisplayWindowOther(e.target.value)}
                      value={displayWindowOther}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

        {/* Residential Meta Tags */}
        {propertyType?.value === "residential" &&
          (propertySubType?.value === "apartment" ||
            propertySubType?.value === "studio" ||
            propertySubType?.value === "room") && (
            <div className="row">
              <div className="col-md-12">
                <div className="input-item">
                  <label className="h6">Building Amenities</label>
                  <div>
                    {BUILDING_AMENITIES_OPTIONS.map((option) => (
                      <div key={option.value}>
                        <label>
                          <input
                            type="checkbox"
                            value={option.value}
                            checked={buildingAmenities.includes(option.value)}
                            onChange={(e) => handleBuildingAmenitiesChange(e)}
                          />
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        {propertyType?.value === "residential" &&
          (propertySubType?.value === "house" ||
            propertySubType?.value === "bungalow" ||
            propertySubType?.value === "duplex" ||
            propertySubType?.value === "triplex" ||
            propertySubType?.value === "cottage") && (
            <div className="row">
              <div className="col-md-12">
                <div className="input-item">
                  <label className="h6">Fireplace</label>
                  <div>
                    <label className="p-2">
                      <input
                        type="radio"
                        name="fireplace"
                        value="yes"
                        checked={fireplace === "yes"}
                        onChange={(e) => setFireplace(e.target.value)}
                      />{" "}
                      Yes
                    </label>
                    <label className="p-2">
                      <input
                        type="radio"
                        name="fireplace"
                        value="no"
                        checked={fireplace === "no"}
                        onChange={(e) => setFireplace(e.target.value)}
                      />{" "}
                      No
                    </label>
                  </div>
                </div>

                {fireplace === "yes" && (
                  <div className="col-md-12">
                    <div className="input-item">
                      <label className="h6">Wood Burning Gas</label>
                      <div className="input-item">
                        <Select
                          classNamePrefix="custom-select"
                          options={FIREPLACE_VALUE_OPTIONS}
                          onChange={(selectedOption) =>
                            setWoodBurning(
                              selectedOption ? selectedOption.value : ""
                            )
                          }
                          value={FIREPLACE_VALUE_OPTIONS.find(
                            (option) => option.value === woodBurning
                          )}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="col-md-12">
                <div className="input-item">
                  <label className="h6">Number of Floors</label>
                  <input
                    type="number"
                    placeholder="0"
                    onChange={(e) => setNoOfFloors(e.target.value)}
                    value={noOfFloors}
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="input-item">
                  <label className="h6">Basement</label>
                  <div>
                    <label className="p-2">
                      <input
                        type="radio"
                        name="basement"
                        value="yes"
                        checked={basement === "yes"}
                        onChange={(e) => setBasement(e.target.value)}
                      />{" "}
                      Yes
                    </label>
                    <label className="p-2">
                      <input
                        type="radio"
                        name="basement"
                        value="no"
                        checked={basement === "no"}
                        onChange={(e) => setBasement(e.target.value)}
                      />{" "}
                      No
                    </label>
                  </div>
                </div>
              </div>

              <div className="col-md-12">
                <div className="input-item">
                  <label className="h6">Kitchen</label>
                  <div className="input-item">
                    <Select
                      classNamePrefix="custom-select"
                      options={KITCHEN_OPTIONS}
                      onChange={(selectedOption) =>
                        setResidentialKitchen(
                          selectedOption ? selectedOption.value : ""
                        )
                      }
                      value={KITCHEN_OPTIONS.find(
                        (option) => option.value === residentialKitchen
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

        {/* common comercial feature tag */}
        {propertyType?.value === "commercial" && (
          <div className="row">
            <div className="col-md-12">
              <div className="input-item">
                <label className="h6">Pet Friendliness</label>
                <div>
                  <label className="p-2">
                    <input
                      type="radio"
                      name="petFriendliness"
                      value="yes"
                      checked={petFreindliness === "yes"}
                      onChange={(e) => setPetFreindliness(e.target.value)}
                    />{" "}
                    Yes
                  </label>
                  <label className="p-2">
                    <input
                      type="radio"
                      name="petFriendliness"
                      value="no"
                      checked={petFreindliness === "no"}
                      onChange={(e) => setPetFreindliness(e.target.value)}
                    />{" "}
                    No
                  </label>
                </div>
              </div>
            </div>

            <div className="col-md-12">
              <div className="input-item">
                <label className="h6">Parking Facility</label>
                <div>
                  <label className="p-2">
                    <input
                      type="radio"
                      name="commercialParking"
                      value="yes"
                      checked={commercialParking === "yes"}
                      onChange={(e) => setCommercialParking(e.target.value)}
                    />{" "}
                    Yes
                  </label>
                  <label className="p-2">
                    <input
                      type="radio"
                      name="commercialParking"
                      value="no"
                      checked={commercialParking === "no"}
                      onChange={(e) => setCommercialParking(e.target.value)}
                    />{" "}
                    No
                  </label>
                </div>
              </div>
            </div>

            {commercialParking === "yes" && (
              <div className="col-md-12">
                <div className="input-item">
                  <label className="h6">Number of Parking</label>
                  <input
                    type="number"
                    placeholder="0"
                    onChange={(e) => setNoOfSpacesCommercial(e.target.value)}
                    value={noOfSpacesCommercial}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* common residential feature tag */}
        {propertyType?.value === "residential" && (
          <div className="row">
            <div className="col-md-12">
              <div className="input-item">
                <label className="h6">Outdoor Spaces</label>
                <div>
                  {OUTDOOR_SPACES_OPTIONS.map((option) => (
                    <div key={option.value}>
                      <label>
                        <input
                          type="checkbox"
                          value={option.value}
                          checked={outdoorSpaces.includes(option.value)}
                          onChange={(e) => handleOutdoorSpacesChange(e)}
                        />
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="input-item">
                <label className="h6">Number of Bathrooms</label>
                <input
                  type="number"
                  placeholder="0"
                  onChange={(e) => setNoOfBathrooms(e.target.value)}
                  value={noOfBathrooms}
                />
              </div>
            </div>
            <div className="col-md-12">
              <div className="input-item">
                <label className="h6">Furnished</label>
                <div className="input-item">
                  <Select
                    classNamePrefix="custom-select"
                    options={FURNISHED_OPTIONS}
                    onChange={(selectedOption) =>
                      setFurnished(selectedOption ? selectedOption.value : "")
                    }
                    value={FURNISHED_OPTIONS.find(
                      (option) => option.value === furnished
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="input-item">
                <label className="h6">Parking</label>
                <div>
                  <label className="p-2">
                    <input
                      type="radio"
                      name="parkingFacility"
                      value="yes"
                      checked={parkingFacility === "yes"}
                      onChange={(e) => setParkingFacility(e.target.value)}
                    />{" "}
                    Yes
                  </label>
                  <label className="p-2">
                    <input
                      type="radio"
                      name="parkingFacility"
                      value="no"
                      checked={parkingFacility === "no"}
                      onChange={(e) => setParkingFacility(e.target.value)}
                    />{" "}
                    No
                  </label>
                </div>
              </div>
            </div>

            {parkingFacility === "yes" && (
              <div className="col-md-12">
                <div className="input-item">
                  <label className="h6">Parking Type</label>
                  <div className="input-item">
                    <Select
                      classNamePrefix="custom-select"
                      options={PARKING_OPTION_TYPES}
                      onChange={(selectedOption) =>
                        setParkingType(
                          selectedOption ? selectedOption.value : ""
                        )
                      }
                      value={PARKING_OPTION_TYPES.find(
                        (option) => option.value === parkingType
                      )}
                    />
                  </div>
                </div>
                {parkingType === "Garage/Carport" && (
                  <div className="col-md-12">
                    <div className="input-item">
                      <label className="h6">Number of Parking</label>
                      <input
                        type="number"
                        placeholder="0"
                        onChange={(e) => setGarageSpaces(e.target.value)}
                        value={garageSpaces}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Common Features */}
        <div className="row">
          <div className="col-md-12">
            <div className="input-item">
              <label className="h6">Security Features</label>
              <div className="input-group">
                <label className="p-2">
                  <input
                    type="radio"
                    value="yes"
                    checked={securityFeatures === "yes"}
                    onChange={(e) => setSecurityFeatures(e.target.value)}
                  />{" "}
                  Yes
                </label>
                <label className="p-2">
                  <input
                    type="radio"
                    value="no"
                    checked={securityFeatures === "no"}
                    onChange={(e) => setSecurityFeatures(e.target.value)}
                  />{" "}
                  No
                </label>
              </div>
            </div>
          </div>

          {securityFeatures === "yes" && (
            <div className="col-md-12">
              <div className="input-item">
                <label className="h6">Alaram/Camera</label>
                <div className="input-item">
                  <Select
                    classNamePrefix="custom-select"
                    options={SECURITY_FEATURES_OPTIONS}
                    onChange={(selectedOption) =>
                      setAlaramCameraB(
                        selectedOption ? selectedOption.value : ""
                      )
                    }
                    value={SECURITY_FEATURES_OPTIONS.find(
                      (option) => option.value === alaramCameraB
                    )}
                  />
                </div>
              </div>
            </div>
          )}
          <div className="col-md-12">
            <div className="input-item">
              <label className="h6">Disability Access</label>
              <div className="input-group">
                <div className="p-2">
                  <input
                    type="radio"
                    value="yes"
                    name="disabilityAccess"
                    checked={disabilityAccess === "yes"}
                    onChange={(e) => setDisabilityAccess(e.target.value)}
                  />
                  <label htmlFor="yes">Yes</label>
                </div>

                <div className="p-2">
                  <input
                    type="radio"
                    value="no"
                    name="disabilityAccess"
                    checked={disabilityAccess === "no"}
                    onChange={(e) => setDisabilityAccess(e.target.value)}
                  />
                  <label htmlFor="no">No</label>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-12">
            <div className="input-item">
              <label className="h6">Public Transport</label>
              <div>
                <label className="p-2">
                  <input
                    type="radio"
                    name="publicTransport"
                    value="yes"
                    checked={publicTransport === "yes"}
                    onChange={(e) => setPublicTransport(e.target.value)}
                  />{" "}
                  Yes
                </label>
                <label className="p-2">
                  <input
                    type="radio"
                    name="publicTransport"
                    value="no"
                    checked={publicTransport === "no"}
                    onChange={(e) => setPublicTransport(e.target.value)}
                  />{" "}
                  No
                </label>
              </div>
            </div>
          </div>

          <div className="col-md-12">
            <div className="input-item">
              <label className="h6">Year Built</label>
              <input
                type="number"
                placeholder="0"
                onChange={(e) => setYearBuilt(e.target.value)}
                value={yearBuilt}
              />
            </div>
          </div>
          <div className="col-md-12">
            <div className="input-item">
              <label className="h6">Condition</label>
              <div className="input-item">
                <Select
                  classNamePrefix="custom-select"
                  options={CONDITION_OPTIONS}
                  onChange={(selectedOption) =>
                    setCondition(selectedOption ? selectedOption.value : "")
                  }
                  value={CONDITION_OPTIONS.find(
                    (option) => option.value === condition
                  )}
                />
              </div>
            </div>
          </div>
          <div className="col-md-12">
            <div className="input-item">
              <label className="h6">Availability Date</label>
              <input
                type="date"
                value={availabilityDate}
                onChange={(e) => setAvailabilityDate(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-12">
            <div className="input-item">
              <label className="h6">Additional Features</label>
              <textarea
                className="mb-custom"
                value={additionalFeatures}
                placeholder="Additional Features"
                onChange={(e) => setAdditionalFeatures(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Permit Number and QR Code for Dubai properties */}
        {userFullUser.cityName === "Dubai" &&
          userFullUser.countryName === "United Arab Emirates" &&
          jobTitle === "developer" && (
            <div className="row">
              <div className="col-md-12">
                <div className="input-item">
                  <label className="h6">Permit Number *</label>
                  <input
                    type="text"
                    className="form-control" // Ensure consistent class usage for styling
                    value={permitNumber}
                    placeholder="Enter Permit Number"
                    onChange={(e) => setPermitNumber(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          )}

        <LocationForm
          address={address}
          setAddress={setAddress}
          city={city}
          setCity={setCity}
          postalCode={postalCode}
          setPostalCode={setPostalCode}
          region={region}
          setRegion={setRegion}
          latitude={latitude}
          longitude={longitude}
          setLatitude={setLatitude}
          setLongitude={setLongitude}
        />

        {userDetail.agent.agentType !== AGENT_TYPE.STAFF && (
          <div className="row">
            <div className="col-md-12">
              <div className="input-item">
                <label className="h6">Allotted To</label>
                <div className="input-item ltn__z-index-99">
                  <Select
                    classNamePrefix="custom-select"
                    isMulti
                    options={users}
                    onChange={(e) => setAllotedToUsers(e)}
                    value={allotedToUsers}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <br />
        <div className="row">
          <div className="col-md-12">
            {!id && (
              <div className="alert alert-warning mb-btn" role="alert">
                {" "}
                Add Images/Documents by clicking Next button{" "}
              </div>
            )}
            <button
              disabled={loading}
              type="submit"
              className="btn theme-btn-1 btn-effect-1 text-uppercase ltn__z-index-m-1"
            >
              {loading ? (
                <div className="lds-ring">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              ) : id ? (
                "Update Property"
              ) : (
                "Next"
              )}
            </button>
          </div>
        </div>
      </form>

      {id && (
        <div className="row mb-50">
          {userFullUser.cityName === "Dubai" &&
            userFullUser.countryName === "United Arab Emirates" && (
              <UploadQrCode
                propertyId={id}
                onQrCodeUploadSuccess={handleQrCodeUploadSuccess}
                onUploadSuccess={props.responseHandler}
              />
            )}
          <UploadFeaturedImage
            propertyId={id} // This might be undefined if adding a new property
            selectedFeatureImage={featuredImage}
            onImageSelect={handleImageSelect}
            setProperty={setPropertyDetails}
            onUploadSuccess={props.responseHandler}
          />
          <UploadVirtualTour
            propertyId={id}
            onUploadSuccess={props.responseHandler}
          />
          <UploadPropertyImage
            id={id}
            images={propertyImages}
            responseHandler={props.responseHandler}
            onUploadSuccess={props.responseHandler}
          />
          <UploadPropertyDocument
            id={id}
            documents={propertyDocuments}
            responseHandler={props.responseHandler}
          />
        </div>
      )}
    </React.Fragment>
  );
}
