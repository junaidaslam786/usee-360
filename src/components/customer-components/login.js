import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import ResponseHandler from "../global-components/respones-handler";
import axios from "axios";
import { USER_TYPE } from "../../constants";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";

export default function Login() {
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [resetPassErrors, setResetPassErrors] = useState([]);
  const [loading, setLoading] = useState();
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetPassSuccess, setResetPassSuccess] = useState();
  const [token, setToken] = useState();
  const [form1, setForm1] = useState(true);
  const [form2, setForm2] = useState(false);
  const [otp1, setOtp1] = useState();
  const [otp2, setOtp2] = useState();
  const [otp3, setOtp3] = useState();
  const [otp4, setOtp4] = useState();
  const [otp5, setOtp5] = useState();
  const [otp6, setOtp6] = useState();
  const closeModal = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formResponse = await axios
      .post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        {
          email,
          password,
          type: USER_TYPE.CUSTOMER,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response?.status !== 200) {
          setErrorHandler("login", "Unable to login, please try again later");
        }
        setLoading(false);
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

      if (!formResponse.user.otpVerified || formResponse.user.signupStep != 2) {
        const auth = getAuth();
        const appVerifier = window.recaptchaVerifier;

        await signInWithPhoneNumber(auth, formResponse.user.phoneNumber, appVerifier)
          .then((confirmationResult) => {
            window.confirmationResult = confirmationResult;
            setForm1(false);
            setForm2(true);
          })
          .catch(() => {
            setErrorHandler("login", "Unable to send code to phone number, please try again");
          });
      } else {
        localStorage.setItem("customerToken", JSON.stringify(formResponse.token));
        const returnUrl = new URLSearchParams(window.location.search).get("returnUrl") || "/customer/dashboard";
        window.location = returnUrl;
      }
    }
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
        localStorage.setItem("customerToken", JSON.stringify(token));
        const returnUrl = new URLSearchParams(window.location.search).get("returnUrl") || "/customer/dashboard";
        window.location = returnUrl;
      })
      .catch(() => {
        setErrorHandler("login", "Some error occurred, please try again");
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
        setErrorHandler("login", "Invalid Code");
        setLoading(false);
      });
  };

  const forgotPasswordSubmit = async (e) => {
    e.preventDefault();

    const formResponse = await axios
      .get(
        `${process.env.REACT_APP_API_URL}/auth/forgot-password?email=${forgotEmail}&type=customer`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
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
    <div>
      <div className="ltn__login-area pb-65">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title-area text-center">
                <h1 className="section-title">
                  Sign In
                  <br />
                  To Your {process.env.REACT_APP_CUSTOMER_ENTITY_LABEL} Account
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
                    <div id="recaptcha-container" className="mb-30"></div>
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
                      to="/customer/register"
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
              className="ltn__form-box contact-form-box digit-group text-center"
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
