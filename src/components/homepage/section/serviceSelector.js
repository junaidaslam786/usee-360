import React, { useState } from "react";
import SearchForm from "./search-form";
import _ from "lodash";
import Select, { components } from "react-select";

export default function ServiceSelector() {
  const [selectedService, setSelectedService] = useState("");

  const options = [
    { value: "", label: "Usee-360 Select" },
    { value: "properties", label: "Usee-360 Properties" },
    // Add more options as needed
  ];

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderRadius: "40px",
      borderWidth: "1.5px",
      width: "100%",
      borderColor: state.isFocused ? "#00c800" : "black",
      paddingInline: "50px",
      boxShadow: state.isFocused ? "0 0 0 1px blue" : "none",
      "&:hover": {
        borderColor: state.isFocused ? "#00c800" : "black",
      },
      // This removes the default arrow, you'll add a custom one below
      WebkitAppearance: "none",
    }),
    valueContainer: (provided, state) => ({
      ...provided,
      padding: '0 8px', // Adjust padding to ensure space around the selected value
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      backgroundImage: 'url("your-custom-arrow-image-url")',
      backgroundSize: "contain",
      padding: "10px 8px", // Adjust padding around the arrow
    }),
    // You can add more custom styles for other parts as needed
  };

  const CustomControl = ({ children, ...props }) => (
    <components.Control {...props}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <img
          src="assets/img/logo.png"
          alt=""
          style={{ width: "auto", height: 25, marginRight: 10 }}
        />
        {children}
      </div>
    </components.Control>
  );

  return (
    <div
      className="service-selector-area"
      style={{
        backgroundImage: "url(assets/img/hero-section-bg.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="container">
        <div
          className="row justify-content-center"
          style={{
            // opacity: "0.75",
          }}
        >
          <div className="col-lg-12">
            {" "}
            <div className="service-selector-form tab-content bg-white box-shadow-1 position-relative pb-10 pt-10">
              <div
                className="form-group "
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "120px",
                  marginBottom: "120px",
                }}
              >
                {" "}
                <label
                  style={{
                    marginRight: "20px",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "25px",
                  }}
                >
                  Select a Usee-360 Service:
                </label>{" "}
                <Select
                  // classNamePrefix="custom-select"
                  value={options.find(
                    (option) => option.value === selectedService
                  )}
                  onChange={(selectedOption) =>
                    setSelectedService(selectedOption.value)
                  }
                  options={options}
                  styles={customStyles}
                  components={{ Control: CustomControl }}

                />
              </div>
              {selectedService === "properties" && <SearchForm />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
