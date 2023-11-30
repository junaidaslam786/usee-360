import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import OtpInput from "react-otp-input";
import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";
import AuthService from "../../services/auth";
import { setLoginToken } from "../../utils";

export default function OtpVerification({ user, token, responseHandler, onVerified }) {
  const [otpType, setOtpType] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingResend, setLoadingResend] = useState(false);
  const [preVerificationForm, setpreVerificationForm] = useState(true);
  const [validationForm, setvalidationForm] = useState(false);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [otp, setOtp] = useState("");

  const renderInput = (props, index) => (
    <input className="otp-input" {...props} autoFocus={index === 0} />
  );

  const handleChange = (otp) => setOtp(otp);

  const processOtpEmail = async (e) => {
    e.preventDefault();

    setLoading(true);
    await sendOtpEmail();
    setLoading(false);
  };

  const processOtpPhoneNumber = async (e) => {
    e.preventDefault();

    setLoading(true);
    await sendOtpPhoneNumber();
    setLoading(false);
  };

  const sendOtpEmail = async () => {
    const formResponse = await AuthService.sendOtp({ userId: user.id });

    if (formResponse?.error && formResponse?.message) {
      responseHandler(formResponse.message);
      return;
    }

    if (formResponse?.message) {
      responseHandler(formResponse.message, true);
      setpreVerificationForm(false);
      setvalidationForm(true);
      setMinutes(1);
    }

    return;
  };

  const sendOtpPhoneNumber = async (resend = false) => {
    const auth = getAuth();
    const appVerifier = window.recaptchaVerifier;

    await signInWithPhoneNumber(auth, user.phoneNumber, appVerifier)
      .then((confirmationResult) => {
        responseHandler("Otp sent successfully.", true);
        window.confirmationResult = confirmationResult;
        setpreVerificationForm(false);
        setvalidationForm(true);
        setMinutes(1);

        if (!resend) {
          window.recaptchaVerifier = new RecaptchaVerifier(
            "recaptcha-container",
            {},
            auth
          );
          window.recaptchaVerifier.render();
        }
      })
      .catch(() => {
        responseHandler([
          "Unable to send code to phone number, please try again",
        ]);
      });
  };

  const resendOtp = async (e) => {
    e.preventDefault();

    if (!(minutes === 0 && seconds === 0)) {
      responseHandler(["OTP already sent, please wait."]);
      return;
    }

    setLoadingResend(true);
    if (otpType === "phoneNumber") {
      await sendOtpPhoneNumber(true);
    } else {
      await sendOtpEmail();
    }
    setLoadingResend(false);
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
      const formResponse = await AuthService.validateOtp(
        {
          otp,
          type: otpType,
        },
        token
      );
      setLoading(false);

      if (formResponse?.error && formResponse?.message) {
        responseHandler(formResponse.message);
        return;
      }

      // If OTP validation is successful, we now check if the user is active.
      if (!formResponse.user.active) {
        // If the user is not active, we stop the process and show a message.
        setLoading(false);
        responseHandler(
          "Your account is not active and requires approval from the SuperAdmin. It will take 24-48 hours to approve your account."
        );
        // Optionally, you can redirect the user to a different page or perform some action.
        // navigate('/some-approval-pending-page');
        return; // Stop further execution.
      }

      responseHandler("Account verified successfully.", true);
      onVerified && onVerified(formResponse.user, token);
      // redirectUser(token);
    }
  };

  // const redirectUser = (token) => {
  //   let returnUrl;

  //   setLoginToken(token);
  //   returnUrl =
  //     new URLSearchParams(window.location.search).get("returnUrl") ||
  //     `/${user.userType}/dashboard`;

  //   setTimeout(() => {
  //     window.location = returnUrl;
  //   }, 1000);
  // };

  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(myInterval);
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);

    return () => {
      clearInterval(myInterval);
    };
  });

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
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {},
      auth
    );
    window.recaptchaVerifier.render();
  }, []);

  return (
    <React.Fragment>
      {preVerificationForm ? (
        <form
          onSubmit={
            otpType === "phoneNumber" ? processOtpPhoneNumber : processOtpEmail
          }
          className="ltn__form-box contact-form-box"
        >
          <div className="row">
            <label>Verify By: </label>
            <div onChange={(e) => setOtpType(e.target.value)}>
              <label className="checkbox-item mr_20">
                Phone Number
                <input type="radio" name="otpType" value="phoneNumber" />
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
              {loading ? (
                <div className="lds-ring">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              ) : (
                "Send"
              )}
            </button>
          </div>
        </form>
      ) : null}

      {validationForm ? (
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
          {otpType === "phoneNumber" ? (
            <div className="mt-4 mb-4" style={{ textAlign: "center" }}>
              <div
                id="recaptcha-container"
                style={{ display: "inline-block" }}
              ></div>
            </div>
          ) : null}
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
                "Verify"
              )}
            </button>

            <button
              disabled={!(minutes === 0 && seconds === 0)}
              className="btn btn-effect-3 btn-white"
              type="button"
              onClick={resendOtp}
            >
              {loadingResend ? (
                <div className="lds-ring">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              ) : (
                "Resend OTP"
              )}
            </button>

            {!(minutes === 0 && seconds === 0) && (
              <h5 className="text-center mt-20">
                <span>
                  Time Remaining: {minutes}:
                  {seconds < 10 ? "0" + seconds : seconds}
                </span>
              </h5>
            )}
          </div>
        </form>
      ) : null}
    </React.Fragment>
  );
}
