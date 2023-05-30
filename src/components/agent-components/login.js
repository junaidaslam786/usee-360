import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import ResponseHandler from "../global-components/respones-handler";
import axios from "axios";
import { USER_TYPE } from "../../constants";
import { initializeApp } from "firebase/app";
import OtpInput from "react-otp-input";
import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";

export default function Login() {
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [email, setEmail] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [password, setPassword] = useState();
  const [verified, setVerified] = useState(true);
  const [otpType, setOtpType] = useState();
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState([]);
  const [resetPassErrors, setResetPassErrors] = useState([]);
  const [loading, setLoading] = useState();
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetPassSuccess, setResetPassSuccess] = useState();
  const [token, setToken] = useState();
  const [form1, setForm1] = useState(true);
  const [form2, setForm2] = useState(false);
  const closeModal = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if(!verified) {
      otpType === 'phoneNumber'
        ? sendOtpPhoneNumber()
        : updateProfile();
    }

    else {
      const payload = {
        email,
        password,
        type: USER_TYPE.AGENT
      };

      const formResponse = await axios
        .post(`${process.env.REACT_APP_API_URL}/auth/login`, payload, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (response?.status !== 200) {
            setErrorHandler("login", "Unable to login, please try again later");
            setLoading(false);
          }
          return response.data;
        })
        .catch((error) => {
          if (error?.response?.data?.errors) {
            setErrorHandler("login", error.response.data.errors, "error", true);
          } else if (error?.response?.data?.message) {
            setErrorHandler("login", error.response.data.message);
          } else {
            setErrorHandler("login", "Unable to login, please try again later");
          }
          setLoading(false);
        });

      if (formResponse?.token) {
        setToken(formResponse.token);
        setFirstName(formResponse.user.firstName);
        setLastName(formResponse.user.lastName);
        setPhoneNumber(formResponse.user.phoneNumber);

        if (formResponse?.user?.timezone) {
          localStorage.setItem("userTimezone", JSON.stringify(formResponse.user.timezone));
        }
        
        if (!formResponse.user.otpVerified || formResponse.user.signupStep != 2) {
          setLoading(false);
          setVerified(false);
          const auth = getAuth();
          window.recaptchaVerifier = new RecaptchaVerifier("recaptcha-container", {}, auth);
          window.recaptchaVerifier.render();
        } else {
          localStorage.removeItem("customerToken");
          localStorage.setItem("agentToken", JSON.stringify(formResponse.token));
          const returnUrl = new URLSearchParams(window.location.search).get("returnUrl") || "/agent/dashboard";
          window.location = returnUrl;
        }
      }
    }
  };

  const updateProfile = async () => {
    let formData = new FormData();
    const code = Math.floor(100000 + Math.random() * 900000);

    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    
    if(otpType === 'phoneNumber') {
      formData.append("otpVerified", true);
      formData.append("signupStep", 2);
    } else {
      formData.append("otpCode", code);
    }
    
    await axios
      .put(`${process.env.REACT_APP_API_URL}/user/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        if(otpType === 'phoneNumber') {
          localStorage.removeItem("customerToken");
          localStorage.setItem("agentToken", JSON.stringify(token));
          const returnUrl = new URLSearchParams(window.location.search).get("returnUrl") || "/agent/dashboard";
          window.location = returnUrl;
        } else {
          sendOtpEmail(code);
        }
      })
      .catch(() => {
        setErrorHandler("login", "Some error occurred, please try again");
        setLoading(false);
      });
  };

  const sendOtpEmail = async (code) => {
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
        setLoading(false);
        setForm1(false);
        setForm2(true);
      }).catch((error) => {
        if (error?.response?.data?.errors) {
          setErrorHandler(error.response.data.errors, "error", true);
        } else {
          setErrorHandler("login", "Unable to send OTP, please try again later");
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
          setErrorHandler("login", "Invalid OTP");
        }
        setLoading(false);
      });
  }

  const sendOtpPhoneNumber = async () => {
    const auth = getAuth();
    const appVerifier = window.recaptchaVerifier;

    await signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setForm1(false);
        setForm2(true);
      })
      .catch(() => {
        setErrorHandler("login", "Unable to send code to phone number, please try again");
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
        setErrorHandler("login", "Invalid Code");
        setLoading(false);
      });
  };

  const forgotPasswordSubmit = async (e) => {
    e.preventDefault();

    const formResponse = await axios
      .get(`${process.env.REACT_APP_API_URL}/auth/forgot-password?email=${forgotEmail}&type=agent`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response?.status !== 200) {
          setErrorHandler("reset", "Unable to reset password, please try again later");
        }
        return response.data;
      })
      .catch((error) => {
        if (error?.response?.data?.errors) {
          setErrorHandler("reset", error.response.data.errors, "error", true);
        } else if (error?.response?.data?.message) {
          setErrorHandler("reset", error.response.data.message);
        } else {
          setErrorHandler("reset", "Unable to reset password, please try again later");
        }
      });

    if (formResponse?.message) {
      setSuccessHandler(formResponse.message);
      setForgotEmail("");
      setTimeout(() => {
        closeModal.current.click();
      }, 1000);
    }
  };

  const setErrorHandler = (
    type = "login",
    msg,
    param = "form",
    fullError = false
  ) => {
    if (type === "reset") {
      setResetPassErrors(fullError ? msg : [{ msg, param }]);
      setTimeout(() => {
        setResetPassErrors([]);
      }, 3000);
      setResetPassSuccess("");
    } else {
      setErrors(fullError ? msg : [{ msg, param }]);
      setTimeout(() => {
        setErrors([]);
      }, 3000);
    }
  };

  const setSuccessHandler = (msg) => {
    setResetPassSuccess(msg);
    setTimeout(() => {
      setResetPassSuccess("");
    }, 3000);
    setResetPassErrors([]);
  };

  const renderInput = (props, index) => (
    <input
      className="otp-input"
      {...props}
      autoFocus={index === 0}
    />
  );

  const handleChange = (otp) => setOtp(otp);

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
  }, []);

  return (
    <div>
      <div className="ltn__login-area pb-65">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title-area text-center">
                <h1 className="section-title">
                  Sign In
                  <br />
                  To Your {process.env.REACT_APP_AGENT_ENTITY_LABEL} Account
                </h1>
              </div>
            </div>
          </div>
          {form1 ? (
            <div className="row">
              <div className="col-lg-6">
                <div className="account-login-inner">
                  <form
                    onSubmit={handleSubmit}
                    className="ltn__form-box contact-form-box"
                  >
                    <ResponseHandler errors={errors} />
                    {verified ? (
                    <div>
                      <input
                        type="text"
                        name="email"
                        placeholder="Email*"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <input
                        type="password"
                        name="password"
                        placeholder="Password*"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>) : (
                    <div>
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
                      <div id="recaptcha-container" className="mb-4 mt-3"></div>
                    </div>)}
                    <div className="btn-wrapper mt-0">
                      <button
                        className="theme-btn-1 btn btn-block"
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
                          "SIGN IN"
                        )}
                      </button>
                    </div>
                    <div className="go-to-btn mt-20">
                      <a
                        href="#"
                        title="Forgot Password?"
                        data-bs-toggle="modal"
                        data-bs-target="#ltn_forget_password_modal"
                      >
                        <small>FORGOTTEN YOUR PASSWORD?</small>
                      </a>
                    </div>
                  </form>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="account-create text-center pt-50">
                  <h4>DON'T HAVE AN ACCOUNT?</h4>
                  <div className="btn-wrapper go-top">
                    <Link
                      to="/agent/register"
                      className="theme-btn-1 btn black-btn"
                    >
                      CREATE ACCOUNT
                    </Link>
                  </div>
                </div>
              </div>
            </div>
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
        </div>
      </div>
      <div className="ltn__modal-area ltn__add-to-cart-modal-area----">
        <div
          className="modal fade"
          id="ltn_forget_password_modal"
          tabIndex={-1}
        >
          <div className="modal-dialog modal-md" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  ref={closeModal}
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
                          <h4>FORGET PASSWORD?</h4>
                          <p className="added-cart">
                            {" "}
                            Enter you registered email.
                          </p>
                          <form
                            onSubmit={forgotPasswordSubmit}
                            className="ltn__form-box"
                          >
                            <ResponseHandler
                              errors={resetPassErrors}
                              success={resetPassSuccess}
                            />
                            <input
                              type="email"
                              name="email"
                              placeholder="Type your register email*"
                              onChange={(e) => setForgotEmail(e.target.value)}
                              value={forgotEmail}
                            />
                            <div className="btn-wrapper mt-0">
                              <button
                                className="theme-btn-1 btn btn-full-width-2"
                                type="submit"
                              >
                                Submit
                              </button>
                            </div>
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
    </div>
  );
}
