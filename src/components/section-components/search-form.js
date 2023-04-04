import React, { Component } from "react";
import { Link } from "react-router-dom";
import parse from "html-react-parser";

class SearchForm extends Component {
  render() {
    return (
      <div className="ltn__car-dealer-form-area mt-120 mb-120">
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
                        <div className="ltn__car-dealer-form-item ltn__custom-icon---- ltn__icon-meter---- col-lg-3 col-md-6">
                          <select className="nice-select">
                            <option>Homes</option>
                            <option>Villas</option>
                          </select>
                        </div>
                        <div className="ltn__car-dealer-form-item ltn__custom-icon---- ltn__icon-meter---- col-lg-3 col-md-6">
                          <select className="nice-select">
                            <option>Commercial</option>
                            <option>Residential</option>
                          </select>
                        </div>
                        <div className="ltn__car-dealer-form-item ltn__custom-icon---- ltn__icon-meter---- col-lg-3 col-md-6">
                          <select className="nice-select">
                            <option selected hidden disabled>
                              No. of Bedrooms
                            </option>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                          </select>
                        </div>
                        <div className="ltn__car-dealer-form-item ltn__custom-icon---- ltn__icon-car---- col-lg-3 col-md-6">
                          <input
                            type="text"
                            placeholder="Minimum Price"
                            className="m-0"
                          />
                        </div>
                        <div className="ltn__car-dealer-form-item ltn__custom-icon---- ltn__icon-car---- col-lg-3 col-md-6">
                          <input
                            type="text"
                            placeholder="Maximum Price"
                            className="m-0"
                          />
                        </div>
                        <div className="ltn__car-dealer-form-item ltn__custom-icon---- ltn__icon-car---- col-lg-3 col-md-6">
                          <input
                            type="text"
                            placeholder="Property Name"
                            className="m-0"
                          />
                        </div>
                        <div className="ltn__car-dealer-form-item ltn__custom-icon---- ltn__icon-car---- col-lg-3 col-md-6">
                          <input
                            type="text"
                            placeholder="Location Name"
                            className="m-0"
                          />
                        </div>
                        <div className="ltn__car-dealer-form-item ltn__custom-icon ltn__icon-calendar col-lg-3 col-md-6">
                          <div className="btn-wrapper mt-0 go-top">
                            <Link
                              to="/property-grid"
                              className="btn theme-btn-1 btn-effect-1 text-uppercase search-btn"
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
