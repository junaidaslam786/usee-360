import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import {
  formatPrice,
  getLoginToken,
  loadPropertyMetaData,
} from "../../../utils";
import HomepageService from "../../../services/homepage";
import WishlistService from "../../../services/customer/wishlist";

import { FaPaw } from "react-icons/fa";
import { useJsApiLoader } from "@react-google-maps/api";

import SearchForm from '../section/search-form'

export default function PropertyGrid(props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [latFilter, setLatFilter] = useState(null);
  const [lngFilter, setLngFilter] = useState(null);
  const [address, setAddress] = useState("");
  const [properties, setProperties] = useState([]);
  const [wishlistProperties, setWishlistProperties] = useState([]);
  const [wishlistId, setWishlistId] = useState();
  const [wishlistTitle, setWishlistTitle] = useState();
  const [wishlistImage, setWishlistImage] = useState();
  const [carbonFootprint, setCarbonFootprint] = useState("Value Here");

  const publicUrl = `${process.env.REACT_APP_API_URL}`;
  const token = getLoginToken();
  const toggleButton = useRef(null);
  const sort = useRef(null);
  const history = useHistory();
  const location = useLocation();
  const redirectPath = `/customer/login?returnUrl=${encodeURIComponent(
    window.location.pathname
  )}`;

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBIjbPr5V0gaRCzgQQ-oN0eW25WvGoALVY",
    libraries: ["places", "drawing"],
  });

  

  // const loadProperties = async (page = 1) => {
  //   const { state } = location; // Assuming you have access to 'location'

  //   // Extract filters and properties from location state with default values
  //   const filtersFromLocation = state?.filters ?? {};
  //   const propertiesFromState = state?.properties ?? [];
  //   const source = state?.source; // Source of the navigation ('search-form' or 'google-maps')

  //   console.log("filtersFromLocation", filtersFromLocation);
  //   console.log("propertiesFromState", propertiesFromState);
  //   console.log("source", source);

  //   // If the source is google-maps, and properties are provided, use them directly
  //   if (source === "google-maps" && propertiesFromState.length > 0) {
  //     setProperties(propertiesFromState);
  //     setCurrentPage(1); // Assuming the first page
  //     setTotalPages(Math.ceil(propertiesFromState.length / 10)); // Assuming 10 properties per page
  //     return; // Skip fetching new data if we already have properties
  //   }

  //   // If the source is search-form, or no source but filters are provided, fetch properties based on filters
  //   if (
  //     source === "search-form" ||
  //     (!source && Object.keys(filtersFromLocation).length > 0)
  //   ) {
  //     // Construct the payload with filters and include dynamic lat/lng if present
  //     let payload = {
  //       ...filtersFromLocation,
  //       ...(latFilter !== null && { lat: latFilter }),
  //       ...(lngFilter !== null && { lng: lngFilter }),
  //       page,
  //       size: 10, // Assuming a default size of 10, adjust as needed
  //     };

  //     // Apply sorting if specified
  //     if (sort.current && sort.current.value !== "null") {
  //       payload.sort = [
  //         sort.current.value.split("_")[0],
  //         sort.current.value.split("_")[1],
  //       ]; // Example: "price_ASC"
  //     }

  //     try {
  //       const response = await HomepageService.listProperties("", payload);
  //       if (response.error && response.message) {
  //         props.responseHandler(response.message);
  //       } else {
  //         setProperties(response.data);
  //         setCurrentPage(response.page);
  //         setTotalPages(response.totalPage);
  //       }
  //     } catch (error) {
  //       console.error("Error loading properties:", error);
  //       props.responseHandler("Failed to load properties. Please try again.");
  //     }
  //   }
  //   // Optionally, handle cases where neither properties nor filters are provided, or handle other sources
  // };

  const loadProperties = async (page = 1) => {
    const filtersData = props.filters ? props.filters : {};
    console.log('filters data from props',filtersData)
    let payload = {
      ...filtersData,
      page,
      size: 10,
    };

    try {
      const response = await HomepageService.listProperties("", payload);
      if (response.error && response.message) {
        props.responseHandler(response.message);
      } else {
        setProperties(response.data);
        setCurrentPage(response.page);
        setTotalPages(response.totalPage);
      }
    } catch (err) {
      console.error("Error loading properties:", err);
      props.responseHandler("Failed to load properties. Please try again.");
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

    const reponse = await WishlistService.addToWishlist(propertyId);
    if (reponse?.error && reponse?.message) {
      props.responseHandler(reponse.message);
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

    const reponse = await WishlistService.removeFromWishlist(propertyId);
    if (reponse?.error && reponse?.message) {
      props.responseHandler(reponse.message);
      return;
    }

    props.responseHandler("Property removed from wishlist.", true);
  };

  // Handler for the "Find Now" button click
  const handleFindNowClick = () => {
    // Check if any filters have been applied
    const hasFilters = latFilter || lngFilter;

    if (hasFilters) {
      // If any filters have been set, load properties with filters
      loadProperties("filter");
    } else {
      // If no filters have been set, load properties without filters
      loadProperties();
    }
  };

  useEffect(() => {
    loadProperties(currentPage);
  }, [location.state, currentPage, latFilter, lngFilter, sort.current?.value]);

  useEffect(() => {
    // Removed the initial loadProperties call for brevity; adjust as needed.

    // This part remains unchanged; it's your logic for fetching wishlist properties.
    if (token && isLoaded) {
      const fetchAllWishlistProperties = async () => {
        await loadWishlistProperties();
      };

      fetchAllWishlistProperties();
    }

    // Ensure Google Maps Places API is loaded before initializing Autocomplete
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
  }, [isLoaded, token]); // Depend on isLoaded to re-run this effect when the API is ready

  return (
    <div>
      <div className="ltn__product-area ltn__product-gutter">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 order-lg-2 mb-100">
              {/* <SearchForm /> */}
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
                                <div
                                  className="product-views"
                                  style={{ display: "flex" }}
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
                                  {/* Carbon Footprint Section */}
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      marginLeft: "100px",
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
                                      {carbonFootprint}
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
