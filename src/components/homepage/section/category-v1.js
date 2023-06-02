import React, { Component } from "react";
import { Link } from "react-router-dom";
import parse from "html-react-parser";

class CategoryV1 extends Component {
  render() {
    return (
      <div className="ltn__category-area ltn__product-gutter section-bg-1 pt-115 pb-90 go-top">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title-area ltn__section-title-2--- text-center">
                <h6 className="section-subtitle section-subtitle-2 ltn__secondary-color">
                  Features
                </h6>
                <h1 className="section-title">Key Features</h1>
              </div>
            </div>
          </div>
          <div className="row ltn__category-slider-active--- slick-arrow-1 justify-content-center">
            <div className="col-12 col-md-6 col-xl-4">
                <div className="ltn__category-item ltn__category-item-5 text-center">
                <Link to="/" className="pointer_none"
                 >
                  <span className="category-icon">
                    <i className="flaticon-user" />
                  </span>
                  <span className="category-title">Video Conference</span>
                  <p className="category-desc">
                    Use our video call facility to engage and qualify buyers
                    earlier.
                  </p>
                </Link>
              </div>
            </div>
            <div className="col-12 col-md-6 col-xl-4">
              <div className="ltn__category-item ltn__category-item-5 text-center">
                <Link to="/" className="pointer_none"
                 >
                  <span className="category-icon">
                    <i className="flaticon-secure" />
                  </span>
                  <span className="category-title">
                    Virtual Tours, Photos & Videos
                  </span>
                  <p className="category-desc">
                    Upload your own virtual tours, videos or other multimedia.
                  </p>
                </Link>
              </div>
            </div>
            <div className="col-12 col-md-6 col-xl-4">
              <div className="ltn__category-item ltn__category-item-5 text-center">
                <Link to="/" className="pointer_none"
                 >
                  <span className="category-icon">
                    <i className="flaticon-house-4" />
                  </span>
                  <span className="category-title">Multiple Viewings</span>
                  <p className="category-desc">
                    Deliver multiple properties in just one viewing.
                  </p>
                </Link>
              </div>
            </div>
            <div className="col-12 col-md-6 col-xl-4">
              <div className="ltn__category-item ltn__category-item-5 text-center">
                <Link to="/" className="pointer_none"
                 >
                  <span className="category-icon">
                    <i className="flaticon-deal" />
                  </span>
                  <span className="category-title">
                    Share Marketing Collateral
                  </span>
                  <p className="category-desc">
                    Upload floor plans, brochures and more.
                  </p>
                </Link>
              </div>
            </div>
            <div className="col-12 col-md-6 col-xl-4">
              <div className="ltn__category-item ltn__category-item-5 text-center">
                <Link to="/" className="pointer_none"
                 >
                  <span className="category-icon">
                    <i className="flaticon-location" />
                  </span>
                  <span className="category-title">
                    Google Maps Integration
                  </span>
                  <p className="category-desc">Share your local knowledge.</p>
                </Link>
              </div>
            </div>
            <div className="col-12 col-md-6 col-xl-4">
              <div className="ltn__category-item ltn__category-item-5 text-center">
                <Link to="/" className="pointer_none"
                 >
                  <span className="category-icon">
                    <i className="flaticon-book" />
                  </span>
                  <span className="category-title">
                  { process.env.REACT_APP_CUSTOMER_ENTITY_LABEL } Analytics & Insights
                  </span>
                  <p className="category-desc">
                    Receive data to better understand your customers and deliver
                    a more personalised experience.
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CategoryV1;
