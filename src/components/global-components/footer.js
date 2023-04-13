import React, { Component } from "react";
import { Link } from "react-router-dom";
import Social from "../section-components/social";
import Copyright from "./copyright";

class Footer_v1 extends Component {
  componentDidMount() {
    const { $ } = window;

    const publicUrl = `${process.env.PUBLIC_URL}/`;
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
    const publicUrl = `${process.env.PUBLIC_URL}/`;
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
                      <li>
                        <Link to="/demo">Book a Demo</Link>
                      </li>
                      <li>
                        <Link to="/contact">Contact</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-3 col-sm-3 col-12">
                <div className="footer-widget footer-menu-widget clearfix">
                  <h4 className="footer-title">Address</h4>
                  <div className="footer-address">
                    <ul>
                      <li>
                        <div className="footer-address-icon">
                          <i className="icon-call" />
                        </div>
                        <div className="footer-address-info">
                          <p>
                            <a href="tel:07808055833">078 080 55833</a>
                          </p>
                        </div>
                      </li>
                      <li>
                        <div className="footer-address-icon">
                          <i className="icon-call" />
                        </div>
                        <div className="footer-address-info">
                          <a href="tel:0501813399">050 181 3399</a>
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
                    </ul>
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
