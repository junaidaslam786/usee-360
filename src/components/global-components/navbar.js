import React, { Component } from "react";
import { Link } from "react-router-dom";
import Social from "../section-components/social";

class Navbar extends Component {
  render() {
    const publicUrl = `${process.env.PUBLIC_URL}/`;
    return (
      <div>
        <header className="ltn__header-area ltn__header-5 ltn__header-transparent--- gradient-color-4---">
          <div className="ltn__header-top-area section-bg-6 top-area-color-white---">
            <div className="container">
              <div className="row">
                <div className="col-md-7">
                  <div className="ltn__top-bar-menu">
                    <ul>
                      <li>
                        <a href="mailto:info@usee-360.com">
                          <i className="icon-mail" /> info@usee-360.com
                        </a>
                      </li>
                      <li>
                        <a href="tel:07808055833">
                          <i className="icon-call" /> Tel UK: 078 080 55833
                        </a>
                      </li>
                      <li>
                        <a href="tel:0501813399">
                          <i className="icon-call" /> Tel UAE: 050 181 3399
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-md-5">
                  <div className="top-bar-right text-end">
                    <div className="ltn__top-bar-menu">
                      <ul>
                        <li>
                          <Social />
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="ltn__header-middle-area ltn__header-sticky ltn__sticky-bg-white">
            <div className="container">
              <div className="row">
                <div className="col">
                  <div className="site-logo-wrap">
                    <div className="site-logo go-top">
                      <Link to="/">
                        <img
                          src={`${publicUrl}assets/img/logo.png`}
                          alt="Logo"
                          height="80"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col header-menu-column">
                  <div className="header-menu d-none d-xl-block">
                    <nav>
                      <div className="ltn__main-menu go-top">
                        <ul>
                          <li>
                            <Link to="/">Home</Link>
                          </li>
                          <li className="menu-icon">
                            <Link to="/services">Services</Link>
                            <ul>
                              <li>
                                <Link to="/services/homes">Usee-360 Homes</Link>
                              </li>
                              <li>
                                <Link to="/services/villas">
                                  Usee-360 Villas
                                </Link>
                              </li>
                              <li>
                                <Link to="/services/boats">Usee-360 Boats</Link>
                              </li>
                              <li>
                                <Link to="/services/vehicles">
                                  Usee-360 Vehicles
                                </Link>
                              </li>
                              <li>
                                <Link to="/services/aviation">
                                  Usee-360 Aviation
                                </Link>
                              </li>
                              <li>
                                <Link to="/services/commercial-retail">
                                  Usee-360 Commercial Retail
                                </Link>
                              </li>
                            </ul>
                          </li>
                          <li>
                            <Link to="/demo">Book a Demo</Link>
                          </li>
                          <li>
                            <Link to="/contact">Contact</Link>
                          </li>
                        </ul>
                      </div>
                    </nav>
                  </div>
                </div>
                <div className="col ltn__header-options ltn__header-options-2 mb-sm-20">
                  {/* user-menu */}
                  <div className="ltn__drop-menu user-menu">
                    <ul>
                      <li>
                        <Link to="/customer">
                          <i className="icon-user" /> Customer
                        </Link>
                      </li>
                      <li>
                        <Link to="/agent">
                          <i className="icon-user" /> Agent
                        </Link>
                      </li>
                    </ul>
                  </div>
                  {/* Mobile Menu Button */}
                  <div className="mobile-menu-toggle d-xl-none">
                    <a
                      href="#ltn__utilize-mobile-menu"
                      className="ltn__utilize-toggle"
                    >
                      <svg viewBox="0 0 800 600">
                        <path
                          d="M300,220 C300,220 520,220 540,220 C740,220 640,540 520,420 C440,340 300,200 300,200"
                          id="top"
                        />
                        <path d="M300,320 L540,320" id="middle" />
                        <path
                          d="M300,210 C300,210 520,210 540,210 C740,210 640,530 520,410 C440,330 300,190 300,190"
                          id="bottom"
                          transform="translate(480, 320) scale(1, -1) translate(-480, -318) "
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        <div
          id="ltn__utilize-mobile-menu"
          className="ltn__utilize ltn__utilize-mobile-menu"
        >
          <div className="ltn__utilize-menu-inner ltn__scrollbar">
            <div className="ltn__utilize-menu-head">
              <div className="site-logo">
                <Link to="/">
                  <img
                    src={`${publicUrl}assets/img/logo.png`}
                    alt="Logo"
                    height="80"
                  />
                </Link>
              </div>
              <button className="ltn__utilize-close">×</button>
            </div>
            <div className="ltn__utilize-menu">
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/services">Services</Link>
                  <ul className="sub-menu">
                    <li>
                      <Link to="/services/homes">Usee-360 Homes</Link>
                    </li>
                    <li>
                      <Link to="/services/villas">Usee-360 Villas</Link>
                    </li>
                    <li>
                      <Link to="/services/boats">Usee-360 Boats</Link>
                    </li>
                    <li>
                      <Link to="/services/vehicles">Usee-360 Vehicles</Link>
                    </li>
                    <li>
                      <Link to="/services/aviation">Usee-360 Aviation</Link>
                    </li>
                    <li>
                      <Link to="/services/commercial-retail">
                        Usee-360 Commercial Retail
                      </Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link to="/demo">Book a Demo</Link>
                </li>
                <li>
                  <Link to="/contact">Contact</Link>
                </li>
              </ul>
            </div>
            <div className="ltn__utilize-buttons ltn__utilize-buttons-2">
              <ul>
                <li>
                  <Link to="/customer">
                    <span className="utilize-btn-icon">
                      <i className="far fa-user" />
                    </span>
                    Customer
                  </Link>
                </li>
                <li>
                  <Link to="/agent">
                    <span className="utilize-btn-icon">
                      <i className="far fa-user" />
                    </span>
                    Agent
                  </Link>
                </li>
              </ul>
            </div>
            <div className="ltn__social-media-2">
              <ul>
                <li>
                  <a href="#" title="Facebook">
                    <i className="fab fa-facebook-f" />
                  </a>
                </li>
                <li>
                  <a href="#" title="Twitter">
                    <i className="fab fa-twitter" />
                  </a>
                </li>
                <li>
                  <a href="#" title="Linkedin">
                    <i className="fab fa-linkedin" />
                  </a>
                </li>
                <li>
                  <a href="#" title="Instagram">
                    <i className="fab fa-instagram" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Navbar;
