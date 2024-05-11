import React, { useState, useEffect, useRef, useCallback } from "react";
import { USER_TYPE } from "../../../constants";
import TimezoneDetail from "../../partial/timezone-detail";
import ProfileService from "../../../services/profile";
import { setLoginToken } from "../../../utils";
import UpdatePassword from "../../partial/update-password";
import UploadCallBackgroundImage from "./upload-call-background-image";
import { useStateIfMounted } from "use-state-if-mounted";
import AgentService from "../../../services/agent/user";
import UserService from "../../../services/agent/user";
import { getUserDetailsFromJwt } from "../../../utils";
import ConfirmationModal from "./confirmationModal";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Autocomplete,
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";

const libraries = ["places", "drawing"];

export default function Profile(props) {
  const [agentId, setAgentId] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [companyPosition, setCompanyPosition] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [mobileNumber, setMobileNumber] = useState();
  const [companyName, setCompanyName] = useState();
  const [companyAddress, setCompanyAddress] = useState();
  const [zipCode, setZipCode] = useState();
  const [city, setCity] = useState();
  const [countryName, setCountryName] = useState();
  const [ORNNumber, setORNNumber] = useState();
  const [mortgageAdvisorEmail, setMortgageAdvisorEmail] = useState();
  const [companyLogo, setCompanyLogo] = useState();
  const [profileImage, setProfileImage] = useState();
  const [companyLogoPreview, setCompanyLogoPreview] = useState();
  const [profileImagePreview, setProfileImagePreview] = useState();
  const [loading, setLoading] = useState();
  const [user, setUser] = useState();
  const [callBackgroundImages, setCallBackgroundImages] = useState([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const [address, setAddress] = useState("");
  const [location, setLocation] = useState({ lat: 37.7749, lng: -122.4194 }); // Default location (San Francisco)
  const [map, setMap] = useState(null);

  const code = useRef();
  const userDetail = getUserDetailsFromJwt();
  const userId = userDetail?.id;

  const history = useHistory();

  const autocompleteInputRef = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBIjbPr5V0gaRCzgQQ-oN0eW25WvGoALVY",
    // googleMapsApiKey: process.env.GOOGLE_API_KEY,
    libraries,
  });

  // const onLoad = useCallback(function callback(map) {
  //   const bounds = new window.google.maps.LatLngBounds();
  //   map.fitBounds(bounds);
  //   setMap(map);
  // }, []);
  const onLoad = useCallback(
    function callback(map) {
      setMap(map);
      // Center map on the initial location
      if (location) {
        map.panTo(location);
      }
    },
    [location]
  );

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const onPlaceChanged = (autocomplete) => {
    const place = autocomplete.getPlace();

    if (place.geometry) {
      setLocation(place.geometry.location);
      setAddress(place.formatted_address);
      map.panTo(place.geometry.location);
    } else {
      console.log("No details available for input: '" + place.name + "'");
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    let formdata = new FormData();
    formdata.append("firstName", firstName);
    formdata.append("lastName", lastName);
    formdata.append("companyPosition", companyPosition);
    formdata.append("phoneNumber", phoneNumber);
    formdata.append("mobileNumber", mobileNumber);
    formdata.append("companyName", companyName);
    formdata.append("companyAddress", companyAddress);
    formdata.append("zipCode", zipCode);
    formdata.append("city", city);
    formdata.append("ornNumber", ORNNumber);
    formdata.append("mortgageAdvisorEmail", mortgageAdvisorEmail);
    formdata.append("companyLogo", companyLogo);
    formdata.append("profileImage", profileImage);

    formdata.append("latitude", location.lat);
    formdata.append("longitude", location.lng);

    setLoading(true);
    const formResponse = await ProfileService.updateProfile(formdata);
    setLoading(false);

    if (formResponse?.error && formResponse?.message) {
      props.responseHandler(formResponse.message);
      return;
    }

    if (formResponse?.token) {
      props.responseHandler(formResponse.message, true);
      setLoginToken(formResponse.token);
    }
  };

  // const onMarkerDragEnd = (event) => {
  //   const newLat = event.latLng.lat();
  //   const newLng = event.latLng.lng();
  //   setLocation({ lat: newLat, lng: newLng });

  //   // Reverse geocode to get address from lat and lng
  //   const geocoder = new window.google.maps.Geocoder();
  //   geocoder.geocode(
  //     { location: { lat: newLat, lng: newLng } },
  //     (results, status) => {
  //       if (status === "OK") {
  //         if (results[0]) {
  //           setAddress(results[0].formatted_address);
  //           if (window.autocomplete) {
  //             window.autocomplete.set("place", results[0]);
  //           }
  //         } else {
  //           console.log("No results found");
  //         }
  //       } else {
  //         console.log("Geocoder failed due to: " + status);
  //       }
  //     }
  //   );
  // };
  const onMarkerDragEnd = (event) => {
    const newLat = event.latLng.lat();
    const newLng = event.latLng.lng();
    setLocation({ lat: newLat, lng: newLng });
  
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat: newLat, lng: newLng } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        setAddress(results[0].formatted_address);
        // Directly set the input value
        if (autocompleteInputRef.current) {
          autocompleteInputRef.current.value = results[0].formatted_address;
        }
      } else {
        console.log("Geocoder failed due to: " + status);
      }
    });
  };
  

  const onProfileImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setProfileImage(event.target.files[0]);
      setProfileImagePreview(URL.createObjectURL(event.target.files[0]));
    }
  };

  const onCompanyLogoChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setCompanyLogo(event.target.files[0]);
      setCompanyLogoPreview(URL.createObjectURL(event.target.files[0]));
    }
  };

  const copyApiCode = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(code.current.value);

    props.responseHandler("Code Copied Successfully!", true);
  };

  const openDeleteModal = () => setDeleteModalOpen(true);
  const closeDeleteModal = () => setDeleteModalOpen(false);

  const handleFinalConfirmation = async () => {
    try {
      const deletionResult = await UserService.deleteUser(); // Assuming UserService has a deleteUser method
      if (!deletionResult.error) {
        props.responseHandler("User deleted successfully", true);
        history.push("/agent/login"); // Navigate away, assuming the user's session is invalidated
        closeDeleteModal(); // Ensure the modal is closed
      } else {
        // Handle potential errors from the deletion attempt
        props.responseHandler(deletionResult.message);
      }
    } catch (error) {
      // Handle any unexpected errors during the deletion process
      props.responseHandler(error.message || "An unexpected error occurred.");
    }
  };

  const verifyPasswordLogic = async (
    password,
    setError,
    proceedToNextScreen
  ) => {
    UserService.verifyPassword({ password })
      .then((response) => {
        if (response.success) {
          // Make sure this matches your actual API response structure
          setError(""); // Clear any existing error messages
          toast.success(response.message);
          proceedToNextScreen(); // Proceed to the confirmation screen
        } else {
          setError("Password verification failed. Please try again."); // Show error message
        }
      })
      .catch((error) => {
        setError("An error occurred during verification. Please try again."); // Handle exceptions
      });
  };

  useEffect(() => {
    let isMounted = true;
    const getUserProfile = async () => {
      const jsonData = await ProfileService.getProfile();
      if (jsonData?.error && jsonData?.message) {
        props.responseHandler(jsonData.message);
        return;
      }

      console.log("User Profile", jsonData);

      if (isMounted) {
        setUser(jsonData);
        setAgentId(jsonData.agent.userId);
        setFirstName(jsonData.firstName);
        setLastName(jsonData.lastName);
        setCompanyPosition(
          jsonData?.agent?.companyPosition ? jsonData.agent.companyPosition : ""
        );
        setPhoneNumber(jsonData.phoneNumber);
        setMobileNumber(
          jsonData?.agent?.mobileNumber ? jsonData.agent.mobileNumber : ""
        );
        setCompanyName(
          jsonData?.agent?.companyName ? jsonData.agent.companyName : ""
        );
        setCompanyAddress(
          jsonData?.agent?.companyAddress ? jsonData.agent.companyAddress : ""
        );
        setZipCode(jsonData?.agent?.zipCode ? jsonData.agent.zipCode : "");
        setCity(jsonData?.cityName ? jsonData.cityName : "");
        setORNNumber(
          jsonData?.agent?.ornNumber ? jsonData.agent.ornNumber : ""
        );
        setMortgageAdvisorEmail(
          jsonData?.agent?.mortgageAdvisorEmail
            ? jsonData.agent.mortgageAdvisorEmail
            : ""
        );
        setCompanyLogoPreview(
          jsonData?.agent?.companyLogo
            ? `${process.env.REACT_APP_API_URL}/${jsonData.agent.companyLogo}`
            : ""
        );
        setProfileImagePreview(
          jsonData?.profileImage
            ? `${process.env.REACT_APP_API_URL}/${jsonData.profileImage}`
            : ""
        );

        if (jsonData.userCallBackgroundImages) {
          setCallBackgroundImages(jsonData.userCallBackgroundImages);
        }
        if (jsonData.agent.latitude && jsonData.agent.longitude) {
          const initialLocation = {
            lat: parseFloat(jsonData.agent.latitude),
            lng: parseFloat(jsonData.agent.longitude),
          };
          setLocation(initialLocation);
          // setMapLocation(initialLocation); // If you're using a separate state for the map center
          // Fetch and set the address
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: initialLocation }, (results, status) => {
            if (status === "OK") {
              if (results[0]) {
                setAddress(results[0].formatted_address);
              }
            }
          });
        }
      }
    };

    getUserProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <React.Fragment>
      <div>
        <h4 className="title-2">Account Details</h4>
        <div className="ltn__myaccount-tab-content-inner">
          <div className="ltn__form-box">
            <form onSubmit={updateProfile}>
              <div className="row mb-100">
                <div className="col-md-6">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="ltn__name"
                    placeholder="First Name"
                    onChange={(e) => setFirstName(e.target.value)}
                    defaultValue={firstName}
                  />
                </div>
                <div className="col-md-6">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="ltn__name"
                    placeholder="Last Name"
                    onChange={(e) => setLastName(e.target.value)}
                    defaultValue={lastName}
                  />
                </div>
                <div className="col-md-6">
                  <label>Company Position</label>
                  <input
                    type="text"
                    name="ltn__name"
                    placeholder="Company Position"
                    onChange={(e) => setCompanyPosition(e.target.value)}
                    defaultValue={companyPosition}
                  />
                </div>
                <div className="col-md-6">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    name="ltn__name"
                    placeholder="Phone Number"
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    defaultValue={phoneNumber}
                  />
                </div>
                <div className="col-md-6">
                  <label>Mobile Number</label>
                  <input
                    type="text"
                    name="ltn__name"
                    placeholder="Mobile Number"
                    onChange={(e) => setMobileNumber(e.target.value)}
                    defaultValue={mobileNumber}
                  />
                </div>
                <div className="col-md-6">
                  <label>Company Name</label>
                  <input
                    type="text"
                    name="ltn__name"
                    placeholder="Company Name"
                    onChange={(e) => setCompanyName(e.target.value)}
                    defaultValue={companyName}
                  />
                </div>
                <div className="col-md-6">
                  <label>Company Address</label>
                  <input
                    type="text"
                    name="ltn__name"
                    placeholder="Company Address"
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    defaultValue={companyAddress}
                  />
                </div>
                {city === "Dubai" && (
                  <div className="col-md-6">
                    <label>ORN Number</label>
                    <input
                      type="text"
                      name="ltn__orn_number"
                      placeholder="ORN Number"
                      onChange={(e) => setORNNumber(e.target.value)}
                      defaultValue={ORNNumber}
                    />
                  </div>
                )}
                <div className="col-md-6">
                  <label>Zip Code</label>
                  <input
                    type="text"
                    name="ltn__name"
                    placeholder="Zip Code"
                    onChange={(e) => setZipCode(e.target.value)}
                    defaultValue={zipCode}
                  />
                </div>
                <div className="col-md-6">
                  <label>City</label>
                  <input
                    type="text"
                    name="ltn__name"
                    placeholder="City"
                    onChange={(e) => setCity(e.target.value)}
                    defaultValue={city}
                  />
                </div>
                <div className="col-md-6">
                  <label>Mortgage Advisor Email</label>
                  <input
                    type="text"
                    name="ltn__name"
                    placeholder="Mortgage Advisor Email"
                    onChange={(e) => setMortgageAdvisorEmail(e.target.value)}
                    defaultValue={mortgageAdvisorEmail}
                  />
                </div>
                <div className="col-md-6 my-3">
                  <label>Company Logo</label>
                  <input
                    type="file"
                    name="ltn__name"
                    onChange={onCompanyLogoChange}
                  />
                </div>
                <div className="col-md-6 my-3">
                  {companyLogoPreview && (
                    <img
                      className="companyLogoCss"
                      src={companyLogoPreview}
                      alt="No logo found"
                      width="300px"
                    />
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 my-3">
                  <label>Profile Image</label>
                  <input
                    type="file"
                    name="ltn__name"
                    onChange={onProfileImageChange}
                  />
                </div>
                <div className="col-md-6 my-3">
                  {profileImagePreview && (
                    <img
                      className="companyLogoCss"
                      src={profileImagePreview}
                      alt="No logo found"
                      width="300px"
                    />
                  )}
                </div>
              </div>
              <div className="row">
                {/* Map and Autocomplete Input */}
                <h4 className="title-2 mt-100">Update Your Location</h4>
                {isLoaded && !loadError && (
                  <div className="row">
                    <div className="col-md-12">
                      <Autocomplete
                        onLoad={(autocomplete) => {
                          window.autocomplete = autocomplete;
                        }}
                        onPlaceChanged={() =>
                          onPlaceChanged(window.autocomplete)
                        }
                      >
                        <input
                          ref={autocompleteInputRef}
                          type="text"
                          className="form-control"
                          placeholder="Search Location"
                          style={{ margin: "10px 0", height: "40px" }}
                        />
                      </Autocomplete>
                    </div>
                    <div className="col-md-12">
                      <GoogleMap
                        mapContainerStyle={{ width: "100%", height: "400px" }}
                        center={location}
                        zoom={15}
                        onLoad={onLoad}
                        onUnmount={onUnmount}
                      >
                        <Marker
                          position={location}
                          draggable={true}
                          onDragEnd={onMarkerDragEnd}
                        />
                      </GoogleMap>
                    </div>
                  </div>
                )}
              </div>
              <div className="btn-wrapper">
                <button
                  type="submit"
                  className="btn theme-btn-1 btn-effect-1 text-uppercase"
                >
                  {loading ? (
                    <div className="lds-ring">
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
            <TimezoneDetail
              type={USER_TYPE.AGENT}
              user={user}
              responseHandler={props.responseHandler}
            />
            <UpdatePassword responseHandler={props.responseHandler} />
            {user?.id && (
              <UploadCallBackgroundImage
                id={user.id}
                images={callBackgroundImages}
                responseHandler={props.responseHandler}
              />
            )}
            <h4 className="title-2 mt-100">Embeded Code</h4>
            <div className="row mb-50">
              <div className="col-lg-10">
                <p>
                  Please click the API button to see the API code and copy the
                  code and insert it in your website.
                </p>
              </div>
              <div className="col-lg-2">
                <button
                  className="btn theme-btn-1 btn-effect-1 text-uppercase"
                  data-bs-toggle="modal"
                  data-bs-target="#ltn_api_code_modal"
                >
                  API
                </button>
              </div>
            </div>
            <h4 className="title-2 mt-100">Delete Account</h4>
            <div className="row mb-50">
              <div className="col-lg-10">
                <p>
                  Please click the 'Delete' button to proceed with account
                  deletion. Confirming this action will permanently remove your
                  account and associated data. Ensure you have backed up any
                  necessary information before proceeding.
                </p>
              </div>
              <div className="col-lg-2">
                <button
                  className="btn theme-btn-1 btn-effect-1 text-uppercase"
                  style={{ backgroundColor: "red" }}
                  onClick={openDeleteModal}
                >
                  Delete
                </button>
              </div>
              <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={handleFinalConfirmation} // This should be the logic to finally delete the account
                onPasswordSubmit={verifyPasswordLogic}
              >
                <p>
                  Are you sure you want to delete your account? This action
                  cannot be undone.
                </p>
              </ConfirmationModal>
            </div>
          </div>
        </div>
      </div>
      <div className="ltn__modal-area ltn__add-to-cart-modal-area">
        <div className="modal fade" id="ltn_api_code_modal" tabIndex={-1}>
          <div className="modal-dialog modal-md" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="ltn__quick-view-modal-inner">
                  <div className="modal-product-item">
                    <div className="row">
                      <div className="col-12">
                        <div className="modal-product-info text-center p-0">
                          <h4>Embeded Code</h4>
                          <form className="ltn__form-box mt-50">
                            <textarea
                              readOnly
                              ref={code}
                              value={`<!-- useepopupcode--><link rel="stylesheet" href="${process.env.REACT_APP_PUBLIC_URL}/script/usee-agent-popup.css?v=107"><div id="usee_prop_list_dn"><button type="button" style="font-size: 15px; color:#00CB04; background: #ffffff; border: 2px solid #00CB04" class="usee_btn grn-line-btn usee-popup-trigger_" data-popup-trigger="usee_agent_model">Book a guided Usee360 Virtual Tour</button><div class="usee_agent_website_model" data-popup-modal="usee_agent_model"><div id="usee_agent_website_popup" class="u-see-agent-website-popup_ shadow"><span class="usee_popup__close">X</span> <iframe class="usee-agent-popup-iframe" src="${process.env.REACT_APP_PUBLIC_URL}/iframe/property-grid/${agentId}" width="100%" height="100%" frameborder="0"></iframe> </div></div></div><div class="usee-bg-popup-overlay_"></div><script src="${process.env.REACT_APP_PUBLIC_URL}/script/useeapi.js?ver=2"></script><!-- usee popupcodeends-->`}
                            ></textarea>
                            <button
                              className="theme-btn-1 btn btn-full-width-2"
                              onClick={copyApiCode}
                            >
                              Copy
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
