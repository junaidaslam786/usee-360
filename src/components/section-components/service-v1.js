import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import parse from 'html-react-parser';

class ServiceV5 extends Component {
  render() {
    const publicUrl = `${process.env.PUBLIC_URL}/`;

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
            <div className="col-lg-4 col-sm-6 col-12">
              <div className="ltn__feature-item ltn__feature-item-6 text-center bg-white  box-shadow-1">
                <div className="ltn__feature-icon">
                  <span><i className="flaticon-house-3" /></span>
                </div>
                <div className="ltn__feature-info">
                  <h3><Link to="/services/homes">Usee-360 Homes</Link></h3>
                  <p>Simply add your current property sales collateral and offer enhanced real-time guided virtual viewings to qualify your customer early, truly understand their needs and offer amazing experiences to maximise your outcomes, effectively and efficiently.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-sm-6 col-12">
              <div className="ltn__feature-item ltn__feature-item-6 text-center bg-white  box-shadow-1">
                <div className="ltn__feature-icon">
                  <span><i className="flaticon-house-2" /></span>
                </div>
                <div className="ltn__feature-info">
                  <h3><Link to="/services/villas">Usee-360 Villas</Link></h3>
                  <p>Showcase your villa to buyers or the rental market, offering them a unique experience to interpret their levels of interest and in real-time, guide them around the villa and local area using the integrated google maps to achieve the best results possible.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-sm-6 col-12">
              <div className="ltn__feature-item ltn__feature-item-6 text-center bg-white  box-shadow-1">
                <div className="ltn__feature-icon">
                  <span><i className="flaticon-swimming" /></span>
                </div>
                <div className="ltn__feature-info">
                  <h3><Link to="/services/boats">Usee-360 Boats</Link></h3>
                  <p>Effectively upload your virtual tours, and any images of a yacht and deliver a specialist guided overview, delivering key information, registrations, titles and compliance in the one call. Offer smooth transitions between other boats to truly understand your customer’s needs.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-sm-6 col-12">
              <div className="ltn__feature-item ltn__feature-item-6 text-center bg-white  box-shadow-1">
                <div className="ltn__feature-icon">
                  <span><i className="flaticon-car" /></span>
                </div>
                <div className="ltn__feature-info">
                  <h3><Link to="/services/vehicles">Usee-360 Vehicles</Link></h3>
                  <p>With built in pro video calling, virtual tours and many other features including ‘buyer favorites’ shortlists, you’ll be able to tailor every viewing experience and offer the right vehicle to the right buyer effortlessly, reducing time and increasing commissions.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-sm-6 col-12">
              <div className="ltn__feature-item ltn__feature-item-6 text-center bg-white  box-shadow-1">
                <div className="ltn__feature-icon">
                  <span><i className="flaticon-plane" /></span>
                </div>
                <div className="ltn__feature-info">
                  <h3><Link to="/services/aviation">Usee-360 Aviation</Link></h3>
                  <p>If you’re are chartering or selling a plane, the process one must go through involves considerable investment of time and money. Offer your customers the ability to explore your inventory from the comfort of their home using a professional real-time guided virtual walk.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-sm-6 col-12">
              <div className="ltn__feature-item ltn__feature-item-6 text-center bg-white  box-shadow-1">
                <div className="ltn__feature-icon">
                  <span><i className="flaticon-secure" /></span>
                </div>
                <div className="ltn__feature-info">
                  <h3><Link to="/services/commercial-retail">Usee-360 Retail</Link></h3>
                  <p>Take control of the ‘total customer experience’, save time and money whilst not compromising on that face-to-face feeling. The ability to examine luxury items and art with the customer using your professional knowledge virtually, will allow buyers and sellers across the globe.</p>
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
