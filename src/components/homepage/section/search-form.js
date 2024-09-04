

// import React, { useState, useEffect, useRef } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { Link, useHistory, useLocation } from 'react-router-dom';
// import { PRICE_TYPE } from '../../../constants';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faFilter } from '@fortawesome/free-solid-svg-icons';
// import Select from 'react-select';
// import FilterModal from './filterModal';
// import { Autocomplete, useJsApiLoader } from '@react-google-maps/api';
// import { updateFilters, fetchProperties, clearFilters } from './../../../store/propertySearchSlice';

// const libraries = ["places", "drawing"];

// export default function SearchForm({
//   propertyCategory: defaultPropertyCategory,
//   address: defaultAddress,
//   lat: defaultLat,
//   lng: defaultLng,
//   priceType: defaultPriceType,
  
// }) {
//   const { filters, selectedFilterCount } = useSelector((state) => state.propertySearch);
//   const dispatch = useDispatch();
//   const [address, setAddress] = useState(defaultAddress || "");
//   const [propertyCategory, setPropertyCategory] = useState(
//      filters.propertyCategory || defaultPropertyCategory || ""
//   );
//   const [lat, setLat] = useState(defaultLat || null);
//   const [lng, setLng] = useState(defaultLng || null);
//   const [showLink, setShowLink] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
  
//   const [priceType, setPriceType] = useState(defaultPriceType ? PRICE_TYPE.find(option => option.value === defaultPriceType) : null);
//   const autocompleteInputRef = useRef(null);

//   const history = useHistory();
//   const location = useLocation();

//   const { isLoaded } = useJsApiLoader({
//     id: "google-map-script",
//     googleMapsApiKey: "AIzaSyBIjbPr5V0gaRCzgQQ-oN0eW25WvGoALVY",
//     libraries,
//   });

  

//   const handleFiltersChange = (newFilters) => {
//     dispatch(updateFilters({ ...newFilters, propertyCategory }));
//   };
  

//   const sendFilters = () => {
//     const constructedFilters = {
//       propertyCategory,
//       ...(priceType && { priceType: priceType.value }),
//       ...(lat != null && { lat }),
//       ...(lng != null && { lng }),
//       ...filters,
//     };

//     // dispatch(updateFilters(constructedFilters));
//     dispatch(fetchProperties(constructedFilters));
    
//     if (location.pathname !== "/services/properties") {
//       history.push("/services/properties");
    
//     }
//   };

//   const handlePriceTypeChange = (selectedOption) => {
//     setPriceType(selectedOption);
//   };

//   const resetFilters = () => {
//     setAddress("");
//     setPropertyCategory("");
//     setPriceType(null);
//     setLat(null);
//     setLng(null);
//     dispatch(clearFilters());
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

//   // useEffect(() => {
//   //   if (isLoaded && lat != null && lng != null) {
//   //     dispatch(updateFilters({ lat, lng }));
//   //   }
//   // }, [isLoaded, lat, lng, dispatch]);

//   // useEffect(() => {
//   //   if (filterFromModal) {
//   //     handleFiltersChange(filterFromModal);  // Update filters with those passed from the FilterModal
//   //   }
//   // }, [filterFromModal, dispatch]);
//   // useEffect(() => {
//   //   if (location.state?.filters && location.state.filters.propertyCategory !== propertyCategory) {
//   //     setPropertyCategory(location.state.filters.propertyCategory || defaultPropertyCategory || "");
//   //     setAddress(location.state.filters.address || "");
//   //     setLat(location.state.filters.lat || null);
//   //     setLng(location.state.filters.lng || null);
//   //     setPriceType(
//   //       PRICE_TYPE.find((option) => option.value === location.state.filters.priceType) || null
//   //     );
//   //   }
//   // }, [location.state?.filters, defaultPropertyCategory, propertyCategory]);


//   useEffect(() => {
//     if (!isLoaded) return;

//     const inputElement = autocompleteInputRef.current;
//     if (inputElement && inputElement instanceof HTMLInputElement) {
//       const autocomplete = new window.google.maps.places.Autocomplete(inputElement);

//       autocomplete.setFields(["geometry", "formatted_address"]);

//       const handlePlaceSelect = () => {
//         const place = autocomplete.getPlace();
//         if (!place.geometry) return;

//         const location = {
//           lat: place.geometry.location.lat(),
//           lng: place.geometry.location.lng(),
//         };
//         setLat(location.lat);
//         setLng(location.lng);
//         const formattedAddress = place.formatted_address || place.name;
//         setAddress(formattedAddress);
//       };

//       autocomplete.addListener("place_changed", handlePlaceSelect);

//       return () => {
//         window.google.maps.event.clearInstanceListeners(inputElement);
//       };
//     } else {
//       console.error(
//         "autocompleteInputRef is not attached to a valid HTMLInputElement"
//       );
//     }
//   }, [isLoaded]);

//   return (
//     <div className="ltn__car-dealer-form-area mt-120 mb-120">
//       <div className="container">
//         <div className="row">
//           <div className="col-lg-12">
//             <div className="ltn__car-dealer-form-tab">
//               <div className="tab-content bg-white box-shadow-1 position-relative pb-10">
//                 <div
//                   className="tab-pane fade active show"
//                   id="ltn__form_tab_1_1"
//                 >
//                   <div className="car-dealer-form-inner">
//                     <form
//                       action="#"
//                       className="ltn__car-dealer-form-box"
//                       onSubmit={(e) => {
//                         e.preventDefault();
//                         sendFilters();
//                       }}
//                     >
//                       <div className="row">
//                         <div className="ltn__car-dealer-form-item col-lg-4 col-md-4">
//                           <label>I'm looking to</label>
//                           <select
//                             className="nice-select"
//                             value={propertyCategory}
//                             onChange={(e) =>
//                               setPropertyCategory(e.target.value)
//                             }
//                           >
//                             <option value="">Select an option</option> 
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
//                               value={priceType}
//                             />
//                           </div>
//                         )}

//                         <div className="ltn__car-dealer-form-item col-lg-4 col-md-4">
//                           <label>Location</label>
//                           {isLoaded && (
//                             <Autocomplete>
//                               <input
//                                 ref={autocompleteInputRef}
//                                 type="text"
//                                 value={address}
//                                 onChange={(event) =>
//                                   setAddress(event.target.value)
//                                 }
//                                 placeholder="Location Name"
//                                 className="m-0"
//                                 onFocus={handleFocus}
//                                 onBlur={handleBlur}
//                               />
//                             </Autocomplete>
//                           )}
//                           {showLink && (
//                             <Link
//                               to={{ pathname: "/map-search" }}
//                               className="draw-on-map"
//                             >
//                               <i
//                                 className="fa fa-map-marker"
//                                 aria-hidden="true"
//                               ></i>
//                               Search by drawing on map
//                             </Link>
//                           )}
//                         </div>
//                       </div>
//                       <div
//                         className="row mt-3"
//                         style={{
//                           display: "flex",
//                           flexDirection: "row",
//                           justifyContent: "space-between",
//                         }}
//                       >
//                         <div className="col-lg-4 col-md-4">
//                           <button
//                             type="button"
//                             className="btn theme-btn-2 btn-effect-1 text-uppercase "
//                             onClick={openModal}
//                           >
//                            <FontAwesomeIcon icon={faFilter} /> Filters {selectedFilterCount > 0 && `(${selectedFilterCount})`}
//                           </button>
//                         </div>

//                         <div className="col-lg-4 col-md-4">
//                           <button
//                             type="submit"
//                             className="btn theme-btn-1 btn-effect-1 text-uppercase "
//                           >
//                             Find Now
//                           </button>
//                         </div>
//                         <div className="col-lg-4 col-md-4">
//                           <button
//                             type="button"
//                             className="btn theme-btn-2 btn-effect-2 text-uppercase "
//                             onClick={resetFilters}
//                           >
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
//         />
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { PRICE_TYPE } from '../../../constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
import FilterModal from './filterModal';
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api';
import { updateFilters, fetchProperties, clearFilters } from './../../../store/propertySearchSlice';

const libraries = ["places", "drawing"];

export default function SearchForm() {
  const { filters, selectedFilterCount } = useSelector((state) => state.propertySearch);
  const dispatch = useDispatch();
  
  // Local state management for the form fields
  const [address, setAddress] = useState(filters.address || "");
  const [propertyCategory, setPropertyCategory] = useState(filters.propertyCategory || "");
  const [lat, setLat] = useState(filters.lat || null);
  const [lng, setLng] = useState(filters.lng || null);
  const [priceType, setPriceType] = useState(filters.priceType ? PRICE_TYPE.find(option => option.value === filters.priceType) : null);

  const [showLink, setShowLink] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const autocompleteInputRef = useRef(null);

  const history = useHistory();
  const location = useLocation();

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBIjbPr5V0gaRCzgQQ-oN0eW25WvGoALVY",
    libraries,
  });

  

  const sendFilters = () => {
    const constructedFilters = {
      propertyCategory,
      ...(priceType && { priceType: priceType.value }),
      ...(lat != null && { lat }),
      ...(lng != null && { lng }),
      ...filters,
    };

    // Update the Redux store only when the user clicks "Find Now"
    dispatch(updateFilters(constructedFilters));
    dispatch(fetchProperties(constructedFilters));

    if (location.pathname !== "/services/properties") {
      history.push("/services/properties");
    }
  };

  const handleFiltersChange = (newFilters) => {
    dispatch(updateFilters(newFilters));
  };

  const handlePriceTypeChange = (selectedOption) => {
    setPriceType(selectedOption);
  };

  const resetFilters = () => {
    setAddress("");
    setPropertyCategory("");
    setPriceType(null);
    setLat(null);
    setLng(null);
    dispatch(clearFilters());
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
    if (!isLoaded) return;

    const inputElement = autocompleteInputRef.current;
    if (inputElement && inputElement instanceof HTMLInputElement) {
      const autocomplete = new window.google.maps.places.Autocomplete(inputElement);
      autocomplete.setFields(["geometry", "formatted_address"]);

      const handlePlaceSelect = () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) return;

        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setLat(location.lat);
        setLng(location.lng);
        const formattedAddress = place.formatted_address || place.name;
        setAddress(formattedAddress);
      };

      autocomplete.addListener("place_changed", handlePlaceSelect);

      return () => {
        window.google.maps.event.clearInstanceListeners(inputElement);
      };
    }
  }, [isLoaded]);

  useEffect(() => {
    // If location state changes, update the form fields and the store
    if (location.state?.filters) {
      setPropertyCategory(location.state.filters.propertyCategory || "");
      setAddress(location.state.filters.address || "");
      setLat(location.state.filters.lat || null);
      setLng(location.state.filters.lng || null);
      setPriceType(
        PRICE_TYPE.find((option) => option.value === location.state.filters.priceType) || null
      );
      dispatch(updateFilters(location.state.filters));
    }
  }, [location.state?.filters, dispatch]);

  useEffect(() => {
    // Ensure that propertyCategory changes are correctly captured and dispatched
    dispatch(updateFilters({ propertyCategory }));
  }, [propertyCategory, dispatch]);

  return (
    <div className="ltn__car-dealer-form-area mt-120 mb-120">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="ltn__car-dealer-form-tab">
              <div className="tab-content bg-white box-shadow-1 position-relative pb-10">
                <div className="tab-pane fade active show">
                  <div className="car-dealer-form-inner">
                    <form
                      className="ltn__car-dealer-form-box"
                      onSubmit={(e) => {
                        e.preventDefault();
                        sendFilters(); // Only fetch properties when the form is submitted
                      }}
                    >
                      <div className="row">
                        <div className="ltn__car-dealer-form-item col-lg-4 col-md-4">
                          <label>I'm looking to</label>
                          <select
                            className="nice-select"
                            value={propertyCategory}
                            onChange={(e) => setPropertyCategory(e.target.value)}
                          >
                            <option value="">Select an option</option> 
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
                            <Autocomplete>
                              <input
                                ref={autocompleteInputRef}
                                type="text"
                                value={address}
                                onChange={(event) =>
                                  setAddress(event.target.value)
                                }
                                placeholder="Location Name"
                                className="m-0"
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                              />
                            </Autocomplete>
                          )}
                          {showLink && (
                            <Link to="/map-search" className="draw-on-map">
                              <i className="fa fa-map-marker" aria-hidden="true"></i>
                              Search by drawing on map
                            </Link>
                          )}
                        </div>
                      </div>
                      <div
                        className="row mt-3"
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <div className="col-lg-4 col-md-4">
                          <button
                            type="button"
                            className="btn theme-btn-2 btn-effect-1 text-uppercase"
                            onClick={openModal}
                          >
                           <FontAwesomeIcon icon={faFilter} /> Filters {selectedFilterCount > 0 && `(${selectedFilterCount})`}
                          </button>
                        </div>

                        <div className="col-lg-4 col-md-4">
                          <button
                            type="submit"
                            className="btn theme-btn-1 btn-effect-1 text-uppercase"
                          >
                            Find Now
                          </button>
                        </div>
                        <div className="col-lg-4 col-md-4">
                          <button
                            type="button"
                            className="btn theme-btn-2 btn-effect-2 text-uppercase"
                            onClick={resetFilters}
                          >
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
        />
      </div>
    </div>
  );
}
