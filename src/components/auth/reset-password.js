import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import AuthService from "../../services/auth";

export default function ResetPassword({ type, responseHandler }) {
  const params = useParams();

  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [loading, setLoading] = useState();
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    const formResponse = await AuthService.resetPassword({
      token: params.token,
      type,
      password,
      confirmPassword,
    });
    setLoading(false);

    if (formResponse?.error && formResponse?.message) {
      responseHandler(formResponse.message);
      return;
    }
    
    if (formResponse?.message) {
      responseHandler(formResponse.message, true);
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        history.push(`/${type}/login`);
      }, 1000);
    }
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
                    {
                      loading ? (
                        <div className="lds-ring">
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                        </div>
                      ) : (
                        "RESET PASSWORD"
                      )
                    }
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
