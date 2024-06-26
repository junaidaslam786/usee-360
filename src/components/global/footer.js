import React, { Component } from "react";
import { Link } from "react-router-dom";
import Copyright from "./copyright";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faXTwitter,
  faMicrosoft,
  faLinkedin,
  faGoogle,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

class Footer_v1 extends Component {
  constructor(props) {
    super(props);
    // You can access props as this.props in the constructor
  }

  componentDidMount() {
    const { $ } = window;

    const publicUrl = `${process.env.REACT_APP_PUBLIC_URL}/`;
    const minscript = document.createElement("script");
    minscript.async = true;
    minscript.src = `${publicUrl}assets/js/main.js`;

    document.body.appendChild(minscript);

    $(".go-top")
      .find("a")
      .on("click", () => {
        $(".quarter-overlay").fadeIn(1);

        $(window).scrollTop(0);

        setTimeout(() => {
          $(".quarter-overlay").fadeOut(300);
        }, 800);
      });

    $(document).on("click", ".theme-btn-1 ", () => {
      $("div").removeClass("modal-backdrop");
      $("div").removeClass("show");
      $("div").removeClass("fade");
      $("body").attr("style", "");
    });
  }

  render() {
    const publicUrl = `${process.env.REACT_APP_PUBLIC_URL}/`;
    const imgattr = "Footer logo";

    return (
      <footer className="ltn__footer-area  ">
        <div className="footer-top-area  section-bg-2 plr--5">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-3 col-md-3 col-sm-3 col-12">
                <div className="footer-widget footer-about-widget">
                  <div className="footer-logo">
                    <div className="site-logo">
                      <img
                        src={`${publicUrl}assets/img/logo-2.png`}
                        height="100"
                        alt="Logo"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-3 col-sm-3 col-12">
                <div className="footer-widget footer-menu-widget clearfix">
                  <h4 className="footer-title">Company</h4>
                  <div className="footer-menu go-top">
                    <ul>
                      <li>
                        <Link to="/services">Services</Link>
                      </li>
                      {this.props?.page !== "register" && (
                        <li>
                          <Link to="/demo">Book a Demo</Link>
                        </li>
                      )}
                      <li>
                        <Link to="/contact">Contact</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-3 col-sm-3 col-12">
                <div className="footer-widget footer-menu-widget clearfix">
                  <h4 className="footer-title">Contact Information</h4>
                  <div className="footer-address">
                    <ul>
                      <li>
                        <div className="footer-address-icon">
                          <i className="icon-call" />
                        </div>
                        <div className="footer-address-info">
                          <p>
                            <a href="tel:+4407808055833">+44 (0)78 080 55833</a>
                          </p>
                        </div>
                      </li>

                      <li>
                        <div className="footer-address-icon">
                          <i className="icon-call" />
                        </div>
                        <div className="footer-address-info">
                          <a href="tel:+9710501813399">+971 (0) 50 181 3399</a>
                        </div>
                      </li>
                      <li>
                        <div className="footer-address-icon">
                          <i className="icon-mail" />
                        </div>
                        <div className="footer-address-info">
                          <p>
                            <a href="mailto:info@usee-360.com">
                              info@usee-360.com
                            </a>
                          </p>
                        </div>
                      </li>
                      <li>
                        <div className="footer-address-icon">
                          <i className="fa-solid fa-location-dot"></i>
                        </div>
                        <div className="footer-address-info">
                          <p>Business Bay, Dubai, UAE</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-3 col-sm-3 col-12">
                <div className="footer-widget footer-menu-widget clearfix">
                  <h4 className="footer-title">Connect with us</h4>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap", // Enable wrapping
                      justifyContent: "flex-start", // Align items to the start of the container
                      alignItems: "center",
                      margin: "10px 0",
                    }}
                  >
                    <a
                      href="https://www.facebook.com/usee360/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon
                        icon={faFacebook}
                        size="2x"
                        style={{
                          color: "#fff",
                          cursor: "pointer",
                          margin: "10px",
                        }}
                      />
                    </a>
                    <a
                      href="https://www.x.com/usee_360/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon
                        icon={faXTwitter}
                        size="2x"
                        style={{
                          color: "#fff",
                          cursor: "pointer",
                          margin: "10px",
                        }}
                      />
                    </a>
                    <a
                      href="https://www.instagram.com/usee_360/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon
                        icon={faInstagram}
                        size="2x"
                        style={{
                          color: "#fff",
                          cursor: "pointer",
                          margin: "10px",
                        }}
                      />
                    </a>
                    <a
                      href="https://www.linkedin.com/company/usee-360/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon
                        icon={faLinkedin}
                        size="2x"
                        style={{
                          color: "#fff",
                          cursor: "pointer",
                          margin: "10px",
                        }}
                      />
                    </a>
                    {/* <FontAwesomeIcon
                      icon={faLinkedin}
                      size="2x"
                      style={{
                        color: "#0077B5",
                        cursor: "pointer",
                        margin: "5px",
                      }}
                    />
                    <FontAwesomeIcon
                      icon={faGoogle}
                      size="2x"
                      style={{
                        color: "#DB4437",
                        cursor: "pointer",
                        margin: "5px",
                      }}
                    /> */}
                  </div>
                </div>
              </div>

              {/* <div className="col-lg-3 col-md-3 col-sm-3 col-12">
                <div className="footer-widget footer-menu-widget clearfix">
                  <h4 className="footer-title">Socials</h4>
                  <div className="ltn__social-media mt-20">
                    <Social />
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>

        <Copyright />
      </footer>
    );
  }
}

export default Footer_v1;
