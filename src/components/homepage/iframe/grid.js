import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import {
  DEFAULT_CURRENCY,
  PROPERTY_CATEGORY_TYPES,
  BEDROOMS,
  UNITS,
} from "../../../constants";
import HomepageService from "../../../services/homepage";
import Select from "react-select";

export default function IframePropertyGrid() {
  const [currentPage, setCurrentPage] = useState();
  const [totalPages, setTotalPages] = useState();
  const [propertyCategoryFilter, setPropertyCategory] = useState();
  const [propertyCategoryTypeFilter, setPropertyCategoryType] = useState();
  const [latFilter, setLatFilter] = useState();
  const [lngFilter, setLngFilter] = useState();
  const [roomsFilter, setRooms] = useState();
  const [address, setAddress] = useState();
  const [properties, setProperties] = useState([]);

  const publicUrl = `${process.env.REACT_APP_API_URL}`;

  const price = useRef(null);
  const sort = useRef(null);
  const params = useParams();

  const loadProperties = async (search, page = 1) => {
    let payload = {
      page: page,
      size: 10,
    };

    if (search == "filter") {
      if (propertyCategoryFilter) {
        payload.propertyCategory = propertyCategoryFilter;
      }

      if (propertyCategoryTypeFilter) {
        payload.propertyCategoryType = propertyCategoryTypeFilter;
      }

      if (roomsFilter) {
        payload.rooms = roomsFilter.value;
      }

      if (latFilter) {
        payload.lat = latFilter;
      }

      if (lngFilter) {
        payload.lng = lngFilter;
      }

      if (sort.current.value !== "null") {
        payload.sort = ["price", sort.current.value];
      }

      let arr = price.current.value.split(" - ");
      payload.minPrice = parseInt(arr[0]);
      payload.maxPrice = parseInt(arr[1]);
    }

    const response = await HomepageService.listProperties(params.id, payload);
    if (response?.data) {
      setProperties(response.data);
      setCurrentPage(response.page);
      setTotalPages(response.totalPage);
    }
  }

  const loadPropertyMetaData = (property, type) => {
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

  useEffect(() => {
    loadProperties();

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

    const publicUrl = `${process.env.REACT_APP_PUBLIC_URL}/`;
    const minscript = document.createElement("script");

    minscript.async = true;
    minscript.src = `${publicUrl}assets/js/main.js`;
    document.body.appendChild(minscript);
  }, []);

  return (
    <div>
      <div className="ltn__product-area ltn__product-gutter">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 order-lg-2 mb-50">
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
                      <span>Showing 1–{properties.length} of {totalPages} results</span>
                    </div>
                  </li>
                  <li>
                    <div className="short-by text-center">
                      <select
                        className="nice-select"
                        ref={sort}
                        onChange={() => {
                          loadProperties("filter");
                        }}
                      >
                        <option selected disabled value="null">
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
              <div className="mb-50">
                <aside className="sidebar ltn__shop-sidebar">
                  <h3 className="mb-10">Advance Filters</h3>
                  <div className="widget ltn__menu-widget row">
                    <ul className="col-sm-4">
                      <h4 className="ltn__widget-title">Property Category</h4>
                      <div
                        onChange={(e) => {
                          setPropertyCategory(e.target.value);
                        }}
                      >
                        <li>
                          <label className="checkbox-item">
                            Rent
                            <input
                              type="radio"
                              name="propertyCategory"
                              value="rent"
                            />
                            <span className="checkmark" />
                          </label>
                        </li>
                        <li>
                          <label className="checkbox-item">
                            Buy
                            <input
                              type="radio"
                              name="propertyCategory"
                              value="sale"
                            />
                            <span className="checkmark" />
                          </label>
                        </li>
                      </div>
                    </ul>
                    <ul className="col-sm-4">
                      <h4 className="ltn__widget-title">Type</h4>
                      <div
                        onChange={(e) => {
                          setPropertyCategoryType(e.target.value);
                        }}
                      >
                        <li>
                          <label className="checkbox-item">
                            Commercial
                            <input
                              type="radio"
                              name="propertyCategoryType"
                              value="commercial"
                            />
                            <span className="checkmark" />
                          </label>
                        </li>
                        <li>
                          <label className="checkbox-item">
                            Residential
                            <input
                              type="radio"
                              name="propertyCategoryType"
                              value="residential"
                            />
                            <span className="checkmark" />
                          </label>
                        </li>
                      </div>
                    </ul>
                    <ul className="col-sm-4">
                      <h4 className="ltn__widget-title">Bedrooms</h4>
                        <Select
                          classNamePrefix="custom-select"
                          options={BEDROOMS}
                          onChange={(e) => { setRooms(e) }}
                          value={roomsFilter}
                        />
                    </ul>
                    <hr />
                    <div className="widget--- ltn__price-filter-widget col-sm-12">
                      <h4 className="ltn__widget-title ltn__widget-title-border---">
                        Filter by price
                      </h4>
                      <div className="price_filter">
                        <div className="price_slider_amount">
                          <input
                            type="text"
                            className="amount"
                            name="price"
                            ref={price}
                            placeholder="Add Your Price"
                          />
                        </div>
                        <div className="slider-range" />
                      </div>
                    </div>
                  </div>
                </aside>
                <button
                  className="mt-4 btn theme-btn-1"
                  onClick={() => loadProperties("filter")}
                >
                  Submit
                </button>
                <button
                  className="mt-4 btn theme-btn-2"
                  onClick={() => window.location.reload(true)}
                >
                  Reset
                </button>
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
                              name="ltn__name"
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
                                loadProperties("filter");
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
                                  to={`/iframe/property-details/${params.id}/${element.id}`}
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
                                    to={`/iframe/property-details/${params.id}/${element.id}`}
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
                                  to={`/iframe/property-details/${params.id}/${element.id}`}
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
                                    to={`/iframe/property-details/${params.id}/${element.id}`}
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
              <div className="ltn__pagination-area text-center">
                <div className="ltn__pagination">
                  <ul>
                    <li>
                      <Link
                        to="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage !== 1) {
                            loadProperties("filter", currentPage - 1);
                          }
                        }}
                      >
                        <i className="fas fa-angle-double-left" />
                      </Link>
                    </li>
                    {Array.from(Array(totalPages), (e, i) => {
                      return (
                        <li
                          key={i}
                          className={currentPage == i + 1 ? "active" : null}
                        >
                          <Link
                            to="#"
                            onClick={(e) => {
                              e.preventDefault();
                              loadProperties("filter", i + 1);
                            }}
                          >
                            {i + 1}
                          </Link>
                        </li>
                      );
                    })}
                    <li>
                      <Link
                        to="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage !== totalPages) {
                            loadProperties("filter", currentPage + 1);
                          }
                        }}
                      >
                        <i className="fas fa-angle-double-right" />
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
