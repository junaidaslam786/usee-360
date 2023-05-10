import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import axios from "axios";
import {
  DEFAULT_CURRENCY,
  PROPERTY_CATEGORY_TYPES,
  BEDROOMS,
  UNITS,
} from "../../constants";

export default function PropertyGrid() {
  const [currentPage, setCurrentPage] = useState();
  const [totalPages, setTotalPages] = useState();
  const [propertyCategoryFilter, setPropertyCategory] = useState();
  const [propertyCategoryTypeFilter, setPropertyCategoryType] = useState();
  const [latFilter, setLatFilter] = useState();
  const [lngFilter, setLngFilter] = useState();
  const [roomsFilter, setRooms] = useState();
  const [address, setAddress] = useState();

  const publicUrl = `${process.env.REACT_APP_API_URL}`;
  const token = JSON.parse(localStorage.getItem("customerToken"));

  const [properties, setProperties] = useState([]);
  const [wishlistProperties, setWishlistProperties] = useState([]);
  const [wishlistId, setWishlistId] = useState();
  const [wishlistTitle, setWishlistTitle] = useState();
  const [wishlistImage, setWishlistImage] = useState();

  const toggleButton = useRef(null);
  const price = useRef(null);
  const sort = useRef(null);
  const history = useHistory();
  const location = useLocation();

  async function loadProperties(search, page = 1) {
    let payload = {
      page: page,
      size: 10,
    };

    if (location.state) {
      const {
        propertyCategory,
        propertyCategoryType,
        propertyType,
        rooms,
        lat,
        lng,
        minPrice,
        maxPrice,
      } = location.state;

      if (propertyCategory) {
        payload.propertyCategory = propertyCategory;
      }
      if (propertyCategoryType) {
        payload.propertyCategoryType = propertyCategoryType;
      }
      if (propertyType) {
        payload.propertyType = propertyType;
      }
      if (rooms) {
        payload.rooms = rooms;
      }
      if (lat) {
        payload.lat = lat;
      }
      if (lng) {
        payload.lng = lng;
      }
      if (minPrice) {
        payload.minPrice = minPrice;
      }
      if (maxPrice) {
        payload.maxPrice = maxPrice;
      }
    }

    if (search == "filter") {
      if (propertyCategoryFilter) {
        payload.propertyCategory = propertyCategoryFilter;
      }

      if (propertyCategoryTypeFilter) {
        payload.propertyCategoryType = propertyCategoryTypeFilter;
      }

      if (roomsFilter) {
        payload.rooms = roomsFilter;
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

    await axios
      .post(`${process.env.REACT_APP_API_URL}/home/property/list`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setProperties(response.data.data);
        setCurrentPage(response.data.page);
        setTotalPages(response.data.totalPage);
      });
  }

  async function loadWishlistProperties() {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/customer/wishlist/list`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setWishlistProperties(response.data);
      });
  }

  async function addToWishList(ID) {
    if (!token) {
      history.push(
        "/customer/login?returnUrl=" +
          encodeURIComponent(window.location.pathname)
      );
    } else {
      await axios
        .get(`${process.env.REACT_APP_API_URL}/customer/wishlist/add/${ID}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          const prop = properties.find(({ id }) => id === ID);
          setWishlistId(prop.id);
          setWishlistTitle(prop.title);
          setWishlistImage(prop.featuredImage);
          toggleButton.current.click();
          loadWishlistProperties();
        });
    }
  }

  async function removeWishList(ID) {
    if (!token) {
      history.push(
        "/customer/login?returnUrl=" +
          encodeURIComponent(window.location.pathname)
      );
    } else {
      await axios
        .delete(
          `${process.env.REACT_APP_API_URL}/customer/wishlist/remove/${ID}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          loadWishlistProperties();
        });
    }
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

  useEffect(() => {
    loadProperties();
    if (token) {
      loadWishlistProperties();
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
  }, []);

  return (
    <div>
      <div className="ltn__product-area ltn__product-gutter">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 order-lg-2 mb-100">
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
                                <Link to={`/property-details/${element.id}`}>
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
                                  <Link to={`/property-details/${element.id}`}>
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
                                <div className="product-hover-action">
                                  <ul>
                                    <li
                                      className={
                                        wishlistProperties.find(
                                          ({ productId }) =>
                                            productId === element.id
                                        )
                                          ? "wishlist-active"
                                          : null
                                      }
                                    >
                                      <a
                                        href="#"
                                        title="Quick View"
                                        onClick={() => {
                                          wishlistProperties.find(
                                            ({ productId }) =>
                                              productId === element.id
                                          )
                                            ? removeWishList(element.id)
                                            : addToWishList(element.id);
                                        }}
                                      >
                                        <i className="flaticon-heart-1" />
                                      </a>
                                    </li>
                                  </ul>
                                </div>
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
                                <Link to={`/property-details/${element.id}`}>
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
                                  <Link to={`/property-details/${element.id}`}>
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
                              <div className="product-info-bottom">
                                <div className="product-hover-action">
                                  <ul>
                                    <li
                                      className={
                                        wishlistProperties.find(
                                          ({ productId }) =>
                                            productId === element.id
                                        )
                                          ? "wishlist-active"
                                          : null
                                      }
                                    >
                                      <a
                                        href="#"
                                        title="Quick View"
                                        onClick={() => {
                                          wishlistProperties.find(
                                            ({ productId }) =>
                                              productId === element.id
                                          )
                                            ? removeWishList(element.id)
                                            : addToWishList(element.id);
                                        }}
                                      >
                                        <i className="flaticon-heart-1" />
                                      </a>
                                    </li>
                                  </ul>
                                </div>
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
            <div className="col-lg-4  mb-100">
              <aside className="sidebar ltn__shop-sidebar">
                <h3 className="mb-10">Advance Filters</h3>
                <div className="widget ltn__menu-widget">
                  <h4 className="ltn__widget-title">Property Category</h4>
                  <ul>
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
                  <hr />
                  <h4 className="ltn__widget-title">Type</h4>
                  <ul>
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
                  <hr />
                  <div className="widget--- ltn__price-filter-widget">
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
                  <hr />
                  <h4 className="ltn__widget-title">Bedrooms</h4>
                  <ul>
                    <div
                      onChange={(e) => {
                        setRooms(e.target.value);
                      }}
                    >
                      <li>
                        <label className="checkbox-item">
                          1
                          <input type="radio" name="bedrooms" value="1" />
                          <span className="checkmark" />
                        </label>
                      </li>
                      <li>
                        <label className="checkbox-item">
                          2
                          <input type="radio" name="bedrooms" value="2" />
                          <span className="checkmark" />
                        </label>
                      </li>
                      <li>
                        <label className="checkbox-item">
                          3
                          <input type="radio" name="bedrooms" value="3" />
                          <span className="checkmark" />
                        </label>
                      </li>
                      <li>
                        <label className="checkbox-item">
                          4
                          <input type="radio" name="bedrooms" value="4" />
                          <span className="checkmark" />
                        </label>
                      </li>
                      <li>
                        <label className="checkbox-item">
                          5
                          <input type="radio" name="bedrooms" value="5" />
                          <span className="checkmark" />
                        </label>
                      </li>
                      <li>
                        <label className="checkbox-item">
                          6
                          <input type="radio" name="bedrooms" value="6" />
                          <span className="checkmark" />
                        </label>
                      </li>
                      <li>
                        <label className="checkbox-item">
                          7
                          <input type="radio" name="bedrooms" value="7" />
                          <span className="checkmark" />
                        </label>
                      </li>
                      <li>
                        <label className="checkbox-item">
                          8
                          <input type="radio" name="bedrooms" value="8" />
                          <span className="checkmark" />
                        </label>
                      </li>
                      <li>
                        <label className="checkbox-item">
                          9
                          <input type="radio" name="bedrooms" value="9" />
                          <span className="checkmark" />
                        </label>
                      </li>
                      <li>
                        <label className="checkbox-item">
                          10
                          <input type="radio" name="bedrooms" value="10" />
                          <span className="checkmark" />
                        </label>
                      </li>
                    </div>
                  </ul>
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
          </div>
        </div>
      </div>

      <a
        ref={toggleButton}
        data-bs-toggle="modal"
        data-bs-target="#liton_wishlist_modal"
      ></a>

      <div className="ltn__modal-area ltn__add-to-cart-modal-area">
        <div className="modal fade" id="liton_wishlist_modal" tabIndex={-1}>
          <div className="modal-dialog modal-md" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="ltn__quick-view-modal-inner">
                  <div className="modal-product-item">
                    <div className="row">
                      <div className="col-12">
                        <div className="modal-product-img">
                          <img src={`${publicUrl}/${wishlistImage}`} alt="#" />
                        </div>
                        <div className="modal-product-info go-top">
                          <h5>
                            <Link to={`/property-details/${wishlistId}`}>
                              {wishlistTitle}
                            </Link>
                          </h5>
                          <p className="added-cart">
                            <i className="fa fa-check-circle" /> Successfully
                            added to your Wishlist
                          </p>
                          <div className="btn-wrapper">
                            <Link
                              to="/customer/wishlist"
                              className="theme-btn-1 btn btn-effect-1"
                            >
                              View Wishlist
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
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
