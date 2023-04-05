import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import ResponseHandler from '../global-components/respones-handler';
import axios from "axios";

function getToken() {
  const tokenString = localStorage.getItem("agentToken");
  const userToken = JSON.parse(tokenString);
  return userToken;
}

export default function Login() {
  const token = getToken();
  const history = useHistory();

  if (token) {
    history.goBack();
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [resetPassErrors, setResetPassErrors] = useState([]);
  const [loading, setLoading] = useState();
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetPassSuccess, setResetPassSuccess] = useState();

  function setToken(token) {
    localStorage.setItem("agentToken", JSON.stringify(token));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formResponse = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
      email,
      password,
      type: "agent"
    }, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      if (response?.status !== 200) {
        setErrorHandler('login', "Unable to login, please try again later");
      }

      console.log('login-response', response);

      return response.data;
    }).catch(error => {
      console.log('login-error', error);
      if (error?.response?.data?.errors) {
        setErrorHandler('login', error.response.data.errors, "error", true);
      } else if (error?.response?.data?.message) { 
        setErrorHandler('login', error.response.data.message);
      } else {
        setErrorHandler('login', "Unable to login, please try again later");
      }
    });
    setLoading(false);

    if (formResponse?.token) {
      setToken(formResponse.token);
      const returnUrl = new URLSearchParams(window.location.search).get('returnUrl') || "/agent/dashboard";
      window.location = returnUrl;
    }
  };

  const forgotPasswordSubmit = async (e) => {
    e.preventDefault();
    
    const formResponse = await axios.get(`${process.env.REACT_APP_API_URL}/auth/forgot-password?email=${forgotEmail}&type=agent`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      if (response?.status !== 200) {
        setErrorHandler('reset', "Unable to reset password, please try again later");
      }

      console.log('reset-password-response', response);

      return response.data;
    }).catch(error => {
      console.log('reset-password-error', error);
      if (error?.response?.data?.errors) {
        setErrorHandler('reset', error.response.data.errors, "error", true);
      } else if (error?.response?.data?.message) { 
        setErrorHandler('reset', error.response.data.message);
      } else {
        setErrorHandler('reset', "Unable to reset password, please try again later");
      }
    });

    if (formResponse?.message) {
      setSuccessHandler(formResponse.message);
    }
    console.log('reset-password-final-response', formResponse);
  };

  const setErrorHandler = (type = 'login', msg, param = "form", fullError = false) => {
    if (type === 'reset') {
      setResetPassErrors(fullError ? msg : [{ msg, param }])
      setTimeout(() => {
        setResetPassErrors([]);
      }, 3000);
      setResetPassSuccess("");
    } else {
      setErrors(fullError ? msg : [{ msg, param }])
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
                  To Your Account
                </h1>
              </div>
            </div>
          </div>
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
                  <div className="btn-wrapper mt-0">
                    <button className="theme-btn-1 btn btn-block" type="submit">
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
                          <form onSubmit={forgotPasswordSubmit} className="ltn__form-box">
                            <ResponseHandler errors={resetPassErrors} success={resetPassSuccess}/>
                            <input
                              type="email"
                              name="email"
                              placeholder="Type your register email*"
                              onChange={(e) => setForgotEmail(e.target.value)}
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
