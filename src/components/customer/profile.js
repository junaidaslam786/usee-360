import React, { useState, useEffect } from "react";
import TimezoneDetail from "../partial/timezone-detail";
import { USER_TYPE } from "../../constants";
import { setLoginToken } from "../../utils";
import ProfileService from "../../services/profile";
import UpdatePassword from "../partial/update-password";

export default function Profile(props) {
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [city, setCity] = useState();
  const [profileImage, setProfileImage] = useState();
  const [profileImagePreview, setProfileImagePreview] = useState();
  const [loading, setLoading] = useState();

  const getUser = async () => {
    const jsonData = await ProfileService.getProfile();
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
    
    setLoading(true);
    const formResponse = await ProfileService.updateProfile(formdata);
    setLoading(false);

    if (formResponse?.error && formResponse?.message) {
      props.responseHandler(formResponse.message);
      return;
    }

    if (formResponse?.token) {
      props.responseHandler(formResponse.message, true);
      setLoginToken(formResponse.token);
    }
  };

  const onProfileImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setProfileImage(event.target.files[0]);
      setProfileImagePreview(URL.createObjectURL(event.target.files[0]));
    }
  }

  useEffect(() => {
    const getUserProfile = async () => {
      await getUser();
    };

    getUserProfile();
  }, []);

  return (
    <div>
      <h4 className="title-2">Account Details</h4>
      <div className="ltn__myaccount-tab-content-inner">
        <div className="ltn__form-box">
          <form onSubmit={updateProfile}>
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
          <TimezoneDetail type={USER_TYPE.CUSTOMER} responseHandler={props.responseHandler}/>
          <UpdatePassword responseHandler={props.responseHandler}/>
        </div>
      </div>
    </div>
  );
}
