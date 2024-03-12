import React, { Component } from "react";

class CompanyHistory extends Component {
  render() {
    const publicUrl = `${process.env.REACT_APP_PUBLIC_URL}/`;

    return (
      <div className="ltn__about-us-area pb-115 go-top mt-60">
        <div className="container">
          <div className="row">
            <div className="col-lg-7 align-self-center">
              <div className="about-us-info-wrap">
                <div className="section-title-area ltn__section-title-2--- mb-20">
                  <h6 className="section-subtitle section-subtitle-2 ltn__secondary-color">
                    The History of Usee-360
                  </h6>
                  <h1 className="section-title">
                    Usee<span>-</span>360
                  </h1>
                  <p>
                    The impact of COVID-19 on the real estate sector varied
                    across regions and sectors, but there were several common
                    trends and challenges observed globally. The initial phase
                    of the pandemic saw a slowdown in home sales due to economic
                    uncertainty, job losses, and restrictions on in-person
                    activities. However, some markets experienced a rebound as
                    people sought larger homes or moved to suburban or rural
                    areas for more space and lower population density. Rental
                    markets were affected by job losses and financial
                    uncertainties. Some urban areas experienced a decline in
                    rental prices as demand decreased. The real estate sector
                    faced challenges as lock-downs and social distancing
                    measures limited foot traffic. E-commerce, however, saw a
                    surge in demand. It's important to note that the real estate
                    sector is highly localized, and the impact of COVID-19
                    varied widely depending on factors such as the severity and
                    duration of lock-downs, government responses, and the
                    overall economic resilience of specific regions.
                  </p>
                </div>
                <div className="about-us-info-wrap-inner about-us-info-devide---">
                  <p>
                    Additionally, the situation continued to evolve, and the
                    real estate sector adapted to changing circumstances over
                    time. The real estate industry demand significant changes
                    and adaptations leading to a more virtual /
                    technology-driven approach and AI . This was the time when
                    Usee-360 emerged as an online virtual Real Estate platform
                    that offers potential real estate customers the opportunity
                    to view properties remotely adhering to the strict pandemic
                    restrictions during the first and subsequent lockdowns. It
                    gained popularity since Covid and continues to be the ideal
                    solution for consumers that seek the flexibility offered
                    through the virtual environment. Usee-360 is a virtual real
                    estate platform that operates nationally and internationally
                    with properties all around the world.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-5 align-self-center">
              <div className="about-us-img-wrap ltn__img-shape-left  about-img-left">
                <img src={`${publicUrl}assets/img/service/historyOfUsee.jpg`} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CompanyHistory;
