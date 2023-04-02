import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import Select from "react-select";
import Layout from "./layouts/layout";

export default function AddProperty(props) {
  const [categoryFields, setCategoryFields] = useState([]);

  const [id, setId] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState();
  const [propertyType, setPropertyType] = useState("");
  const [propertyCategoryType, setPropertyCategoryType] = useState();
  const [unit, setUnit] = useState();
  const [area, setArea] = useState(0);
  const [bedrooms, setBedrooms] = useState();
  const [featuredImage, setFeaturedImage] = useState(null);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [region, setRegion] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
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
  // const [users, setUsers] = useState([]);

  const onImagesDrop = useCallback((acceptedFiles) => {
    console.log("onImagesDrop", acceptedFiles);
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop: onImagesDrop,
    accept: { "image/*": [] },
  });

  const token = JSON.parse(sessionStorage.getItem("agentToken"));

  const loadCategoryFields = async () => {
    return fetch(`${process.env.REACT_APP_API_URL}/category/1`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((data) => data.json());
  };

  const loadUsersToAllocate = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/agent/user/to-allocate`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((data) => data.json());
    if (response) {
      const formattedUsers = response.map((userDetail) => {
        return {
          label: `${userDetail.user.firstName} ${userDetail.user.lastName}`,
          value: userDetail.userId,
        };
      });
      // setUsers(formattedUsers);

      return formattedUsers;
    }

    return true;
  };

  const loadPropertyFields = async (propertyId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/property/${propertyId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((data) => data.json());
  };

  useEffect(() => {
    const fetchCategoryFields = async () => {
      const response = await loadCategoryFields();
      if (response) setCategoryFields(response.categoryFields);
    };

    // const fetchUsersToAllocate = async () => {
    //   await loadUsersToAllocate();
    // }

    fetchCategoryFields();
    // fetchUsersToAllocate();

    const map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: 51.5072, lng: 0.1276 },
      zoom: 13,
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
      map.setZoom(13);

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

          if (response.virtualTourType == "slideshow") {
            setIsChecked(true);
          } else if (response.virtualTourType == "url") {
            setVirtualTourUrl(response.virtualTourUrl);
          }

          if (response.productMetaTags.length > 0) {
            response.productMetaTags.forEach((metaTag) => {
              switch (metaTag.categoryField.id) {
                case 1:
                  setPropertyType(
                    loadPropertyTypes.find(
                      (property) => property.value == metaTag.value
                    )
                  );
                  break;
                case 2:
                  setPropertyCategoryType(
                    loadPropertyCategoryTypes.find(
                      (category) => category.value == metaTag.value
                    )
                  );
                  break;
                case 3:
                  setUnit(
                    loadUnits.find((unit) => unit.value == metaTag.value)
                  );
                  break;
                case 4:
                  setArea(metaTag.value);
                  break;
                case 5:
                  setBedrooms(
                    loadBedrooms.find(
                      (bedroom) => bedroom.value == metaTag.value
                    )
                  );
                  break;
              }
            });
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

    let virtualTourTypeVar = virtualTourType;
    let virtualTourUrlVar = virtualTourUrl;
    let virtualTourVideoVar = virtualTourVideo;
    if (isChecked) {
      virtualTourTypeVar = "slideshow";
      setVirtualTourType(virtualTourTypeVar);
      virtualTourUrlVar = "";
      virtualTourVideoVar = "";
    } else {
      if (virtualTourType == "video") {
        virtualTourUrlVar = "";
      } else if (virtualTourType == "url") {
        virtualTourVideoVar = "";
      } else {
        virtualTourTypeVar = "slideshow";
        virtualTourUrlVar = "";
        virtualTourVideoVar = "";
      }
    }

    formdata.append("virtualTourType", virtualTourTypeVar);
    formdata.append("virtualTourVideo", virtualTourVideoVar);
    formdata.append("virtualTourUrl", virtualTourUrlVar);

    if (propertyType) {
      formdata.append("metaTags[1]", propertyType.value);
    }

    if (propertyCategoryType) {
      formdata.append("metaTags[2]", propertyCategoryType.value);
    }

    if (unit) {
      formdata.append("metaTags[3]", unit.value);
    }

    if (area) {
      formdata.append("metaTags[4]", area);
    }

    if (bedrooms) {
      formdata.append("metaTags[5]", bedrooms.value);
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

          console.log("update-property-response", response);

          return response.data;
        })
        .catch((error) => {
          console.log("update-property-error", error);
          setErrorHandler(
            error?.response?.data?.errors
              ? error.response.data.errors
              : "Unable to update property, please try again later"
          );
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
              "Unable to update property, please try again later"
            );
          }

          console.log("create-property-response", response);

          return response.data;
        })
        .catch((error) => {
          console.log("create-property-error", error);
          setErrorHandler(
            error?.response?.data?.errors
              ? error.response.data.errors
              : "Unable to update property, please try again later"
          );
        });
    }

    setFeaturedImage(null);
    setVirtualTourVideo(null);

    setLoading(false);
    if (formResponse) {
      setErrors([]);
      setSuccess(successMsg);
      setTimeout(() => {
        setSuccess(null);
        if (formResponse?.id) {
          setId(formResponse.id);
        }
      }, 3000);
      console.log("create-property-final-response", formResponse);
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

  const loadPropertyTypes = [
    { value: "flat/apartment", label: "Apartments" },
    { value: "house", label: "House" },
    { value: "bungalow", label: "Bungalow" },
    { value: "commercial", label: "Commercial" },
    { value: "studio", label: "Studio" },
    { value: "room", label: "Room" },
    { value: "residential", label: "Residential" },
    { value: "office", label: "Office" },
    { value: "retail", label: "Retail" },
    { value: "leisure", label: "Leisure" },
    { value: "hospitality", label: "Hospitality" },
    { value: "shopping_center", label: "Shopping Center" },
    { value: "shop", label: "Shop" },
    { value: "store", label: "Store" },
    { value: "hotels", label: "Hotel" },
    { value: "club", label: "Club" },
    { value: "restaurant", label: "Restaurant" },
    { value: "hotel_room", label: "Hotel Room" },
    { value: "guest_house", label: "Guest House" },
  ];

  const loadPropertyCategoryTypes = [
    { value: "rent", label: "Rent" },
    { value: "sale", label: "Sale" },
  ];

  const loadUnits = [
    { value: "sq_ft", label: "sq_ft" },
    { value: "sq_mt", label: "sq_mt" },
  ];

  const loadBedrooms = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "7", label: "7" },
    { value: "8", label: "8" },
    { value: "9", label: "9" },
    { value: "10", label: "10" },
  ];

  const setErrorHandler = (msg, param = "form") => {
    setErrors([{ msg, param }]);
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

  const baseStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    borderWidth: 2,
    borderRadius: 2,
    borderColor: "#eeeeee",
    borderStyle: "dashed",
    backgroundColor: "#fafafa",
    color: "#bdbdbd",
    outline: "none",
    transition: "border .24s ease-in-out",
  };

  const focusedStyle = {
    borderColor: "#2196f3",
  };

  const acceptStyle = {
    borderColor: "#00e676",
  };

  const rejectStyle = {
    borderColor: "#ff1744",
  };

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  return (
    <Layout>
      <form
        encType="multipart/form-data"
        onSubmit={handleSubmit}
        className="ltn__myaccount-tab-content-inner"
      >
        {errors
          ? errors.map((err) => {
              return (
                <div
                  className="alert alert-danger"
                  role="alert"
                  key={err.param}
                >
                  {" "}
                  {err.msg}{" "}
                </div>
              );
            })
          : ""}
        <h4 className="title-2">Property Description</h4>
        <div className="row mb-50">
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
          <div className="col-md-12">
            <div className="input-item">
              <label>Price *</label>
              <input
                type="text"
                value={price || ""}
                placeholder="10000"
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="input-item">
              <label>No. of bedrooms</label>
              <div className="input-item">
                <Select
                  options={loadBedrooms}
                  onChange={(e) => setBedrooms(e)}
                  value={bedrooms}
                  required
                />
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="input-item">
              <label>Property Type *</label>
              <div className="input-item">
                <Select
                  options={loadPropertyTypes}
                  onChange={(e) => setPropertyType(e)}
                  value={propertyType}
                  required
                />
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="input-item">
              <label>Property Category Type *</label>
              <div className="input-item">
                <Select
                  options={loadPropertyCategoryTypes}
                  onChange={(e) => setPropertyCategoryType(e)}
                  value={propertyCategoryType}
                  required
                />
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="input-item">
              <label>Unit</label>
              <div className="input-item">
                <Select
                  options={loadUnits}
                  onChange={(e) => setUnit(e)}
                  value={unit}
                  required
                />
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="input-item">
              <label>Area</label>
              <input
                type="text"
                placeholder="0"
                onChange={(e) => setArea(e.target.value)}
                value={area}
              />
            </div>
          </div>
        </div>
        <h4 className="title-2">Featured Image</h4>
        <div className="row mb-50">
          <div className="col-md-12">
            <div className="input-item">
              <input
                type="file"
                className="btn theme-btn-3 mb-10"
                onChange={(e) => setFeaturedImage(e.target.files[0])}
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
          <div className="col-md-6">
            <div className="input-item input-item-textarea ltn__custom-icon">
              <input
                type="text"
                value={latitude}
                onChange={(event) => {
                  setLatitude(event.target.value);
                }}
                name="ltn__name"
                placeholder="Latitude (for Google Maps)"
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="input-item input-item-textarea ltn__custom-icon">
              <input
                type="text"
                value={longitude}
                onChange={(event) => {
                  setLongitude(event.target.value);
                }}
                name="ltn__name"
                placeholder="Longitude (for Google Maps)"
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
        {id ? (
          <div>
            <h4 className="title-2">Add More Images</h4>
            <div className="row mb-50">
              <div className="col-md-12">
                <div {...getRootProps({ style })}>
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p>Drop the files here ...</p>
                  ) : (
                    <p>
                      Drag 'n' drop some files here, or click to select files
                    </p>
                  )}
                </div>
              </div>
            </div>
            <h4 className="title-2">Upload Documents</h4>
            <div className="row mb-50">
              <div className="col-md-8">
                <div className="input-item">
                  <label>Brochure</label>
                  <input type="file" className="btn theme-btn-3 mb-10" />
                </div>
              </div>
              <div className="col-md-8">
                <div className="input-item">
                  <label>Floor Plan</label>
                  <input type="file" className="btn theme-btn-3 mb-10" />
                </div>
              </div>
              <div className="col-md-8 mb-20">
                <div className="input-item">
                  <label>More Documents</label>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        {errors
          ? errors.map((err) => {
              return (
                <div
                  className="alert alert-danger"
                  role="alert"
                  key={err.param}
                >
                  {" "}
                  {err.msg}{" "}
                </div>
              );
            })
          : ""}
        {success ? (
          <div className="alert alert-primary" role="alert">
            {" "}
            {success}{" "}
          </div>
        ) : (
          ""
        )}
        <button
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
    </Layout>
  );
}
