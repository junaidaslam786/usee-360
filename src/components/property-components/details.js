import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";

export default function PropertyDetails() {
  const publicUrl = `${process.env.PUBLIC_URL}/`;

  const [property, setProperty] = useState({});
  const [propertyCategoryType, setPropertyCategoryType] = useState();
  const [propertyType, setPropertyType] = useState();
  const [propertyBedrooms, setPropertyBedrooms] = useState();
  const [propertyArea, setPropertyArea] = useState();

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
        setPropertyCategoryType(response.data.productMetaTags[1].value);
        setPropertyType(response.data.productMetaTags[0].value);
        setPropertyBedrooms(response.data.productMetaTags[4].value);
        setPropertyArea(response.data.productMetaTags[2].value);
      });
  }

  useEffect(() => {
    loadProperty();
  }, []);

  return (
    <div className="ltn__shop-details-area pb-10 mt-100">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 col-md-12">
            <div className="ltn__shop-details-inner ltn__page-details-inner mb-60">
              <div className="ltn__blog-meta">
                <ul>
                  <img
                    className="mb-50"
                    src={`${process.env.REACT_APP_API_URL}/${property.featuredImage}`}
                    alt="#"
                  />
                  <li className="ltn__blog-category">
                    <Link className="bg-orange" to="#">
                      For {propertyCategoryType}
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
              <h2 className="mb-50">${property.price}</h2>
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
                        <small>{propertyType}</small>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="property-detail-feature-list-item">
                      <i className="flaticon-double-bed" />
                      <div>
                        <h6>Bedrooms</h6>
                        <small>{propertyBedrooms}</small>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="property-detail-feature-list-item">
                      <i className="flaticon-double-bed" />
                      <div>
                        <h6>Area</h6>
                        <small>{propertyArea}</small>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <span className="property-details">
                <span className="row">
                  <span className="col-md-5">
                    <button className="btn theme-btn-1 mb-3">
                      View Floor Plan
                    </button>
                    <button className="btn theme-btn-3 mb-3">
                      View Brochure
                    </button>
                    <button className="btn theme-btn-1 mb-3">View Map</button>
                    <button className="btn theme-btn-3 mb-3">View Tour</button>
                    <button className="btn theme-btn-1 mb-3">
                      Remove From Wishlist
                    </button>
                    <button className="btn theme-btn-3 mb-3">
                      Mortgage Calculator
                    </button>
                    <button className="btn theme-btn-1 mb-3">
                      Make An Offer
                    </button>
                  </span>
                </span>
              </span>
              {/* <div className="ltn__shop-details-tab-content-inner--- ltn__shop-details-tab-inner-2 ltn__product-details-review-inner mb-60">
                <div className="ltn__comment-reply-area ltn__form-box mb-30">
                  <form action="#">
                    <h4>Make an Offer</h4>
                    <div className="input-item input-item-name ltn__custom-icon">
                      <input type="text" placeholder="Enter name...." />
                    </div>
                    <div className="input-item input-item-email ltn__custom-icon">
                      <input type="email" placeholder="Enter email...." />
                    </div>
                    <div className="input-item input-item-website ltn__custom-icon">
                      <input type="text" placeholder="Enter Offer..." />
                    </div>
                    <div className="input-item input-item-textarea ltn__custom-icon">
                      <textarea
                        placeholder="Enter message...."
                        defaultValue=""
                      />
                    </div>
                    <label className="mb-0">
                      <input type="checkbox" name="agree" /> Save my name,
                      email, and website in this browser for the next time I
                      comment.
                    </label>
                    <div className="btn-wrapper">
                      <button
                        className="btn theme-btn-1 btn-effect-1 text-uppercase"
                        type="submit"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div> */}
            </div>
          </div>
          <div className="col-lg-4">
            <aside className="sidebar ltn__shop-sidebar ltn__right-sidebar---">
              {/* Author Widget */}
              <div className="widget ltn__author-widget">
                <div className="ltn__author-widget-inner text-center">
                  <img
                    src={`${publicUrl}assets/img/blog/author.jpg`}
                    alt="Image"
                  />
                  <h5>Rosalina D. Willaimson</h5>
                  <small>Real Estate Agent</small>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
