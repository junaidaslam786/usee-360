import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import ViewOffer from "./view-offer";
import { VIRTUAL_TOUR_TYPE } from "../../../constants";
import Slideshow from "../../homepage/section/Slideshow";
import PropertyService from "../../../services/agent/property";
import { formatPrice, iconsMap, setPropertyMetaData } from "../../../utils";

export default function Details(props) {
  const [property, setProperty] = useState({});
  const [propertyCategoryType, setPropertyCategoryType] = useState();
  const [propertyType, setPropertyType] = useState();
  const [propertyBedrooms, setPropertyBedrooms] = useState();
  const [propertyArea, setPropertyArea] = useState();
  const [propertyUnit, setPropertyUnit] = useState();
  const [propertyImages, setPropertyImages] = useState([]);
  const [propertyDocuments, setPropertyDocuments] = useState([]);
  const [propertyTags, setPropertyTags] = useState([]);
  const params = useParams();

  

  const loadProperty = async () => {
    const response = await PropertyService.detail(params.id);
    console.log("property-details", response);

    if (response?.error && response?.message) {
      props.responseHandler(response.message);
      return;
    }

    setProperty(response);

    

    // Use slice() to clone the array before reversing to avoid mutating the original array
    const reversedMetaTags = response.productMetaTags.slice().reverse();

    const metaTagsMap = reversedMetaTags.reduce((acc, tag) => {
      const label = tag.categoryField.label;
      acc[label] = tag.value;
      return acc;
    }, {});

    // Now you have a dynamic map of all meta tags which can be used directly in the component
    // Example: metaTagsMap['Parking Facility'] will give you the value of the Parking Facility tag
    setPropertyMetaData(metaTagsMap);
    setPropertyTags(metaTagsMap);

    if (response?.productImages?.length > 0) {
      setPropertyImages(response.productImages);
    }

    if (response?.productDocuments?.length > 0) {
      setPropertyDocuments(response.productDocuments);
    }
  };

  useEffect(() => {
    loadProperty();
  }, [params.id, loadProperty]);

  return (
    <section>
      {propertyImages?.length > 0 ? (
        <Slideshow fadeImages={propertyImages} />
      ) : (
        <img
          className="detail-feature-image"
          src={`${process.env.REACT_APP_API_URL}/${property.featuredImage}`}
          alt="#"
        />
      )}
      <div className="row property-desc">
        <span className="ltn__blog-category pb-20">
          <Link className="bg-orange" to="#">
            For {propertyCategoryType?.label || ""}
          </Link>
        </span>
        <div className="col-md-10">
          <h3>{property.title}</h3>
          <small>
            <i className="icon-placeholder" /> {property.address}
          </small>
        </div>
        <div className="col-md-2">
          <h3>{formatPrice(property.price)}</h3>
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
          <div>
            <p>{property.description}</p>
          </div>
        </div>
        <h4 className="title-2">Features</h4>
        <div className="property-detail-feature-list clearfix mb-45">
          <ul style={{ display: "flex", flexDirection: "column" }}>
            {Object.entries(propertyTags).map(([key, value]) => (
              <li key={key}>
                <div className="property-detail-feature-list-item">
                  <i className={iconsMap[key] || "flaticon-double-bed"} />
                  <div>
                    <h6>{key}</h6>
                    <small>{value}</small>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-5">
          {propertyDocuments &&
            propertyDocuments.map((element, index) => (
              <a
                href={`${process.env.REACT_APP_API_URL}/${element.file}`}
                target="_blank"
                className="btn theme-btn-1 mb-3"
                key={index}
              >
                View {element.title}
              </a>
            ))}
          {property?.virtualTourType &&
            property?.virtualTourType === VIRTUAL_TOUR_TYPE.URL && (
              <a
                href={property.virtualTourUrl}
                target="_blank"
                className="btn theme-btn-3 mb-3"
              >
                View Tour
              </a>
            )}
        </div>
      </div>
      {property?.virtualTourType &&
        property?.virtualTourType === VIRTUAL_TOUR_TYPE.VIDEO && (
          <div className="property-detail-feature-list clearfix mb-45">
            <video width="100%" height="100%" controls>
              <source
                src={`${process.env.REACT_APP_API_URL}/${property.virtualTourUrl}`}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      <div className="row property-details">
        <ViewOffer
          property={property}
          responseHandler={props.responseHandler}
        />
      </div>
    </section>
  );
}
