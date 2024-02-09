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
  // console.log("userDetail", userDetail);

  const [id, setId] = useStateIfMounted();
  const [title, setTitle] = useStateIfMounted("");
  const [description, setDescription] = useStateIfMounted("");
  const [price, setPrice] = useStateIfMounted();
  const [propertyType, setPropertyType] = useStateIfMounted("");
  // const [selectedImage, setSelectedImage] = useStateIfMounted(null);
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

    // if (qrCode) {
    //   formdata.append("qrCode", qrCode);
    // }
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

        {/* Permit Number and QR Code for Dubai properties */}
        {userFullUser.cityName === "Dubai" &&
          userFullUser.countryName === "United Arab Emirates" &&  jobTitle === "developer" && (
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
