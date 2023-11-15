import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  VIRTUAL_TOUR_TYPE,
} from "../../../constants";
import Slideshow from "../../homepage/section/Slideshow";
import Modal from "./dateTimeModal";
import { formatCreatedAtTimestamp, formatPrice, setPropertyMetaData } from "../../../utils";
import HomepageService from "../../../services/homepage";
import IframeService from "../../../services/iframe";

export default function IframePropertyDetails() {
  const [property, setProperty] = useState({});
  const [propertyCategoryType, setPropertyCategoryType] = useState();
  const [propertyType, setPropertyType] = useState();
  const [propertyBedrooms, setPropertyBedrooms] = useState();
  const [propertyArea, setPropertyArea] = useState();
  const [propertyUnit, setPropertyUnit] = useState();
  const [agentImage, setAgentImage] = useState();
  const [agentName, setAgentName] = useState();
  const [propertyImages, setPropertyImages] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState();
  const [errors, setErrors] = useState();

  const params = useParams();

  const loadProperty = async () => {
    const response = await HomepageService.propertyDetail(params.propertyId);
    if (response?.error && response?.message) {
      setErrorHandler(response.message);
      return;
    }

    setProperty(response);
    
    if (response?.productMetaTags) {
      const { typeMetaTag, categoryTypeMetaTag, unitMetaTag, areaMetaTag, bedroomsMetaTag } = setPropertyMetaData(response.productMetaTags);
      setPropertyType(typeMetaTag);
      setPropertyCategoryType(categoryTypeMetaTag);
      setPropertyUnit(unitMetaTag);
      setPropertyArea(areaMetaTag);
      setPropertyBedrooms(bedroomsMetaTag);
    }

    setAgentImage(response?.user?.profileImage);
    setAgentName(`${response?.user?.firstName} ${response?.user?.lastName}`);

    if (response?.productImages?.length > 0) {
      setPropertyImages([{ id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', image: response.featuredImage }, ...response.productImages]);
    }
  }

  const wishlistHandler = async (e) => {
    e.preventDefault();

    const response = await IframeService.addToWishlist({
      firstName,
      lastName,
      email,
      productId: params.propertyId,
    });
    
    if (response?.error && response?.message) {
      setErrorHandler(response.message);
      return;
    }

    if (response?.message) {
      setSuccessHandler(response.message);
      setFirstName("");
      setLastName("");
      setEmail("");
    }
  }

  const setErrorHandler = (errorMessages) => {
    setErrors(errorMessages);
    setTimeout(() => {
      setErrors([]);
    }, 3000);
    setSuccess("");
  };

  const setSuccessHandler = (msg) => {
    setSuccess(msg);
    setTimeout(() => {
      setSuccess("");
    }, 3000);

    setErrors([]);
  };


  useEffect(() => {
    window.scrollTo(0, 0);
    loadProperty();
  }, [loadProperty]);

  return (
    <div className="ltn__shop-details-area pb-10 mt-50 mb-50">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 col-md-12">
            <div className="ltn__shop-details-inner ltn__page-details-inner mb-60">
              <h5 className="mb-30">
                <Link to={`/iframe/property-grid/${params.agentId}`}>
                  <i className="fa-solid fa-arrow-left"></i> Back
                </Link>
              </h5>
              <div className="ltn__blog-meta">
                {propertyImages?.length > 0 ? (
                  <Slideshow fadeImages={propertyImages} />
                ) : (
                  <img
                    className="mb-50 detail-feature-image"
                    src={`${process.env.REACT_APP_API_URL}/${property.featuredImage}`}
                    alt="#"
                  />
                )}
                <ul>
                  <li className="ltn__blog-category">
                    <Link className="bg-orange" to="#">
                      For {propertyCategoryType?.label || ""}
                    </Link>
                  </li>
                  <li className="ltn__blog-date">
                    <i className="far fa-calendar-alt" />
                    { property?.createdAt ? formatCreatedAtTimestamp(property.createdAt, "MMMM Do, YYYY") : "-"}
                  </li>
                </ul>
              </div>
              <h1>{property.title}</h1>
              <label>
                <span className="ltn__secondary-color">
                  <i className="flaticon-pin" />
                </span>{" "}
                {property.address}
              </label>
              <h2 className="mb-50">
                { formatPrice(property.price) }
              </h2>
              <h4 className="title-2">Description</h4>
              <p>{property.description}</p>
              <h4 className="title-2">Features</h4>
              <div className="property-detail-feature-list clearfix mb-45">
                <ul>
                  <li>
                    <div className="property-detail-feature-list-item">
                      <i className="flaticon-double-bed" />
                      <div>
                        <h6>Type</h6>
                        <small>{propertyType?.label || ""}</small>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="property-detail-feature-list-item">
                      <i className="flaticon-double-bed" />
                      <div>
                        <h6>Bedrooms</h6>
                        <small>{propertyBedrooms?.label || ""}</small>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="property-detail-feature-list-item">
                      <i className="flaticon-double-bed" />
                      <div>
                        <h6>Area</h6>
                        <small>{propertyArea || ""}</small>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="property-detail-feature-list-item">
                      <i className="flaticon-double-bed" />
                      <div>
                        <h6>Unit</h6>
                        <small>{propertyUnit?.label || ""}</small>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              {property?.virtualTourType &&
                property?.virtualTourType === VIRTUAL_TOUR_TYPE.VIDEO && (
                  <div>
                    <h4 className="title-2">Features</h4>
                    <div className="property-detail-feature-list clearfix mb-45">
                      <video width="100%" height="100%" controls>
                        <source
                          src={`${process.env.REACT_APP_API_URL}/${property.virtualTourUrl}`}
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                )}
            </div>
          </div>
          <div className="col-lg-4">
            <aside className="sidebar ltn__shop-sidebar ltn__right-sidebar---">
              <div className="widget ltn__author-widget">
                <div className="ltn__author-widget-inner text-center">
                  <img
                    src={`${process.env.REACT_APP_API_URL}/${agentImage}`}
                    alt="Image"
                  />
                  <h5>{agentName}</h5>
                </div>
              </div>
              <div>
                <a
                  className="btn theme-btn-3 mb-3 w-100"
                  data-bs-toggle="modal"
                  data-bs-target="#ltn_add_to_wishlist_modal"
                >
                  Add To Wishlist
                </a>
                <a
                  className="btn theme-btn-3 mb-3 w-100"
                  data-bs-toggle="modal"
                  data-bs-target="#ltn_book_an_appointment_modal"
                >
                  Book an Appointment
                </a>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <div className="ltn__modal-area ltn__add-to-cart-modal-area">
        <div
          className="modal fade"
          id="ltn_add_to_wishlist_modal"
          tabIndex={-1}
        >
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
                        <div className="modal-product-info text-center p-0">
                          <h4>Add To Wishlist</h4>
                          <form
                            onSubmit={wishlistHandler}
                            className="ltn__form-box"
                          >
                            {
                              errors ?
                                errors.map((err, i) => {
                                  return <div className="alert alert-danger" role="alert" key={i}> { err?.msg ? err.msg : err } </div>;
                                }
                              ) : ""
                            }
                            { 
                              success ? ( <div className="alert alert-primary" role="alert"> { success } </div> ) : "" 
                            }
                            <div className="row">
                              <div className="col-md-6">
                                <input
                                  type="text"
                                  placeholder="First Name"
                                  onChange={(e) => setFirstName(e.target.value)}
                                  value={firstName}
                                  required
                                />
                              </div>
                              <div className="col-md-6">
                                <input
                                  type="text"
                                  placeholder="Last Name"
                                  onChange={(e) => setLastName(e.target.value)}
                                  value={lastName}
                                  required
                                />
                              </div>
                            </div>
                            <input
                              type="email"
                              placeholder="Email Address"
                              onChange={(e) => setEmail(e.target.value)}
                              value={email}
                              required
                            />
                            <button
                              className="theme-btn-1 btn btn-full-width-2"
                              type="submit"
                            >
                              Submit
                            </button>
                          </form>
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

      <Modal
        id="ltn_book_an_appointment_modal"
        agentId={params.agentId}
        propertyId={params.propertyId}
      />
    </div>
  );
}
