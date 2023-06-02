import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import AuthService from "../../services/auth";
import { USER_TYPE } from "../../constants";
import { setLoginToken, setUserTimezone } from "../../utils";
import OtpVerification from "../partial/otp-verification";

export default function Login({ type, responseHandler }) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState();
  const [token, setToken] = useState();
  const [loadOTpForm, setLoadOTpForm] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [user, setUser] = useState(null);
  const closeModal = useRef(null);

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
        setUserTimezone(formResponse.user.timezone)
      }
      
      if (!formResponse.user.otpVerified || formResponse.user.signupStep != 2) {
        setUser(formResponse.user);
        setLoadOTpForm(true);
        return;
      } 

      setLoginToken(formResponse.token);
      const returnUrl = new URLSearchParams(window.location.search).get("returnUrl") || `/${type}/dashboard`;
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
                  To Your { type === USER_TYPE.CUSTOMER ? process.env.REACT_APP_CUSTOMER_ENTITY_LABEL : process.env.REACT_APP_AGENT_ENTITY_LABEL} Account
                </h1>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6">
              <div className="account-login-inner">
              {
                loadOTpForm ? (
                  <OtpVerification user={user} token={token} responseHandler={responseHandler} />
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
                )
              }
              </div>
            </div>
            <div className="col-lg-6">
              <div className="account-create text-center pt-50">
                <h4>DON'T HAVE AN ACCOUNT?</h4>
                <div className="btn-wrapper go-top">
                  <Link
                    to={`/${type}/register`}
                    className="theme-btn-1 btn black-btn"
                  >
                    CREATE ACCOUNT
                  </Link>
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
