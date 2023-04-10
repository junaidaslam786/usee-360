import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  DEFAULT_CURRENCY,
  PROPERTY_CATEGORY_TYPES,
  BEDROOMS,
  UNITS,
} from "../../constants";

export default function PropertyGrid() {
  const publicUrl = `${process.env.REACT_APP_API_URL}`;
  const [properties, setProperties] = useState([]);

  const [latFilter, setLatFilter] = useState();
  const [lngFilter, setLngFilter] = useState();
  const [sortFilter, setSortFilter] = useState();
  const [address, setAddress] = useState();

  async function loadProperties(search) {
    let payload = {
      page: 1,
      size: 50,
    };

    if (search == "location") {
      if (latFilter) {
        payload.lat = latFilter;
      }

      if (lngFilter) {
        payload.lng = lngFilter;
      }
    }

    if (search == "sort") {
      if (sortFilter) {
        payload.sort = ["price", sortFilter];
      }
    }

    await axios
      .post(`${process.env.REACT_APP_API_URL}/home/property/list`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setProperties(response.data.data);
      });
  }

  function loadPropertyMetaData(property, type) {
    let metaData = "";
    let metaTag;
    if (property?.productMetaTags?.length > 0) {
      switch (type) {
        case "categoryType":
          metaTag = property.productMetaTags.find(
            (meta) => meta.categoryField.id === 2
          );
          if (metaTag) {
            metaData = PROPERTY_CATEGORY_TYPES.find(
              (property) => property.value == metaTag.value
            );
            metaData = metaData?.value === "sale" ? "Buy" : "Rent";
          } else {
            metaData = "Rent";
          }

          break;

        case "unit":
          metaTag = property.productMetaTags.find(
            (meta) => meta.categoryField.id === 3
          );
          if (metaTag) {
            metaData = UNITS.find(
              (property) => property.value == metaTag.value
            );
            metaData = metaData?.label ? metaData.label : "Square Ft";
          } else {
            metaData = "Square Ft";
          }
          break;

        case "area":
          metaTag = property.productMetaTags.find(
            (meta) => meta.categoryField.id === 4
          );
          metaData = metaTag ? metaTag.value : 0;
          break;

        case "bedroom":
          metaTag = property.productMetaTags.find(
            (meta) => meta.categoryField.id === 5
          );
          if (metaTag) {
            metaData = BEDROOMS.find(
              (property) => property.value == metaTag.value
            );
            metaData = metaData?.label ? metaData.label : "No";
          } else {
            metaData = "No";
          }
          break;
      }
    }
    return metaData;
  }

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
    setLatFilter(place.geometry.location.lat());
    setLngFilter(place.geometry.location.lng());
  });

  useEffect(() => {
    loadProperties();
  }, []);

  return (
    <div className="mt-50">
      <div className="ltn__product-area ltn__product-gutter">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 order-lg-2 mb-50">
              <div className="ltn__shop-options">
                <ul className="justify-content-start">
                  <li>
                    <div className="ltn__grid-list-tab-menu ">
                      <div className="nav">
                        <a
                          className="active show"
                          data-bs-toggle="tab"
                          href="#liton_product_grid"
                        >
                          <i className="fas fa-th-large" />
                        </a>
                        <a data-bs-toggle="tab" href="#liton_product_list">
                          <i className="fas fa-list" />
                        </a>
                      </div>
                    </div>
                  </li>
                  <li className="d-none">
                    <div className="showing-product-number text-right">
                      <span>Showing 1–12 of 18 results</span>
                    </div>
                  </li>
                  <li>
                    <div className="short-by text-center">
                      <select
                        className="nice-select"
                        onChange={(e) => {
                          setSortFilter(e.target.value);
                          loadProperties("sort");
                        }}
                      >
                        <option selected disabled>
                          Default Sorting
                        </option>
                        <option value={"ASC"}>
                          Sort by price: low to high
                        </option>
                        <option value={"DESC"}>
                          Sort by price: high to low
                        </option>
                      </select>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="tab-content">
                <div
                  className="tab-pane fade active show"
                  id="liton_product_grid"
                >
                  <div className="ltn__product-tab-content-inner ltn__product-grid-view">
                    <div className="row">
                      <div className="col-lg-12">
                        {/* Search Widget */}
                        <div className="ltn__search-widget mb-30">
                          <form>
                            <input
                              type="text"
                              name="search"
                              id="autocomplete"
                              placeholder="Search Location..."
                              value={address}
                              onChange={(event) =>
                                setAddress(event.target.value)
                              }
                            />
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                loadProperties("location");
                              }}
                            >
                              <i className="fas fa-search" />
                            </button>
                          </form>
                        </div>
                      </div>
                      {properties && properties.length === 0 ? (
                        <div className="col-lg-12">
                          <p>No Data!</p>
                        </div>
                      ) : (
                        properties.map((element, i) => (
                          <div className="col-xl-6 col-sm-6 col-12" key={i}>
                            <div className="ltn__product-item ltn__product-item-4 ltn__product-item-5 text-center---">
                              <div className="product-img go-top">
                                <Link
                                  to={`/iframe/property-details/${element.id}`}
                                >
                                  <img
                                    src={`${publicUrl}/${element.featuredImage}`}
                                    height="250px"
                                    width="100%"
                                  />
                                </Link>
                              </div>
                              <div className="product-info">
                                <div className="product-badge">
                                  <ul>
                                    <li className="sale-badg">
                                      For{" "}
                                      {loadPropertyMetaData(
                                        element,
                                        "categoryType"
                                      )}
                                    </li>
                                  </ul>
                                </div>
                                <h2 className="product-title go-top">
                                  <Link
                                    to={`/iframe/property-details/${element.id}`}
                                  >
                                    {element.title}
                                  </Link>
                                </h2>
                                <div className="product-img-location go-top">
                                  <ul>
                                    <li>
                                      <Link to="#">
                                        <i className="flaticon-pin" />{" "}
                                        {element.address}
                                      </Link>
                                    </li>
                                  </ul>
                                </div>
                                {element?.productMetaTags?.length > 0 && (
                                  <ul className="ltn__list-item-2--- ltn__list-item-2-before--- ltn__plot-brief">
                                    <li>
                                      <span>
                                        {loadPropertyMetaData(
                                          element,
                                          "bedroom"
                                        )}{" "}
                                      </span>
                                      Bed
                                    </li>
                                    <li>
                                      <span>
                                        {loadPropertyMetaData(element, "area")}{" "}
                                      </span>
                                      {loadPropertyMetaData(element, "unit")}
                                    </li>
                                  </ul>
                                )}
                              </div>
                              <div className="product-info-bottom">
                                <div className="product-price">
                                  <span>
                                    {DEFAULT_CURRENCY} {element.price}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
                <div className="tab-pane fade" id="liton_product_list">
                  <div className="ltn__product-tab-content-inner ltn__product-list-view">
                    <div className="row">
                      <div className="col-lg-12">
                        {/* Search Widget */}
                        <div className="ltn__search-widget mb-30">
                          <form action="#">
                            <input
                              type="text"
                              name="search"
                              placeholder="Search your keyword..."
                            />
                            <button type="submit">
                              <i className="fas fa-search" />
                            </button>
                          </form>
                        </div>
                      </div>
                      {properties && properties.length === 0 ? (
                        <div className="col-lg-12">
                          <p>No Data!</p>
                        </div>
                      ) : (
                        properties.map((element, i) => (
                          <div className="col-lg-12" key={i}>
                            <div className="ltn__product-item ltn__product-item-4 ltn__product-item-5">
                              <div className="product-img go-top">
                                <Link
                                  to={`/iframe/property-details/${element.id}`}
                                >
                                  <img
                                    src={`${publicUrl}/${element.featuredImage}`}
                                    height="200px"
                                    width="100%"
                                  />
                                </Link>
                              </div>
                              <div className="product-info">
                                <div className="product-badge-price">
                                  <div className="product-badge">
                                    <ul>
                                      <li className="sale-badg">
                                        For{" "}
                                        {loadPropertyMetaData(
                                          element,
                                          "categoryType"
                                        )}
                                      </li>
                                    </ul>
                                  </div>
                                  <div className="product-price">
                                    <span>
                                      {DEFAULT_CURRENCY} {element.price}
                                    </span>
                                  </div>
                                </div>
                                <h2 className="product-title go-top">
                                  <Link
                                    to={`/iframe/property-details/${element.id}`}
                                  >
                                    {element.title}
                                  </Link>
                                </h2>
                                <div className="product-img-location go-top">
                                  <ul>
                                    <li>
                                      <Link to="#">
                                        <i className="flaticon-pin" />{" "}
                                        {element.address}
                                      </Link>
                                    </li>
                                  </ul>
                                </div>
                                <ul className="ltn__list-item-2--- ltn__list-item-2-before--- ltn__plot-brief">
                                  <li>
                                    <span>
                                      {loadPropertyMetaData(element, "bedroom")}{" "}
                                    </span>
                                    Bed
                                  </li>
                                  <li>
                                    <span>
                                      {loadPropertyMetaData(element, "area")}{" "}
                                    </span>
                                    {loadPropertyMetaData(element, "unit")}
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="ltn__pagination-area text-center">
                <div className="ltn__pagination">
                  <ul>
                    <li>
                      <Link to="#">
                        <i className="fas fa-angle-double-left" />
                      </Link>
                    </li>
                    <li>
                      <Link to="#">1</Link>
                    </li>
                    <li className="active">
                      <Link to="#">2</Link>
                    </li>
                    <li>
                      <Link to="#">3</Link>
                    </li>
                    <li>
                      <Link to="#">...</Link>
                    </li>
                    <li>
                      <Link to="#">10</Link>
                    </li>
                    <li>
                      <Link to="#">
                        <i className="fas fa-angle-double-right" />
                      </Link>
                    </li>
                  </ul>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
