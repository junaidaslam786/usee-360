import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  JOB_TITLE,
  DEFAULT_LICENSE_NO_TEXT,
  DEFAULT_DEED_TITLE_TEXT,
  UPLOAD_DOCUMENT_DEFAULT,
  UPLOAD_DOCUMENT_LANDLORD,
  USER_TYPE,
} from "../../constants";
import Select from "react-select";
import AuthService from "../../services/auth";
import OtpVerification from "../partial/otp-verification";
import 'react-phone-number-input/style.css'
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'

export default function RegisterAgent(props) {
  const [companyName, setCompanyName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyPosition, setCompanyPosition] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [licenseNo, setLicenseNo] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [document, setDocument] = useState();
  const [jobTitlePlaceHolder, setJobTitlePlaceHolder] = useState(DEFAULT_LICENSE_NO_TEXT);
  const [documentLabel, setDocumentLabel] = useState();
  const [loading, setLoading] = useState(false);
  const [loadOTpForm, setLoadOTpForm] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");

  const registerAgent = async (e) => {
    e.preventDefault();

    let formData = new FormData();
    formData.append("companyName", companyName);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("companyPosition", companyPosition);
    formData.append("email", email);
    formData.append("phoneNumber", phoneNumber);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    formData.append("jobTitle", jobTitle.value);
    formData.append("document", document);
    formData.append("licenseNo", licenseNo);
    formData.append("signupStep", 1);
    formData.append("timezone", Intl.DateTimeFormat().resolvedOptions().timeZone);

    if(!isValidPhoneNumber(phoneNumber)) {
      props.responseHandler(["Invalid Phone Number"]);
      return;
    }

    setLoading(true);
    const formResponse = await AuthService.register(formData, USER_TYPE.AGENT);
    setLoading(false);

    if (formResponse?.error && formResponse?.message) {
      props.responseHandler(formResponse.message);
      return;
    }

    if (formResponse?.token) {
      setUser(formResponse.user);
      setToken(formResponse.token);
      setLoadOTpForm(true);
    }
  };

  const jobTitleHandler = (e) => {
    setJobTitle(e);
    setJobTitlePlaceHolder(
      e.value === "landlord" ? DEFAULT_DEED_TITLE_TEXT : DEFAULT_LICENSE_NO_TEXT
    );
    setDocumentLabel(
      e.value === "landlord"
        ? UPLOAD_DOCUMENT_LANDLORD
        : UPLOAD_DOCUMENT_DEFAULT
    );
  };

  const setPhoneNumberHandler = async (phoneNumber) => {
    setPhoneNumber(phoneNumber);

    const formResponse = await AuthService.checkFieldExist(`?phone=${encodeURIComponent(phoneNumber)}`);
    if (formResponse?.error && formResponse?.message) {
      props.responseHandler(formResponse.message);
    }
  }

  const setEmailHandler = async (email) => {
    setEmail(email);

    const formResponse = await AuthService.checkFieldExist(`?email=${encodeURIComponent(email)}`);
    if (formResponse?.error && formResponse?.message) {
      props.responseHandler(formResponse.message);
    }
  }

  return (
    <div className="ltn__login-area pb-80">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="section-title-area text-center">
              <h1 className="section-title">
                Register
                <br />
                Your { process.env.REACT_APP_AGENT_ENTITY_LABEL } Account
              </h1>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6 offset-lg-3">
            <div className="account-login-inner">
              {
                loadOTpForm ? (
                  <OtpVerification user={user} token={token} responseHandler={props.responseHandler} />
                ) : (
                  <form
                    onSubmit={registerAgent}
                    className="ltn__form-box contact-form-box"
                  >
                    <input
                      type="text"
                      name="companyname"
                      placeholder="Company Name*"
                      onChange={(e) => setCompanyName(e.target.value)}
                      value={companyName}
                      required
                    />
                    <div className="row">
                      <div className="col-md-6">
                        <input
                          type="text"
                          name="firstname"
                          placeholder="First Name*"
                          onChange={(e) => setFirstName(e.target.value)}
                          value={firstName}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          name="lastname"
                          placeholder="Last Name*"
                          onChange={(e) => setLastName(e.target.value)}
                          value={lastName}
                          required
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <input
                          type="text"
                          name="companyposition"
                          placeholder="Company Position*"
                          onChange={(e) => setCompanyPosition(e.target.value)}
                          value={companyPosition}
                          required
                        />
                      </div>
                    </div>
                    <div className="row mb-30">
                      <div className="col-md-12">
                        <Select
                          className="mb-0"
                          classNamePrefix="custom-select"
                          options={JOB_TITLE}
                          onChange={(e) => jobTitleHandler(e)}
                          value={jobTitle}
                          required
                        />
                      </div>
                    </div>
                    {jobTitle ? (
                      <div className="input-item mb-30">
                        <span className="m-0 p-0">{documentLabel}</span>
                        <input
                          type="file"
                          className="btn theme-btn-3 w_100"
                          onChange={(e) => setDocument(e.target.files[0])}
                          required
                        />
                      </div>
                    ) : null}
                    <div className="row">
                      <div className="col-md-12">
                        <input
                          type="text"
                          name="licenseNo"
                          placeholder={jobTitlePlaceHolder}
                          onChange={(e) => setLicenseNo(e.target.value)}
                          value={licenseNo}
                          required
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <input
                          type="email"
                          name="email"
                          placeholder="Email*"
                          onChange={(e) => setEmailHandler(e.target.value)}
                          value={email}
                          required
                        />
                      </div>
                    </div>
                    <small>Phone Number: {phoneNumber}</small>
                    <PhoneInput
                      className="phoneInput"
                      type="text"
                      defaultCountry="AE"
                      placeholder="Phone Number*"
                      onChange={(e) => setPhoneNumberHandler(e)}
                      limitMaxLength={true}
                      value={phoneNumber}
                      required
                    />
                    <div className="row">
                      <div className="col-md-6">
                        <input
                          type="password"
                          name="password"
                          placeholder="Password*"
                          onChange={(e) => setPassword(e.target.value)}
                          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}"
                          title="Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character."
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="password"
                          name="confirmpassword"
                          placeholder="Confirm Password*"
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}"
                          title="Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character."
                          required
                        />
                      </div>
                    </div>
                    {/* <div id="recaptcha-container" className="mb-30"></div> */}
                    
                    <div className="btn-wrapper text-center">
                      <button
                        className="theme-btn-1 btn reverse-color btn-block"
                        type="submit"
                      >
                        {loading ? (
                          <div className="lds-ring">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                          </div>
                        ) : (
                          "CREATE ACCOUNT"
                        )}
                      </button>
                    </div>
                  </form>
                )
              }

              <div className="by-agree text-center">
                <p className="mt-3">By creating an account, you agree to our:</p>
                <p>
                  <Link to={`/terms-and-conditions`}>
                    TERMS OF CONDITIONS &nbsp; &nbsp; | &nbsp; &nbsp; PRIVACY
                    POLICY
                  </Link>
                </p>

                <div className="go-to-btn mt-50 go-top">
                  <Link to="/agent/login">ALREADY HAVE AN ACCOUNT ?</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
