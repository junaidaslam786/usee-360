import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import Layout from "./layouts/layout";
import UploadPropertyImage from "./properties/upload-property-image";
import UploadPropertyDocument from "./properties/upload-property-document";
import ResponseHandler from '../global-components/respones-handler';
import { 
  PROPERTY_TYPES, RESIDENTIAL_PROPERTY, 
  COMMERCIAL_PROPERTY, PROPERTY_CATEGORY_TYPES, 
  PRICE_TYPE, UNITS, BEDROOMS 
} from '../../constants';

export default function AddProperty(props) {
  const token = JSON.parse(localStorage.getItem("agentToken"));
  const [categoryFields, setCategoryFields] = useState([]);

  const [id, setId] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState();
  const [propertyType, setPropertyType] = useState("");
  const [propertySubType, setPropertySubType] = useState("");
  const [propertyCategoryType, setPropertyCategoryType] = useState();
  const [priceType, setPriceType] = useState();
  const [unit, setUnit] = useState();
  const [area, setArea] = useState(0);
  const [bedrooms, setBedrooms] = useState();
  const [featuredImage, setFeaturedImage] = useState(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState(null);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [region, setRegion] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [propertyImages, setPropertyImages] = useState([]);
  const [propertyDocuments, setPropertyDocuments] = useState([]);
  // const [allotedToUsers, setAllotedToUsers] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState();
  const [virtualTourType, setVirtualTourType] = useState("");
  const [virtualTourVideo, setVirtualTourVideo] = useState("");
  const [virtualTourUrl, setVirtualTourUrl] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [success, setSuccess] = useState(null);
  const [propertySubTypeOptions, setPropertySubTypeOptions] = useState(null);
  const [deedTitle, setDeedTitle] = useState("");
  const [userJobTitle, setUserJobTitle] = useState("");
  // const [users, setUsers] = useState([]);
  const history = useHistory();

  const loadCategoryFields = async () => {
    return fetch(`${process.env.REACT_APP_API_URL}/category/1`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((data) => data.json());
  };

  const getUser = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/user/profile`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const jsonData = await response.json();
    if (jsonData?.agent?.jobTitle) {
      setUserJobTitle(jsonData.agent.jobTitle);
    }
  };

  // const loadUsersToAllocate = async () => {
  //   const response = await fetch(`${process.env.REACT_APP_API_URL}/agent/user/to-allocate`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token}`,
  //     },
  //   }).then((data) => data.json());
  //   if (response) {
  //     const formattedUsers = response.map((userDetail) => {
  //       return {
  //         label: `${userDetail.user.firstName} ${userDetail.user.lastName}`,
  //         value: userDetail.userId
  //       }
  //     });
  //     // setUsers(formattedUsers);

  //     return formattedUsers;
  //   }

  //   return true;
  // };

  const loadPropertyFields = async (propertyId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/property/${propertyId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((data) => data.json());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title | !price | !propertyType | !propertyCategoryType) {
      setErrorHandler("Fill all required fields");
      return;
    }

    let apiUrl = "create";
    let successMsg = "Property created successfully.";

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
    formdata.append("deedTitle", setDeedTitle);

    let virtualTourTypeVar = virtualTourType;
    let virtualTourUrlVar = virtualTourUrl;
    let virtualTourVideoVar = virtualTourVideo;

    if (virtualTourTypeVar == "video") {
      virtualTourUrlVar = "";
      setIsChecked(false);
    } else if (virtualTourTypeVar == "url") {
      virtualTourVideoVar = "";
      setIsChecked(false);
    } else {
      virtualTourTypeVar = "slideshow";
      setVirtualTourType(virtualTourTypeVar);
      virtualTourUrlVar = "";
      virtualTourVideoVar = "";
      setIsChecked(true);
    }

    formdata.append("virtualTourType", virtualTourTypeVar);
    formdata.append("virtualTourVideo", virtualTourVideoVar);
    formdata.append("virtualTourUrl", virtualTourUrlVar);

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

    // if (allotedToUsers.length > 0) {
    //   for (let i = 0; i < allotedToUsers.length; i++) {
    //     formdata.append(`allocatedUser[${i}]`, allotedToUsers[i].value);
    //   }
    // }

    setLoading(true);
    let formResponse = null;
    if (apiUrl == "update") {
      formResponse = await axios
        .put(`${process.env.REACT_APP_API_URL}/property/${apiUrl}`, formdata, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          if (response?.status !== 200) {
            setErrorHandler(
              "Unable to update property, please try again later"
            );
          }

          return response.data;
        })
        .catch((error) => {
          console.log("update-property-error", error);
          if (error?.response?.data?.errors) {
            setErrorHandler(error.response.data.errors, "error", true);
          } else if (error?.response?.data?.message) {
            setErrorHandler(error.response.data.message);
          } else {
            setErrorHandler(
              "Unable to update property, please try again later"
            );
          }
        });
    } else {
      formResponse = await axios
        .post(`${process.env.REACT_APP_API_URL}/property/${apiUrl}`, formdata, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          if (response?.status !== 201) {
            setErrorHandler(
              "Unable to create property, please try again later"
            );
          }

          // console.log("create-property-response", response);

          return response.data;
        })
        .catch((error) => {
          console.log("create-property-error", error);
          if (error?.response?.data?.errors) {
            setErrorHandler(error.response.data.errors, "error", true);
          } else if (error?.response?.data?.message) {
            setErrorHandler(error.response.data.message);
          } else {
            setErrorHandler(
              "Unable to create property, please try again later"
            );
          }
        });
    }

    setLoading(false);
    if (formResponse) {
      setFeaturedImage(null);
      setVirtualTourVideo(null);
      setSuccessHandler(successMsg);
      if (apiUrl === "create") {
        setFeaturedImagePreview(null);
      }

      setTimeout(() => {
        if (formResponse?.id) {
          history.push(`/agent/edit-property/${formResponse.id}`);
        }
      }, 3000);
    }
  };

  const checkHandler = () => {
    setIsChecked(!isChecked);
  };

  const vrTourUrlHandler = (e) => {
    setVirtualTourType("url");
    setVirtualTourUrl(e);
  };

  const vrTourVideoHandler = (e) => {
    setVirtualTourType("video");
    setVirtualTourVideo(e);
  };

  const setPropertyCategoryTypeHandler = (e) => {
    setPropertyCategoryType(e);
  };

  const setPropertyTypeHandler = (e) => {
    setPropertyType(e);
    setPropertySubType("");
  };

  const onFeaturedImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setFeaturedImage(event.target.files[0]);
      setFeaturedImagePreview(URL.createObjectURL(event.target.files[0]));
    }
  };

  const setAddressFields = (place) => {
    place.address_components.forEach((addressPart) => {
      if (addressPart.types.includes("postal_code"))
        setPostalCode(addressPart.long_name);

      if (addressPart.types.includes("country"))
        setRegion(addressPart.long_name);

      if (addressPart.types.includes("locality"))
        setCity(addressPart.long_name);
    });

    setLatitude(place.geometry.location.lat());
    setLongitude(place.geometry.location.lng());
  };

  const setErrorHandler = (msg, param = "form", fullError = false) => {
    setErrors(fullError ? msg : [{ msg, param }]);
    setTimeout(() => {
      setErrors([]);
    }, 3000);
    setSuccess("");
  };

  const setSuccessHandler = (msg) => {
    setSuccess(msg);
    setTimeout(() => {
      setSuccess("");
    }, 3000);

    setErrors([]);
  };

  useEffect(() => {
    const fetchCategoryFields = async () => {
      const response = await loadCategoryFields();
      if (response) setCategoryFields(response.categoryFields);
    };

    const fetchUserFields = async () => {
      await getUser();
    };

    // const fetchUsersToAllocate = async () => {
    //   await loadUsersToAllocate();
    // }

    fetchUserFields();
    fetchCategoryFields();
    // fetchUsersToAllocate();

    const map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: 24.466667, lng: 54.366669 },
      zoom: 17,
    });

    setMap(map);

    const marker = new window.google.maps.Marker({
      position: map.getCenter(),
      map,
      draggable: true,
    });

    setMarker(marker);

    const autocomplete = new window.google.maps.places.Autocomplete(
      document.getElementById("autocomplete")
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }

      setAddress(place.formatted_address);
      setAddressFields(place);
      map.setCenter(place.geometry.location);
      map.setZoom(17);

      marker.setPosition(place.geometry.location);
    });

    marker.addListener("dragend", () => {
      const position = marker.getPosition();
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: position }, (results, status) => {
        if (status === "OK") {
          setAddressFields(results[0]);
          if (results[0]) {
            setAddress(results[0].formatted_address);
          }
        }
      });
    });
  }, []);

  useEffect(() => {
    if (props?.id) {
      setId(props.id);

      const fetchPropertyDetails = async () => {
        // const usersArray = await loadUsersToAllocate();

        const response = await loadPropertyFields(props.id);
        if (response) {
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
            response.productMetaTags.sort((a,b) => a.categoryField.id - b.categoryField.id);
            let responsePropertyType;
            let responsePropertyCategoryType;
            response.productMetaTags.forEach((metaTag) => {
              switch (metaTag.categoryField.id) {
                case 1:
                  responsePropertyType = PROPERTY_TYPES.find(
                    (property) => property.value == metaTag.value
                  );

                  setPropertyType(responsePropertyType);
                  break;
                case 2:
                  responsePropertyCategoryType = PROPERTY_CATEGORY_TYPES.find(
                    (category) => category.value == metaTag.value
                  );

                  setPropertyCategoryType(responsePropertyCategoryType);
                  break;
                case 3:
                  setUnit(
                    UNITS.find((unit) => unit.value == metaTag.value)
                  );
                  break;
                case 4:
                  setArea(metaTag.value);
                  break;
                case 5:
                  setBedrooms(
                    BEDROOMS.find(
                      (bedroom) => bedroom.value == metaTag.value
                    )
                  );
                  break;
                case 6:
                  if (responsePropertyType && responsePropertyType.value === 'residential') {
                    setPropertySubType(RESIDENTIAL_PROPERTY.find(
                      (subType) => subType.value == metaTag.value
                    ));
                  }

                  break;
                case 7:
                  if (responsePropertyType && responsePropertyType.value === 'commercial') {
                    setPropertySubType(COMMERCIAL_PROPERTY.find(
                      (subType) => subType.value == metaTag.value
                    ));
                  }

                  break;
                case 8:
                  if (responsePropertyCategoryType && responsePropertyCategoryType.value === 'rent') {
                    setPriceType(PRICE_TYPE.find(
                      (priceType) => priceType.value == metaTag.value
                    ));
                  }

                  break;
                case 9:
                  setDeedTitle(metaTag.value);
                  break;
              }
            });
          }

          if (response.productImages) {
            setPropertyImages(response.productImages);
          }

          if (response.productDocuments) {
            setPropertyDocuments(response.productDocuments);
          }

          // if (response.productAllocations.length > 0) {
          //   const newAllotedUsers = [];
          //   response.productAllocations.forEach((productAllocation => {
          //     newAllotedUsers.push(usersArray.find((user) => user.value == productAllocation.user.id));
          //   }));
          //   setAllotedToUsers(newAllotedUsers);
          // }
        }
      };

      fetchPropertyDetails();
    }
  }, [props.id]);

  useEffect(() => {
    setPropertySubTypeOptions(propertyType?.value == 'residential' ? RESIDENTIAL_PROPERTY : COMMERCIAL_PROPERTY);
  }, [propertyType]);

  return (
    <Layout>
      <form encType="multipart/form-data" onSubmit={handleSubmit} className="ltn__myaccount-tab-content-inner mb-50">
        <ResponseHandler errors={errors} success={success}/>
        <h4 className="title-2">Property Description</h4>
        <div className="row mb-50">
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
              <label>Description</label>
              <textarea
                value={description}
                placeholder="Description"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          {
            userJobTitle && userJobTitle === 'landlord' && (
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
            )
          }
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
          {
            propertyCategoryType?.value === 'rent' && (
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
                  required
                />
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="input-item">
              <label>Area</label>
              <input
                min="1"
                type="number"
                placeholder="0"
                onChange={(e) => setArea(e.target.value)}
                value={area}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="input-item">
              <label>Unit</label>
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
        <h4 className="title-2">Featured Image</h4>
        <div className="row mb-50">
          <div className="col-md-12">
            <div className="input-item">
              <input
                type="file"
                className="btn theme-btn-3 mb-10 positionRevert"
                onChange={onFeaturedImageChange}
              />
              <br />
              <p>
                <small>
                  * At least 1 image is required for a valid submission. Minimum
                  size is 500/500px.
                </small>
                <br />
                <small>* Supports JPG, JPEG and PNG formats.</small>
                <br />
                <small>* Images might take longer to be processed.</small>
              </p>
            </div>
            {featuredImagePreview && (
              <img
                className="featuredImageCss"
                src={featuredImagePreview}
                alt={title}
                width="300px"
              />
            )}
          </div>
        </div>
        <h4 className="title-2">Upload VR Tour</h4>
        <div className="row mb-50">
          <div className="col-md-12">
            <div className="input-item">
              <input
                type="file"
                className="btn theme-btn-3 mb-10"
                onChange={(e) => vrTourVideoHandler(e.target.files[0])}
              />
            </div>
          </div>
          <h5 className="mt-10">OR</h5>
          <div className="col-md-12">
            <div className="input-item">
              <input
                type="text"
                placeholder="Property VR URL"
                value={virtualTourUrl}
                onChange={(e) => vrTourUrlHandler(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-12 mb-30">
            <label className="checkbox-item">
              Use the images to create a video slideshow instead of using
              virtual tour
              <input
                type="checkbox"
                checked={isChecked}
                onChange={checkHandler}
              />
              <span className="checkmark" />
            </label>
          </div>
        </div>
        <h6>Listing Location</h6>
        <div className="row">
          <div className="col-md-12">
            <div className="input-item input-item-textarea ltn__custom-icon">
              <input
                type="text"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                id="autocomplete"
                name="ltn__name"
                placeholder="*Address"
              />
            </div>
          </div>
          <div className="col-lg-12">
            <div className="property-details-google-map mb-60">
              <div id="map" style={{ height: "400px", width: "100%" }} />
            </div>
          </div>
          <div className="col-md-6">
            <div className="input-item input-item-textarea ltn__custom-icon">
              <input
                type="text"
                value={city}
                name="ltn__name"
                onChange={(event) => {
                  setCity(event.target.value);
                }}
                placeholder="City"
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="input-item input-item-textarea ltn__custom-icon">
              <input
                type="text"
                value={postalCode}
                name="ltn__name"
                onChange={(event) => {
                  setPostalCode(event.target.value);
                }}
                placeholder="Postal Code"
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="input-item input-item-textarea ltn__custom-icon">
              <input
                type="text"
                value={region}
                name="ltn__name"
                onChange={(event) => {
                  setRegion(event.target.value);
                }}
                placeholder="Region"
              />
            </div>
          </div>
        </div>
        {/* <div className="row">
          <div className="col-md-12">
            <div className="input-item">
              <label>Allotted To *</label>
              <div className="input-item ltn__z-index-99">
                <Select 
                  isMulti
                  options={users} 
                  onChange={(e) => setAllotedToUsers(e)}
                  value={allotedToUsers}
                  required
                />
              </div>
            </div>
          </div>
        </div> */}
        <br />
        
        <ResponseHandler errors={errors} success={success}/>
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
          ) : (
            "Submit"
          )}
        </button>
      </form>
      {id && (
        <div className="row mb-50">
          <UploadPropertyImage id={id} images={propertyImages} />
          <UploadPropertyDocument id={id} documents={propertyDocuments} />
        </div>
      )}
    </Layout>
  );
}
