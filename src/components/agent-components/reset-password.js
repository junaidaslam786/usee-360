import React from "react";

export default function ResetPassword() {
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
              <form className="ltn__form-box contact-form-box">
                <input type="text" placeholder="Current Password*" required />
                <input type="text" placeholder="New Password*" required />
                <input type="text" placeholder="Confirm Password*" required />
                <div className="btn-wrapper">
                  <button className="theme-btn-1 btn reverse-color btn-block" type="submit">
                    RESET PASSWORD
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
