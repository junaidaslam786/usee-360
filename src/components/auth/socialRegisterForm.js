import React, { useState, useEffect } from "react";
import { Link, useLocation, withRouter } from "react-router-dom";
import {
  JOB_TITLE,
  DEFAULT_LICENSE_NO_TEXT,
  DEFAULT_DEED_TITLE_TEXT,
  UPLOAD_DOCUMENT_DEFAULT,
  UPLOAD_DOCUMENT_LANDLORD,
  USER_TYPE,
} from "../../constants";
import Select from "react-select";
import AuthService from "../../services/auth";
import "react-phone-number-input/style.css";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import PasswordChecklist from "react-password-checklist";
import { toast } from "react-toastify";
import { Country, City } from "country-state-city";
import { getUserDetailsFromJwt } from "../../utils";

const SocialRegisterForm = (props) => {
  const [companyName, setCompanyName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [cityOptions, setCityOptions] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [showTraderORNField, setShowTraderORNField] = useState(false);
  const [companyPosition, setCompanyPosition] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [licenseNo, setLicenseNo] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [document, setDocument] = useState();
  const [jobTitlePlaceHolder, setJobTitlePlaceHolder] = useState(
    DEFAULT_LICENSE_NO_TEXT
  );
  const [documentLabel, setDocumentLabel] = useState();
  const [loading, setLoading] = useState(false);
  const [loadOTpForm, setLoadOTpForm] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");

  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(props.location.search);
    const token = queryParams.get('token');
    console.log(token);
    if (token) {
      setToken(token);
      fetchUserDetails();
    }
  }, [token, props.location.search]);

  const fetchUserDetails = async () => {
    try {
      const decoded = getUserDetailsFromJwt(token);
      if (decoded) {
        const user = decoded.user;
        setUser(user);
        setCompanyName(user.company_name);
        setFirstName(user.first_name);
        setLastName(user.last_name);
        setSelectedCountry(user.country);
        setCityOptions(City.getCityNames(user.country));
        setSelectedCity(user.city);
        setCompanyPosition(user.company_position);
        setJobTitle(user.job_title);
        setLicenseNo(user.license_no);
        setEmail(user.email);
        setPhoneNumber(user.phone_number);
      } else {
        toast.error("Invalid token");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updateUserProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      company_name: companyName,
      first_name: firstName,
      last_name: lastName,
      country: selectedCountry,
      city: selectedCity,
      company_position: companyPosition,
      job_title: jobTitle,
      license_no: licenseNo,
      email: email,
      phone_number: phoneNumber,
      password: password,
      document: document,
    };
    const response = await AuthService.updateUserProfile(token, data);
    if (response.status === 200) {
      toast.success(response.data.message);
      setLoading(false);
      setLoadOTpForm(true);
    } else {
      toast.error(response.data.message);
      setLoading(false);
    }
  };

  return (
    <div className="ltn__login-area pb-80">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="section-title-area text-center">
              <h1 className="section-title">
                Register
                <br />
                Your {process.env.REACT_APP_AGENT_ENTITY_LABEL} Account
              </h1>
            </div>
          </div>
        </div>
        {user && (
          <form onSubmit={updateUserProfile}>
            <div className="row ltn__form-box ltn__form-box-2 mb-50">
              <div className="col-md-6">
                <input
                  type="text"
                  name="companyName"
                  placeholder="Company Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <Select
                  options={Country.getNames()}
                  value={selectedCountry}
                  onChange={(e) => {
                    setSelectedCountry(e.value);
                    setCityOptions(City.getCityNames(e.value));
                    setSelectedCity("");
                  }}
                />
              </div>
              <div className="col-md-6">
                <Select
                  options={cityOptions}
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.value)}
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  name="companyPosition"
                  placeholder="Company Position"
                  value={companyPosition}
                  onChange={(e) => setCompanyPosition(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  name="jobTitle"
                  placeholder={jobTitlePlaceHolder}
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  name="licenseNo"
                  placeholder="License No"
                  value={licenseNo}
                  onChange={(e) => setLicenseNo(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <PhoneInput
                  international
                  defaultCountry="US"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e)}
                />
              </div>
              <div className="col-md-6">
                <PasswordChecklist
                  rules={["minLength", "specialChar", "number", "capital"]}
                  minLength={8}
                  value={password}
                  onChange={setPassword}
                />
              </div>
              <div className="col-md-6">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <input
                  type="file"
                  name="document"
                  onChange={(e) => setDocument(e.target.files[0])}
                />
              </div>
              <div className="col-md-12">
                <button
                  type="submit"
                  className="btn theme-btn-1 btn-effect-1 text-uppercase"
                >
                  Update Profile
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default withRouter(SocialRegisterForm);
