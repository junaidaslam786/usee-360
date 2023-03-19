import React, { Component } from "react";
import { Link } from "react-router-dom";
import parse from "html-react-parser";

class SearchForm extends Component {
  render() {
    const publicUrl = `${process.env.PUBLIC_URL}/`;
    const imagealt = "image";

    return (
      <div className="ltn__car-dealer-form-area mt--65 mt-120 pb-115---">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="ltn__car-dealer-form-tab">
                <div className="tab-content bg-white box-shadow-1 position-relative pb-10">
                  <div
                    className="tab-pane fade active show"
                    id="ltn__form_tab_1_1"
                  >
                    <div className="car-dealer-form-inner">
                      <form action="#" className="ltn__car-dealer-form-box row">
                        <div className="ltn__car-dealer-form-item ltn__custom-icon---- ltn__icon-meter---- col-lg-4 col-md-6">
                          <select className="nice-select">
                            <option selected hidden disabled>
                              Property Type
                            </option>
                            <option>Homes</option>
                            <option>Villas</option>
                            <option>Boats</option>
                            <option>Vehicles</option>
                            <option>Aviation</option>
                            <option>Commercial Retail</option>
                          </select>
                        </div>
                        <div className="ltn__car-dealer-form-item ltn__custom-icon---- ltn__icon-calendar---- col-lg-4 col-md-6">
                          <select className="nice-select">
                            <option selected hidden disabled>
                              Property Location
                            </option>
                            <option>chicago</option>
                            <option>London</option>
                            <option>Los Angeles</option>
                            <option>New York</option>
                            <option>New Jersey</option>
                          </select>
                        </div>
                        <div className="ltn__car-dealer-form-item ltn__custom-icon---- ltn__icon-car---- col-lg-4 col-md-6">
                          <input
                            type="text"
                            placeholder="Property Name"
                            className="m-0"
                          />
                        </div>
                        <div className="ltn__car-dealer-form-item ltn__custom-icon---- ltn__icon-car---- col-lg-4 col-md-6">
                          <input
                            type="text"
                            placeholder="Min Price"
                            className="m-0"
                          />
                        </div>
                        <div className="ltn__car-dealer-form-item ltn__custom-icon---- ltn__icon-car---- col-lg-4 col-md-6">
                          <input
                            type="text"
                            placeholder="Max Price"
                            className="m-0"
                          />
                        </div>
                        <div className="ltn__car-dealer-form-item ltn__custom-icon ltn__icon-calendar col-lg-4 col-md-6">
                          <div className="btn-wrapper mt-0 go-top">
                            <Link
                              to="/property-grid"
                              className="btn theme-btn-1 btn-effect-1 text-uppercase"
                            >
                              Find Now
                            </Link>
                          </div>
                        </div>
                      </form>
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

export default SearchForm;
