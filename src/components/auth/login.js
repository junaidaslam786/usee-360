import React, { useState, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import AuthService from "../../services/auth";
import { USER_TYPE } from "../../constants";
import { setLoginToken, setUserTimezone } from "../../utils";
import { AuthContext } from "./AuthContext";
import OtpVerification from "../partial/otp-verification";
import PasswordChecklist from "react-password-checklist";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faMicrosoft,
  faLinkedin,
  faGoogle,
} from "@fortawesome/free-brands-svg-icons";

export default function Login({ type, responseHandler }) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState();
  const [token, setToken] = useState();
  const [loadOTpForm, setLoadOTpForm] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [user, setUser] = useState(null);
  const closeModal = useRef(null);

  // const {updateAuthState} = useContext(AuthContext);

  const handleFacebookAuth = async () => {
    try {
      
      const url = await AuthService.getFacebookAuthUrl(type);
      if (url) {
        window.location.href = url; // Redirect to the Facebook auth URL
      } else {
        responseHandler("Unable to connect to Facebook", false);
      }
    } catch (error) {
      responseHandler("Failed to authenticate with Facebook", false);
    }
  };

  const onVerified = (user, token) => {
    // Redirect to the dashboard or appropriate page after successful verification
    
    setLoginToken(token);
    // updateAuthState({
    //   userDetails: user,
    //   token,
    //   type: user.type,
    //   email: user.email,
    // })

    const returnUrl =
      new URLSearchParams(window.location.search).get("returnUrl") ||
      `/${type}/dashboard`;
    window.location = returnUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    const formResponse = await AuthService.login({
      email,
      password,
      type,
    });
    setLoading(false);

    if (formResponse?.error && formResponse?.message) {
      responseHandler(formResponse.message);
      return;
    }

    if (formResponse?.token) {
      setToken(formResponse.token);

      if (formResponse?.user?.timezone) {
        setUserTimezone(formResponse.user.timezone);
      }

      if (!formResponse.user.otpVerified || formResponse.user.signupStep != 2) {
        setUser(formResponse.user);
        setLoadOTpForm(true);
        return;
      }

      // updateAuthState({
      //   userDetails: formResponse.user,
      //   token: formResponse.token,
      //   type: formResponse.user.type,
      //   email: formResponse.user.email,
      // })

      setLoginToken(formResponse.token);
      const returnUrl =
        new URLSearchParams(window.location.search).get("returnUrl") ||
        `/${type}/dashboard`;
      window.location = returnUrl;
    }
  };

  const forgotPasswordSubmit = async (e) => {
    e.preventDefault();

    const formResponse = await AuthService.forgotPassword(forgotEmail, type);
    if (formResponse?.error && formResponse?.message) {
      responseHandler(formResponse.message);
      return;
    }

    if (formResponse?.message) {
      responseHandler(formResponse.message, true);
      setForgotEmail("");
      setTimeout(() => {
        closeModal.current.click();
      }, 1000);
    }
  };

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
                  To Your{" "}
                  {type === USER_TYPE.CUSTOMER
                    ? process.env.REACT_APP_CUSTOMER_ENTITY_LABEL
                    : process.env.REACT_APP_AGENT_ENTITY_LABEL}{" "}
                  Account
                </h1>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6">
              <div className="account-login-inner">
                {loadOTpForm ? (
                  <OtpVerification
                    user={user}
                    token={token}
                    responseHandler={responseHandler}
                    onVerified={onVerified}
                  />
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="ltn__form-box contact-form-box"
                  >
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
                )}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="account-create text-center pt-50">
                <h4>DON'T HAVE AN ACCOUNT?</h4>
                <div
                  className="btn-wrapper go-top"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Link
                    to={`/${type}/register`}
                    className="theme-btn-1 btn black-btn"
                    style={{
                      width: "50%",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    CREATE ACCOUNT
                  </Link>
                  {/* Divider with Text */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      margin: "20px 0",
                      width: "100%",
                    }}
                  >
                    <hr
                      style={{
                        flex: 1,
                        borderWidth: "1px",
                        borderColor: "#ccc",
                      }}
                    />
                    <span style={{ padding: "0 10px" }}>or SignUp with</span>
                    <hr
                      style={{
                        flex: 1,
                        borderWidth: "1px",
                        borderColor: "#ccc",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                      padding: "0 10px",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faFacebook}
                      size="2x"
                      style={{
                        color: "#3b5998",
                        cursor: "pointer",
                        margin: "0 10px",
                      }}
                      onClick={handleFacebookAuth}
                    />
                    <FontAwesomeIcon
                      icon={faTwitter}
                      size="2x"
                      style={{ color: "#1DA1F2" }}
                    />
                    <FontAwesomeIcon
                      icon={faMicrosoft}
                      size="2x"
                      style={{ color: "#F25022" }}
                    />
                    <FontAwesomeIcon
                      icon={faLinkedin}
                      size="2x"
                      style={{ color: "#0077B5" }}
                    />
                    <FontAwesomeIcon
                      icon={faGoogle}
                      size="2x"
                      style={{ color: "#DB4437" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
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
