import React from "react";
import { Link } from "react-router-dom";

const AnalyticsPage = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Analytics Page</h1>
      <nav>
        <ul>
          <li style={{ listStyleType: "none" }}>
            <Link to="/agent/video-call">
              <i style={{ marginRight: "1vmin" }} class="fa-solid fa-video"></i>
              Video Call
            </Link>
          </li>
          <li style={{ listStyleType: "none" }}>
            <Link to="/agent/property-listing">
              <i
                style={{ marginRight: "1vmin" }}
                class="fa-solid fa-building"
              ></i>
              Property Listing
            </Link>
          </li>
          <li style={{ listStyleType: "none" }}>
            <Link to="/agent/api-subscription">
              <i
                style={{ marginRight: "1vmin" }}
                class="fa-solid fa-bag-shopping"
              ></i>
              API Subscription
            </Link>
          </li>
          <li style={{ listStyleType: "none" }}>
            <Link to="/agent/reports">
              <i
                style={{ marginRight: "1vmin" }}
                class="fa-solid fa-bag-shopping"
              ></i>
              Reports
            </Link>
          </li>
          <li style={{ listStyleType: "none" }}>
            <Link to="/agent/property-visits-analytics">
              <i
                style={{ marginRight: "1vmin" }}
                class="fa-solid fa-bag-shopping"
              ></i>
              Property Visits
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AnalyticsPage;
