import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ResponseHandler from "../global-components/respones-handler";
import axios from "axios";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";

export default function Register() {
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [email, setEmail] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [token, setToken] = useState();
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState();
  const [form1, setForm1] = useState(true);
  const [form2, setForm2] = useState(false);
  const [otp1, setOtp1] = useState();
  const [otp2, setOtp2] = useState();
  const [otp3, setOtp3] = useState();
  const [otp4, setOtp4] = useState();
  const [otp5, setOtp5] = useState();
  const [otp6, setOtp6] = useState();

  const setErrorHandler = (msg, param = "form", fullError = false) => {
    setErrors(fullError ? msg : [{ msg, param }]);
    setTimeout(() => {
      setErrors([]);
    }, 3000);
  };

  const registerCustomer = async () => {
    let formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("phoneNumber", phoneNumber);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    formData.append("signupStep", 1);

    await axios
      .post(`${process.env.REACT_APP_API_URL}/auth/register-customer`, formData, {
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
          setErrorHandler("Unable to register customer, please try again later");
        }
        setLoading(false);
      });
  }

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
        localStorage.setItem("customerToken", JSON.stringify(token));
        const returnUrl = new URLSearchParams(window.location.search).get("returnUrl") || "/customer/dashboard";
        window.location = returnUrl;
      })
      .catch(() => {
        setErrorHandler("Some error occurred, please try again");
        setLoading(false);
      });
  };

  const sendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    const auth = getAuth();
    const appVerifier = window.recaptchaVerifier;

    await signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        registerCustomer();
      })
      .catch(() => {
        setErrorHandler("Unable to send code to phone number, please try again");
        setLoading(false);
      });
  };

  const validateOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    const code = otp1 + otp2 + otp3 + otp4 + otp5 + otp6;

    await window.confirmationResult
      .confirm(code)
      .then(() => {
        updateProfile();
      })
      .catch(() => {
        setErrorHandler("Invalid Code");
        setLoading(false);
      });
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
                Your { process.env.REACT_APP_CUSTOMER_ENTITY_LABEL } Account
              </h1>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6 offset-lg-3">
            <div className="account-login-inner">
              {form1 ? (
                <form
                  onSubmit={sendOTP}
                  className="ltn__form-box contact-form-box"
                >
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
                  <input
                    type="email"
                    name="email"
                    placeholder="Email*"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                  />
                  <input
                    type="text"
                    name="phoneNumber"
                    placeholder="PhoneNumber*"
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
                  </div>
                  <div id="recaptcha-container" className="mb-30"></div>
                  <ResponseHandler errors={errors}/>
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
              ): null}
              {form2 ? (
                <form
                  className="ltn__form-box contact-form-box digit-group"
                  data-group-name="digits"
                  data-autosubmit="false"
                  autocomplete="off"
                  onSubmit={validateOTP}
                >
                  <p className="text-center">Validate OTP (One Time Passcode)</p>
                  <ResponseHandler errors={errors} />
                  <input
                    type="text"
                    id="digit-1"
                    name="digit-1"
                    data-next="digit-2"
                    placeholder="-"
                    onChange={(e) => setOtp1(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    id="digit-2"
                    name="digit-2"
                    data-next="digit-3"
                    placeholder="-"
                    data-previous="digit-1"
                    onChange={(e) => setOtp2(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    id="digit-3"
                    name="digit-3"
                    data-next="digit-4"
                    placeholder="-"
                    data-previous="digit-2"
                    onChange={(e) => setOtp3(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    id="digit-4"
                    name="digit-4"
                    data-next="digit-5"
                    placeholder="-"
                    data-previous="digit-3"
                    onChange={(e) => setOtp4(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    id="digit-5"
                    name="digit-5"
                    data-next="digit-6"
                    placeholder="-"
                    data-previous="digit-4"
                    onChange={(e) => setOtp5(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    id="digit-6"
                    name="digit-6"
                    placeholder="-"
                    data-previous="digit-5"
                    onChange={(e) => setOtp6(e.target.value)}
                    required
                  />
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
                <p>By creating an account, you agree to our:</p>
                <p>
                  <Link to={`/terms-and-conditions`}>
                    TERMS OF CONDITIONS &nbsp; &nbsp; | &nbsp; &nbsp; PRIVACY
                    POLICY
                  </Link>
                </p>
                <div className="go-to-btn mt-50 go-top">
                  <Link to="/customer/login">ALREADY HAVE AN ACCOUNT ?</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
