import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class ServiceV5 extends Component {
  render() {
    return (
      <div className="ltn__service-area section-bg-1 pt-115 pb-70 go-top">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title-area ltn__section-title-2--- text-center">
                <h6 className="section-subtitle section-subtitle-2 ltn__secondary-color">Our Services</h6>
                <h1 className="section-title">Our Core Services</h1>
              </div>
            </div>
          </div>
          <div className="row  justify-content-center">
            <div className="col-lg-6 col-sm-6 col-12">
              <div className="ltn__feature-item ltn__feature-item-6 text-center bg-white  box-shadow-1">
                <div className="ltn__feature-icon">
                  <span><i className="flaticon-house-3" /></span>
                </div>
                <div className="ltn__feature-info">
                  <h3><Link to="/services/properties">Usee-360 Properties</Link></h3>
                  <p>Simply add your current property sales collateral and offer enhanced real-time guided virtual viewings to qualify your customer early, truly understand their needs and offer amazing experiences to maximise your outcomes, effectively and efficiently.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-sm-6 col-12">
              <div className="ltn__feature-item ltn__feature-item-6 text-center bg-white  box-shadow-1">
                <div className="ltn__feature-icon">
                  <span><i className="flaticon-swimming" /></span>
                </div>
                <div className="ltn__feature-info">
                  <h3><Link to="#">Usee-360 Yachts</Link></h3>
                  <p>Effectively upload your virtual tours, and any images of a yacht and deliver a specialist guided overview, delivering key information, registrations, titles and compliance in the one call. Offer smooth transitions between other boats to truly understand your customer’s needs.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-sm-6 col-12">
              <div className="ltn__feature-item ltn__feature-item-6 text-center bg-white  box-shadow-1">
                <div className="ltn__feature-icon">
                  <span><i className="flaticon-car" /></span>
                </div>
                <div className="ltn__feature-info">
                  <h3><Link to="#">Usee-360 Vehicles</Link></h3>
                  <p>With built in pro video calling, virtual tours and many other features including ‘buyer favorites’ shortlists, you’ll be able to tailor every viewing experience and offer the right vehicle to the right buyer effortlessly, reducing time and increasing commissions.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-sm-6 col-12">
              <div className="ltn__feature-item ltn__feature-item-6 text-center bg-white  box-shadow-1">
                <div className="ltn__feature-icon">
                  <span><i className="flaticon-deal" /></span>
                </div>
                <div className="ltn__feature-info">
                  <h3><Link to="#">Usee-360 Maintenance</Link></h3>
                  <p>If you’re are buying or selling a property, the process one must go through involves considerable investment of time and money. Offer your customers the ability to explore your inventory from the comfort of their home using a professional real-time guided virtual walk.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ServiceV5;
