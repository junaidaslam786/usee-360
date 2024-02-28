import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  RESIDENTIAL_PROPERTY,
  COMMERCIAL_PROPERTY,
  BEDROOMS,
  PRICE_TYPE,
} from "../../../constants";
import { useStateIfMounted } from "use-state-if-mounted";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "react-select";
import FilterModal from "./filterModal";
import { useJsApiLoader } from "@react-google-maps/api";

export default function SearchForm() {
  const [address, setAddress] = useStateIfMounted();
  const [types, setTypes] = useState([]);
  const [propertyCategory, setPropertyCategory] = useState("sale");
  const [lat, setLat] = useStateIfMounted();
  const [lng, setLng] = useStateIfMounted();
  const [showLink, setShowLink] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [priceType, setPriceType] = useState();

  const [filters, setFilters] = useState({});

 const isMounted = useRef(false);

  const {isLoaded} =useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: 'AIzaSyBIjbPr5V0gaRCzgQQ-oN0eW25WvGoALVY',
    libraries: ["places", "drawing"],
  })


  const handleFiltersChange = (newFilters) => {
    console.log(newFilters);
    setFilters(newFilters);
  };

  const countSelectedFilters = () => {
    let count = 0;
    // Adjust the logic if your filters structure is different
    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (value !== null && value !== undefined) {
        if (typeof value === "object") {
          if (Array.isArray(value) && value.length > 0) {
            count++;
          } else if (!Array.isArray(value) && Object.keys(value).length > 0) {
            count++;
          }
        } else {
          count++;
        }
      }
    });
    return count;
  };

  const selectedFiltersCount = useMemo(() => countSelectedFilters(), [filters]);

  const constructSelectedFilters = () => {
    const selectedFilters = {
      ...(propertyCategory && { propertyCategory }),
      ...(priceType && { priceType }),
      ...(lat && { lat }),
      ...(lng && { lng }),
      ...Object.entries(filters).reduce((acc, [key, value]) => {
        if (value) acc[key] = value; // Adjust this logic based on how you determine a filter is 'selected'
        return acc;
      }, {}),
    };

    return selectedFilters;
  };

    const selectedFilters = constructSelectedFilters();
  // const handleFndNowClick = () => {
    //   const selectedFilters = constructSelectedFilters();
  //   history.push('/property-grid', {...selectedFilters});
  // };


  const handleFocus = () => {
    setShowLink(true);
  };

  // Update handleBlur to use clearTimeout for cleanup
  const handleBlur = () => {
    const timeoutId = setTimeout(() => {
      if (isMounted.current) { // Only update state if the component is still mounted
        setShowLink(false);
      }
    }, 300);
    return () => clearTimeout(timeoutId); // Cleanup function to clear the timeout
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (isLoaded) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        document.getElementById("autocomplete")
      );
  
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !isMounted.current) {
          window.alert("No details available for input: '" + place.name + "'");
          return;
        }
  
        setAddress(place.formatted_address);
        setLat(place.geometry.location.lat());
        setLng(place.geometry.location.lng());
      });
    }
    return () => {
      isMounted.current = false; 
    };
  }, [isLoaded]);

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
                        <label>I'm looking to</label>
                        <select
                          className="nice-select"
                          onChange={(e) => setPropertyCategory(e.target.value)}
                          defaultValue={"sale"}
                        >
                          <option value={"sale"}>Buy</option>
                          <option value={"rent"}>Rent</option>
                        </select>
                      </div>

                      {propertyCategory === "rent" && (
                        <div className="ltn__car-dealer-form-item ltn__custom-icon---- ltn__icon-meter---- col-lg-3 col-md-6">
                          <label>Price Type</label>
                          <Select
                            classNamePrefix="custom-select"
                            options={PRICE_TYPE}
                            onChange={(e) => setPriceType(e)}
                            value={priceType}
                            required
                          />
                        </div>
                      )}

                      <div className="ltn__car-dealer-form-item ltn__custom-icon---- ltn__icon-car---- col-lg-3 col-md-6">
                        <label>Location</label>
                        <input
                          type="text"
                          id="autocomplete"
                          value={address}
                          onChange={(event) => setAddress(event.target.value)}
                          placeholder="Location Name"
                          className="m-0"
                          onFocus={handleFocus}
                          onBlur={handleBlur}
                        />
                        {showLink && (
                          <Link
                            to={{
                              pathname: "/map-search",
                            }}
                            className="draw-on-map"
                          >
                            <i
                              className="fa fa-map-marker"
                              aria-hidden="true"
                            ></i>
                            Search by drawing on map
                          </Link>
                        )}
                      </div>

                      <div className="ltn__car-dealer-form-item ltn__custom-icon ltn__icon-calendar col-lg-6 col-md-6">
                        <div
                          className="btn-wrapper mt-0 go-top pt-1"
                          style={{ display: "flex" }}
                        >
                          <button
                            type="button"
                            className="btn theme-btn-2 btn-effect-1 text-uppercase search-btn mt-4"
                            onClick={openModal}
                          >
                            <FontAwesomeIcon icon={faFilter} /> Filters (
                            {selectedFiltersCount})
                          </button>
                          <FilterModal
                            // className="btn theme-btn-2 btn-effect-1 text-uppercase search-btn mt-4"
                            isOpen={isModalOpen}
                            onRequestClose={closeModal}
                            onFiltersChange={handleFiltersChange}
                          />
                          <Link
                            to={{
                              pathname: "/property-grid",
                              state: { filters: selectedFilters, source: 'search-form' },
                            }}
                            on
                            className="btn theme-btn-1 btn-effect-1 text-uppercase search-btn mt-4"
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
        {/* Filter Modal */}
      </div>
    </div>
  );
}
