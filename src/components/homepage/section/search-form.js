import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { PRICE_TYPE } from "../../../constants";
import { useStateIfMounted } from "use-state-if-mounted";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "react-select";
import FilterModal from "./filterModal";
import { useJsApiLoader } from "@react-google-maps/api";

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
  const [propertyCategory, setPropertyCategory] = useState(
    defaultPropertyCategory || "sale"
  );
  const [lat, setLat] = useStateIfMounted(defaultLat || null);
  const [lng, setLng] = useStateIfMounted(defaultLng || null);
  const [showLink, setShowLink] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [priceType, setPriceType] = useState(defaultPriceType);

  const [filters, setFilters] = useState({});

  const history = useHistory();
  const location = useLocation();

  const isMounted = useRef(false);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBIjbPr5V0gaRCzgQQ-oN0eW25WvGoALVY",
    libraries,
  });

  const handleFiltersChange = (newFilters) => {
    console.log(newFilters);
    setFilters(newFilters);
  };

  const sendFilters = () => {
    const combinedFilters = constructSelectedFilters();
    // Check if the current page is not the properties page
    if (location.pathname !== "/services/properties") {
      history.push("/services/properties", {
        filters: combinedFilters,
        propertyCategory: defaultPropertyCategory,
      });
    } else if (onFiltersChange) {
      onFiltersChange(combinedFilters);
    }
  };

  const constructSelectedFilters = () => {
    const selectedFilters = {
      ...(propertyCategory && { propertyCategory }),
      ...(priceType && { priceType }),
      ...(lat != null && { lat }),
      ...(lng != null && { lng }),
      ...Object.entries(filters).reduce((acc, [key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          acc[key] = value;
        } else if (!Array.isArray(value) && value) {
          // For non-array values, check if they have a truthy value
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
  };

  const handleFocus = () => {
    setShowLink(true);
  };

  // Update handleBlur to use clearTimeout for cleanup
  const handleBlur = () => {
    const timeoutId = setTimeout(() => {
      if (isMounted.current) {
        setShowLink(false);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const reverseGeocode = (latitude, longitude) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results, status) => {
        if (status === "OK") {
          if (results[0]) {
            setAddress(results[0].formatted_address);
          } else {
            console.log("No results found");
          }
        } else {
          console.error("Geocoder failed due to: " + status);
        }
      }
    );
  };

  useEffect(() => {
    // Trigger reverse geocoding if lat and lng change and are not null
    if (lat !== null && lng !== null) {
      reverseGeocode(lat, lng);
    }
  }, [lat, lng]);

  useEffect(() => {
    setAddress(defaultAddress || "");
    setLat(defaultLat || null);
    setLng(defaultLng || null);
    setPriceType(defaultPriceType);
    setPropertyCategory(defaultPropertyCategory || "sale");
  }, [
    defaultAddress,
    defaultLat,
    defaultLng,
    defaultPriceType,
    defaultPropertyCategory,
  ]);

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
    let autocomplete;
    if (isLoaded) {
      autocomplete = new window.google.maps.places.Autocomplete(
        document.getElementById("autocomplete2")
      );
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          setLat((prevLat) => place.geometry.location.lat());
          setLng((prevLng) => place.geometry.location.lng());
          setAddress(place.formatted_address);
        } else {
          console.error("No geometry for selected place.");
        }
      });
    }
    return () => {
      if (autocomplete) {
        window.google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [isLoaded, setAddress, setLat, setLng]);

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
                    <form action="#" className="ltn__car-dealer-form-box">
                      {/* First row for inputs */}
                      <div className="row">
                        <div className="ltn__car-dealer-form-item col-lg-4 col-md-4">
                          <label>I'm looking to</label>
                          <select
                            className="nice-select"
                            value={propertyCategory}
                            onChange={(e) =>
                              setPropertyCategory(e.target.value)
                            }
                            // defaultValue={"sale"}
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
                              onChange={(e) => setPriceType(e)}
                              value={priceType}
                            />
                          </div>
                        )}

                        <div className="ltn__car-dealer-form-item col-lg-4 col-md-4">
                          <label>Location</label>
                          <input
                            type="text"
                            id="autocomplete2"
                            value={address || ""}
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
                            className="btn theme-btn-2 btn-effect-1 text-uppercase "
                            onClick={openModal}
                          >
                            <FontAwesomeIcon icon={faFilter} /> Filters (
                            {selectedFiltersCount})
                          </button>
                        </div>

                        <div className="col-lg-4 col-md-4">
                          <button
                            className="btn theme-btn-1 btn-effect-1 text-uppercase "
                            onClick={sendFilters}
                          >
                            Find Now
                          </button>
                        </div>
                        <div className="col-lg-4 col-md-4">
                          <button
                            type="button"
                            className="btn theme-btn-2 btn-effect-2 text-uppercase "
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
          // className="btn theme-btn-2 btn-effect-1 text-uppercase search-btn mt-4"
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          onFiltersChange={handleFiltersChange}
        />
      </div>
    </div>
  );
}
