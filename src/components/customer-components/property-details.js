import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "./layouts/layout";
import axios from "axios";
import ViewOffer from "./properties/view-offer";
import { PROPERTY_TYPES, PROPERTY_CATEGORY_TYPES, BEDROOMS, UNITS, VIRTUAL_TOUR_TYPE, DEFAULT_CURRENCY } from "../../constants";
import Slideshow from "../Slideshow";

export default function PropertyDetails() {
  const [property, setProperty] = useState({});
  const [propertyCategoryType, setPropertyCategoryType] = useState();
  const [propertyType, setPropertyType] = useState();
  const [propertyBedrooms, setPropertyBedrooms] = useState();
  const [propertyArea, setPropertyArea] = useState();
  const [propertyUnit, setPropertyUnit] = useState();
  const [propertyImages, setPropertyImages] = useState([]);
  const [propertyDocuments, setPropertyDocuments] = useState([]);

  const params = useParams();

  const token = JSON.parse(localStorage.getItem("customerToken"));
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

        if(response?.data?.productImages?.length > 0) {
          setPropertyImages(response.data.productImages);
        }

        if (response?.data?.productDocuments?.length > 0) {
          setPropertyDocuments(response.data.productDocuments);
        }
      });
  }

  useEffect(() => {
    loadProperty();
  }, []);

  return (
    <Layout>
      <section>
        {
          propertyImages?.length > 0 ? (
            <Slideshow fadeImages={propertyImages}/>
          ) : (
            <img
              className="mb-50"
              src={`${process.env.REACT_APP_API_URL}/${property.featuredImage}`}
              alt="#"
            />
          )
        }
        <div className="row property-desc">
          <span className="ltn__blog-category pb-20">
            <Link className="bg-orange" to="#">
              For { propertyCategoryType?.label || "" }
            </Link>
          </span>
          <div className="col-md-10">
            <h3>{property.title}</h3>
            <small>
              <i className="icon-placeholder" /> {property.address}
            </small>
          </div>
          <div className="col-md-2">
            <h3>{DEFAULT_CURRENCY} {property.price}</h3>
          </div>
        </div>
        <div className="row property-details">
          <div className="col-md-7">
            <div className="row mb-5">
              <div className="col-md-3">
                <h5>Type</h5>
                <p>{propertyType?.label || ""}</p>
              </div>
              <div className="col-md-3">
                <h5>Bedrooms</h5>
                <p>{propertyBedrooms?.label || ""}</p>
              </div>
              <div className="col-md-3">
                <h5>Area</h5>
                <p>{propertyArea || ""}</p>
              </div>
              <div className="col-md-3">
                <h5>Unit</h5>
                <p>{propertyUnit?.label || ""}</p>
              </div>
            </div>
            <h5>Description:</h5>
            <div><p>{property.description}</p></div>
          </div>
          <div className="col-md-5">
            {
              propertyDocuments && (
                propertyDocuments.map((element, index) => (
                  <a href={`${process.env.REACT_APP_API_URL}/${element.file}`} target="_blank" className="btn theme-btn-1 mb-3">View {element.title}</a>
                )
              ))
            }
            {
              (property?.virtualTourType && property?.virtualTourType === VIRTUAL_TOUR_TYPE.URL) && (
                <a href={property.virtualTourUrl} target="_blank" className="btn theme-btn-3 mb-3">View Tour</a>
              )
            }
          </div>
          {
            (property?.virtualTourType && property?.virtualTourType === VIRTUAL_TOUR_TYPE.VIDEO) && (
              <div className="property-detail-feature-list clearfix mb-45">
                <video width="100%" height="100%" controls>
                  <source src={`${process.env.REACT_APP_API_URL}/${property.virtualTourUrl}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )
          }
          <div className="row property-details">
            <ViewOffer property={property} />
          </div>
        </div>
      </section>
    </Layout>
  );
}
