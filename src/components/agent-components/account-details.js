import React from "react";

export default function AccountDetails() {
  return (
    <div>
      <h4 className="title-2">Account Details</h4>
      <div className="ltn__myaccount-tab-content-inner">
        <div className="ltn__form-box">
          <form action="#">
            <div className="row mb-50">
              <div className="col-md-6">
                <label>First Name</label>
                <input type="text" name="ltn__name" placeholder="First Name" />
              </div>
              <div className="col-md-6">
                <label>Last Name</label>
                <input type="text" name="ltn__name" placeholder="Last Name" />
              </div>
              <div className="col-md-6">
                <label>Company Position</label>
                <input type="text" name="ltn__name" placeholder="Company Position" />
              </div>
              <div className="col-md-6">
                <label>Email</label>
                <input type="email" name="ltn__name" placeholder="Email" />
              </div>
              <div className="col-md-6">
                <label>Phone Number</label>
                <input type="text" name="ltn__name" placeholder="Phone Number" />
              </div>
              <div className="col-md-6">
                <label>Mobile Number</label>
                <input type="text" name="ltn__name" placeholder="Mobile Number" />
              </div>
              <div className="col-md-6">
                <label>Company Name</label>
                <input type="text" name="ltn__name" placeholder="Company Name" />
              </div>
              <div className="col-md-6">
                <label>Business Address</label>
                <input type="text" name="ltn__name" placeholder="Business Address" />
              </div>
              <div className="col-md-6">
                <label>Postal Code</label>
                <input type="text" name="ltn__name" placeholder="Postal Code" />
              </div>
              <div className="col-md-6">
                <label>City</label>
                <input type="text" name="ltn__name" placeholder="City" />
              </div>
              <div className="col-md-6">
                <label>Mortgage Advisor Email</label>
                <input type="text" name="ltn__name" placeholder="Mortgage Advisor Email" />
              </div>
              <div className="col-md-6">
                <label>Logo</label>
                <input type="file" name="ltn__name" />
              </div>
            </div>
            <h4 className="title-2">Change Password</h4>
            <div className="row mb-50">
              <div className="col-md-12">
                <label>
                  Current password (leave blank to leave unchanged):
                </label>
                <input type="password" name="ltn__name" />
                <label>New password (leave blank to leave unchanged):</label>
                <input type="password" name="ltn__lastname" />
                <label>Confirm new password:</label>
                <input type="password" name="ltn__lastname" />
              </div>
            </div>
            <h4 className="title-2">Embeded Code</h4>
            <div className="row mb-50">
              <div className="col-lg-10">
                <p>Please click the API button to see the API code and copy the code and insert it in your website.</p>
              </div>
              <div className="col-lg-2">
                <button className="btn theme-btn-2">API</button>
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
    </div>
  );
}
