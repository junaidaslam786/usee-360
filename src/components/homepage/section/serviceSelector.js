// import React, { useState } from "react";
// import SearchForm from "./search-form";
// import _ from "lodash";
// import Select, { components } from "react-select";
// import { useHistory } from "react-router-dom";

// export default function ServiceSelector() {
//   const [selectedService, setSelectedService] = useState("");

//   const history = useHistory();

//   const options = [
//     { value: "", label: "Usee-360 Select" },
//     { value: "properties", label: "Usee-360 Properties" },
//   ];

//   const handleFiltersChange = (filters) => {
//     history.push("/services/properties", { filters, propertyCategory: selectedService });
//   };

//   const customStyles = {
//     control: (provided, state) => ({
//       ...provided,
//       backgroundColor: "rgba(255, 255, 255, 0)",
//       borderRadius: "40px",
//       borderWidth: "1.8px",
//       width: "100%",
//       maxWidth: "50vw",
//       borderColor: state.isFocused ? "#00c800" : "white",
//       paddingInline: "20px",
//       boxShadow: state.isFocused ? "0 0 0 1px 00c800" : "none",
//       "&:hover": {
//         borderColor: state.isFocused ? "#00c800" : "#00c800",
//       },
//       WebkitAppearance: "none",
//     }),
//     valueContainer: (provided, state) => ({
//       ...provided,
//       padding: "0px 0px", 
//       width: "100%"
//     }),
//     dropdownIndicator: (provided, state) => ({
//       ...provided,
//       backgroundImage: 'url("your-custom-arrow-image-url")',
//       backgroundSize: "contain",
//       padding: "0px 10px", 
//     }),
//     singleValue: (provided, state) => ({
//       ...provided,
//       color: "#ffffff",
//       padding: "0px 20px",
//       fontFamily: "Poppins, sans-serif",
//       fontSize: "18px",
//       width: '100%'
//     }),

//     option: (provided, state) => ({
//       ...provided,
//       backgroundColor: state.isSelected ? "#432e3c" : "white",
//       color: state.isSelected ? "white" : "black",
//       padding: 20,
//       fontFamily: "Poppins, sans-serif",

      
//       ":hover": {
//         backgroundColor: "#00c800",
//       },
//       ":active": {
//         backgroundColor: state.isSelected ? "#432e3c" : "#00c800",
//       },
//     }),
//     // You can add more custom styles for other parts as needed
//   };

//   const CustomControl = ({ children, ...props }) => (
//     <components.Control {...props}>
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//         }}
//       >
//         <img
//           src="assets/img/logo-2.png"
//           alt=""
//           style={{ width: "auto", height: 25 }}
//         />
//         {children}
//       </div>
//     </components.Control>
//   );

//   return (
//     <div
//       className="service-selector-area"
//       style={{
//         backgroundImage: "url(assets/img/hero-section-bg.webp)",
//         backgroundSize: "cover",
//         backgroundPosition: "center center",
//         backgroundRepeat: "no-repeat",
//         backgroundColor: "rgba(0, 0, 0, 0.6)", // Overlay color
//         backgroundBlendMode: "overlay",
//       }}
//     >
//       <div className="container">
//         <div className="row justify-content-center">
//           <div className="col-lg-12">
//             <div
//               className="service-selector-form tab-content position-relative pb-10 pt-10"
//               style={{
//                 backgroundColor: "rgba(255, 255, 255, 0)",
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 marginTop: "120px",
//                 marginBottom: "120px",
//               }}
//             >
//               <label
//                 style={{
//                   marginRight: "20px",
//                   fontFamily: "Poppins, sans-serif",
//                   fontSize: "25px",
//                   color: "white",
//                   marginBottom: "30px",
//                 }}
//               >
//                 Select a Usee-360 Service:
//               </label>{" "}
//               <Select
//                 // classNamePrefix="custom-select"
//                 value={options.find(
//                   (option) => option.value === selectedService
//                 )}
//                 onChange={(selectedOption) =>
//                   setSelectedService(selectedOption.value)
//                 }
//                 options={options}
//                 styles={customStyles}
//                 components={{ Control: CustomControl }}
//               />
//             </div>
//             {selectedService === "properties" && (
//               <SearchForm onFiltersChange={handleFiltersChange} />
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";
import SearchForm from "./search-form";
import Select, { components } from "react-select";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearFilters } from "./../../../store/propertySearchSlice"; // Import Redux actions if needed

export default function ServiceSelector() {
  const [selectedService, setSelectedService] = useState("");
  const history = useHistory();
  const dispatch = useDispatch();

  const options = [
    { value: "", label: "Usee-360 Select" },
    { value: "properties", label: "Usee-360 Properties" },
  ];

  const handleServiceChange = (selectedOption) => {
    const serviceValue = selectedOption.value;
    setSelectedService(serviceValue);

    if (serviceValue === "properties") {
      // Clear any previous filters when switching to properties
      dispatch(clearFilters());
      history.push("/services/properties"); // Navigate to the properties page
    }
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "rgba(255, 255, 255, 0)",
      borderRadius: "40px",
      borderWidth: "1.8px",
      width: "100%",
      maxWidth: "50vw",
      borderColor: state.isFocused ? "#00c800" : "white",
      paddingInline: "20px",
      boxShadow: state.isFocused ? "0 0 0 1px 00c800" : "none",
      "&:hover": {
        borderColor: state.isFocused ? "#00c800" : "#00c800",
      },
      WebkitAppearance: "none",
    }),
    valueContainer: (provided, state) => ({
      ...provided,
      padding: "0px 0px", 
      width: "100%"
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      backgroundImage: 'url("your-custom-arrow-image-url")',
      backgroundSize: "contain",
      padding: "0px 10px", 
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: "#ffffff",
      padding: "0px 20px",
      fontFamily: "Poppins, sans-serif",
      fontSize: "18px",
      width: '100%'
    }),

    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#432e3c" : "white",
      color: state.isSelected ? "white" : "black",
      padding: 20,
      fontFamily: "Poppins, sans-serif",

      
      ":hover": {
        backgroundColor: "#00c800",
      },
      ":active": {
        backgroundColor: state.isSelected ? "#432e3c" : "#00c800",
      },
    }),
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
          src="assets/img/logo-2.png"
          alt=""
          style={{ width: "auto", height: 25 }}
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
        backgroundColor: "rgba(0, 0, 0, 0.6)", // Overlay color
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-12">
            <div
              className="service-selector-form tab-content position-relative pb-10 pt-10"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "120px",
                marginBottom: "120px",
              }}
            >
              <label
                style={{
                  marginRight: "20px",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "25px",
                  color: "white",
                  marginBottom: "30px",
                }}
              >
                Select a Usee-360 Service:
              </label>{" "}
              <Select
                value={options.find(
                  (option) => option.value === selectedService
                )}
                onChange={handleServiceChange}
                options={options}
                styles={customStyles}
                components={{ Control: CustomControl }}
              />
            </div>

            {/* SearchForm will be conditionally rendered based on selectedService */}
            {selectedService === "properties" && (
              <SearchForm />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
