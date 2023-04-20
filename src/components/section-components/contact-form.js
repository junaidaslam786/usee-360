import React, { useState } from "react";
import axios from "axios";
import ResponseHandler from '../global-components/respones-handler';
import { useHistory } from 'react-router';

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState();
  const [loading, setLoading] = useState();
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    const formResponse = await axios.post(`${process.env.REACT_APP_API_URL}/home/book-demo`, {
      name,
      email,
      jobTitle,
      phoneNumber,
      message,
    }, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      if (response?.status !== 200) {
        setErrorHandler("Unable to book demo, please try again later");
      }

      // console.log('book-demo-response', response);

      return response.data;
    }).catch(error => {
      console.log('book-demo-error', error);
      if (error?.response?.data?.errors) {
        setErrorHandler(error.response.data.errors, "error", true);
      } else if (error?.response?.data?.message) { 
        setErrorHandler(error.response.data.message);
      } else {
        setErrorHandler("Unable to book demo, please try again later");
      }
    });

    setLoading(false);
    if (formResponse?.message) {
      setSuccessHandler(formResponse.message);
      setTimeout(() => {
        history.go(0);
      }, 1000);
    }
  };

  const setErrorHandler = (msg, param = "form", fullError = false) => {
    setErrors(fullError ? msg : [{ msg, param }])
    setTimeout(() => {
      setErrors([]);
    }, 3000);
    setSuccess("");
  };

  const setSuccessHandler = (msg) => {
    setSuccess(msg);
    setTimeout(() => {
      setSuccess("");
    }, 3000);

    setErrors([]);
  };

  return (
    <div className="ltn__contact-message-area mb-120">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="ltn__form-box contact-form-box box-shadow white-bg">
              <h4 className="title-2">Book a Demo</h4>
              <ResponseHandler errors={errors} success={success}/>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="input-item input-item-name ltn__custom-icon">
                      <input
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-item input-item-briefcase ltn__custom-icon">
                      <input
                        type="text"
                        name="job"
                        placeholder="Enter job title"
                        onChange={(e) => setJobTitle(e.target.value)}
                        value={jobTitle}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-item input-item-email ltn__custom-icon">
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter email address"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-item input-item-phone ltn__custom-icon">
                      <input
                        type="text"
                        name="phone"
                        placeholder="Enter phone number"
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        value={phoneNumber}
                      />
                    </div>
                  </div>
                </div>
                <div className="input-item input-item-textarea ltn__custom-icon">
                  <textarea
                    name="message"
                    placeholder="Enter message"
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                  />
                </div>
                <div className="btn-wrapper mt-0">
                  <button
                    className="btn theme-btn-1 btn-effect-1 text-uppercase"
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
                      "Submit"
                    )}
                  </button>
                </div>
                <p className="form-messege mb-0 mt-20" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}