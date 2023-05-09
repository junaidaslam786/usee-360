import React, { useState } from "react";
import { Link } from "react-router-dom";
import ResponseHandler from "../global-components/respones-handler";
import { JOB_TITLE, DEFAULT_LICENSE_NO_TEXT, DEFAULT_DEED_TITLE_TEXT } from "../../constants";
import Select from "react-select";

export default function Register() {
  const [companyName, setCompanyName] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [companyPosition, setCompanyPosition] = useState();
  const [jobTitle, setJobTitle] = useState();
  const [licenseNo, setLicenseNo] = useState();
  const [email, setEmail] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [jobTitlePlaceHolder, setJobTitlePlaceHolder] = useState(DEFAULT_LICENSE_NO_TEXT);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState();

  function setToken(token) {
    localStorage.setItem("agentToken", JSON.stringify(token));
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
      jobTitle: jobTitle?.value ? jobTitle.value : "",
      licenseNo,
    });
    if (response.token) {
      setToken(response.token);
      window.location = "/agent/dashboard";
    } else {
      if (response?.errors) {
        setErrors(response.errors);
      } else {
        setErrors([
          {
            msg: "Unable to register agent, please try again later",
            param: "form",
          },
        ]);
      }

      setTimeout(() => {
        setErrors([]);
      }, 3000);
    }
    setLoading(false);
  };

  const jobTitleHandler = (e) => {
    setJobTitle(e);
    setJobTitlePlaceHolder(e.value === "landlord" ? DEFAULT_DEED_TITLE_TEXT : DEFAULT_LICENSE_NO_TEXT);
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
                Your { process.env.REACT_APP_AGENT_ENTITY_LABEL } Account
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
                <div className="row">
                  <div className="col-md-12">
                    <input
                      type="text"
                      name="companyposition"
                      placeholder="Company Position*"
                      onChange={(e) => setCompanyPosition(e.target.value)}
                      required
                    />
                  </div>
                </div>
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
                <div className="row">
                  <div className="col-md-12">
                    <input
                      type="text"
                      name="licenseNo"
                      placeholder={jobTitlePlaceHolder}
                      onChange={(e) => setLicenseNo(e.target.value)}
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
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
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
                <ResponseHandler errors={errors} />
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
              <div className="by-agree text-center">
                <p>By creating an account, you agree to our:</p>
                <p>
                  <Link to={`/terms-and-conditions`}>
                    TERMS OF CONDITIONS &nbsp; &nbsp; | &nbsp; &nbsp; PRIVACY
                    POLICY
                  </Link>
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
