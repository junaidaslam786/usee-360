import React, { Component } from 'react';

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
                  <h3>Usee-360 Properties</h3>
                  <p>Simply add your current property sales collateral and offer enhanced real-time guided virtual viewings to qualify your customer early, truly understand their needs and offer amazing experiences to maximise your outcomes, effectively and efficiently.</p>
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
