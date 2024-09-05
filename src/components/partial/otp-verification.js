// import React, { useEffect, useState } from "react";
// import { initializeApp } from "firebase/app";
// import OtpInput from "react-otp-input";
// import {
//   getAuth,
//   signInWithPhoneNumber,
//   RecaptchaVerifier,
// } from "firebase/auth";
// import AuthService from "../../services/auth";
// import { setLoginToken } from "../../utils";
// import { toast } from "react-toastify";
// import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

// export default function OtpVerification({
//   user,
//   token,
//   responseHandler,
//   onVerified,
// }) {
//   const [otpType, setOtpType] = useState();
//   const [loading, setLoading] = useState(false);
//   const [loadingResend, setLoadingResend] = useState(false);
//   const [preVerificationForm, setpreVerificationForm] = useState(true);
//   const [validationForm, setvalidationForm] = useState(false);
//   const [minutes, setMinutes] = useState(0);
//   const [seconds, setSeconds] = useState(0);
//   const [otp, setOtp] = useState("");

//   const history = useHistory();

//   const renderInput = (props, index) => (
//     <input className="otp-input" {...props} autoFocus={index === 0} />
//   );

//   const handleChange = (otp) => setOtp(otp);

//   const processOtpEmail = async (e) => {
//     e.preventDefault();

//     setLoading(true);
//     await sendOtpEmail();
//     setLoading(false);
//   };

//   const processOtpPhoneNumber = async (e) => {
//     e.preventDefault();

//     setLoading(true);
//     await sendOtpPhoneNumber();
//     setLoading(false);
//   };

//   const sendOtpEmail = async () => {
//     const formResponse = await AuthService.sendOtp({ userId: user.id });

//     if (formResponse?.error && formResponse?.message) {
//       responseHandler(formResponse.message);
//       return;
//     }

//     if (formResponse?.message) {
//       responseHandler(formResponse.message, true);
//       setpreVerificationForm(false);
//       setvalidationForm(true);
//       setMinutes(1);
//     }

//     return;
//   };

//   const sendOtpPhoneNumber = async (resend = false) => {
//     const auth = getAuth();
//     const appVerifier = window.recaptchaVerifier;

//     await signInWithPhoneNumber(auth, user.phoneNumber, appVerifier)
//       .then((confirmationResult) => {
//         responseHandler("Otp sent successfully.", true);
//         window.confirmationResult = confirmationResult;
//         setpreVerificationForm(false);
//         setvalidationForm(true);
//         setMinutes(1);

//         if (!resend) {
//           window.recaptchaVerifier = new RecaptchaVerifier(
//             "recaptcha-container",
//             {},
//             auth
//           );
//           window.recaptchaVerifier.render();
//         }
//       })
//       .catch(() => {
//         responseHandler([
//           "Unable to send code to phone number, please try again",
//         ]);
//       });
//   };

//   const resendOtp = async (e) => {
//     e.preventDefault();

//     if (!(minutes === 0 && seconds === 0)) {
//       responseHandler(["OTP already sent, please wait."]);
//       return;
//     }

//     setLoadingResend(true);
//     if (otpType === "phoneNumber") {
//       await sendOtpPhoneNumber(true);
//     } else {
//       await sendOtpEmail();
//     }
//     setLoadingResend(false);
//   };

//   const validateOtp = async (e) => {
//     e.preventDefault();
  
//     setLoading(true);
//     let proceed = true;
//     if (otpType === "phoneNumber") {
//       proceed = false;
//       await window.confirmationResult
//         .confirm(otp)
//         .then(() => {
//           proceed = true;
//         })
//         .catch(() => {
//           responseHandler(["Invalid Code"]);
//           setLoading(false);
//         });
//     }
  
//     if (proceed) {
//       const formResponse = await AuthService.validateOtp(
//         {
//           otp,
//           type: otpType,
//         },
//         token
//       );
  
//       if (formResponse?.error && formResponse?.message) {
//         responseHandler(formResponse.message);
//         setLoading(false);
//         return;
//       }
  
//       // Check if the user is an agent and if the account is not active
//       if (formResponse?.user?.userType === "agent" && !formResponse?.user?.active) {
//         setLoading(false);
//         responseHandler(
//           "Your account is not active and requires approval from the SuperAdmin. It will take 24-48 hours to approve your account."
//         );
//         history.push('/login');
//         return; // Stop further execution for agents whose account is not active.
//       }
  
//       responseHandler("Account verified successfully.", true);
//       onVerified && onVerified(formResponse.user, token);
//       if (formResponse?.user?.userType === "agent") {
//         toast.warn(
//           "Your request for trader has been received. Please wait for account approval"
//         );
//       }
//       redirectUser(formResponse?.token);
//       history.push('/register'); // Adjust the redirection path as needed.
//     }
//   };
  

//   const redirectUser = (token) => {
//     let returnUrl;

//     setLoginToken(token);
//     returnUrl =
//       new URLSearchParams(window.location.search).get("returnUrl") ||
//       `/${user.userType}/dashboard`;

//     setTimeout(() => {
//       window.location = returnUrl;
//     }, 1000);
//   };

//   useEffect(() => {
//     let myInterval = setInterval(() => {
//       if (seconds > 0) {
//         setSeconds(seconds - 1);
//       }
//       if (seconds === 0) {
//         if (minutes === 0) {
//           clearInterval(myInterval);
//         } else {
//           setMinutes(minutes - 1);
//           setSeconds(59);
//         }
//       }
//     }, 1000);

//     return () => {
//       clearInterval(myInterval);
//     };
//   });

//   useEffect(() => {
//     const firebaseConfig = {
//       apiKey: process.env.REACT_APP_API_KEY,
//       authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//       projectId: process.env.REACT_APP_PROJECT_ID,
//       storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//       messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
//       appId: process.env.REACT_APP_APP_ID,
//       measurementId: process.env.REACT_APP_MEASUREMENT_ID,
//     };

//     initializeApp(firebaseConfig);

//     const auth = getAuth();
//     window.recaptchaVerifier = new RecaptchaVerifier(
//       "recaptcha-container",
//       {},
//       auth
//     );
//     window.recaptchaVerifier.render();
//   }, []);

//   return (
//     <React.Fragment>
//       {preVerificationForm ? (
//         <form
//           onSubmit={
//             otpType === "phoneNumber" ? processOtpPhoneNumber : processOtpEmail
//           }
//           className="ltn__form-box contact-form-box"
//         >
//           <div className="row">
//             <label>Verify By: </label>
//             <div onChange={(e) => setOtpType(e.target.value)}>
//               <label className="checkbox-item mr_20">
//                 Phone Number
//                 <input type="radio" name="otpType" value="phoneNumber" />
//                 <span className="checkmark" />
//               </label>
//               <label className="checkbox-item">
//                 Email Address
//                 <input type="radio" name="otpType" value="emailAddress" />
//                 <span className="checkmark" />
//               </label>
//             </div>
//           </div>
//           <div id="recaptcha-container" className="mt-4 mb-4"></div>
//           <div className="btn-wrapper text-center">
//             <button
//               className="theme-btn-1 btn reverse-color btn-block"
//               type="submit"
//             >
//               {loading ? (
//                 <div className="lds-ring">
//                   <div></div>
//                   <div></div>
//                   <div></div>
//                   <div></div>
//                 </div>
//               ) : (
//                 "Send"
//               )}
//             </button>
//           </div>
//         </form>
//       ) : null}

//       {validationForm ? (
//         <form
//           className="ltn__form-box contact-form-box digit-group"
//           onSubmit={validateOtp}
//         >
//           <p className="text-center">Validate OTP (One Time Passcode)</p>
//           <div className="d-flex justify-content-center otp">
//             <OtpInput
//               value={otp}
//               onChange={handleChange}
//               numInputs={6}
//               isInputNum={true}
//               inputMode="numeric"
//               separator={<span>-</span>}
//               renderInput={renderInput}
//             />
//           </div>
//           {otpType === "phoneNumber" ? (
//             <div className="mt-4 mb-4" style={{ textAlign: "center" }}>
//               <div
//                 id="recaptcha-container"
//                 style={{ display: "inline-block" }}
//               ></div>
//             </div>
//           ) : null}
//           <div className="btn-wrapper text-center">
//             <button
//               className="theme-btn-1 btn reverse-color btn-block"
//               type="submit"
//             >
//               {loading ? (
//                 <div className="lds-ring">
//                   <div></div>
//                   <div></div>
//                   <div></div>
//                   <div></div>
//                 </div>
//               ) : (
//                 "Verify"
//               )}
//             </button>

//             <button
//               disabled={!(minutes === 0 && seconds === 0)}
//               className="btn btn-effect-3 btn-white"
//               type="button"
//               onClick={resendOtp}
//             >
//               {loadingResend ? (
//                 <div className="lds-ring">
//                   <div></div>
//                   <div></div>
//                   <div></div>
//                   <div></div>
//                 </div>
//               ) : (
//                 "Resend OTP"
//               )}
//             </button>

//             {!(minutes === 0 && seconds === 0) && (
//               <h5 className="text-center mt-20">
//                 <span>
//                   Time Remaining: {minutes}:
//                   {seconds < 10 ? "0" + seconds : seconds}
//                 </span>
//               </h5>
//             )}
//           </div>
//         </form>
//       ) : null}
//     </React.Fragment>
//   );
// }

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
      responseHandler("Failed to send OTP to phone number. Try again.");
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
  
      console.log('API response:', formResponse); // Inspect the response
  
      if (formResponse?.error) {
        responseHandler(formResponse.message);
        setLoading(false);
        return;
      }
  
      // Check if the user object is present
      if (formResponse?.user) {
        if (formResponse.user.userType === "agent" && !formResponse.user.active) {
          responseHandler(
            "Your account is inactive and requires SuperAdmin approval. Please wait 24-48 hours."
          );
          history.push("/agent/login");
          toast.warn("Your account is inactive and requires approval.");
          setLoading(false);
          return;
        }
  
        onVerified && onVerified(formResponse.user, token);
        responseHandler("Account verified successfully.", true);
  
        // Pass the user object to redirectUser only if it exists
        redirectUser(formResponse.token, formResponse.user);
      } else {
        responseHandler("User data is missing in the response.");
        setLoading(false);
      }
    }
  };
  
  

  // Redirect User based on User Type
  const redirectUser = (token, user) => {
    // Ensure user exists before accessing userType
    if (!user) {
      console.error("User is undefined, cannot redirect.");
      return;
    }
  
    setLoginToken(token);
  
    let returnUrl =
      new URLSearchParams(window.location.search).get("returnUrl") ||
      `/${user.userType}/dashboard`; // Safely access userType
  
    setTimeout(() => {
      window.location.href = returnUrl;
    }, 1000);
  };
  

  // Countdown Timer
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (seconds > 0) {
        setSeconds((prev) => prev - 1);
      } else if (minutes > 0) {
        setMinutes((prev) => prev - 1);
        setSeconds(59);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [seconds, minutes]);

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
              {loading ? <div className="lds-ring"><div></div><div></div><div></div><div></div></div> : "Send"}
            </button>
          </div>
        </form>
      ) : null}

      {validationForm && (
        <form className="ltn__form-box contact-form-box digit-group" onSubmit={validateOtp}>
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
            <button className="theme-btn-1 btn reverse-color btn-block" type="submit">
              {loading ? <div className="lds-ring"><div></div><div></div><div></div><div></div></div> : "Verify"}
            </button>

            <button
              disabled={!(minutes === 0 && seconds === 0)}
              className="btn btn-effect-3 btn-white"
              type="button"
              onClick={resendOtp}
            >
              {loadingResend ? <div className="lds-ring"><div></div><div></div><div></div><div></div></div> : "Resend OTP"}
            </button>

            {!(minutes === 0 && seconds === 0) && (
              <h5 className="text-center mt-20">
                <span>
                  Time Remaining: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                </span>
              </h5>
            )}
          </div>
        </form>
      )}
    </React.Fragment>
  );
}
