

// import React, { useState, useEffect, useRef } from "react";
// import { Link, useHistory, useLocation } from "react-router-dom";
// import { PRICE_TYPE } from "../../../constants";
// import { useStateIfMounted } from "use-state-if-mounted";
// import { faFilter } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import Select from "react-select";
// import FilterModal from "./filterModal";
// import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";

// const libraries = ["places", "drawing"];

// export default function SearchForm({
//   onFiltersChange,
//   propertyCategory: defaultPropertyCategory,
//   address: defaultAddress,
//   lat: defaultLat,
//   lng: defaultLng,
//   priceType: defaultPriceType,
// }) {
//   const [address, setAddress] = useStateIfMounted(defaultAddress || "");
//   const [propertyCategory, setPropertyCategory] = useState(defaultPropertyCategory || "sale");
//   const [lat, setLat] = useStateIfMounted(defaultLat || null);
//   const [lng, setLng] = useStateIfMounted(defaultLng || null);
//   const [showLink, setShowLink] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [priceType, setPriceType] = useState(defaultPriceType ? defaultPriceType.value : null);

//   const [filters, setFilters] = useState({});

//   const [resetTrigger, setResetTrigger] = useState(0);

//   const history = useHistory();
//   const location = useLocation();

//   const autocompleteInputRef = useRef(null);

//   const { isLoaded } = useJsApiLoader({
//     id: "google-map-script",
//     googleMapsApiKey: "AIzaSyBIjbPr5V0gaRCzgQQ-oN0eW25WvGoALVY",
//     libraries,
//   });

//   const handleFiltersChange = (newFilters) => {
//     setFilters((prevFilters) => ({
//       ...prevFilters,
//       ...newFilters,
//     }));
//   };

//   const sendFilters = () => {
//     const combinedFilters = constructSelectedFilters();
//     localStorage.setItem("searchFilters", JSON.stringify(combinedFilters));
//     if (location.pathname !== "/services/properties") {
//       history.push("/services/properties", {
//         filters: combinedFilters,
//         propertyCategory: defaultPropertyCategory,
//       });
//     } else if (onFiltersChange) {
//       onFiltersChange(combinedFilters);
//     }
//   };

//   const handlePriceTypeChange = (selectedOption) => {
//     setPriceType(selectedOption ? selectedOption.value : null);
//   };

//   const constructSelectedFilters = () => {
//     const selectedFilters = {
//       ...(propertyCategory && { propertyCategory }),
//       ...(priceType && { priceType }),
//       ...(lat != null && { lat }),
//       ...(lng != null && { lng }),
//       ...Object.entries(filters).reduce((acc, [key, value]) => {
//         if (Array.isArray(value) && value.length > 0) {
//           acc[key] = value;
//         } else if (!Array.isArray(value) && value) {
//           acc[key] = value;
//         }
//         return acc;
//       }, {}),
//     };
//     return selectedFilters;
//   };

//   const selectedFilters = constructSelectedFilters();
//   const selectedFiltersCount = Object.keys(selectedFilters).length;

//   const resetFilters = () => {
//     setAddress("");
//     setPropertyCategory(defaultPropertyCategory || "sale");
//     setPriceType(null);
//     setFilters({});
//     setLat(null);
//     setLng(null);
//     localStorage.removeItem("searchFilters");
//     setResetTrigger((oldTrigger) => oldTrigger + 1);
//     if (onFiltersChange) {
//       onFiltersChange({});
//     }
//   };

//   const handleFocus = () => {
//     setShowLink(true);
//   };

//   const handleBlur = () => {
//     const timeoutId = setTimeout(() => {
//       setShowLink(false);
//     }, 300);
//     return () => clearTimeout(timeoutId);
//   };

//   const openModal = () => {
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//   };

//   useEffect(() => {
//     if (lat !== null && lng !== null) {
//       const geocoder = new window.google.maps.Geocoder();
//       geocoder.geocode({ location: { lat, lng } }, (results, status) => {
//         if (status === "OK" && results[0]) {
//           setAddress(results[0].formatted_address);
//         } else {
//           console.error("Geocoder failed due to: " + status);
//         }
//       });
//     }
//   }, [lat, lng]);

//   useEffect(() => {
//     setAddress(defaultAddress || "");
//     setLat(defaultLat || null);
//     setLng(defaultLng || null);
//     setPriceType(defaultPriceType ? defaultPriceType.value : null);
//     setPropertyCategory(defaultPropertyCategory || "sale");
//   }, [defaultAddress, defaultLat, defaultLng, defaultPriceType, defaultPropertyCategory]);

//   useEffect(() => {
//     if (isLoaded && lat != null && lng != null) {
//       setFilters((prevFilters) => ({
//         ...prevFilters,
//         lat,
//         lng,
//       }));
//     }
//   }, [isLoaded, lat, lng]);

//   useEffect(() => {
//     const savedFilters = localStorage.getItem("searchFilters");
//     if (savedFilters) {
//       setFilters(JSON.parse(savedFilters));
//     }
//   }, []);

//   return (
//     <div className="ltn__car-dealer-form-area mt-120 mb-120">
//       <div className="container">
//         <div className="row">
//           <div className="col-lg-12">
//             <div className="ltn__car-dealer-form-tab">
//               <div className="tab-content bg-white box-shadow-1 position-relative pb-10">
//                 <div className="tab-pane fade active show" id="ltn__form_tab_1_1">
//                   <div className="car-dealer-form-inner">
//                     <form action="#" className="ltn__car-dealer-form-box">
//                       <div className="row">
//                         <div className="ltn__car-dealer-form-item col-lg-4 col-md-4">
//                           <label>I'm looking to</label>
//                           <select
//                             className="nice-select"
//                             value={propertyCategory}
//                             onChange={(e) => setPropertyCategory(e.target.value)}
//                           >
//                             <option value={"sale"}>Buy</option>
//                             <option value={"rent"}>Rent</option>
//                           </select>
//                         </div>

//                         {propertyCategory === "rent" && (
//                           <div className="ltn__car-dealer-form-item col-lg-4 col-md-4">
//                             <label>Price Type</label>
//                             <Select
//                               classNamePrefix="custom-select"
//                               options={PRICE_TYPE}
//                               onChange={handlePriceTypeChange}
//                               value={PRICE_TYPE.find(option => option.value === priceType)}
//                             />
//                           </div>
//                         )}

//                         <div className="ltn__car-dealer-form-item col-lg-4 col-md-4">
//                           <label>Location</label>
//                           {isLoaded && (
//                             <Autocomplete
//                               onLoad={(autocomplete) => {
//                                 window.autocomplete = autocomplete;
//                               }}
//                               onPlaceChanged={() => {
//                                 const place = window.autocomplete.getPlace();
//                                 if (place.geometry) {
//                                   setLat(place.geometry.location.lat());
//                                   setLng(place.geometry.location.lng());
//                                   setAddress(place.formatted_address);
//                                 } else {
//                                   console.error("No geometry for selected place.");
//                                 }
//                               }}
//                             >
//                               <input
//                                 ref={autocompleteInputRef}
//                                 type="text"
//                                 value={address}
//                                 onChange={(event) => setAddress(event.target.value)}
//                                 placeholder="Location Name"
//                                 className="m-0"
//                                 onFocus={handleFocus}
//                                 onBlur={handleBlur}
//                               />
//                             </Autocomplete>
//                           )}
//                           {showLink && (
//                             <Link to={{ pathname: "/map-search" }} className="draw-on-map">
//                               <i className="fa fa-map-marker" aria-hidden="true"></i>
//                               Search by drawing on map
//                             </Link>
//                           )}
//                         </div>
//                       </div>
//                       <div className="row mt-3" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
//                         <div className="col-lg-4 col-md-4">
//                           <button type="button" className="btn theme-btn-2 btn-effect-1 text-uppercase " onClick={openModal}>
//                             <FontAwesomeIcon icon={faFilter} /> Filters ({selectedFiltersCount})
//                           </button>
//                         </div>

//                         <div className="col-lg-4 col-md-4">
//                           <button className="btn theme-btn-1 btn-effect-1 text-uppercase " onClick={sendFilters}>
//                             Find Now
//                           </button>
//                         </div>
//                         <div className="col-lg-4 col-md-4">
//                           <button type="button" className="btn theme-btn-2 btn-effect-2 text-uppercase " onClick={resetFilters}>
//                             Clear Filters
//                           </button>
//                         </div>
//                       </div>
//                     </form>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <FilterModal
//           isOpen={isModalOpen}
//           onRequestClose={closeModal}
//           onFiltersChange={handleFiltersChange}
//           currentFilters={filters}
//           resetTrigger={resetTrigger}
//         />
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { PRICE_TYPE } from "../../../constants";
import { useStateIfMounted } from "use-state-if-mounted";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "react-select";
import FilterModal from "./filterModal";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";

const libraries = ["places", "drawing"];

export default function SearchForm({
  onFiltersChange,
  propertyCategory: defaultPropertyCategory,
  address: defaultAddress,
  lat: defaultLat,
  lng: defaultLng,
  priceType: defaultPriceType,
}) {
  const [address, setAddress] = useStateIfMounted(defaultAddress || "");
  const [propertyCategory, setPropertyCategory] = useState(defaultPropertyCategory || "sale");
  const [lat, setLat] = useStateIfMounted(defaultLat || null);
  const [lng, setLng] = useStateIfMounted(defaultLng || null);
  const [showLink, setShowLink] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [priceType, setPriceType] = useState(defaultPriceType ? defaultPriceType : null);

  const [filters, setFilters] = useState({});

  const [resetTrigger, setResetTrigger] = useState(0);

  const history = useHistory();
  const location = useLocation();

  const autocompleteInputRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBIjbPr5V0gaRCzgQQ-oN0eW25WvGoALVY",
    libraries,
  });

  const handleFiltersChange = (newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  const sendFilters = () => {
    const combinedFilters = constructSelectedFilters();
    localStorage.setItem("searchFilters", JSON.stringify(combinedFilters));
    if (location.pathname !== "/services/properties") {
      history.push("/services/properties", {
        filters: combinedFilters,
        propertyCategory: defaultPropertyCategory,
      });
    } else if (onFiltersChange) {
      onFiltersChange(combinedFilters);
    }
  };

  const handlePriceTypeChange = (selectedOption) => {
    setPriceType(selectedOption);
  };

  const constructSelectedFilters = () => {
    const selectedFilters = {
      ...(propertyCategory && { propertyCategory }),
      ...(priceType && { priceType: priceType.value }),
      ...(lat != null && { lat }),
      ...(lng != null && { lng }),
      ...Object.entries(filters).reduce((acc, [key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          acc[key] = value;
        } else if (!Array.isArray(value) && value) {
          acc[key] = value;
        }
        return acc;
      }, {}),
    };
    return selectedFilters;
  };

  const selectedFilters = constructSelectedFilters();
  const selectedFiltersCount = Object.keys(selectedFilters).length;

  const resetFilters = () => {
    setAddress("");
    setPropertyCategory(defaultPropertyCategory || "sale");
    setPriceType(null);
    setFilters({});
    setLat(null);
    setLng(null);
    localStorage.removeItem("searchFilters");
    setResetTrigger((oldTrigger) => oldTrigger + 1);
    if (onFiltersChange) {
      onFiltersChange({});
    }
  };

  const handleFocus = () => {
    setShowLink(true);
  };

  const handleBlur = () => {
    const timeoutId = setTimeout(() => {
      setShowLink(false);
    }, 300);
    return () => clearTimeout(timeoutId);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (lat !== null && lng !== null) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results[0]) {
          setAddress(results[0].formatted_address);
        } else {
          console.error("Geocoder failed due to: " + status);
        }
      });
    }
  }, [lat, lng]);

  useEffect(() => {
    setAddress(defaultAddress || "");
    setLat(defaultLat || null);
    setLng(defaultLng || null);
    setPriceType(defaultPriceType ? defaultPriceType : null);
    setPropertyCategory(defaultPropertyCategory || "sale");
  }, [defaultAddress, defaultLat, defaultLng, defaultPriceType, defaultPropertyCategory]);

  useEffect(() => {
    if (isLoaded && lat != null && lng != null) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        lat,
        lng,
      }));
    }
  }, [isLoaded, lat, lng]);

  useEffect(() => {
    const savedFilters = localStorage.getItem("searchFilters");
    if (savedFilters) {
      const parsedFilters = JSON.parse(savedFilters);
      setFilters(parsedFilters);
      setPriceType(parsedFilters.priceType ? PRICE_TYPE.find(option => option.value === parsedFilters.priceType) : null);
    }
  }, []);

  return (
    <div className="ltn__car-dealer-form-area mt-120 mb-120">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="ltn__car-dealer-form-tab">
              <div className="tab-content bg-white box-shadow-1 position-relative pb-10">
                <div className="tab-pane fade active show" id="ltn__form_tab_1_1">
                  <div className="car-dealer-form-inner">
                    <form action="#" className="ltn__car-dealer-form-box">
                      <div className="row">
                        <div className="ltn__car-dealer-form-item col-lg-4 col-md-4">
                          <label>I'm looking to</label>
                          <select
                            className="nice-select"
                            value={propertyCategory}
                            onChange={(e) => setPropertyCategory(e.target.value)}
                          >
                            <option value={"sale"}>Buy</option>
                            <option value={"rent"}>Rent</option>
                          </select>
                        </div>

                        {propertyCategory === "rent" && (
                          <div className="ltn__car-dealer-form-item col-lg-4 col-md-4">
                            <label>Price Type</label>
                            <Select
                              classNamePrefix="custom-select"
                              options={PRICE_TYPE}
                              onChange={handlePriceTypeChange}
                              value={priceType}
                            />
                          </div>
                        )}

                        <div className="ltn__car-dealer-form-item col-lg-4 col-md-4">
                          <label>Location</label>
                          {isLoaded && (
                            <Autocomplete
                              onLoad={(autocomplete) => {
                                window.autocomplete = autocomplete;
                              }}
                              onPlaceChanged={() => {
                                const place = window.autocomplete.getPlace();
                                if (place.geometry) {
                                  setLat(place.geometry.location.lat());
                                  setLng(place.geometry.location.lng());
                                  setAddress(place.formatted_address);
                                } else {
                                  console.error("No geometry for selected place.");
                                }
                              }}
                            >
                              <input
                                ref={autocompleteInputRef}
                                type="text"
                                value={address}
                                onChange={(event) => setAddress(event.target.value)}
                                placeholder="Location Name"
                                className="m-0"
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                              />
                            </Autocomplete>
                          )}
                          {showLink && (
                            <Link to={{ pathname: "/map-search" }} className="draw-on-map">
                              <i className="fa fa-map-marker" aria-hidden="true"></i>
                              Search by drawing on map
                            </Link>
                          )}
                        </div>
                      </div>
                      <div className="row mt-3" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                        <div className="col-lg-4 col-md-4">
                          <button type="button" className="btn theme-btn-2 btn-effect-1 text-uppercase " onClick={openModal}>
                            <FontAwesomeIcon icon={faFilter} /> Filters ({selectedFiltersCount})
                          </button>
                        </div>

                        <div className="col-lg-4 col-md-4">
                          <button className="btn theme-btn-1 btn-effect-1 text-uppercase " onClick={sendFilters}>
                            Find Now
                          </button>
                        </div>
                        <div className="col-lg-4 col-md-4">
                          <button type="button" className="btn theme-btn-2 btn-effect-2 text-uppercase " onClick={resetFilters}>
                            Clear Filters
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <FilterModal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          onFiltersChange={handleFiltersChange}
          currentFilters={filters}
          resetTrigger={resetTrigger}
        />
      </div>
    </div>
  );
}
