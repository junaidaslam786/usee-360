import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthService from "../../services/auth";
import { USER_TYPE } from "../../constants";
import OtpVerification from "../partial/otp-verification";

export default function RegisterCustomer(props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [loading, setLoading] = useState(false);
  const [loadOTpForm, setLoadOTpForm] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");

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
    formData.append("timezone", Intl.DateTimeFormat().resolvedOptions().timeZone);

    setLoading(true);
    const formResponse = await AuthService.register(formData, USER_TYPE.CUSTOMER);
    setLoading(false);

    if (formResponse?.error && formResponse?.message) {
      props.responseHandler(formResponse.message);
      return;
    }

    if (formResponse?.token) {
      setUser(formResponse.user);
      setToken(formResponse.token);
      setLoadOTpForm(true);
    }
  }

  const setPhoneNumberHandler = async (phoneNumber) => {
    setPhoneNumber(phoneNumber);

    const formResponse = await AuthService.checkFieldExist(`?phone=${encodeURIComponent(phoneNumber)}`);
    if (formResponse?.error && formResponse?.message) {
      props.responseHandler(formResponse.message);
    }
  }

  const setEmailHandler = async (email) => {
    setEmail(email);

    const formResponse = await AuthService.checkFieldExist(`?email=${encodeURIComponent(email)}`);
    if (formResponse?.error && formResponse?.message) {
      props.responseHandler(formResponse.message);
    }
  }

  return (
    <div className="ltn__login-area pb-80">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="section-title-area text-center">
              <h1 className="section-title">
                Register
                <br />
                Your { process.env.REACT_APP_CUSTOMER_ENTITY_LABEL } Account
              </h1>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6 offset-lg-3">
            <div className="account-login-inner">
              {
                loadOTpForm ? (
                  <OtpVerification user={user} token={token} responseHandler={props.responseHandler} />
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
                    <small>Phone Number Hint: +971 5XXXX XXXX</small>
                    <input
                      type="text"
                      name="phoneNumber"
                      placeholder="PhoneNumber*"
                      onChange={(e) => setPhoneNumberHandler(e.target.value)}
                      value={phoneNumber}
                      required
                    />
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
                          "CREATE ACCOUNT"
                        )}
                      </button>
                    </div>
                  </form>
                )
              }

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
