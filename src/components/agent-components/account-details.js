import React, { useState, useEffect } from "react";
import Layout from "./layouts/layout";
import axios from "axios";

export default function AccountDetails() {
  const [success, setSuccess] = useState();
  const [error, setError] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [companyPosition, setCompanyPosition] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [mobileNumber, setMobileNumber] = useState();
  const [companyName, setCompanyName] = useState();
  const [companyAddress, setCompanyAddress] = useState();
  const [zipCode, setZipCode] = useState();
  const [city, setCity] = useState();
  const [mortgageAdvisorEmail, setMortgageAdvisorEmail] = useState();
  const [companyLogo, setCompanyLogo] = useState();
  const [loading, setLoading] = useState();

  const token = JSON.parse(sessionStorage.getItem("agentToken"));
  const getUser = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/user/profile`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const jsonData = await response.json();
    setFirstName(jsonData.firstName);
    setLastName(jsonData.lastName);
    setCompanyPosition(jsonData.agent.companyPosition);
    setPhoneNumber(jsonData.phoneNumber);
    setMobileNumber(jsonData.agent.mobileNumber);
    setCompanyName(jsonData.agent.companyName);
    setCompanyAddress(jsonData.agent.companyAddress);
    setZipCode(jsonData.agent.zipCode);
    setMortgageAdvisorEmail(jsonData.agent.mortgageAdvisorEmail);
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    let formdata = new FormData();
    formdata.append("firstName", firstName);
    formdata.append("lastName", lastName);
    formdata.append("companyPosition", companyPosition);
    formdata.append("phoneNumber", phoneNumber);
    formdata.append("mobileNumber", mobileNumber);
    formdata.append("companyName", companyName);
    formdata.append("companyAddress", companyAddress);
    formdata.append("zipCode", zipCode);
    formdata.append("city", city);
    formdata.append("mortgageAdvisorEmail", mortgageAdvisorEmail);
    formdata.append("companyLogo", companyLogo);

    await axios
      .put(`${process.env.REACT_APP_API_URL}/user/profile`, formdata, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setSuccess(response.data.message);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.response.data.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <Layout>
      <div>
        <h4 className="title-2">Account Details</h4>
        <div className="ltn__myaccount-tab-content-inner">
          <div className="ltn__form-box">
            <form onSubmit={updateProfile}>
              {success ? (
                <div className="alert alert-success" role="alert">
                  {success}
                </div>
              ) : (
                ""
              )}
              {error ? (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              ) : (
                ""
              )}
              <div className="row">
                <div className="col-md-6">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="ltn__name"
                    placeholder="First Name"
                    onChange={(e) => setFirstName(e.target.value)}
                    defaultValue={firstName}
                  />
                </div>
                <div className="col-md-6">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="ltn__name"
                    placeholder="Last Name"
                    onChange={(e) => setLastName(e.target.value)}
                    defaultValue={lastName}
                  />
                </div>
                <div className="col-md-6">
                  <label>Company Position</label>
                  <input
                    type="text"
                    name="ltn__name"
                    placeholder="Company Position"
                    onChange={(e) => setCompanyPosition(e.target.value)}
                    defaultValue={companyPosition}
                  />
                </div>
                <div className="col-md-6">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    name="ltn__name"
                    placeholder="Phone Number"
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    defaultValue={phoneNumber}
                  />
                </div>
                <div className="col-md-6">
                  <label>Mobile Number</label>
                  <input
                    type="text"
                    name="ltn__name"
                    placeholder="Mobile Number"
                    onChange={(e) => setMobileNumber(e.target.value)}
                    defaultValue={mobileNumber}
                  />
                </div>
                <div className="col-md-6">
                  <label>Company Name</label>
                  <input
                    type="text"
                    name="ltn__name"
                    placeholder="Company Name"
                    onChange={(e) => setCompanyName(e.target.value)}
                    defaultValue={companyName}
                  />
                </div>
                <div className="col-md-6">
                  <label>Company Address</label>
                  <input
                    type="text"
                    name="ltn__name"
                    placeholder="Company Address"
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    defaultValue={companyAddress}
                  />
                </div>
                <div className="col-md-6">
                  <label>Zip Code</label>
                  <input
                    type="text"
                    name="ltn__name"
                    placeholder="Zip Code"
                    onChange={(e) => setZipCode(e.target.value)}
                    defaultValue={zipCode}
                  />
                </div>
                <div className="col-md-6">
                  <label>City</label>
                  <input
                    type="text"
                    name="ltn__name"
                    placeholder="City"
                    onChange={(e) => setCity(e.target.value)}
                    defaultValue={city}
                  />
                </div>
                <div className="col-md-6">
                  <label>Mortgage Advisor Email</label>
                  <input
                    type="text"
                    name="ltn__name"
                    placeholder="Mortgage Advisor Email"
                    onChange={(e) => setMortgageAdvisorEmail(e.target.value)}
                    defaultValue={mortgageAdvisorEmail}
                  />
                </div>
                <div className="col-md-6">
                  <label>Company Logo</label>
                  <input
                    type="file"
                    name="ltn__name"
                    onChange={(e) => setCompanyLogo(e.target.files[0])}
                  />
                </div>
              </div>
              <div className="btn-wrapper">
                <button
                  type="submit"
                  className="btn theme-btn-1 btn-effect-1 text-uppercase"
                >
                  {loading ? (
                    <div className="lds-ring">
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
            <form>
              <h4 className="title-2 mt-100">Change Password</h4>
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
            <h4 className="title-2 mt-100">Embeded Code</h4>
            <div className="row mb-50">
              <div className="col-lg-10">
                <p>
                  Please click the API button to see the API code and copy the
                  code and insert it in your website.
                </p>
              </div>
              <div className="col-lg-2">
                <button className="btn theme-btn-2">API</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
