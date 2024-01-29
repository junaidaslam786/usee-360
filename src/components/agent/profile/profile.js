import React, { useState, useEffect, useRef } from "react";
import { USER_TYPE } from "../../../constants";
import TimezoneDetail from "../../partial/timezone-detail";
import ProfileService from "../../../services/profile";
import { setLoginToken } from "../../../utils";
import UpdatePassword from "../../partial/update-password";
import UploadCallBackgroundImage from "./upload-call-background-image";
import { useStateIfMounted } from "use-state-if-mounted";
import AgentService from "../../../services/agent/user";
import { getUserDetailsFromJwt } from "../../../utils";
import { el } from "@fullcalendar/core/internal-common";
import ConfirmationModal from "./confirmationModal";
import { useHistory } from "react-router-dom";

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
  const [mortgageAdvisorEmail, setMortgageAdvisorEmail] = useState();
  const [companyLogo, setCompanyLogo] = useState();
  const [profileImage, setProfileImage] = useState();
  const [companyLogoPreview, setCompanyLogoPreview] = useState();
  const [profileImagePreview, setProfileImagePreview] = useState();
  const [loading, setLoading] = useState();
  const [user, setUser] = useState();
  const [callBackgroundImages, setCallBackgroundImages] = useState([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const code = useRef();
  const userDetail = getUserDetailsFromJwt();
  const userId = userDetail?.id;

  const history = useHistory();

  // const getUser = async () => {
  //   const jsonData = await ProfileService.getProfile();
  //   if (jsonData?.error && jsonData?.message) {
  //     props.responseHandler(jsonData.message);
  //     return;
  //   }

  //   setUser(jsonData);
  //   setAgentId(jsonData.agent.userId);
  //   setFirstName(jsonData.firstName);
  //   setLastName(jsonData.lastName);
  //   setCompanyPosition(
  //     jsonData?.agent?.companyPosition ? jsonData.agent.companyPosition : ""
  //   );
  //   setPhoneNumber(jsonData.phoneNumber);
  //   setMobileNumber(
  //     jsonData?.agent?.mobileNumber ? jsonData.agent.mobileNumber : ""
  //   );
  //   setCompanyName(
  //     jsonData?.agent?.companyName ? jsonData.agent.companyName : ""
  //   );
  //   setCompanyAddress(
  //     jsonData?.agent?.companyAddress ? jsonData.agent.companyAddress : ""
  //   );
  //   setZipCode(jsonData?.agent?.zipCode ? jsonData.agent.zipCode : "");
  //   setCity(jsonData?.cityName ? jsonData.cityName : "");
  //   setMortgageAdvisorEmail(
  //     jsonData?.agent?.mortgageAdvisorEmail
  //       ? jsonData.agent.mortgageAdvisorEmail
  //       : ""
  //   );
  //   setCompanyLogoPreview(
  //     jsonData?.agent?.companyLogo
  //       ? `${process.env.REACT_APP_API_URL}/${jsonData.agent.companyLogo}`
  //       : ""
  //   );
  //   setProfileImagePreview(
  //     jsonData?.profileImage
  //       ? `${process.env.REACT_APP_API_URL}/${jsonData.profileImage}`
  //       : ""
  //   );

  //   if (jsonData.userCallBackgroundImages) {
  //     setCallBackgroundImages(jsonData.userCallBackgroundImages);
  //   }
  // };

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
    formdata.append("mortgageAdvisorEmail", mortgageAdvisorEmail);
    formdata.append("companyLogo", companyLogo);
    formdata.append("profileImage", profileImage);

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

  const handleDeleteConfirmation = async () => {
    // Implement your delete logic here
    const result = await AgentService.deleteUser(userId);
    if (result?.error) {
      props.responseHandler(result.message);
      return;
    } else {
      props.responseHandler("User deleted successfully", true);
    }
    closeDeleteModal();
    history.push("/agent/login");
    // Maybe call a service function to delete the user account
  };

  useEffect(() => {
    let isMounted = true;
    const getUserProfile = async () => {
      const jsonData = await ProfileService.getProfile();
      if (jsonData?.error && jsonData?.message) {
        props.responseHandler(jsonData.message);
        return;
      }

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
                Please click the 'Delete' button to proceed with account deletion. Confirming this action will permanently remove your account and associated data. Ensure you have backed up any necessary information before proceeding.
                </p>
              </div>
              <div className="col-lg-2">
                <button
                  className="btn theme-btn-1 btn-effect-1 text-uppercase"
                  style={{backgroundColor: 'red'}}
                  onClick={openDeleteModal}
                >
                  Delete
                </button>
              </div>
              <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDeleteConfirmation}
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
