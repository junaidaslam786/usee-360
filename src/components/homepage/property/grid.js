import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  formatPrice,
  getLoginToken,
  loadPropertyMetaData,
} from "../../../utils";
import HomepageService from "../../../services/homepage";
import WishlistService from "../../../services/customer/wishlist";
import UserService from "../../../services/profile";
import { FaPaw } from "react-icons/fa";
import { useJsApiLoader } from "@react-google-maps/api";

export default function PropertyGrid({
  filters,
  mapProperties,
  responseHandler,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [properties, setProperties] = useState([]);
  const [wishlistProperties, setWishlistProperties] = useState([]);
  const [wishlistId, setWishlistId] = useState();
  const [wishlistTitle, setWishlistTitle] = useState();
  const [wishlistImage, setWishlistImage] = useState();
  const [carbonFootprints, setCarbonFootprints] = useState({});
  const [userDetails, setUserDetails] = useState({});
  const [latFilter, setLatFilter] = useState(null);
  const [lngFilter, setLngFilter] = useState(null);
  const [address, setAddress] = useState("");

  const publicUrl = `${process.env.REACT_APP_API_URL}`;
  const token = getLoginToken();
  const toggleButton = useRef(null);
  const sort = useRef(null);
  const history = useHistory();
  const redirectPath = `/customer/login?returnUrl=${encodeURIComponent(
    window.location.pathname
  )}`;

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBIjbPr5V0gaRCzgQQ-oN0eW25WvGoALVY",
    libraries: ["places", "drawing"],
  });

  const loadProperties = async (page = 1) => {
    if (mapProperties && mapProperties.length > 0) {
      setProperties(mapProperties);
      setCurrentPage(1);
      setTotalPages(Math.ceil(mapProperties.length / 12));
      return;
    }

    const filtersData = filters ? filters : {};
    let payload = {
      ...filtersData,
      page,
      size: 12,
    };

    try {
      const response = await HomepageService.listProperties("", payload);
      if (response.error && response.message) {
        responseHandler(response.message);
      } else {
        setProperties(response.data);
        setCurrentPage(response.page);
        setTotalPages(response.totalPage);
        await fetchUserDetails(response.data);
      }
    } catch (err) {
      responseHandler("Failed to load properties. Please try again.");
    }
  };

  const fetchUserDetails = async (properties) => {
    const userDetailsTemp = { ...userDetails };
    const promises = properties.map(async (property) => {
      if (!userDetailsTemp[property.userId]) {
        try {
          const response = await UserService.getUserBasicDetail(
            property.userId
          );
          userDetailsTemp[property.userId] = response;
        } catch (err) {
          console.error("Error fetching user details:", err);
        }
      }
    });
    await Promise.all(promises);
    setUserDetails(userDetailsTemp);
  };

  const fetchCarbonFootprint = async (propertyId) => {
    if (!carbonFootprints[propertyId]) {
      setCarbonFootprints((prev) => ({
        ...prev,
        [propertyId]: { loading: true },
      }));
      const response = await HomepageService.carbonFootprint(propertyId);
      if (response?.error) {
        setCarbonFootprints((prev) => ({
          ...prev,
          [propertyId]: { error: "Failed to load carbon footprint" },
        }));
      } else {
        setCarbonFootprints((prev) => ({
          ...prev,
          [propertyId]: { value: response.totalCo2SavedText },
        }));
      }
    }
  };

  const loadWishlistProperties = async () => {
    const response = await WishlistService.list();
    if (response?.length > 0) {
      setWishlistProperties(response);
    }
  };

  const addToWishList = async (propertyId) => {
    if (!token) {
      history.push(redirectPath);
      return;
    }

    const response = await WishlistService.addToWishlist(propertyId);
    if (response?.error && response?.message) {
      responseHandler(response.message);
      return;
    }

    const prop = properties.find(({ id }) => id === propertyId);
    setWishlistId(prop.id);
    setWishlistTitle(prop.title);
    setWishlistImage(prop.featuredImage);
    toggleButton.current.click();
    await loadWishlistProperties();
  };

  const removeWishList = async (propertyId) => {
    if (!token) {
      history.push(redirectPath);
      return;
    }

    const response = await WishlistService.removeFromWishlist(propertyId);
    if (response?.error && response?.message) {
      responseHandler(response.message);
      return;
    }

    responseHandler("Property removed from wishlist.", true);
  };

  useEffect(() => {
    loadProperties(currentPage);
  }, [currentPage, filters]);

  useEffect(() => {
    if (token && isLoaded) {
      const fetchAllWishlistProperties = async () => {
        await loadWishlistProperties();
      };
      fetchAllWishlistProperties();
    }

    if (isLoaded) {
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
    }
  }, [isLoaded, token]);

  return (
    <div>
      <div className="ltn__product-area ltn__product-gutter">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 order-lg-2 mb-100">
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
                        defaultValue="ASC"
                      >
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
                      {properties && properties.length === 0 ? (
                        <div className="col-lg-12">
                          <p>No Data!</p>
                        </div>
                      ) : (
                        properties.map((element, i) => (
                          <div className="col-xl-4 col-sm-4 col-12" key={i}>
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
                                <h2
                                  className="product-title go-top"
                                  style={{ height: "100px" }}
                                >
                                  <Link to={`/property-details/${element.id}`}>
                                    {element.title}
                                  </Link>
                                </h2>
                                <div
                                  className="product-views"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <span
                                    className="view-icon"
                                    style={{ marginRight: "5px" }}
                                  >
                                    <i className="fas fa-eye" />{" "}
                                    {/* Icon for views */}
                                  </span>
                                  <span className="view-count">
                                    {element.productViews
                                      ? element.productViews.length
                                      : 0}{" "}
                                    Views
                                  </span>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      marginLeft: "20px",
                                    }}
                                  >
                                    <FaPaw
                                      style={{
                                        fontSize: "20px",
                                        marginLeft: "25px",
                                        marginRight: "5px",
                                        color: "green",
                                      }}
                                    />
                                    <span style={{ fontSize: "12px" }}>
                                      {carbonFootprints[element.id] ? (
                                        carbonFootprints[element.id].loading ? (
                                          "Loading..."
                                        ) : carbonFootprints[element.id]
                                            .error ? (
                                          <span
                                            onClick={() =>
                                              fetchCarbonFootprint(element.id)
                                            }
                                            style={{
                                              cursor: "pointer",
                                              color: "#007bff",
                                              textDecoration: "underline",
                                            }}
                                          >
                                            Retry
                                          </span>
                                        ) : (
                                          carbonFootprints[element.id].value
                                        )
                                      ) : (
                                        <span
                                          onClick={() =>
                                            fetchCarbonFootprint(element.id)
                                          }
                                          style={{
                                            cursor: "pointer",
                                            color: "#00c800",
                                            textDecoration: "none",
                                          }}
                                        >
                                          View
                                        </span>
                                      )}
                                    </span>
                                  </div>
                                </div>

                                
                                <div
                                  className="product-img-location go-top"
                                  style={{ height: "80px" }}
                                >
                                  <ul>
                                    <li>
                                      <Link to="#">
                                        <i className="flaticon-pin" />{" "}
                                        {element.address}
                                      </Link>
                                    </li>
                                  </ul>
                                </div>
                                <div className="product-creator">
                                  <span>
                                    Created by:{" "}
                                    {userDetails[element.userId]
                                      ? userDetails[element.userId]
                                          .companyName ||
                                        userDetails[element.userId]?.user
                                          ?.firstName +
                                          " " +
                                          userDetails[element.userId]?.user
                                            ?.lastName
                                      : "Loading..."}
                                  </span>
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
                                        onClick={(e) => {
                                          e.preventDefault();
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
                                  <span>{formatPrice(element.price)}</span>
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
                      <div className="col-lg-12"></div>
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
                                    <span>{formatPrice(element.price)}</span>
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
                                <div className="product-creator">
                                  <span>
                                    Created by:{" "}
                                    {userDetails[element.userId] ? (
                                      <span style={{ fontWeight: "600" }}>
                                        {" "}
                                        {/* Adjust the weight as needed */}
                                        {userDetails[element.userId]
                                          .companyName ||
                                          `${
                                            userDetails[element.userId]?.user
                                              ?.firstName
                                          } ${
                                            userDetails[element.userId]?.user
                                              ?.lastName
                                          }`}
                                      </span>
                                    ) : (
                                      "Loading..."
                                    )}
                                  </span>
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
                                        onClick={(e) => {
                                          e.preventDefault();
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
                            setCurrentPage(currentPage - 1);
                          }
                        }}
                      >
                        <i className="fas fa-angle-double-left" />
                      </Link>
                    </li>
                    {Array.from(Array(totalPages), (e, i) => (
                      <li
                        key={i}
                        className={currentPage == i + 1 ? "active" : null}
                      >
                        <Link
                          to="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(i + 1);
                          }}
                        >
                          {i + 1}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link
                        to="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage !== totalPages) {
                            setCurrentPage(currentPage + 1);
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
