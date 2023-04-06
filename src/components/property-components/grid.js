import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import axios from "axios";
import Sidebar from "./sidebar";
import { DEFAULT_CURRENCY, PROPERTY_CATEGORY_TYPES, BEDROOMS, UNITS } from "../../constants";

export default function PropertyGrid() {
  // const location = useLocation();
  // const {
  //   propertyCategory,
  //   propertyCategoryType,
  //   propertyType,
  //   rooms,
  //   lat,
  //   lng,
  //   minPrice,
  //   maxPrice,
  // } = location.state;

  const publicUrl = `${process.env.REACT_APP_API_URL}`;
  const token = JSON.parse(localStorage.getItem("customerToken"));

  const [properties, setProperties] = useState([]);
  const [wishlistProperties, setWishlistProperties] = useState([]);
  const [wishlistId, setWishlistId] = useState();
  const [wishlistTitle, setWishlistTitle] = useState();
  const [wishlistImage, setWishlistImage] = useState();

  const toggleButton = useRef(null);
  const history = useHistory();

  async function loadProperties() {
    await axios
      .post(`${process.env.REACT_APP_API_URL}/home/property/list`, {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ page: 1, size: 10 }),
      })
      .then((response) => {
        setProperties(response.data.data);
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
      history.push("/customer/login");
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

  function loadPropertyMetaData(property, type) {
    let metaData = "";
    let metaTag;
    if (property?.productMetaTags?.length > 0) {
      switch(type) {
        case "categoryType":
          metaTag = property.productMetaTags.find((meta) => meta.categoryField.id === 2);
          if (metaTag) {
            metaData = PROPERTY_CATEGORY_TYPES.find(
              (property) => property.value == metaTag.value
            );
            metaData = metaData?.label ? metaData.label : "Rent";
          } else {
            metaData = "Rent";
          }
          
          break;
       
        case "unit":
          metaTag = property.productMetaTags.find((meta) => meta.categoryField.id === 3);
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
          metaTag = property.productMetaTags.find((meta) => meta.categoryField.id === 4);
          metaData = metaTag ? metaTag.value : 0;
          break;

        case "bedroom":
          metaTag = property.productMetaTags.find((meta) => meta.categoryField.id === 5);
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
                      <select className="nice-select">
                        <option>Default Sorting</option>
                        <option>Sort by price: low to high</option>
                        <option>Sort by price: high to low</option>
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
                                    <li className="sale-badg">For {loadPropertyMetaData(element, "categoryType")}</li>
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
                                {
                                  (element?.productMetaTags?.length > 0) && (
                                    <ul className="ltn__list-item-2--- ltn__list-item-2-before--- ltn__plot-brief">
                                      <li>
                                        <span>{loadPropertyMetaData(element, "bedroom")} </span>
                                        Bed
                                      </li>
                                      <li>
                                        <span>{loadPropertyMetaData(element, "area")} </span>
                                        {loadPropertyMetaData(element, "unit")}
                                      </li>
                                    </ul>
                                  )
                                }
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
                                        onClick={() =>
                                          addToWishList(element.id)
                                        }
                                      >
                                        <i className="flaticon-heart-1" />
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                              <div className="product-info-bottom">
                                <div className="product-price">
                                  <span>{DEFAULT_CURRENCY} {element.price}</span>
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
                                      <li className="sale-badg">For {loadPropertyMetaData(element, "categoryType")}</li>
                                    </ul>
                                  </div>
                                  <div className="product-price">
                                    <span>{DEFAULT_CURRENCY} {element.price}</span>
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
                                  <span>{loadPropertyMetaData(element, "bedroom")} </span>
                                    Bed
                                  </li>
                                  <li>
                                    <span>{loadPropertyMetaData(element, "area")} </span>
                                    {loadPropertyMetaData(element, "unit")}
                                  </li>
                                </ul>
                              </div>
                              <div className="product-info-bottom">
                                <div className="product-hover-action">
                                  <ul>
                                    <li>
                                      <a
                                        href="#"
                                        title="Quick View"
                                        onClick={() =>
                                          addToWishList(element.id)
                                        }
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
            <Sidebar />
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
