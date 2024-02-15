import React, { useState, useEffect, useContext } from "react";
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
import { getUserDetailsFromJwt, getUserDetailsFromJwt2 } from "../../utils";
import UserService from "../../services/agent/user";
import { AuthContext } from "./AuthContext";

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
  const [userId, setUserId] = useState("");
  const [token, setToken] = useState("");

  const location = useLocation();

  const { setAuthState } = useContext(AuthContext);

  useEffect(() => {
    const queryParams = new URLSearchParams(props.location.search);
    const token = queryParams.get("token");
    
    const fetchDetails = async () => {
      const decoded = await getUserDetailsFromJwt(token);
      const [firstName, lastName] = decoded.name.split(' ');
      console.log(decoded.id);
      setFirstName(firstName);
      setLastName(lastName || '');
      setUserId(decoded.id);
      setEmail(decoded.email);
      setPhoneNumber(decoded.phoneNumber);
      
    }
    fetchDetails();
    // setAuthState({ token, isAuthenticated: true });
    // const wrapToken = `"${token}"`;
    console.log(token);
    if (token) {
      setToken(token);
      localStorage.setItem("userToken", "\""+token+"\"")
      fetchUserDetails();
    }
  }, [props.location.search]);

  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
    const cities = City.getCitiesOfCountry(selectedOption.value);
    const cityOptions = cities.map((city) => ({
      value: city.name,
      label: city.name,
    }));
    setCityOptions(cityOptions);
  };

  const handleCityChange = (selectedCity) => {
    // Handle city selection
    setSelectedCity(selectedCity);
    setShowTraderORNField(selectedCity.label === "Dubai");
  };

  const jobTitleHandler = (e) => {
    setJobTitle(e);
    setJobTitlePlaceHolder(
      e.value === "landlord" ? DEFAULT_DEED_TITLE_TEXT : DEFAULT_LICENSE_NO_TEXT
    );
    setDocumentLabel(
      e.value === "landlord"
        ? UPLOAD_DOCUMENT_LANDLORD
        : UPLOAD_DOCUMENT_DEFAULT
    );
  };

  const setPhoneNumberHandler = async (phoneNumber) => {
    setPhoneNumber(phoneNumber);

    const formResponse = await AuthService.checkFieldExist(
      `?phone=${encodeURIComponent(phoneNumber)}`
    );
    if (formResponse?.error && formResponse?.message) {
      props.responseHandler(formResponse.message);
    }
  };

  const setEmailHandler = async (email) => {
    setEmail(email);

    const formResponse = await AuthService.checkFieldExist(
      `?email=${encodeURIComponent(email)}`
    );
    if (formResponse?.error && formResponse?.message) {
      props.responseHandler(formResponse.message);
    }
  };

  const fetchUserDetails = async () => {
    try {
      console.log(userId);
      const response = await UserService.detail(userId);
      console.log(response);
      if (response) {
        // const user = response.user;
        // setUser(user);
        // setCompanyName(user.company_name);
        // setFirstName(user.first_name);
        // setLastName(user.last_name);
        // setSelectedCountry(user.country);
        // setCityOptions(City.getCityNames(user.country));
        // setSelectedCity(user.city);
        // setCompanyPosition(user.company_position);
        // setJobTitle(user.job_title);
        // setLicenseNo(user.license_no);
        // setEmail(user.email);
        // setPhoneNumber(user.phone_number);
      } else {
        toast.error("Invalid token");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const countryOptions = Country.getAllCountries().map((country) => ({
    value: country.isoCode,
    label: country.name,
  }));

  const updateUserProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      userId: userId,
      role: 'agent',
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
    const response = await UserService.update(data);
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
        {/* {user && ( */}
        <div className="row">
          <div className="col-lg-6 offset-lg-3">
            <div className="account-login-inner">
              <form
                onSubmit={updateUserProfile}
                className="ltn__form-box contact-form-box"
              >
                <input
                  type="text"
                  name="companyname"
                  placeholder="Company Name*"
                  onChange={(e) => setCompanyName(e.target.value)}
                  value={companyName}
                  required
                />
                <div className="row">
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="firstname"
                      placeholder="First Name*"
                      onChange={(e) => setFirstName(e.target.value)}
                      value={firstName}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="lastname"
                      placeholder="Last Name*"
                      onChange={(e) => setLastName(e.target.value)}
                      value={lastName}
                      required
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <input
                      type="text"
                      name="companyposition"
                      placeholder="Company Position*"
                      onChange={(e) => setCompanyPosition(e.target.value)}
                      value={companyPosition}
                      required
                    />
                  </div>
                </div>
                <div className="row mb-30">
                  <div className="col-md-12">
                    <Select
                      className="mb-0"
                      classNamePrefix="custom-select"
                      options={countryOptions}
                      onChange={handleCountryChange}
                      value={selectedCountry}
                      placeholder="Select Country"
                      required
                    />
                  </div>
                </div>
                <div className="row mb-30">
                  <div className="col-md-12">
                    <Select
                      className="mb-0"
                      classNamePrefix="custom-select"
                      options={cityOptions}
                      onChange={handleCityChange}
                      value={selectedCity}
                      placeholder="Select City"
                      isDisabled={!selectedCountry}
                      required
                    />
                  </div>
                </div>
                {showTraderORNField && (
                  <div className="row">
                    <div className="col-md-12">
                      <input
                        type="text"
                        name="traderorn"
                        placeholder="Trader ORN"
                        onChange={(e) => setShowTraderORNField(e.target.value)}
                        // value={showTraderORNField}
                        required
                      />
                    </div>
                  </div>
                )}
                <div className="row mb-30">
                  <div className="col-md-12">
                    <Select
                      className="mb-0"
                      classNamePrefix="custom-select"
                      options={JOB_TITLE}
                      onChange={(e) => jobTitleHandler(e)}
                      value={jobTitle}
                      required
                    />
                  </div>
                </div>
                {jobTitle ? (
                  <div className="input-item mb-30">
                    <span className="m-0 p-0">{documentLabel}</span>
                    <input
                      type="file"
                      className="btn theme-btn-3 w_100"
                      onChange={(e) => setDocument(e.target.files[0])}
                      required
                    />
                  </div>
                ) : null}
                <div className="row">
                  <div className="col-md-12">
                    <input
                      type="text"
                      name="licenseNo"
                      placeholder={jobTitlePlaceHolder}
                      onChange={(e) => setLicenseNo(e.target.value)}
                      value={licenseNo}
                      required
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email*"
                      onChange={(e) => setEmailHandler(e.target.value)}
                      value={email}
                      required
                    />
                  </div>
                </div>
                <small>Phone Number: {phoneNumber}</small>
                <PhoneInput
                  className="phoneInput"
                  type="text"
                  defaultCountry="AE"
                  placeholder="Phone Number*"
                  onChange={(e) => setPhoneNumberHandler(e)}
                  limitMaxLength={true}
                  value={phoneNumber}
                  required
                />
                <small>
                  Password must Contain 8 Characters, One Uppercase, One
                  Lowercase, One Number and One Special Case Character.
                </small>
                <div className="row">
                  <div className="col-md-6">
                    <input
                      type="password"
                      name="password"
                      placeholder="Password*"
                      onChange={(e) => setPassword(e.target.value)}
                      pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}"
                      title="Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character."
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="password"
                      name="confirmpassword"
                      placeholder="Confirm Password*"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}"
                      title="Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character."
                      required
                    />
                  </div>
                  <PasswordChecklist
                    rules={["minLength", "specialChar", "number", "capital"]}
                    minLength={8}
                    value={password}
                    valueAgain={confirmPassword}
                    messages={{
                      minLength: "Must be 8 characters.",
                      specialChar: "Must contains special character.",
                      number: "Must contains a number.",
                      capital: "Must contains a capital letter.",
                    }}
                  />
                </div>
                {/* <div id="recaptcha-container" className="mb-30"></div> */}

                <div className="btn-wrapper text-center">
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
                      "CREATE ACCOUNT"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* )} */}
      </div>
    </div>
  );
};

export default withRouter(SocialRegisterForm);
