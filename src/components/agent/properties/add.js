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
import { getUserDetailsFromJwt, setPropertyMetaData } from "../../../utils";
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
  const [map, setMap] = useStateIfMounted(null);
  const [marker, setMarker] = useStateIfMounted(null);
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
  const [conferenceRoom, setConferenceRoom] = useStateIfMounted(false);
  const [capacity, setCapacity] = useStateIfMounted("");
  const [kitchen, setKitchen] = useStateIfMounted("");
  const [store, setStore] = useStateIfMounted("");
  const [foordCourt, setFoodCourt] = useStateIfMounted(false);
  const [restRoom, setRestRoom] = useStateIfMounted(false);
  const [pools, setPools] = useStateIfMounted("");
  const [poolType, setPoolType] = useStateIfMounted("");
  const [hotelRoom, setHotelRoom] = useStateIfMounted("");
  const [areaBar, setAreaBar] = useStateIfMounted(0);
  const [loungeArea, setLoungeArea] = useStateIfMounted(0);
  const [capacityOfVip, setCapacityOfVip] = useStateIfMounted(0);
  const [noOfDanceFloor, setNoOfDanceFloor] = useStateIfMounted(0);
  const [noOfPrivateRooms, setNoOfPrivateRooms] = useStateIfMounted(0);

  const [kitchenArea, setKitchenArea] = useStateIfMounted(0);
  const [outdoorSeating, setOutdoorSeating] = useStateIfMounted(false);
  const [outdoorSeatingArea, setOutdoorSeatingArea] = useStateIfMounted(0);

  const [roomSize, setRoomSize] = useStateIfMounted(0);
  const [noOfBeds, setNoOfBeds] = useStateIfMounted(0);
  const [roomType, setRoomType] = useStateIfMounted("");
  const [floorLevel, setFloorLevel] = useStateIfMounted(0);
  const [view, setView] = useStateIfMounted("");
  const [balcony, setBalcony] = useStateIfMounted(false);

  const [displayWindowArea, setDisplayWindowArea] = useStateIfMounted(0);
  const [displayWindow, setDisplayWindow] = useStateIfMounted("");

  const [residentialFloorLevel, setResidentialFloorLevel] =
    useStateIfMounted(0);
  const [buildingAmenities, setBuildingAmenities] = useStateIfMounted([]);

  const [fireplace, setFireplace] = useStateIfMounted(false);
  const [woodBurning, setWoodBurning] = useStateIfMounted(false);
  const [gas, setGas] = useStateIfMounted(false);
  const [noOfFloors, setNoOfFloors] = useStateIfMounted(0);
  const [basement, setBasement] = useStateIfMounted(false);
  const [residentialKitchen, setResidentialKitchen] = useStateIfMounted("");

  // common tags useState
  const [securityFeatures, setSecurityFeatures] = useStateIfMounted(false);
  const [alaramCameraB, setAlaramCameraB] = useStateIfMounted("");
  const [disabilityAccess, setDisabilityAccess] = useStateIfMounted(false);
  const [publicTransport, setPublicTransport] = useStateIfMounted(false);
  const [yearBuilt, setYearBuilt] = useStateIfMounted("");
  const [condition, setCondition] = useStateIfMounted("");
  const [availabilityDate, setAvailabilityDate] = useStateIfMounted("");
  const [additionalFeatures, setAdditionalFeatures] = useStateIfMounted("");

  const [petFreindliness, setPetFreindliness] = useStateIfMounted(false);
  const [commercialParking, setCommercialParking] = useStateIfMounted(false);
  const [noOfSpacesCommercial, setNoOfSpacesCommercial] = useStateIfMounted(0);

  const [outdoorSpaces, setOutdoorSpaces] = useStateIfMounted(false);
  const [noOfBathrooms, setNoOfBathrooms] = useStateIfMounted(0);
  const [furnished, setFurnished] = useStateIfMounted(false);
  const [parkingResidential, setParkingResidential] = useStateIfMounted(false);
  const [parkingType, setParkingType] = useStateIfMounted("");
  const [garageSpaces, setGarageSpaces] = useStateIfMounted(0);

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
    const apiUrl = id ? "/update" : "/create";
    const successMsg = id
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

    if (propertyType?.value) {
      formdata.append("metaTags[1]", propertyType.value);
      if (propertyType.value == "commercial" && propertySubType?.value) {
        formdata.append("metaTags[7]", propertySubType.value);
      } else if (
        propertyType.value == "residential" &&
        propertySubType?.value
      ) {
        formdata.append("metaTags[6]", propertySubType.value);
      }
    }

    if (propertyCategoryType) {
      formdata.append("metaTags[2]", propertyCategoryType.value);
      if (propertyCategoryType?.value === "rent" && priceType?.value) {
        formdata.append("metaTags[8]", priceType.value);
      }
    }

    if (unit?.value) {
      formdata.append("metaTags[3]", unit.value);
    }

    if (area) {
      formdata.append("metaTags[4]", area);
    }

    if (bedrooms?.value) {
      formdata.append("metaTags[5]", bedrooms.value);
    }

    if (deedTitle) {
      formdata.append("metaTags[9]", deedTitle);
    }

    // Append new fields with checks
    if (propertyType?.value === "commercial") {
      switch (propertySubType?.value) {
        case "office":
          formdata.append("metaTags[10]", layout);
          formdata.append("metaTags[11]", conferenceRoom);
          if (conferenceRoom === "yes") {
            formdata.append("metaTags[12]", capacity);
          }
          formdata.append("metaTags[13]", kitchen);
          break;
        case "shopping_center":
          formdata.append("metaTags[17]", store);
          formdata.append("metaTags[18]", foordCourt);
          formdata.append("metaTags[19]", restRoom);
          break;
        case "hotels":
          formdata.append("metaTags[20]", pools);
          formdata.append("metaTags[21]", poolType);
          formdata.append("metaTags[22]", hotelRoom);
          break;
        case "club":
          formdata.append("metaTags[23]", areaBar);
          formdata.append("metaTags[24]", loungeArea);
          formdata.append("metaTags[25]", capacityOfVip);
          formdata.append("metaTags[26]", noOfDanceFloor);
          formdata.append("metaTags[27]", noOfPrivateRooms);
          break;
        case "restaurant":
          formdata.append("metaTags[28]", kitchenArea);
          formdata.append("metaTags[29]", outdoorSeating);
          if (outdoorSeating === "yes") {
            formdata.append("metaTags[30]", outdoorSeatingArea);
          }
          break;
        case "hotel_room":
          formdata.append("metaTags[31]", roomSize);
          formdata.append("metaTags[32]", noOfBeds);
          formdata.append("metaTags[33]", roomType);
          formdata.append("metaTags[34]", floorLevel);
          formdata.append("metaTags[35]", view);
          formdata.append("metaTags[36]", balcony);
          break;
        case "retail":
        case "shop":
        case "store":
          formdata.append("metaTags[14]", displayWindowArea);
          formdata.append("metaTags[15]", displayWindow);
          break;
      }

      // Common commercial tags
      formdata.append("metaTags[46]", petFreindliness);
      formdata.append("metaTags[40]", commercialParking);
      if (commercialParking === "yes") {
        formdata.append("metaTags[41]", noOfSpacesCommercial);
      }
    }

    if (propertyType?.value === "residential") {
      switch (propertySubType?.value) {
        case "apartment":
        case "studio":
        case "room":
          // Fields common to apartment, studio, and room
          formdata.append(
            "metaTags[residentialFloorLevel]",
            residentialFloorLevel
          );
          if (buildingAmenities.length > 0) {
            buildingAmenities.forEach((amenity, index) => {
              formdata.append(`metaTags[48][${index}]`, amenity);
            });
          }
          break;
        case "house":
        case "bungalow":
        case "duplex":
        case "triplex":
        case "cottage":
          // Fields specific to house, bungalow, duplex, triplex, cottage
          formdata.append("metaTags[49]", fireplace);
          if (fireplace === "yes") {
            formdata.append("metaTags[50]", woodBurning);
          }
          formdata.append("metaTags[51]", noOfFloors);
          formdata.append("metaTags[52]", basement);
          formdata.append("metaTags[13]", residentialKitchen);
          break;
        // Add more cases for other residential subtypes as needed
      }

      // Common residential tags
      formdata.append("metaTags[outdoorSpaces]", outdoorSpaces);
      formdata.append("metaTags[noOfBathrooms]", noOfBathrooms);
      formdata.append("metaTags[furnished]", furnished);
      formdata.append("metaTags[53]", parkingResidential);
      if (parkingResidential === "yes") {
        formdata.append("metaTags[54]", parkingType);
      }
    }

    // Common fields for both types
    formdata.append("metaTags[37]", securityFeatures);
    if (securityFeatures === "yes") {
      formdata.append("metaTags[38]", alaramCameraB);
    }
    formdata.append("metaTags[39]", disabilityAccess);
    formdata.append("metaTags[42]", publicTransport);
    formdata.append("metaTags[43]", yearBuilt);
    formdata.append("metaTags[44]", condition);
    formdata.append("metaTags[45]", availabilityDate);
    formdata.append("metaTags[47]", additionalFeatures);

    if (id) {
      apiUrl = "update";
      formdata.append("productId", id);
      successMsg = "Property updated successfully.";
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
      const formResponse = await PropertyService[
        apiUrl === "/update" ? "update" : "add"
      ](formdata);

      setLoading(false);

      if (formResponse?.error) {
        props.responseHandler([formResponse.message || "An error occurred."]);
        return;
      }

      if (!id && formResponse?.id) {
        // Check if creating a new property and response includes an ID
        setId(formResponse.id); // Update the `id` state
        toast.success(successMsg);
        // No need to redirect here; just update the state
      }

      // Redirect after success
      if (id) {
        setTimeout(() => {
          if (formResponse?.id) {
            history.push(`/agent/edit-property/${formResponse.id}`);
          }
        }, 2000);
      }
    } catch (error) {
      props.responseHandler([
        "An error occurred while processing your request.",
      ]);
      setLoading(false);
    }
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

          if (response.productMetaTags.length > 0) {
            response.productMetaTags.sort(
              (a, b) => a.categoryField.id - b.categoryField.id
            );

            const {
              typeMetaTag,
              categoryTypeMetaTag,
              unitMetaTag,
              areaMetaTag,
              bedroomsMetaTag,
              subTypeMetaTag,
              priceTypeMetaTag,
              deedTitleMetaTag,
            } = setPropertyMetaData(response.productMetaTags);
            setPropertyType(typeMetaTag);
            setPropertyCategoryType(categoryTypeMetaTag);
            setUnit(unitMetaTag);
            setArea(areaMetaTag);
            setBedrooms(bedroomsMetaTag);
            setPropertySubType(subTypeMetaTag);
            setPriceType(priceTypeMetaTag);
            setDeedTitle(deedTitleMetaTag);
            setPermitNumber(response.permitNumber);
            setQrCode(response.qrCode);
          }

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
  }, [params.id]);

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
              <label>Property Type *</label>
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
              <label>Property Sub Type *</label>
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
              <label>Property Category Type *</label>
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
              <label>
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
              <label>Description*</label>
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
                <label> Deed Title *</label>
                <input
                  type="text"
                  value={deedTitle}
                  placeholder="Deed Title"
                  onChange={(e) => setDeedTitle(e.target.value)}
                  required
                />
              </div>
            </div>
          )}
          <div className="col-md-12">
            <div className="input-item">
              <label>Price *</label>
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
                <label>Price Type</label>
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
              <label>No. of bedrooms</label>
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
              <label>Area *</label>
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
              <label>Unit *</label>
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
                  <label>Layout</label>
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
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="input-item">
                  <label>Conference Room</label>
                  <div className="input-item">
                    <Select
                      classNamePrefix="custom-select"
                      options={YES_NO_OPTIONS}
                      onChange={(selectedOption) =>
                        setConferenceRoom(
                          selectedOption ? selectedOption.value : ""
                        )
                      }
                      value={YES_NO_OPTIONS.find(
                        (option) => option.value === conferenceRoom
                      )}
                      required
                    />
                  </div>
                </div>
              </div>
              {conferenceRoom === "yes" && (
                <div className="col-md-12">
                  <div className="input-item">
                    <label>Capacity</label>
                    <input
                      type="number"
                      placeholder="0"
                      onChange={(e) => setCapacity(e.target.value)}
                      value={capacity}
                      required
                    />
                  </div>
                </div>
              )}
              <div className="col-md-12">
                <div className="input-item">
                  <label>Kitchen</label>
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
                      required
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
                  <label>Number of Stores</label>
                  <div className="input-item">
                    <input
                      type="number"
                      placeholder="0"
                      onChange={(e) => setStore(e.target.value)}
                      value={store}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="input-item">
                  <label>Food Court</label>
                  <div className="input-item">
                    <Select
                      classNamePrefix="custom-select"
                      options={YES_NO_OPTIONS}
                      onChange={(selectedOption) =>
                        setFoodCourt(selectedOption ? selectedOption.value : "")
                      }
                      value={YES_NO_OPTIONS.find(
                        (option) => option.value === foordCourt
                      )}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="input-item">
                  <label>Rest Room</label>
                  <div className="input-item">
                    <Select
                      classNamePrefix="custom-select"
                      options={YES_NO_OPTIONS}
                      onChange={(selectedOption) =>
                        setRestRoom(selectedOption ? selectedOption.value : "")
                      }
                      value={YES_NO_OPTIONS.find(
                        (option) => option.value === restRoom
                      )}
                      required
                    />
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
                  <label>Number of Pools</label>
                  <input
                    type="number"
                    placeholder="0"
                    onChange={(e) => setPools(e.target.value)}
                    value={pools}
                    required
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="input-item">
                  <label>Pool Type</label>
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
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="input-item">
                  <label>Number of Rooms</label>
                  <input
                    type="number"
                    placeholder="0"
                    onChange={(e) => setHotelRoom(e.target.value)}
                    value={hotelRoom}
                    required
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
                  <label>Area of Bar (Square Meter)</label>
                  <input
                    type="number"
                    placeholder="0"
                    onChange={(e) => setAreaBar(e.target.value)}
                    value={areaBar}
                    required
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="input-item">
                  <label>Lounge Area (Square Meter)</label>
                  <input
                    type="number"
                    placeholder="0"
                    onChange={(e) => setLoungeArea(e.target.value)}
                    value={loungeArea}
                    required
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="input-item">
                  <label>Capacity of VIP</label>
                  <input
                    type="number"
                    placeholder="0"
                    onChange={(e) => setCapacityOfVip(e.target.value)}
                    value={capacityOfVip}
                    required
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="input-item">
                  <label>Number of Dance Floor</label>
                  <input
                    type="number"
                    placeholder="0"
                    onChange={(e) => setNoOfDanceFloor(e.target.value)}
                    value={noOfDanceFloor}
                    required
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="input-item">
                  <label>Number of Private Rooms</label>
                  <input
                    type="number"
                    placeholder="0"
                    onChange={(e) => setNoOfPrivateRooms(e.target.value)}
                    value={noOfPrivateRooms}
                    required
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
                  <label>Kitchen Area (Square Meter)</label>
                  <input
                    type="number"
                    placeholder="0"
                    onChange={(e) => setKitchenArea(e.target.value)}
                    value={kitchenArea}
                    required
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="input-item">
                  <label>Outdoor Seating</label>
                  <div className="input-item">
                    <Select
                      classNamePrefix="custom-select"
                      options={YES_NO_OPTIONS}
                      onChange={(selectedOption) =>
                        setOutdoorSeating(
                          selectedOption ? selectedOption.value : ""
                        )
                      }
                      value={YES_NO_OPTIONS.find(
                        (option) => option.value === outdoorSeating
                      )}
                      required
                    />
                  </div>
                </div>
              </div>
              {outdoorSeating === "yes" && (
                <div className="col-md-12">
                  <div className="input-item">
                    <label>Outdoor Seating Area (Square Meter)</label>
                    <input
                      type="number"
                      placeholder="0"
                      onChange={(e) => setOutdoorSeatingArea(e.target.value)}
                      value={outdoorSeatingArea}
                      required
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
                  <label>Room Size (Square Meter)</label>
                  <input
                    type="number"
                    placeholder="0"
                    onChange={(e) => setRoomSize(e.target.value)}
                    value={roomSize}
                    required
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="input-item">
                  <label>Number of Beds</label>
                  <input
                    type="number"
                    placeholder="0"
                    onChange={(e) => setNoOfBeds(e.target.value)}
                    value={noOfBeds}
                    required
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="input-item">
                  <label>Room Type</label>
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
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="input-item">
                  <label>Floor Level</label>
                  <input
                    type="number"
                    placeholder="0"
                    onChange={(e) => setFloorLevel(e.target.value)}
                    value={floorLevel}
                    required
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="input-item">
                  <label>View</label>
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
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="input-item">
                  <label>Balcony/Terrace</label>
                  <div className="input-item">
                    <Select
                      classNamePrefix="custom-select"
                      options={YES_NO_OPTIONS}
                      onChange={(selectedOption) =>
                        setBalcony(selectedOption ? selectedOption.value : "")
                      }
                      value={YES_NO_OPTIONS.find(
                        (option) => option.value === balcony
                      )}
                    />
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
                  <label>Display Window Area (Square Meter)</label>
                  <input
                    type="number"
                    placeholder="0"
                    onChange={(e) => setDisplayWindowArea(e.target.value)}
                    value={displayWindowArea}
                    required
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="input-item">
                  <label>Display Window</label>
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
                      required
                    />
                  </div>
                </div>
              </div>
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
                  <label>Floor Level</label>
                  <input
                    type="number"
                    placeholder="0"
                    onChange={(e) => setResidentialFloorLevel(e.target.value)}
                    value={residentialFloorLevel}
                    required
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="input-item">
                  <label>Building Amenities</label>
                  <div className="input-item">
                    <Select
                      classNamePrefix="custom-select"
                      isMulti
                      options={BUILDING_AMENITIES_OPTIONS}
                      onChange={(selectedOptions) =>
                        setBuildingAmenities(
                          selectedOptions.map((option) => option.value)
                        )
                      }
                      value={BUILDING_AMENITIES_OPTIONS.filter((option) =>
                        buildingAmenities.includes(option.value)
                      )}
                      required
                    />
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
                  <label>Fireplace</label>
                  <div className="input-item">
                    <Select
                      classNamePrefix="custom-select"
                      options={YES_NO_OPTIONS}
                      onChange={(selectedOption) =>
                        setFireplace(selectedOption ? selectedOption.value : "")
                      }
                      value={YES_NO_OPTIONS.find(
                        (option) => option.value === fireplace
                      )}
                      required
                    />
                  </div>
                </div>
                {fireplace === "yes" && (
                  <div className="col-md-12">
                    <div className="input-item">
                      <label>Wood Burning Gas</label>
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
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="col-md-12">
                <div className="input-item">
                  <label>Number of Floors</label>
                  <input
                    type="number"
                    placeholder="0"
                    onChange={(e) => setNoOfFloors(e.target.value)}
                    value={noOfFloors}
                    required
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="input-item">
                  <label>Basement</label>
                  <div className="input-item">
                    <Select
                      classNamePrefix="custom-select"
                      options={YES_NO_OPTIONS}
                      onChange={(selectedOption) =>
                        setBasement(selectedOption ? selectedOption.value : "")
                      }
                      value={YES_NO_OPTIONS.find(
                        (option) => option.value === basement
                      )}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="input-item">
                  <label>Kitchen</label>
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
                      required
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
                <label>Pet Friendliness</label>
                <div className="input-item">
                  <Select
                    classNamePrefix="custom-select"
                    options={YES_NO_OPTIONS}
                    onChange={(selectedOption) =>
                      setPetFreindliness(
                        selectedOption ? selectedOption.value : ""
                      )
                    }
                    value={YES_NO_OPTIONS.find(
                      (option) => option.value === petFreindliness
                    )}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="input-item">
                <label>Parking Facility</label>
                <div className="input-item">
                  <Select
                    classNamePrefix="custom-select"
                    options={YES_NO_OPTIONS}
                    onChange={(selectedOption) =>
                      setCommercialParking(
                        selectedOption ? selectedOption.value : ""
                      )
                    }
                    value={YES_NO_OPTIONS.find(
                      (option) => option.value === commercialParking
                    )}
                    required
                  />
                </div>
              </div>
            </div>
            {commercialParking === "yes" && (
              <div className="col-md-12">
                <div className="input-item">
                  <label>Number of Parking</label>
                  <input
                    type="number"
                    placeholder="0"
                    onChange={(e) => setNoOfSpacesCommercial(e.target.value)}
                    value={noOfSpacesCommercial}
                    required
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
                <label>Outdoor Spaces</label>
                <div className="input-item">
                  <Select
                    classNamePrefix="custom-select"
                    options={OUTDOOR_SPACES_OPTIONS}
                    onChange={(selectedOption) =>
                      setOutdoorSpaces(
                        selectedOption ? selectedOption.value : ""
                      )
                    }
                    value={OUTDOOR_SPACES_OPTIONS.find(
                      (option) => option.value === outdoorSpaces
                    )}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="input-item">
                <label>Number of Bathrooms</label>
                <input
                  type="number"
                  placeholder="0"
                  onChange={(e) => setNoOfBathrooms(e.target.value)}
                  value={noOfBathrooms}
                  required
                />
              </div>
            </div>
            <div className="col-md-12">
              <div className="input-item">
                <label>Furnished</label>
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
                    required
                  />
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="input-item">
                <label>Parking</label>
                <div className="input-item">
                  <Select
                    classNamePrefix="custom-select"
                    options={YES_NO_OPTIONS}
                    onChange={(selectedOption) =>
                      setParkingResidential(
                        selectedOption ? selectedOption.value : ""
                      )
                    }
                    value={YES_NO_OPTIONS.find(
                      (option) => option.value === parkingResidential
                    )}
                    required
                  />
                </div>
              </div>
            </div>
            {parkingResidential === "yes" && (
              <div className="col-md-12">
                <div className="input-item">
                  <label>Parking Type</label>
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
                      required
                    />
                  </div>
                </div>
                {parkingType === "Garage/Carport" && (
                  <div className="col-md-12">
                    <div className="input-item">
                      <label>Number of Parking</label>
                      <input
                        type="number"
                        placeholder="0"
                        onChange={(e) => setGarageSpaces(e.target.value)}
                        value={garageSpaces}
                        required
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
              <label>Security Features</label>
              <div className="input-item">
                <Select
                  classNamePrefix="custom-select"
                  options={YES_NO_OPTIONS}
                  onChange={(selectedOption) =>
                    setSecurityFeatures(
                      selectedOption ? selectedOption.value : ""
                    )
                  }
                  value={YES_NO_OPTIONS.find(
                    (option) => option.value === securityFeatures
                  )}
                  required
                />
              </div>
            </div>
          </div>
          {securityFeatures === "yes" && (
            <div className="col-md-12">
              <div className="input-item">
                <label>Alaram/Camera</label>
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
                    required
                  />
                </div>
              </div>
            </div>
          )}
          <div className="col-md-12">
            <div className="input-item">
              <label>Disability Access</label>
              <div className="input-item">
                <Select
                  classNamePrefix="custom-select"
                  options={YES_NO_OPTIONS}
                  onChange={(selectedOption) =>
                    setDisabilityAccess(
                      selectedOption ? selectedOption.value : ""
                    )
                  }
                  value={YES_NO_OPTIONS.find(
                    (option) => option.value === disabilityAccess
                  )}
                  required
                />
              </div>
            </div>
          </div>

          <div className="col-md-12">
            <div className="input-item">
              <label>Public Transport</label>
              <div className="input-item">
                <Select
                  classNamePrefix="custom-select"
                  options={YES_NO_OPTIONS}
                  onChange={(selectedOption) =>
                    setPublicTransport(
                      selectedOption ? selectedOption.value : ""
                    )
                  }
                  value={YES_NO_OPTIONS.find(
                    (option) => option.value === publicTransport
                  )}
                  required
                />
              </div>
            </div>
          </div>
          <div className="col-md-12">
            <div className="input-item">
              <label>Year Built</label>
              <input
                type="number"
                placeholder="0"
                onChange={(e) => setYearBuilt(e.target.value)}
                value={yearBuilt}
                required
              />
            </div>
          </div>
          <div className="col-md-12">
            <div className="input-item">
              <label>Condition</label>
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
                  required
                />
              </div>
            </div>
          </div>
          <div className="col-md-12">
            <div className="input-item">
              <label>Availability Date</label>
              <input
                type="date"
                value={availabilityDate}
                onChange={(e) => setAvailabilityDate(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="col-md-12">
            <div className="input-item">
              <label>Additional Features</label>
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
                  <label>Permit Number *</label>
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
                <label>Allotted To</label>
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
