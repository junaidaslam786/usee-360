

import React, { useState } from "react";
import SearchForm2 from "./search-form2";
import SearchForm from "./search-form";

export default function ServiceSelector() {
  const [selectedService, setSelectedService] = useState("");

  return (
    <div className="service-selector-area mt-120 mb-120">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-12">
            {" "}
            {/* Adjusted for better centering */}
            <div className="service-selector-form tab-content bg-white box-shadow-1 position-relative pb-10 pt-10">
              <div
                className="form-group"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                //   marginTop: "25px",
                }}
              >
                {" "}
                {/* Flex container */}
                <label style={{ marginRight: "20px" }}>
                  Please Select a Service:
                </label>{" "}
                {/* Label with some margin */}
                <select
                  className="nice-select"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  style={{ width: "50%" }} // Adjust width as needed
                >
                  <option value="">Select Service</option>
                  <option value="properties">Properties</option>
                  {/* Additional services can be added here */}
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
