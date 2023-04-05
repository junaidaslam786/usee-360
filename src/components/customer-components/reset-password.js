import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ResponseHandler from '../global-components/respones-handler';
import { useHistory } from "react-router-dom";

export default function ResetPassword() {
  const params = useParams();

  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState();
  const [loading, setLoading] = useState();
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    const formResponse = await axios.post(`${process.env.REACT_APP_API_URL}/auth/reset-password`, {
      token: params.token,
      type: "customer",
      password,
      confirmPassword,
    }, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      if (response?.status !== 200) {
        setErrorHandler("Unable to reset password, please try again later");
      }

      console.log('reset-password-response', response);

      return response.data;
    }).catch(error => {
      console.log('reset-password-error', error);
      if (error?.response?.data?.errors) {
        setErrorHandler(error.response.data.errors, "error", true);
      } else if (error?.response?.data?.message) { 
        setErrorHandler(error.response.data.message);
      } else {
        setErrorHandler("Unable to reset password, please try again later");
      }
    });

    setLoading(false);
    if (formResponse?.message) {
      setSuccessHandler(formResponse.message);
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        history.push("/customer/login");
      }, 1000);
    }
    console.log('reset-password-final-response', formResponse);
  };

  const setErrorHandler = (msg, param = "form", fullError = false) => {
    setErrors(fullError ? msg : [{ msg, param }])
    setTimeout(() => {
      setErrors([]);
    }, 3000);
    setSuccess("");
  };

  const setSuccessHandler = (msg) => {
    setSuccess(msg);
    setTimeout(() => {
      setSuccess("");
    }, 3000);

    setErrors([]);
  };

  return (
    <div className="ltn__login-area pb-80">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="section-title-area text-center">
              <h1 className="section-title">Reset Password</h1>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6 offset-lg-3">
            <div className="account-login-inner">
              <form
                onSubmit={handleSubmit}
                className="ltn__form-box contact-form-box"
              >
                <ResponseHandler errors={errors} success={success}/>
                <input
                  type="password"
                  placeholder="New Password*"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Confirm Password*"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <div className="btn-wrapper">
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
                      "RESET PASSWORD"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
