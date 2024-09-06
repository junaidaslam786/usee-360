import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthService from "../../services/auth";
import OtpVerification from "../partial/otp-verification";
import "react-phone-number-input/style.css";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import PasswordChecklist from "react-password-checklist";
import { getUserDetailsFromJwt, getUserDetailsFromJwt2, getUserDetailsFromJwt3 } from "../../utils"; // Utility to decode JWT and get user details
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export default function CustomerOnboarding(props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadOTpForm, setLoadOTpForm] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");


  const history = useHistory();

  // Fetch user details from the token in localStorage
  useEffect(() => {
    const token = localStorage.getItem("userToken") // Assuming the token is stored under 'token'
    console.log(token);
    if (token) {
      const userDetails = getUserDetailsFromJwt(); // Use decode function
      console.log("user details", userDetails);
      if (userDetails) {
        setFirstName(userDetails.firstName || "");
        setLastName(userDetails.lastName || "");
        setEmail(userDetails.email || "");
      }
    }
  }, []);
  const registerCustomer = async (e) => {
    e.preventDefault();

    let formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("phoneNumber", phoneNumber);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    formData.append("signupStep", 1);
    formData.append(
      "timezone",
      Intl.DateTimeFormat().resolvedOptions().timeZone
    );

    if (!isValidPhoneNumber(phoneNumber)) {
      props.responseHandler(["Invalid Phone Number"]);
      return;
    }

    setLoading(true);
    const formResponse = await AuthService.customerOnboarding(formData);
    setLoading(false);

    if (formResponse?.error && formResponse?.message) {
      props.responseHandler(formResponse.message);
      return;
    }

    if (formResponse?.token) {
      setUser(formResponse.user);
      setToken(formResponse.token);
      setLoadOTpForm(true);

      // Redirect to customer/dashboard after successful registration
    }
    history.push("/customer/dashboard");
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
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

  return (
    <div className="ltn__login-area pb-80 mt-120">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="section-title-area text-center">
              <h1 className="section-title">
                Customer Onboarding
              </h1>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6 offset-lg-3">
            <div className="account-login-inner">
              {loadOTpForm ? (
                <OtpVerification
                  user={user}
                  token={token}
                  responseHandler={props.responseHandler}
                />
              ) : (
                <form
                  onSubmit={registerCustomer}
                  className="ltn__form-box contact-form-box"
                >
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
                  <input
                    type="email"
                    name="email"
                    placeholder="Email*"
                    onChange={(e) => setEmailHandler(e.target.value)}
                    value={email}
                    required
                  />
                  <small>Phone Number: {phoneNumber}</small>
                  <PhoneInput
                    className="custom"
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
                        onChange={handlePassword}
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}"
                        title="Must Contain 10 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character."
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="password"
                        name="confirmpassword"
                        placeholder="Confirm Password*"
                        onChange={handleConfirmPassword}
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
                        "SUBMIT"
                      )}
                    </button>
                  </div>
                </form>
              )}

              <div className="by-agree text-center">
                <p>By creating an account, you agree to our:</p>
                <p>
                  <Link to={`/terms-and-conditions`}>
                    TERMS OF CONDITIONS &nbsp; &nbsp; | &nbsp; &nbsp; PRIVACY
                    POLICY
                  </Link>
                </p>
                <div className="go-to-btn mt-50 go-top">
                  <Link to="/customer/login">ALREADY HAVE AN ACCOUNT ?</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
