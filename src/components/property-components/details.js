import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { PROPERTY_TYPES, PROPERTY_CATEGORY_TYPES, BEDROOMS, UNITS, VIRTUAL_TOUR_TYPE, DEFAULT_CURRENCY } from "../../constants";
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
  const [propertyDocuments, setPropertyDocuments] = useState([]);

  const token = JSON.parse(localStorage.getItem("customerToken"));
  const history = useHistory();

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
              setPropertyType(PROPERTY_TYPES.find(
                (property) => property.value == metaTag.value
              ));
              break;
            case 2:
              setPropertyCategoryType(PROPERTY_CATEGORY_TYPES.find(
                (category) => category.value == metaTag.value
              ));
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
                BEDROOMS.find(
                  (bedroom) => bedroom.value == metaTag.value
                )
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
        if (response?.data?.productDocuments?.length > 0) {
          setPropertyDocuments(response.data.productDocuments);
        }
      });
  }

  async function makeOfferHandler() {
    if (!token) {
      history.push(
        "/customer/login?returnUrl=" +
          encodeURIComponent(`/customer/property-details/${params.id}`)
      );
    } else {
      history.push(`/customer/property-details/${params.id}`);
    }
  }

  async function makeAppointmentHandler() {
    if (!token) {
      history.push(
        "/customer/login?returnUrl=" +
          encodeURIComponent('/customer/add-appointment')
      );
    } else {
      history.push('/customer/add-appointment');
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    loadProperty();
  }, []);

  return (
    <div className="ltn__shop-details-area pb-10 mt-100">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 col-md-12">
            <div className="ltn__shop-details-inner ltn__page-details-inner mb-60">
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
              <h2 className="mb-50">{DEFAULT_CURRENCY} {property.price}</h2>
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
                <a onClick={makeAppointmentHandler} className="btn theme-btn-1 mb-3 w-100">Usee-360 Booking</a>
                <a onClick={makeOfferHandler} className="btn theme-btn-3 mb-3 w-100">Make Offer</a>
                {
                  (property?.virtualTourType && property?.virtualTourType === VIRTUAL_TOUR_TYPE.URL) && (
                    <a href={property.virtualTourUrl} target="_blank" className="btn theme-btn-3 mb-3 w-100">View Tour</a>
                  )
                }
                {
                  propertyDocuments && (
                    propertyDocuments.map((element, index) => (
                      <a href={`${process.env.REACT_APP_API_URL}/${element.file}`} target="_blank" className="btn theme-btn-3 mb-3 w-100">View {element.title}</a>
                    )
                  ))
                }
                
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
