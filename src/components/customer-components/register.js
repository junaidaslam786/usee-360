import React, { useState } from "react";
import { Link } from "react-router-dom";
import ResponseHandler from '../global-components/respones-handler';

export default function Register() {
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState();

  function setToken(token) {
    localStorage.setItem("customerToken", JSON.stringify(token));
  }

  async function registerUser(credentials) {
    return fetch(`${process.env.REACT_APP_API_URL}/auth/register-customer`, {
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
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    });
    if (response.token) {
      setToken(response.token);
      window.location = "/customer/dashboard";
    } else {
      if (response?.errors) {
        setErrors(response.errors);
      } else {
        setErrors([{ msg: "Unable to register customer, please try again later", param: "form" }])
      }
      
      setTimeout(() => {
        setErrors([]);
      }, 3000);
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
                Your Customer Account
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
                <ResponseHandler errors={errors}/>
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
                  type="email"
                  name="email"
                  placeholder="Email*"
                  onChange={(e) => setEmail(e.target.value)}
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
