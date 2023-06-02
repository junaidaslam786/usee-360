import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import OtpInput from "react-otp-input";
import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";
import { USER_TYPE } from "../../constants";
import AuthService from "../../services/auth";
import { setLoginToken } from "../../utils";

export default function OtpVerification({ user, token, responseHandler }) {
  const [otpType, setOtpType] = useState();
  const [loading, setLoading] = useState();
  const [preVerificationForm, setpreVerificationForm] = useState(true);
  const [validationForm, setvalidationForm] = useState(false);
  const [otp, setOtp] = useState("");

  const renderInput = (props, index) => (
    <input
      className="otp-input"
      {...props}
      autoFocus={index === 0}
    />
  );
  
  const handleChange = (otp) => setOtp(otp);

  const sendOtpEmail = async (e) => {
    e.preventDefault();

    setLoading(true);
    const formResponse = await AuthService.sendOtp({ userId: user.id });
    setLoading(false);

    if (formResponse?.error && formResponse?.message) {
      responseHandler(formResponse.message);
      return;
    }

    if (formResponse?.message) {
      responseHandler(formResponse.message, true);
      setpreVerificationForm(false);
      setvalidationForm(true);
    } 
  }

  const sendOtpPhoneNumber = async (e) => {
    e.preventDefault();
    setLoading(true);

    const auth = getAuth();
    const appVerifier = window.recaptchaVerifier;

    await signInWithPhoneNumber(auth, user.phoneNumber, appVerifier)
      .then((confirmationResult) => {
        responseHandler("Otp sent successfully.", true);
        window.confirmationResult = confirmationResult;
        setpreVerificationForm(false);
        setvalidationForm(true);
      })
      .catch((error) => {
        responseHandler("Unable to send code to phone number, please try again");
      });
      setLoading(false);
  };

  const validateOtp = async (e) => {
    e.preventDefault();

    setLoading(true);
    let proceed = true;
    if (otpType === "phoneNumber") {
        proceed = false;
        await window.confirmationResult
        .confirm(otp)
        .then(() => {
          proceed = true;
        })
        .catch(() => {
          responseHandler(["Invalid Code"]);
          setLoading(false);
        });
    }

    if (proceed) {
      const formResponse = await AuthService.validateOtp({
        otp,
        type: otpType
      }, token);
      setLoading(false);

      console.log('formResponse', formResponse);
      if (formResponse?.error && formResponse?.message) {
        responseHandler(formResponse.message);
        return;
      }

      responseHandler("Account verified successfully.", true);
      redirectUser(token);
    }
  }

  const redirectUser = (token) => {
    let returnUrl;

    setLoginToken(token);
    returnUrl = new URLSearchParams(window.location.search).get("returnUrl") || `/${user.userType}/dashboard`;

    setTimeout(() => {   
      window.location = returnUrl;
    }, 1000);
  }

  useEffect(() => {
    const firebaseConfig = {
      apiKey: process.env.REACT_APP_API_KEY,
      authDomain: process.env.REACT_APP_AUTH_DOMAIN,
      projectId: process.env.REACT_APP_PROJECT_ID,
      storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
      messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
      appId: process.env.REACT_APP_APP_ID,
      measurementId: process.env.REACT_APP_MEASUREMENT_ID,
    };

    initializeApp(firebaseConfig);

    const auth = getAuth();
    window.recaptchaVerifier = new RecaptchaVerifier("recaptcha-container", {}, auth);
    window.recaptchaVerifier.render();
  }, []);

  return (
    <React.Fragment>
      {
        preVerificationForm ? (
          <form
            onSubmit={ otpType === "phoneNumber" ? sendOtpPhoneNumber : sendOtpEmail }
            className="ltn__form-box contact-form-box"
          >
            <div className="row">
                <label>Verify By: </label>
                <div onChange={(e) => setOtpType(e.target.value)}>
                    <label className="checkbox-item mr_20" >
                      Phone Number
                      <input type="radio" name="otpType" value="phoneNumber"/>
                      <span className="checkmark" />
                    </label>
                    <label className="checkbox-item">
                      Email Address
                      <input type="radio" name="otpType" value="emailAddress" />
                      <span className="checkmark" />
                    </label>
                </div>
            </div>
            <div id="recaptcha-container" className="mt-4 mb-4"></div>
            <div className="btn-wrapper text-center">
                <button
                  className="theme-btn-1 btn reverse-color btn-block"
                  type="submit"
                >
                  {
                    loading ? (
                      <div className="lds-ring">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                      </div>
                    ) : (
                      "Send"
                    )
                  }
                </button>
            </div>
          </form>
        ) : null
      }

      {
        validationForm ? (
          <form
            className="ltn__form-box contact-form-box digit-group"
            onSubmit={validateOtp}
          >
            <p className="text-center">Validate OTP (One Time Passcode)</p>
            <div className="d-flex justify-content-center otp">
              <OtpInput
                value={otp}
                onChange={handleChange}
                numInputs={6}
                isInputNum={true}
                inputMode="numeric"
                separator={<span>-</span>}
                renderInput={renderInput}
              />
            </div>
            <div className="btn-wrapper text-center">
              <button
                className="theme-btn-1 btn reverse-color btn-block"
                type="submit"
              >
                {
                  loading ? (
                    <div className="lds-ring">
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  ) : (
                    "Verify"
                  )
                }
              </button>
            </div>
          </form>
        ) : null
      }
    </React.Fragment>
  );
}
