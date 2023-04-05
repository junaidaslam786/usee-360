import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "./layouts/layout";
import axios from "axios";
import ViewOffer from "./properties/view-offer";

export default function PropertyDetails() {
  const [property, setProperty] = useState({});
  const [propertyCategoryType, setPropertyCategoryType] = useState();
  const [propertyType, setPropertyType] = useState();
  const [propertyBedrooms, setPropertyBedrooms] = useState();
  const [propertyArea, setPropertyArea] = useState();

  const params = useParams();

  const token = JSON.parse(localStorage.getItem("agentToken"));
  async function loadProperty() {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/property/${params.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
    <Layout>
      <section>
        <img
          src={`${process.env.REACT_APP_API_URL}/${property.featuredImage}`}
          alt="#"
        />
        <div className="row property-desc">
          <span className="ltn__blog-category pb-20">
            <Link className="bg-orange" to="#">
              For {propertyCategoryType}
            </Link>
          </span>
          <div className="col-md-10">
            <h3>{property.title}</h3>
            <small>
              <i className="icon-placeholder" /> {property.address}
            </small>
          </div>
          <div className="col-md-2">
            <h3>${property.price}</h3>
          </div>
        </div>
        <div className="row property-details">
          <div className="col-md-7">
            <div className="row mb-5">
              <div className="col-md-4">
                <h5>Type</h5>
                <p>{propertyType}</p>
              </div>
              <div className="col-md-4">
                <h5>Bedrooms</h5>
                <p>{propertyBedrooms}</p>
              </div>
              <div className="col-md-4">
                <h5>Area</h5>
                <p>{propertyArea}</p>
              </div>
            </div>
            <h5>Description:</h5>
            <p>{property.description}</p>
          </div>
          <div className="col-md-5">
            {/* <button className="btn theme-btn-1 mb-3">View Floor Plan</button> */}
            {/* <button className="btn theme-btn-3 mb-3">View Brochure</button> */}
            {/* <button className="btn theme-btn-1 mb-3">View Map</button> */}
            {/* <button className="btn theme-btn-3 mb-3">View Tour</button> */}
          </div>
        </div>
        <div className="row property-details">
          <ViewOffer property={property} />
        </div>
      </section>
    </Layout>
  );
}
