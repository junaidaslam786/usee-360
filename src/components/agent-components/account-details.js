import React, { useState, useEffect, useRef } from "react";
import Layout from "./layouts/layout";
import axios from "axios";
import ResponseHandler from "../global-components/respones-handler";

export default function AccountDetails() {
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
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState();
  const [success, setSuccess] = useState();
  const [error, setError] = useState();
  const [loadingPass, setLoadingPass] = useState();
  const [successPass, setSuccessPass] = useState();
  const [errorPass, setErrorPass] = useState();
  const [successMessage, setSuccessMessage] = useState();

  const code = useRef();

  const token = JSON.parse(localStorage.getItem("agentToken"));
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
    setAgentId(jsonData.agent.id);
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
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

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

    await axios
      .put(`${process.env.REACT_APP_API_URL}/user/profile`, formdata, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setSuccessHandler("profile", response.data.message);
        setLoading(false);
      })
      .catch((error) => {
        if (error?.response?.data?.errors) {
          setErrorHandler("profile", error.response.data.errors, "error", true);
        } else if (error?.response?.data?.message) {
          setErrorHandler("profile", error.response.data.message);
        } else {
          setErrorHandler();
          setErrorHandler(
            "profile",
            "Unable to update profile, please try again later"
          );
        }
        setLoading(false);
      });
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    setLoadingPass(true);

    if (newPassword !== confirmPassword) {
      setErrorHandler(
        "password",
        "Password and confirm password did not match"
      );
      setLoadingPass(false);
    } else {
      let formdata = new FormData();
      formdata.append("current", currentPassword);
      formdata.append("password", newPassword);

      await axios
        .put(
          `${process.env.REACT_APP_API_URL}/user/update-password`,
          formdata,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then(() => {
          setSuccessHandler("password", "Password updated successfully!");
          setLoadingPass(false);
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        })
        .catch((error) => {
          console.log("update-password-error", error);
          if (error?.response?.data?.errors) {
            setErrorHandler(
              "password",
              error.response.data.errors,
              "error",
              true
            );
          } else if (error?.response?.data?.message) {
            setErrorHandler("password", error.response.data.message);
          } else {
            setErrorHandler(
              "password",
              "Unable to update password, please try again later"
            );
          }
          setLoadingPass(false);
        });
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

  const setErrorHandler = (type, msg, param = "form", fullError = false) => {
    if (type === "password") {
      setErrorPass(fullError ? msg : [{ msg, param }]);
      setTimeout(() => {
        setErrorPass([]);
      }, 3000);
      setSuccessPass("");
    } else {
      setError(fullError ? msg : [{ msg, param }]);
      setTimeout(() => {
        setError([]);
      }, 3000);
      setSuccess("");
    }
  };

  const setSuccessHandler = (type, msg) => {
    if (type === "password") {
      setSuccessPass(msg);
      setTimeout(() => {
        setSuccessPass("");
      }, 3000);

      setErrorPass([]);
    } else {
      setSuccess(msg);
      setTimeout(() => {
        setSuccess("");
      }, 3000);

      setError([]);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <Layout>
      <div>
        <h4 className="title-2">Account Details</h4>
        <div className="ltn__myaccount-tab-content-inner">
          <div className="ltn__form-box">
            <form onSubmit={updateProfile}>
              <ResponseHandler errors={error} success={success} />
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
            <h4 className="title-2 mt-100">Change Password</h4>
            <form onSubmit={updatePassword}>
              <ResponseHandler errors={errorPass} success={successPass} />
              <div className="row">
                <div className="col-md-12">
                  <label>
                    Current password (leave blank to leave unchanged):
                  </label>
                  <input
                    type="password"
                    name="ltn__name"
                    placeholder="Current Password"
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    value={currentPassword}
                    required
                  />
                  <label>New password (leave blank to leave unchanged):</label>
                  <input
                    type="password"
                    name="ltn__lastname"
                    placeholder="New Password"
                    onChange={(e) => setNewPassword(e.target.value)}
                    value={newPassword}
                    required
                  />
                  <label>Confirm new password:</label>
                  <input
                    type="password"
                    name="ltn__lastname"
                    placeholder="Confirm Password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                    required
                  />
                </div>
              </div>
              <div className="btn-wrapper">
                <button
                  type="submit"
                  className="btn theme-btn-1 btn-effect-1 text-uppercase"
                >
                  {loadingPass ? (
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
                  className="btn theme-btn-2"
                  data-bs-toggle="modal"
                  data-bs-target="#ltn_api_code_modal"
                >
                  API
                </button>
              </div>
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
                            {successMessage ? (
                              <div className="alert alert-success" role="alert">
                                Code Copied Successfully!
                              </div>
                            ) : null}
                            <textarea
                              ref={code}
                              value={`<!-- useepopupcode--><link rel="stylesheet" href="${process.env.REACT_APP_PUBLIC_URL}/script/usee-agent-popup.css?v=107"><div id="usee_prop_list_dn"><button type="button" style="font-size: 15px; color:#00CB04; background: #ffffff; border: 2px solid #00CB04" class="usee_btn grn-line-btn usee-popup-trigger_" data-popup-trigger="usee_agent_model">Book a guided U-See Virtual Tour</button><div class="usee_agent_website_model" data-popup-modal="usee_agent_model"><div id="usee_agent_website_popup" class="u-see-agent-website-popup_ shadow"><span class="usee_popup__close">X</span> <iframe class="usee-agent-popup-iframe" src="${process.env.REACT_APP_PUBLIC_URL}/iframe/property-grid/${agentId}" width="100%" height="100%" frameborder="0"></iframe> </div></div></div><div class="usee-bg-popup-overlay_"></div><script src="${process.env.REACT_APP_PUBLIC_URL}/script/useeapi.js?ver=2"></script><!-- usee popupcodeends-->`}
                            ></textarea>
                            <button
                              className="btn theme-btn-1"
                              onClick={(e) => {
                                e.preventDefault();
                                navigator.clipboard.writeText(
                                  code.current.value
                                );
                                setSuccessMessage(true);
                                setTimeout(() => {
                                  setSuccessMessage(false);
                                }, 2000);
                              }}
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
    </Layout>
  );
}
