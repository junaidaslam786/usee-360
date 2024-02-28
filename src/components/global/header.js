import React, { Component } from "react";
import { Link } from "react-router-dom";

class Page_header extends Component {
  render() {
    const HeaderTitle = this.props.headertitle;
    const Subheader = this.props.subheader ? this.props.subheader : HeaderTitle;
    const CustomClass = this.props.customclass ? this.props.customclass : "";

    return (
      <div className={`ltn__breadcrumb-area text-left bg-overlay-white-30 bg-image mb-0 ${CustomClass}`}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="ltn__breadcrumb-inner">
                <div className="ltn__breadcrumb-list">
                  <ul>
                    <li>
                      <Link to="/">
                        <span className="ltn__secondary-color">
                          <i className="fas fa-home" />
                        </span>{" "}
                        Home
                      </Link>
                    </li>
                    <li>{Subheader}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Page_header;
