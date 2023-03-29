import React from "react";
import Layout from "./layouts/layout";

export default function MyProfile() {
  return (
    <Layout>
      <div className="ltn__myaccount-tab-content-inner">
        <div className="ltn__form-box">
          <form action="#">
            <h4 className="title-2">Account Details</h4>
            <div className="row mb-50">
              <div className="col-md-6">
                <label>First name:</label>
                <input type="text" name="ltn__name" placeholder="First Name" />
              </div>
              <div className="col-md-6">
                <label>Last name:</label>
                <input
                  type="text"
                  name="ltn__lastname"
                  placeholder="Last Name"
                />
              </div>
              <div className="col-md-6">
                <label>Display Name:</label>
                <input
                  type="text"
                  name="ltn__lastname"
                  placeholder="Display Name"
                />
              </div>
              <div className="col-md-6">
                <label>Display Email:</label>
                <input
                  type="email"
                  name="ltn__lastname"
                  placeholder="Display Email"
                />
              </div>
            </div>
            <h4 className="title-2">Change Password</h4>
            <div className="row">
              <div className="col-md-12">
                <label>
                  Current password (leave blank to leave unchanged):
                </label>
                <input
                  type="password"
                  name="ltn__name"
                  placeholder="Current Password"
                />
                <label>New password (leave blank to leave unchanged):</label>
                <input
                  type="password"
                  name="ltn__lastname"
                  placeholder="New Password"
                />
                <label>Confirm new password:</label>
                <input
                  type="password"
                  name="ltn__lastname"
                  placeholder="Confirm Password"
                />
              </div>
            </div>
            <div className="btn-wrapper">
              <button
                type="submit"
                className="btn theme-btn-1 btn-effect-1 text-uppercase"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
