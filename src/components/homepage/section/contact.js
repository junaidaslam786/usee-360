import React, { useState } from "react";
import { useHistory } from 'react-router';
import HomepageService from "../../../services/homepage";
import { toast } from "react-toastify";

export default function Contact(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState();
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("subject", subject);
    formData.append("jobTitle", jobTitle);
    formData.append("phoneNumber", phoneNumber);
    formData.append("message", message);

    const formResponse = await HomepageService.contactUs(formData);
    setLoading(false);

    if (formResponse?.error && formResponse?.message) {
      toast(formResponse.message);
      return;
    }

    if (formResponse?.message) {
      toast(formResponse.message, true);
      setTimeout(() => {
        history.go(0);
      }, 1000);
    }
  };

  return (
    <div className="ltn__contact-message-area mb-120 mt-120">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="ltn__form-box contact-form-box box-shadow white-bg">
              <h4 className="title-2">Contact with us</h4>
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
                    <div className="input-item input-item-briefcase ltn__custom-icon">
                      <input
                        type="text"
                        name="subject"
                        placeholder="Enter the subject"
                        onChange={(e) => setSubject(e.target.value)}
                        value={subject}
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