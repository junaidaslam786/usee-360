import React, { Component } from "react";
import { Link } from "react-router-dom";

class Sidebar extends Component {
  render() {
    const anchor = "#";
    const imagealt = "image";
    const publicUrl = `${process.env.PUBLIC_URL}/`;
    return (
      <div className="col-lg-4  mb-100">
        <aside className="sidebar ltn__shop-sidebar">
          <h3 className="mb-10">Advance Information</h3>
          <label className="mb-30">
            <small>About 9,620 results (0.62 seconds) </small>
          </label>
          {/* Advance Information widget */}
          <div className="widget ltn__menu-widget">
            {/* Price Filter Widget */}
            <div className="widget--- ltn__price-filter-widget">
              <h4 className="ltn__widget-title ltn__widget-title-border---">
                Filter by price
              </h4>
              <div className="price_filter">
                <div className="price_slider_amount">
                  <input type="submit" defaultValue="Your range:" />
                  <input
                    type="text"
                    className="amount"
                    name="price"
                    placeholder="Add Your Price"
                  />
                </div>
                <div className="slider-range" />
              </div>
            </div>
            <hr />
            <h4 className="ltn__widget-title">Bed/bath</h4>
            <ul>
              <li>
                <label className="checkbox-item">
                  Single
                  <input type="checkbox" defaultChecked="checked" />
                  <span className="checkmark" />
                </label>
                <span className="categorey-no">3,924</span>
              </li>
              <li>
                <label className="checkbox-item">
                  Double
                  <input type="checkbox" />
                  <span className="checkmark" />
                </label>
                <span className="categorey-no">3,610</span>
              </li>
              <li>
                <label className="checkbox-item">
                  Up To 3
                  <input type="checkbox" />
                  <span className="checkmark" />
                </label>
                <span className="categorey-no">2,912</span>
              </li>
              <li>
                <label className="checkbox-item">
                  Up To 5
                  <input type="checkbox" />
                  <span className="checkmark" />
                </label>
                <span className="categorey-no">2,687</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    );
  }
}

export default Sidebar;
