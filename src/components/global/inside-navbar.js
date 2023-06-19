import React, { Component } from "react";
import { Link } from "react-router-dom";
import Social from "../homepage/section/social";
import { getUserDetailsFromJwt } from "../../utils";
import { AGENT_TYPE, AGENT_USER_ACCESS_TYPE_VALUE } from "../../constants";

class Navbar extends Component {
  render() {
    const publicUrl = `${process.env.REACT_APP_PUBLIC_URL}/`;
    const userDetail = getUserDetailsFromJwt();

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
                        <a href="tel:+4407808055833">
                          <i className="icon-call" /> Tel UK: +44 (0)78 080 55833
                        </a>
                      </li>
                      <li>
                        <a href="tel:+9710501813399">
                          <i className="icon-call" /> Tel UAE: +971 (0) 50 181 3399
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
                    {
                      userDetail && (
                        <div className="ltn__header-user-appointment">
                          <div className="user-info">
                            <div className="user-icon">
                              <img
                                src={`${process.env.REACT_APP_API_URL}/${userDetail.profileImage}`}
                                alt="Author Image"
                              />
                            </div>
                            <div className="user-name">Hi {userDetail.name}</div>
                          </div>
                          <div className="flex-wrapper">
                            <Link to={`/${userDetail?.agent ? "agent" : "customer"}/add-appointment`}>
                              <div className="quick-appointment-btn">
                                Quick Appointment
                              </div>
                            </Link>
                            {
                              (userDetail?.agent?.agentType === AGENT_TYPE.AGENT || userDetail?.agentAccessLevels?.find((level) => level.accessLevel === AGENT_USER_ACCESS_TYPE_VALUE.ADD_PROPERTY)) && (
                                <Link to="/agent/add-property">
                                  <div className="create-property-btn">
                                    Create a Property
                                  </div>
                                </Link>
                              )
                            }
                          </div>
                        </div>
                      )
                    }
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
