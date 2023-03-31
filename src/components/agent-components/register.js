import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

function getToken() {
  const tokenString = sessionStorage.getItem("agentToken");
  const userToken = JSON.parse(tokenString);
  return userToken;
}

export default function Register() {
  const token = getToken();
  const history = useHistory();

  if (token) {
    history.goBack();
  }

  const [companyName, setCompanyName] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [companyPosition, setCompanyPosition] = useState();
  const [email, setEmail] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState();

  function setToken(token) {
    sessionStorage.setItem("agentToken", JSON.stringify(token));
  }

  async function registerUser(credentials) {
    return fetch(`${process.env.REACT_APP_API_URL}/auth/register-agent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    }).then((data) => data.json());
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await registerUser({
      companyName,
      firstName,
      lastName,
      companyPosition,
      email,
      phoneNumber,
      password,
      confirmPassword,
    });
    if (response.token) {
      setToken(response.token);
      window.location = "/agent/dashboard";
    } else {
      setError(response.message);
    }
    setLoading(false);
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
                Your Account
              </h1>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6 offset-lg-3">
            <div className="account-login-inner">
              <form
                onSubmit={handleSubmit}
                className="ltn__form-box contact-form-box"
              >
                {error ? (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                ) : (
                  ""
                )}
                <input
                  type="text"
                  name="companyname"
                  placeholder="Company Name*"
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
                <div className="row">
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="firstname"
                      placeholder="First Name*"
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="lastname"
                      placeholder="Last Name*"
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <input
                  type="text"
                  name="companyposition"
                  placeholder="Company Position*"
                  onChange={(e) => setCompanyPosition(e.target.value)}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email*"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="Phone Number*"
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
                <div className="row">
                  <div className="col-md-6">
                    <input
                      type="password"
                      name="password"
                      placeholder="Password*"
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="password"
                      name="confirmpassword"
                      placeholder="Confirm Password*"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <label className="checkbox-inline">
                  <input type="checkbox" defaultValue />
                  &nbsp; I consent to Herboil processing my personal data in
                  order to send personalized marketing material in accordance
                  with the consent form and the privacy policy.
                </label>
                <label className="checkbox-inline">
                  <input type="checkbox" defaultValue /> &nbsp; By clicking
                  "create account", I consent to the privacy policy.
                </label>
                <div className="btn-wrapper">
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
              <div className="by-agree text-center">
                <p>By creating an account, you agree to our:</p>
                <p>
                  <a href="#">
                    TERMS OF CONDITIONS &nbsp; &nbsp; | &nbsp; &nbsp; PRIVACY
                    POLICY
                  </a>
                </p>
                <div className="go-to-btn mt-50 go-top">
                  <Link to="/agent/login">ALREADY HAVE AN ACCOUNT ?</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
