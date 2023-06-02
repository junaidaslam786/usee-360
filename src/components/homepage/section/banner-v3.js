import React, { Component } from "react";
import { Link } from "react-router-dom";

class BannerV3 extends Component {
  render() {
    const publicUrl = `${process.env.REACT_APP_PUBLIC_URL}/`;

    return (
      <div className="ltn__slider-area ltn__slider-3  section-bg-2">
        <div className="ltn__slide-one-active slick-slide-arrow-1 slick-slide-dots-1">
          {/* ltn__slide-item */}
          <div
            className="ltn__slide-item ltn__slide-item-2 ltn__slide-item-3-normal--- ltn__slide-item-3 bg-image bg-overlay-theme-black-60"
            data-bs-bg={`${publicUrl}assets/img/slider/1.jpg`}
          >
            <div className="ltn__slide-item-inner text-center">
              <div className="container">
                <div className="row">
                  <div className="col-lg-12 align-self-center">
                    <div className="slide-item-info">
                      <div className="slide-item-info-inner ltn__slide-animation">
                        <h6 className="slide-sub-title white-color--- animated">
                          <span>
                            <i className="fas fa-home" />
                          </span>{" "}
                          Powering Innovation
                        </h6>
                        <h1 className="slide-title animated ">
                          Start Your Journey
                          <br /> Today
                        </h1>
                        <div className="btn-wrapper animated go-top">
                          <Link
                            to="/services/properties"
                            className="theme-btn-1 btn btn-effect-1"
                          >
                            Search
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ltn__slide-item */}
          <div
            className="ltn__slide-item ltn__slide-item-2 ltn__slide-item-3-normal--- ltn__slide-item-3 bg-image bg-overlay-theme-black-60"
            data-bs-bg={`${publicUrl}assets/img/slider/2.jpg`}
          >
            <div className="ltn__slide-item-inner text-center">
              <div className="container">
                <div className="row">
                  <div className="col-lg-12 align-self-center">
                    <div className="slide-item-info">
                      <div className="slide-item-info-inner ltn__slide-animation">
                        <h6 className="slide-sub-title white-color--- animated">
                          <span>
                            <i className="fas fa-home" />
                          </span>{" "}
                          Powering Innovation
                        </h6>
                        <h1 className="slide-title animated ">
                          Start Your Journey
                          <br /> Today
                        </h1>
                        <div className="btn-wrapper animated go-top">
                          <Link
                            to="/services/properties"
                            className="theme-btn-1 btn btn-effect-1"
                          >
                            Search
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ltn__slide-item */}
          <div
            className="ltn__slide-item ltn__slide-item-2 ltn__slide-item-3-normal--- ltn__slide-item-3 bg-image bg-overlay-theme-black-60"
            data-bs-bg={`${publicUrl}assets/img/slider/3.jpg`}
          >
            <div className="ltn__slide-item-inner text-center">
              <div className="container">
                <div className="row">
                  <div className="col-lg-12 align-self-center">
                    <div className="slide-item-info">
                      <div className="slide-item-info-inner ltn__slide-animation">
                        <h6 className="slide-sub-title white-color--- animated">
                          <span>
                            <i className="fas fa-home" />
                          </span>{" "}
                          Powering Innovation
                        </h6>
                        <h1 className="slide-title animated ">
                          Start Your Journey
                          <br /> Today
                        </h1>
                        <div className="btn-wrapper animated go-top">
                          <Link
                            to="/services/properties"
                            className="theme-btn-1 btn btn-effect-1"
                          >
                            Search
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ltn__slide-item */}
        </div>
      </div>
    );
  }
}

export default BannerV3;
