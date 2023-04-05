import React, { useState, useEffect } from "react";
import Layout from "./layouts/layout";
import axios from "axios";
import ResponseHandler from '../global-components/respones-handler';

export default function AccountDetails() {
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [city, setCity] = useState();
  const [profileImage, setProfileImage] = useState();
  const [profileImagePreview, setProfileImagePreview] = useState();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState();
  const [success, setSuccess] = useState();
  const [error, setError] = useState();
  const [loadingPass, setLoadingPass] = useState();
  const [successPass, setSuccessPass] = useState();
  const [errorPass, setErrorPass] = useState();

  const token = JSON.parse(sessionStorage.getItem("customerToken"));
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
    setPhoneNumber(jsonData.phoneNumber);
    setCity(jsonData?.cityName ? jsonData.cityName : "");
    setProfileImagePreview(jsonData?.profileImage ? `${process.env.REACT_APP_API_URL}/${jsonData.profileImage}` : "");
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    let formdata = new FormData();
    formdata.append("firstName", firstName);
    formdata.append("lastName", lastName);
    formdata.append("phoneNumber", phoneNumber);
    formdata.append("city", city);
    formdata.append("profileImage", profileImage);
    
    await axios
      .put(`${process.env.REACT_APP_API_URL}/user/profile`, formdata, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setSuccessHandler('profile', response.data.message);
        setLoading(false);
      })
      .catch((error) => {
        if (error?.response?.data?.errors) {
          setErrorHandler("profile", error.response.data.errors, "error", true);
        } else if (error?.response?.data?.message) { 
          setErrorHandler("profile", error.response.data.message);
        } else {
          setErrorHandler();
          setErrorHandler("profile", "Unable to update profile, please try again later");
        }
        setLoading(false);
      });
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    setLoadingPass(true);

    if (newPassword !== confirmPassword) {
      setErrorHandler("password", "Password and confirm password did not match");
      setLoadingPass(false);
    } else {
      let formdata = new FormData();
      formdata.append("current", currentPassword);
      formdata.append("password", newPassword);

      await axios
        .put(
          `${process.env.REACT_APP_API_URL}/user/update-password`,
          formdata,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then(() => {
          setSuccessHandler('password', "Password updated successfully!");
          setLoadingPass(false);
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        })
        .catch((error) => {
          console.log('update-password-error', error);
          if (error?.response?.data?.errors) {
            setErrorHandler("password", error.response.data.errors, "error", true);
          } else if (error?.response?.data?.message) { 
            setErrorHandler("password", error.response.data.message);
          } else {
            setErrorHandler("password", "Unable to update password, please try again later");
          }
          setLoadingPass(false);
        });
    }
  };

  const onProfileImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setProfileImage(event.target.files[0]);
      setProfileImagePreview(URL.createObjectURL(event.target.files[0]));
    }
  }

  const setErrorHandler = (type, msg, param = "form", fullError = false) => {
    if (type === 'password') {
      setErrorPass(fullError ? msg : [{ msg, param }])
      setTimeout(() => {
        setErrorPass([]);
      }, 3000);
      setSuccessPass("");
    } else {
      setError(fullError ? msg : [{ msg, param }])
      setTimeout(() => {
        setError([]);
      }, 3000);
      setSuccess("");
    }
  };

  const setSuccessHandler = (type, msg) => {
    if (type === 'password') {
      setSuccessPass(msg);
      setTimeout(() => {
        setSuccessPass("");
      }, 3000);

      setErrorPass([]);
    } else {
      setSuccess(msg);
      setTimeout(() => {
        setSuccess("");
      }, 3000);

      setError([]);
    }
    
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
              <ResponseHandler errors={error} success={success}/>
              <div className="row mb-50">
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
                  <label>City</label>
                  <input
                    type="text"
                    name="ltn__name"
                    placeholder="City"
                    onChange={(e) => setCity(e.target.value)}
                    defaultValue={city}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <label>Profile Image</label>
                  <input
                    type="file"
                    name="ltn__name"
                    onChange={onProfileImageChange}
                  />
                </div>
                <div className="col-md-6">
                  {
                    profileImagePreview && (
                      <img
                        className="companyLogoCss"
                        src={profileImagePreview}
                        alt="No logo found"
                        width="300px"
                      />
                    )
                  }
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
            <h4 className="title-2 mt-100">Change Password</h4>
            <form onSubmit={updatePassword}>
              <ResponseHandler errors={errorPass} success={successPass}/>
              <div className="row">
                <div className="col-md-12">
                  <label>
                    Current password (leave blank to leave unchanged):
                  </label>
                  <input
                    type="password"
                    name="ltn__name"
                    placeholder="Current Password"
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    value={currentPassword}
                    required
                  />
                  <label>New password (leave blank to leave unchanged):</label>
                  <input
                    type="password"
                    name="ltn__lastname"
                    placeholder="New Password"
                    onChange={(e) => setNewPassword(e.target.value)}
                    value={newPassword}
                    required
                  />
                  <label>Confirm new password:</label>
                  <input
                    type="password"
                    name="ltn__lastname"
                    placeholder="Confirm Password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                    required
                  />
                </div>
              </div>
              <div className="btn-wrapper">
                <button
                  type="submit"
                  className="btn theme-btn-1 btn-effect-1 text-uppercase"
                >
                  {loadingPass ? (
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
          </div>
        </div>
      </div>
    </Layout>
  );
}
