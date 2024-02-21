

import React, { useState } from "react";
import SearchForm from "./search-form";

export default function ServiceSelector() {
  const [selectedService, setSelectedService] = useState("");

  return (
    <div className="service-selector-area mt-120 mb-120">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-12">
            {" "}
            <div className="service-selector-form tab-content bg-white box-shadow-1 position-relative pb-10 pt-10">
              <div
                className="form-group"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {" "}
             
                <label style={{ marginRight: "20px" }}>
                  Please Select a Service:
                </label>{" "}
                <select
                  className="nice-select"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  style={{ width: "50%" }} // Adjust width as needed
                >
                  <option value="">USEE</option>
                  <option value="properties">USEE Properties</option>
                </select>
              </div>
              {selectedService === "properties" && <SearchForm />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
