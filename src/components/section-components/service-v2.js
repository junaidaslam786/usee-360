import React, { Component } from "react";
import { Link } from "react-router-dom";
import parse from "html-react-parser";

class ServiceV2 extends Component {
  render() {
    const publicUrl = `${process.env.PUBLIC_URL}/`;

    return (
      <div className="ltn__feature-area pt-90 pb-90 go-top">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title-area ltn__section-title-2--- text-center">
                <h6 className="section-subtitle section-subtitle-2 ltn__secondary-color">
                  features
                </h6>
                <h1 className="section-title">Benefits of Usee-360</h1>
              </div>
            </div>
          </div>
          <div className="row ltn__custom-gutter">
            <div className="col-lg-4 col-sm-6 col-12">
              <div className="ltn__feature-item ltn__feature-item-6">
                <div className="ltn__feature-icon">
                  <span>
                    <i className="flaticon-apartment" />
                  </span>
                </div>
                <div className="ltn__feature-info">
                  <h4>Simple</h4>
                  <p>
                    Viewing a property has never been easier. You now don’t need
                    to travel around lots of different houses to show them to
                    your client. We offer you a simple platform to show the
                    homes through a video tour.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-sm-6 col-12">
              <div className="ltn__feature-item ltn__feature-item-6 active">
                <div className="ltn__feature-icon">
                  <span>
                    <i className="flaticon-park" />
                  </span>
                </div>
                <div className="ltn__feature-info">
                  <h4>Convenient</h4>
                  <p>
                    There is never enough time in life and when it comes to
                    buying a property, it’s stressful enough. That’s why at
                    usee-360, we’re here to make everyone’s life easier.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-sm-6 col-12">
              <div className="ltn__feature-item ltn__feature-item-6">
                <div className="ltn__feature-icon">
                  <span>
                    <i className="flaticon-maps-and-location" />
                  </span>
                </div>
                <div className="ltn__feature-info">
                  <h4>Friendly</h4>
                  <p>
                    You can enjoy a relaxing and friendly conversation with your
                    clients, who you can take through the virtual tour of their
                    dream home from the comfort of your, and your client’s, own
                    sofa.
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

export default ServiceV2;
