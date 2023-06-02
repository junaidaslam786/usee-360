import React, { Component } from "react";
import { Link } from "react-router-dom";

class AboutV1 extends Component {
  render() {
    const publicUrl = `${process.env.REACT_APP_PUBLIC_URL}/`;

    return (
      <div className="ltn__about-us-area pt-120 pb-90 ">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 align-self-center">
              <div className="about-us-img-wrap about-img-left">
                <img
                  src={`${publicUrl}assets/img/others/7.png`}
                  alt="About Us Image"
                />
              </div>
            </div>
            <div className="col-lg-6 align-self-center">
              <div className="about-us-info-wrap">
                <div className="section-title-area ltn__section-title-2--- mb-20">
                  <h6 className="section-subtitle section-subtitle-2 ltn__secondary-color">
                    About Us
                  </h6>
                  <h1 className="section-title">
                    Usee<span>-</span>360
                  </h1>
                  <p>
                    With technology and digital transformations revolutionising
                    industries, and the continued growth to use multiple formats
                    to deliver seamless personalised experiences for agents,
                    buyers and sellers now more than ever; we’ve focused on
                    delivering a refreshing and inventive tech platform that’s
                    capable of bringing all your assets under one roof to create
                    the most memorable user adventures – and help drive your
                    sales.
                  </p>
                </div>
                <ul className="ltn__list-item-half clearfix">
                  <li>
                    <i className="flaticon-home-2" />
                    Simple
                  </li>
                  <li>
                    <i className="flaticon-mountain" />
                    Convenient
                  </li>
                  <li>
                    <i className="flaticon-heart" />
                    Friendly
                  </li>
                  <li>
                    <i className="flaticon-secure" />
                    Secure
                  </li>
                </ul>
                <div className="ltn__callout bg-overlay-theme-05  mt-30">
                  <p>
                    Simplicity, Innovation & Collaboration are at the core of
                    our business which allows us to partner and build the very
                    best outcomes for all, whilst delivering results and
                    customer loyalty.
                  </p>
                </div>
                <div className="btn-wrapper animated go-top">
                  <Link to="/services" className="theme-btn-1 btn btn-effect-1">
                    OUR SERVICES
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AboutV1;
