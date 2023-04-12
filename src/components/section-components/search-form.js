import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  RESIDENTIAL_PROPERTY,
  COMMERCIAL_PROPERTY,
  BEDROOMS,
} from "../../constants";

export default function SearchForm() {
  const [address, setAddress] = useState();
  const [types, setTypes] = useState([]);
  const [flag, setFlag] = useState(false);
  const [bedrooms, setBedrooms] = useState([]);
  const [propertyCategory, setPropertyCategory] = useState();
  const [propertyCategoryType, setPropertyCategoryType] = useState();
  const [propertyType, setPropertyType] = useState();
  const [rooms, setRooms] = useState();
  const [minPrice, setMinPrice] = useState();
  const [maxPrice, setMaxPrice] = useState();
  const [lat, setLat] = useState();
  const [lng, setLng] = useState();
  const [showLink, setShowLink] = useState(false);

  const handleFocus = () => {
    setShowLink(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowLink(false);
    }, 300);
  };

  function handleChange(value) {
    setPropertyCategoryType(value);
    if (value == "commercial") {
      setTypes(COMMERCIAL_PROPERTY);
      setFlag(false);
    } else if (value == "residential") {
      setTypes(RESIDENTIAL_PROPERTY);
      setBedrooms(BEDROOMS);
      setFlag(true);
    }
  }

  useEffect(() => {
    const autocomplete = new window.google.maps.places.Autocomplete(
      document.getElementById("autocomplete")
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }

      setAddress(place.formatted_address);
      setLat(place.geometry.location.lat());
      setLng(place.geometry.location.lng());
    });
  }, []);

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
                        >
                          <option value={"sale"}>Buy</option>
                          <option value={"rent"}>Rent</option>
                        </select>
                      </div>
                      <div className="ltn__car-dealer-form-item ltn__custom-icon---- ltn__icon-meter---- col-lg-3 col-md-6">
                        <label>Property Category</label>
                        <select
                          className="nice-select"
                          onChange={(e) => handleChange(e.target.value)}
                        >
                          <option selected disabled>
                            Category
                          </option>
                          <option value={"commercial"}>Commercial</option>
                          <option value={"residential"}>Residential</option>
                        </select>
                      </div>
                      <div className="ltn__car-dealer-form-item ltn__custom-icon---- ltn__icon-meter---- col-lg-3 col-md-6">
                        <label>Property Type</label>
                        <select
                          className="nice-select"
                          onChange={(e) => setPropertyType(e.target.value)}
                        >
                          <option selected disabled>
                            Type
                          </option>
                          {types.map((element) => (
                            <option value={element.value}>
                              {element.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      {flag ? (
                        <div className="ltn__car-dealer-form-item ltn__custom-icon---- ltn__icon-meter---- col-lg-3 col-md-6">
                          <label>No. of Bedrooms</label>
                          <select
                            className="nice-select"
                            onChange={(e) => setRooms(e.target.value)}
                          >
                            <option selected disabled>
                              No. of Bedrooms
                            </option>
                            {bedrooms.map((element) => (
                              <option value={element.value}>
                                {element.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : null}
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
                              pathname: "/location-search",
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
                      <div className="ltn__car-dealer-form-item ltn__custom-icon---- ltn__icon-car---- col-lg-3 col-md-6">
                        <label>Minimum Price</label>
                        <input
                          type="text"
                          placeholder="Minimum Price"
                          onChange={(e) => setMinPrice(e.target.value)}
                          className="m-0"
                        />
                      </div>
                      <div className="ltn__car-dealer-form-item ltn__custom-icon---- ltn__icon-car---- col-lg-3 col-md-6">
                        <label>Maximum Price</label>
                        <input
                          type="text"
                          placeholder="Maximum Price"
                          onChange={(e) => setMaxPrice(e.target.value)}
                          className="m-0"
                        />
                      </div>
                      <div className="ltn__car-dealer-form-item ltn__custom-icon ltn__icon-calendar col-lg-3 col-md-6">
                        <div className="btn-wrapper mt-0 go-top pt-1">
                          <Link
                            to={{
                              pathname: "/property-grid",
                              state: {
                                propertyCategory,
                                propertyCategoryType,
                                propertyType,
                                rooms: parseInt(rooms),
                                lat,
                                lng,
                                minPrice: parseInt(minPrice),
                                maxPrice: parseInt(maxPrice),
                              },
                            }}
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
      </div>
    </div>
  );
}
