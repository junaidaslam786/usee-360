import React, { Component } from "react";

class History extends Component {
  render() {
    const publicUrl = `${process.env.REACT_APP_PUBLIC_URL}/`;

    return (
      <div className="ltn__our-history-area pb-100 pt-115">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title-area ltn__section-title-2--- text-center">
                <h6 className="section-subtitle section-subtitle-2 ltn__secondary-color">
                  Our Services
                </h6>
                <h1 className="section-title">
                  Increase Visability in 3 Steps!
                </h1>
              </div>
              <div className="ltn__our-history-inner">
                <div className="ltn__tab-menu text-uppercase">
                  <div className="nav">
                    <a
                      className="active show"
                      data-bs-toggle="tab"
                      href="#liton_tab_2_1"
                    >
                      STEP 1
                    </a>
                    <a data-bs-toggle="tab" href="#liton_tab_2_2">
                      STEP 2
                    </a>
                    <a data-bs-toggle="tab" href="#liton_tab_2_3">
                      STEP 3
                    </a>
                  </div>
                </div>
                <div className="tab-content">
                  <div className="tab-pane fade active show" id="liton_tab_2_1">
                    <div className="ltn__product-tab-content-inner">
                      <div className="row">
                        <div className="col-lg-6 align-self-center">
                          <div className="about-us-img-wrap about-img-left">
                            <img
                              src={`${publicUrl}assets/img/img-slide/11.jpg`}
                              alt="Image"
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 align-self-center history-step">
                          <div className="about-us-info-wrap">
                            <div className="section-title-area ltn__section-title-2--- text-center---">
                              <h1 className="section-title">
                                UPLOAD YOUR COLLATERAL TODAY!
                              </h1>
                              <p>
                                Simply add your current marketing collateral for
                                any asset you wish and offer an enhanced
                                real-time guided virtual viewing to qualify your
                                customer early, truly understand their needs and
                                offer amazing interactive experiences to
                                maximise your outcomes, driving sales
                                effectively and efficiently.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="liton_tab_2_2">
                    <div className="ltn__product-tab-content-inner">
                      <div className="row">
                        <div className="col-lg-6 align-self-center">
                          <div className="about-us-img-wrap about-img-left">
                            <img
                              src={`${publicUrl}assets/img/img-slide/12.jpg`}
                              alt="Image"
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 align-self-center history-step">
                          <div className="about-us-info-wrap">
                            <div className="section-title-area ltn__section-title-2--- text-center---">
                              <h1 className="section-title">
                                USE OUR ANAYLTICS TO IMPROVE PERFORMANCE!
                              </h1>
                              <p>
                                Measure customer activity off-line to drive
                                sales and listings. Our cutting edge technology
                                allows you to use highly effective customer
                                behavior to give you as many meaningful touch
                                points with your customer as possible to keep
                                sales on track and encourage vendors to list
                                with you.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="liton_tab_2_3">
                    <div className="ltn__product-tab-content-inner">
                      <div className="row">
                        <div className="col-lg-6 align-self-center">
                          <div className="about-us-img-wrap about-img-left">
                            <img
                              src={`${publicUrl}assets/img/img-slide/13.jpg`}
                              alt="Image"
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 align-self-center history-step">
                          <div className="about-us-info-wrap">
                            <div className="section-title-area ltn__section-title-2--- text-center---">
                              <h1 className="section-title">
                                WATCH YOUR SALES INCREASE!
                              </h1>
                              <p>
                                Transform your business today, embrace new
                                customer demands to provide incredible customer
                                and user experiences in minutes that will last a
                                lifetime. Watch your sales process develop and
                                adapt digitally with our award-winning platform,
                                increasing efficiencies and completing sales
                                faster.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default History;
