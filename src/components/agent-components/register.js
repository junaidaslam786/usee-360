import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ResponseHandler from "../global-components/respones-handler";
import axios from "axios";
import {
  JOB_TITLE,
  DEFAULT_LICENSE_NO_TEXT,
  DEFAULT_DEED_TITLE_TEXT,
  UPLOAD_DOCUMENT_DEFAULT,
  UPLOAD_DOCUMENT_LANDLORD,
} from "../../constants";
import Select from "react-select";
import { initializeApp } from "firebase/app";
import OtpInput from "react-otp-input";
import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";

export default function Register() {
  const [companyName, setCompanyName] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [companyPosition, setCompanyPosition] = useState();
  const [jobTitle, setJobTitle] = useState();
  const [licenseNo, setLicenseNo] = useState();
  const [email, setEmail] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [otpType, setOtpType] = useState();
  const [document, setDocument] = useState();
  const [jobTitlePlaceHolder, setJobTitlePlaceHolder] = useState(DEFAULT_LICENSE_NO_TEXT);
  const [documentLabel, setDocumentLabel] = useState();
  const [token, setToken] = useState();
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState();
  const [form1, setForm1] = useState(true);
  const [form2, setForm2] = useState(false);
  const [otp, setOtp] = useState("");

  const setErrorHandler = (msg, param = "form", fullError = false) => {
    setErrors(fullError ? msg : [{ msg, param }]);
    setTimeout(() => {
      setErrors([]);
    }, 3000);
  };

  const renderInput = (props, index) => (
    <input
      className="otp-input"
      {...props}
      autoFocus={index === 0}
    />
  );
  
  const handleChange = (otp) => setOtp(otp);

  const registerAgent = async (code = "") => {
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
    formData.append("otpCode", code);
    formData.append("timezone", Intl.DateTimeFormat().resolvedOptions().timeZone);

    await axios
      .post(`${process.env.REACT_APP_API_URL}/auth/register-agent`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response?.data?.token) {
          setToken(response.data.token);
          setForm1(false);
          setForm2(true);
        }
        setLoading(false);
      }).catch((error) => {
        if (error?.response?.data?.errors) {
          setErrorHandler(error.response.data.errors, "error", true);
        } else {
          setErrorHandler("Unable to register agent, please try again later");
        }
        setLoading(false);
      });
  };

  const updateProfile = async () => { 
    let formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("otpVerified", true);
    formData.append("signupStep", 2);
  
    await axios
      .put(`${process.env.REACT_APP_API_URL}/user/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        localStorage.removeItem("customerToken");
        localStorage.setItem("agentToken", JSON.stringify(token));
        const returnUrl = new URLSearchParams(window.location.search).get("returnUrl") || "/agent/dashboard";
        window.location = returnUrl;
      })
      .catch((error) => {
        if (error?.response?.data?.errors) {
          setErrorHandler(error.response.data.errors, "error", true);
        } else {
          setErrorHandler("Unable to send OTP, please try again later");
        }
        setLoading(false);
      });
  };

  const sendOtpEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const code = Math.floor(100000 + Math.random() * 900000);
    
    let formData = new FormData();
    formData.append("name", firstName);
    formData.append("email", email);
    formData.append("otp", code);

    await axios
      .post(`${process.env.REACT_APP_API_URL}/auth/send-otp`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        registerAgent(code);
      }).catch((error) => {
        if (error?.response?.data?.errors) {
          setErrorHandler(error.response.data.errors, "error", true);
        } else {
          setErrorHandler("Unable to send OTP, please try again later");
        }
        setLoading(false);
      });
  }

  const validateOtpEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    let formData = new FormData();
    formData.append("otp", otp);

    await axios
      .post(`${process.env.REACT_APP_API_URL}/user/validate-otp`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        localStorage.removeItem("customerToken");
        localStorage.setItem("agentToken", JSON.stringify(token));
        const returnUrl = new URLSearchParams(window.location.search).get("returnUrl") || "/agent/dashboard";
        window.location = returnUrl;
      }).catch((error) => {
        if (error?.response?.data?.errors) {
          setErrorHandler(error.response.data.errors, "error", true);
        } else {
          setErrorHandler("Invalid OTP");
        }
        setLoading(false);
      });
  }

  const sendOtpPhoneNumber = async (e) => {
    e.preventDefault();
    setLoading(true);

    const auth = getAuth();
    const appVerifier = window.recaptchaVerifier;

    await signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        registerAgent();
      })
      .catch(() => {
        setErrorHandler("Unable to send code to phone number, please try again");
        setLoading(false);
      });
  };

  const validateOtpPhoneNumber = async (e) => {
    e.preventDefault();
    setLoading(true);

    await window.confirmationResult
      .confirm(otp)
      .then(() => {
        updateProfile();
      })
      .catch(() => {
        setErrorHandler("Invalid Code");
        setLoading(false);
      });
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

  useEffect(() => {
    const firebaseConfig = {
      apiKey: process.env.REACT_APP_API_KEY,
      authDomain: process.env.REACT_APP_AUTH_DOMAIN,
      projectId: process.env.REACT_APP_PROJECT_ID,
      storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
      messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
      appId: process.env.REACT_APP_APP_ID,
      measurementId: process.env.REACT_APP_MEASUREMENT_ID,
    };

    initializeApp(firebaseConfig);

    const auth = getAuth();
    window.recaptchaVerifier = new RecaptchaVerifier("recaptcha-container", {}, auth);
    window.recaptchaVerifier.render();
  }, []);

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
              {form1 ? (
                <form
                  onSubmit={otpType === "phoneNumber" ? sendOtpPhoneNumber : sendOtpEmail}
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
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        required
                      />
                    </div>
                  </div>
                  <input
                    type="text"
                    name="phoneNumber"
                    placeholder="Phone Number*"
                    onChange={(e) => setPhoneNumber(e.target.value)}
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
                    <ul>
                    <label>Verify By: </label>
                    <div onChange={(e) => setOtpType(e.target.value)}>
                      <label className="checkbox-item" style={{ marginRight: "20px" }}>
                        Phone Number
                        <input type="radio" name="otpType" value="phoneNumber" required/>
                        <span className="checkmark" />
                      </label>
                      <label className="checkbox-item">
                        Email Address
                        <input type="radio" name="otpType" value="emailAddress" />
                        <span className="checkmark" />
                      </label>
                    </div>
                  </ul>
                  </div>
                  <div id="recaptcha-container" className="mb-4"></div>
                  <ResponseHandler errors={errors} />
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
              ) : null}
              {form2 ? (
                <form
                  className="ltn__form-box contact-form-box contact-form-login digit-group text-center"
                  onSubmit={otpType === "phoneNumber" ? validateOtpPhoneNumber : validateOtpEmail}
                >
                  <p className="text-center">Validate OTP (One Time Passcode)</p>
                  <ResponseHandler errors={errors} />
                  <div className="d-flex justify-content-center otp">
                    <OtpInput
                      value={otp}
                      onChange={handleChange}
                      numInputs={6}
                      isInputNum={true}
                      inputMode="numeric"
                      separator={<span>-</span>}
                      renderInput={renderInput}
                    />
                  </div>
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
                        "Verify"
                      )}
                    </button>
                  </div>
                </form>
              ) : null}
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
