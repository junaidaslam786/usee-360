import React, { Component } from "react";

class AboutV5 extends Component {
  render() {
    const publicUrl = `${process.env.PUBLIC_URL}/`;

    return (
      <div className="ltn__about-us-area pb-115 go-top">
        <div className="container">
          <div className="row">
            <div className="col-lg-5 align-self-center">
              <div className="about-us-img-wrap ltn__img-shape-left  about-img-left">
                <img
                  src={`${publicUrl}assets/img/service/11.jpg`}
                  alt="Image"
                />
              </div>
            </div>
            <div className="col-lg-7 align-self-center">
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
                <div className="about-us-info-wrap-inner about-us-info-devide---">
                  <p>
                    Simplicity, Innovation & Collaboration are at the core of
                    our business which allows us to partner and build the very
                    best outcomes for all, whilst delivering results and
                    customer loyalty.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AboutV5;
