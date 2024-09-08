

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
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Modal from "react-modal";

export default function OtpVerification({
  user,
  token,
  responseHandler,
  onVerified,
}) {
  const [otpType, setOtpType] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingResend, setLoadingResend] = useState(false);
  const [preVerificationForm, setpreVerificationForm] = useState(true);
  const [validationForm, setvalidationForm] = useState(false);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [otp, setOtp] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const history = useHistory();

  const renderInput = (props, index) => (
    <input className="otp-input" {...props} autoFocus={index === 0} />
  );

  const handleChange = (otp) => setOtp(otp);

  // Process OTP Email
  const processOtpEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    await sendOtpEmail();
    setLoading(false);
  };

  // Process OTP Phone Number
  const processOtpPhoneNumber = async (e) => {
    e.preventDefault();
    setLoading(true);
    await sendOtpPhoneNumber();
    setLoading(false);
  };

  // Send OTP via Email
  const sendOtpEmail = async () => {
    try {
      const formResponse = await AuthService.sendOtp({ userId: user.id });

      if (formResponse?.error) {
        responseHandler(formResponse.message);
        return;
      }

      responseHandler(formResponse.message, true);
      setpreVerificationForm(false);
      setvalidationForm(true);
      setMinutes(1); // Set countdown timer
    } catch (error) {
      responseHandler("Error sending OTP via email.");
    }
  };

  // Send OTP via Phone Number
  const sendOtpPhoneNumber = async (resend = false) => {
    const auth = getAuth();
    const appVerifier = window.recaptchaVerifier;
  
    try {
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        user.phoneNumber,
        appVerifier
      );
      responseHandler("OTP sent successfully.", true);
      window.confirmationResult = confirmationResult;
      setpreVerificationForm(false);
      setvalidationForm(true);
      setMinutes(1); // Start countdown timer
    } catch (error) {
      console.error('Error sending OTP:', error.code, error.message);
      switch (error.code) {
        case 'auth/invalid-phone-number':
          responseHandler('The provided phone number is not valid.');
          break;
        case 'auth/recaptcha-not-enabled':
          responseHandler('reCAPTCHA verification is not enabled for this project.');
          break;
        case 'auth/recaptcha-check-failed':
          responseHandler('reCAPTCHA verification failed. Please try again.');
          break;
        case 'auth/too-many-requests':
          responseHandler('You have made too many requests. Please try again later.');
          break;
        default:
          responseHandler('An error occurred. Please try again.');
      }
    }
  };
  

  // Resend OTP Handler
  const resendOtp = async (e) => {
    e.preventDefault();

    if (!(minutes === 0 && seconds === 0)) {
      responseHandler("OTP already sent, please wait.");
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

  // OTP Validation
  const validateOtp = async (e) => {
    e.preventDefault();

    setLoading(true);
    let proceed = true;

    if (otpType === "phoneNumber") {
      proceed = false;
      await window.confirmationResult
        .confirm(otp)
        .then(() => (proceed = true))
        .catch(() => {
          responseHandler("Invalid OTP code.");
          setLoading(false);
        });
    }

    if (proceed) {
      const formResponse = await AuthService.validateOtp(
        { otp, type: otpType },
        token
      );

     

      if (formResponse?.error) {
        responseHandler(formResponse.message);
        setLoading(false);
        return;
      }

     
      responseHandler("Account verified successfully.", true);
      onVerified && onVerified(formResponse.user, token);
      setIsModalOpen(true);
      setLoading(false);

      // Clear reCAPTCHA verification instance to avoid timeout
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();  // Clear expired verifier
        window.recaptchaVerifier = new RecaptchaVerifier(
          "recaptcha-container",
          { size: "invisible" },  // You can use 'normal' for debugging
          getAuth()
        );
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    history.push("/agent/login"); // Redirect to agent login after closing the modal
  };

  // Redirect User based on User Type
  // const redirectUser = (token, user) => {
  //   // Ensure user exists before accessing userType
  //   if (!user) {
  //     console.error("User is undefined, cannot redirect.");
  //     return;
  //   }

  //   setLoginToken(token);

  //   let returnUrl =
  //     new URLSearchParams(window.location.search).get("returnUrl") ||
  //     `/${user.userType}/dashboard`; // Safely access userType

  //   setTimeout(() => {
  //     window.location.href = returnUrl;
  //   }, 1000);
  // };

  // Countdown Timer
  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     if (seconds > 0) {
  //       setSeconds((prev) => prev - 1);
  //     } else if (minutes > 0) {
  //       setMinutes((prev) => prev - 1);
  //       setSeconds(59);
  //     }
  //   }, 1000);

  //   return () => clearInterval(intervalId);
  // }, [seconds, minutes]);

  // Firebase Initialization
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
      {
        size: "invisible", // Try changing this to 'normal' to make the widget visible for debugging
        callback: (response) => {
          console.log("reCAPTCHA resolved successfully");
        },
        "expired-callback": () => {
          console.log("reCAPTCHA expired, please solve it again");
        },
      },
      auth
    );
  
    window.recaptchaVerifier.render().then((widgetId) => {
      window.recaptchaWidgetId = widgetId;
      console.log('reCAPTCHA Widget ID: ', widgetId);
    });
  }, []);

  return (
    <React.Fragment>
      {!isModalOpen && (
        <>
          {preVerificationForm ? (
            <form
              onSubmit={
                otpType === "phoneNumber"
                  ? processOtpPhoneNumber
                  : processOtpEmail
              }
              className="ltn__form-box contact-form-box"
            >
              <div className="row">
                <label>Verify By:</label>
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

          {validationForm && (
            <form
              className="ltn__form-box contact-form-box digit-group"
              onSubmit={validateOtp}
            >
              <p className="text-center">Enter OTP (One Time Passcode)</p>
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
                      {seconds < 10 ? `0${seconds}` : seconds}
                    </span>
                  </h5>
                )}
              </div>
            </form>
          )}
        </>
      )}
      {/* Modal for Account Approval Pending */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="MyNotes MyModal Modal-size-unset"
        overlayClassName="MyModalOverlay"
        contentLabel="Account Approval Modal"
      >
        <h2>Account Approval Pending</h2>
        <p>
          Thank you for signing up! Your account is currently under review by
          our admin team. You will be able to log in once your account has been
          approved.
        </p>
        <p>
          You will receive an email notification regarding the status of your
          account approval. Please allow some time for the review process.
        </p>
        <p>
          If you have any questions, feel free to contact our support team at{" "}
          <a href="mailto:info@usee-360.com">info@usee-360.com</a>.
        </p>
        <button
          onClick={closeModal}
          className="theme-btn-1 btn reverse-color btn-block"
        >
          Close
        </button>
      </Modal>
    </React.Fragment>
  );
}
