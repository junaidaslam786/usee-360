import React, { Component } from "react";

class Sidebar extends Component {
  render() {
    return (
      <div className="col-lg-4  mb-100">
        <aside className="sidebar ltn__shop-sidebar">
          <h3 className="mb-10">Advance Filters</h3>
          <div className="widget ltn__menu-widget">
            <h4 className="ltn__widget-title">Property Category</h4>
            <ul>
              <li>
                <label className="checkbox-item">
                  Rent
                  <input type="checkbox" defaultChecked="checked" />
                  <span className="checkmark" />
                </label>
              </li>
              <li>
                <label className="checkbox-item">
                  Sale
                  <input type="checkbox" />
                  <span className="checkmark" />
                </label>
              </li>
            </ul>
            <hr />
            <h4 className="ltn__widget-title">Property Category Type</h4>
            <ul>
              <li>
                <label className="checkbox-item">
                  Commercial
                  <input type="checkbox" defaultChecked="checked" />
                  <span className="checkmark" />
                </label>
              </li>
              <li>
                <label className="checkbox-item">
                  Residential
                  <input type="checkbox" />
                  <span className="checkmark" />
                </label>
              </li>
            </ul>
            <hr />
            <div className="widget--- ltn__price-filter-widget">
              <h4 className="ltn__widget-title ltn__widget-title-border---">
                Filter by price
              </h4>
              <div className="price_filter">
                <div className="price_slider_amount">
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
            <h4 className="ltn__widget-title">Bedrooms</h4>
            <ul>
              <li>
                <label className="checkbox-item">
                  Single
                  <input type="checkbox" defaultChecked="checked" />
                  <span className="checkmark" />
                </label>
              </li>
              <li>
                <label className="checkbox-item">
                  Double
                  <input type="checkbox" />
                  <span className="checkmark" />
                </label>
              </li>
              <li>
                <label className="checkbox-item">
                  Up To 3
                  <input type="checkbox" />
                  <span className="checkmark" />
                </label>
              </li>
              <li>
                <label className="checkbox-item">
                  Up To 5
                  <input type="checkbox" />
                  <span className="checkmark" />
                </label>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    );
  }
}

export default Sidebar;
