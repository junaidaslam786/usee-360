import React, { Component } from "react";
import { Link } from "react-router-dom";
import parse from "html-react-parser";

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
                  orem ipsum dolor sit amet, consectetur adipisicing elit, sed
                  do eiusmod tempor incidi dunt ut labore et dolore magna
                  aliqua. Ut enim ad minim veniam, quis nostrud exerc itation
                  ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis
                  aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur.
                </p>
                <p>
                  <span className="ltn__first-letter">2</span>
                  orem ipsum dolor sit amet, consectetur adipisicing elit, sed
                  do eiusmod tempor incidi dunt ut labore et dolore magna
                  aliqua. Ut enim ad minim veniam, quis nostrud exerc itation
                  ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis
                  aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur.
                </p>
                <p>
                  <span className="ltn__first-letter">3</span>
                  orem ipsum dolor sit amet, consectetur adipisicing elit, sed
                  do eiusmod tempor incidi dunt ut labore et dolore magna
                  aliqua. Ut enim ad minim veniam, quis nostrud exerc itation
                  ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis
                  aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur.
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <aside className="sidebar-area ltn__right-sidebar">
                {/* Menu Widget */}
                <div className="widget-2 ltn__menu-widget ltn__menu-widget-2 text-uppercase">
                  <ul className="go-top">
                    <li className="active">
                      <Link to="/services/homes">
                        Homes
                        <span>
                          <i className="fas fa-arrow-right" />
                        </span>
                      </Link>
                    </li>
                    <li >
                      <Link to="/services/villas">
                        Villas
                        <span>
                          <i className="fas fa-arrow-right" />
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/services/boats">
                        Boats
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
                    <li>
                      <Link to="/services/commercial-retail">
                        Commercial Retail
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
