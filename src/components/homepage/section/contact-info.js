import React, { Component } from "react";

class ContactInfo extends Component {
  render() {
    const publicUrl = `${process.env.REACT_APP_PUBLIC_URL}/`;

    return (
      <div className="ltn__contact-address-area mb-90">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="ltn__contact-address-item ltn__contact-address-item-3 box-shadow">
                <div className="ltn__contact-address-icon">
                  <img
                    src={`${publicUrl}assets/img/icons/10.png`}
                    alt="Icon Image"
                  />
                </div>
                <h3>Email Address</h3>
                <p>info@usee-360.com</p><br/>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="ltn__contact-address-item ltn__contact-address-item-3 box-shadow">
                <div className="ltn__contact-address-icon">
                  <img
                    src={`${publicUrl}assets/img/icons/11.png`}
                    alt="Icon Image"
                  />
                </div>
                <h3>Phone Number</h3>
                <p>
                  Tel UK: +44 078 080 55833 <br/>
                  Tel UAE: +971 050 181 3399
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ContactInfo;
