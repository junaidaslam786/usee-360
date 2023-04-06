import React, { Component } from "react";
import { Link } from "react-router-dom";

class ServiceDetails extends Component {
  render() {
    const publicUrl = `${process.env.PUBLIC_URL}/`;

    return (
      <div className="ltn__page-details-area ltn__service-details-area mb-90">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="ltn__page-details-inner ltn__service-details-inner">
                <div className="ltn__blog-img">
                  <img
                    src={`${publicUrl}assets/img/service/21.jpg`}
                    alt="Image"
                  />
                </div>
                <p>
                  <span className="ltn__first-letter">1</span>
                  Simply add your current property sales collateral and offer
                  enhanced real-time guided virtual viewings to qualify your
                  customer early, truly understand their needs and offer amazing
                  experiences to maximise your outcomes, effectively and
                  efficiently.
                </p>
                <p>
                  <span className="ltn__first-letter">2</span>
                  Measure customer activity off-line to drive sales and
                  listings. Our cutting edge technology allows you to use highly
                  effective customer behavior to give you as many meaningful
                  touch points with your customer as possible to keep sales on
                  track.
                </p>
                <p>
                  <span className="ltn__first-letter">3</span>
                  Transform your business today, embrace new customer demands to
                  provide incredible customer and user experiences in minutes
                  that will last a lifetime. Watch your sales process develop
                  and adapt digitally with our award-winning platform,
                  increasing efficiencies and completing sales faster.
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <aside className="sidebar-area ltn__right-sidebar">
                {/* Menu Widget */}
                <div className="widget-2 ltn__menu-widget ltn__menu-widget-2 text-uppercase">
                  <ul className="go-top">
                    <li className="active">
                      <Link to="/services/properties">
                        Properties
                        <span>
                          <i className="fas fa-arrow-right" />
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/services/yachts">
                        Yachts
                        <span>
                          <i className="fas fa-arrow-right" />
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/services/vehicles">
                        Vehicles
                        <span>
                          <i className="fas fa-arrow-right" />
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/services/aviation">
                        Aviation
                        <span>
                          <i className="fas fa-arrow-right" />
                        </span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ServiceDetails;
