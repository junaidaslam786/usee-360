import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import {
  PROPERTY_TYPES,
  PROPERTY_CATEGORY_TYPES,
  BEDROOMS,
  UNITS,
  VIRTUAL_TOUR_TYPE,
  DEFAULT_CURRENCY,
} from "../../constants";
import Slideshow from "../Slideshow";

export default function PropertyDetails() {
  const [property, setProperty] = useState({});
  const [propertyCategoryType, setPropertyCategoryType] = useState();
  const [propertyType, setPropertyType] = useState();
  const [propertyBedrooms, setPropertyBedrooms] = useState();
  const [propertyArea, setPropertyArea] = useState();
  const [propertyUnit, setPropertyUnit] = useState();
  const [agentImage, setAgentImage] = useState();
  const [agentName, setAgentName] = useState();
  const [propertyImages, setPropertyImages] = useState([]);
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [email, setEmail] = useState();
  const [successMessage, setSuccessMessage] = useState();

  const params = useParams();

  async function loadProperty() {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/home/property/${params.id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setProperty(response.data);
        response.data.productMetaTags.forEach((metaTag) => {
          switch (metaTag.categoryField.id) {
            case 1:
              setPropertyType(
                PROPERTY_TYPES.find(
                  (property) => property.value == metaTag.value
                )
              );
              break;
            case 2:
              setPropertyCategoryType(
                PROPERTY_CATEGORY_TYPES.find(
                  (category) => category.value == metaTag.value
                )
              );
              break;
            case 3:
              setPropertyUnit(
                UNITS.find((unit) => unit.value == metaTag.value)
              );
              break;
            case 4:
              setPropertyArea(metaTag.value);
              break;
            case 5:
              setPropertyBedrooms(
                BEDROOMS.find((bedroom) => bedroom.value == metaTag.value)
              );
              break;
          }
        });
        setAgentImage(response?.data?.user?.profileImage);
        setAgentName(
          `${response?.data?.user?.firstName} ${response?.data?.user?.lastName}`
        );
        if (response?.data?.productImages?.length > 0) {
          setPropertyImages([{ id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', image: response.data.featuredImage }, ...response.data.productImages]);
        }
      });
  }

  async function makeOfferHandler(e) {
    e.preventDefault();

    const payload = {
      firstName,
      lastName,
      email,
      productId: params.id,
    };

    await axios
      .post(
        `${process.env.REACT_APP_API_URL}/iframe/register-customer`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        setSuccessMessage(true);
      });
  }

  useEffect(() => {
    loadProperty();
  }, []);

  return (
    <div className="ltn__shop-details-area pb-10 mt-50 mb-50">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 col-md-12">
            <div className="ltn__shop-details-inner ltn__page-details-inner mb-60">
              <h5 className="mb-30">
                <Link to="/iframe/property-grid">
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
                    {moment(property.createdAt).format("MMMM Do, YYYY")}
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
                {DEFAULT_CURRENCY} {property.price}
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
                  data-bs-target="#ltn_make_offer_modal"
                >
                  Make Offer
                </a>
              </div>
            </aside>
          </div>
        </div>
      </div>
      <div className="ltn__modal-area ltn__add-to-cart-modal-area">
        <div className="modal fade" id="ltn_make_offer_modal" tabIndex={-1}>
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
                          <h4>Make Offer</h4>
                          <form
                            onSubmit={makeOfferHandler}
                            className="ltn__form-box"
                          >
                            {successMessage ? (
                              <div className="alert alert-success" role="alert">
                                Offer Sent Successfully!
                              </div>
                            ) : null}
                            <div className="row">
                              <div className="col-md-6">
                                <input
                                  type="text"
                                  placeholder="First Name"
                                  onChange={(e) => setFirstName(e.target.value)}
                                  required
                                />
                              </div>
                              <div className="col-md-6">
                                <input
                                  type="text"
                                  placeholder="Last Name"
                                  onChange={(e) => setLastName(e.target.value)}
                                  required
                                />
                              </div>
                            </div>
                            <input
                              type="email"
                              placeholder="Email Address"
                              onChange={(e) => setEmail(e.target.value)}
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
    </div>
  );
}
