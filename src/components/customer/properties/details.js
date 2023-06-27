import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import ViewOffer from "./view-offer";
import { 
  VIRTUAL_TOUR_TYPE,
  PRODUCT_LOG_TYPE 
} from "../../../constants";
import Slideshow from "../../homepage/section/Slideshow";
import WishlistService from "../../../services/customer/wishlist";
import PropertyService from "../../../services/agent/property";
import { formatPrice, setPropertyMetaData } from "../../../utils";

export default function Details(props) {
  const [property, setProperty] = useState({});
  const [propertyCategoryType, setPropertyCategoryType] = useState();
  const [propertyType, setPropertyType] = useState();
  const [propertyBedrooms, setPropertyBedrooms] = useState();
  const [propertyArea, setPropertyArea] = useState();
  const [propertyUnit, setPropertyUnit] = useState();
  const [propertyImages, setPropertyImages] = useState([]);
  const [propertyDocuments, setPropertyDocuments] = useState([]);
  const [wishlistProperties, setWishlistProperties] = useState([]);
  const params = useParams();

  const loadProperty = async () => {
    const response = await PropertyService.detail(params.id);
    if (response?.error && response?.message) {
      props.responseHandler(response.message);
      return;
    }

    setProperty(response);

    if (response?.productMetaTags) {
      const { typeMetaTag, categoryTypeMetaTag, unitMetaTag, areaMetaTag, bedroomsMetaTag } = setPropertyMetaData(response?.productMetaTags);
      setPropertyType(typeMetaTag);
      setPropertyCategoryType(categoryTypeMetaTag);
      setPropertyUnit(unitMetaTag);
      setPropertyArea(areaMetaTag);
      setPropertyBedrooms(bedroomsMetaTag);
    }

    if (response?.productImages?.length > 0) {
      setPropertyImages(response.productImages);
    }

    if (response?.productDocuments?.length > 0) {
      setPropertyDocuments(response.productDocuments);
    }
  }

  const loadWishlistProperties = async () => {
    const response = await WishlistService.list();

    if (response?.length > 0) {
      setWishlistProperties(response);
    }
  }

  const addToWishList = async (propertyId) => {
    const reponse = await WishlistService.addToWishlist(propertyId);
    if (reponse?.error && reponse?.message) {
      props.responseHandler(reponse.message);
      return;
    }

    props.responseHandler("Property added to wishlist.", true);
    await loadWishlistProperties();
  }

  const removeWishList = async (propertyId) => {
    const reponse = await WishlistService.removeFromWishlist(propertyId);
    if (reponse?.error && reponse?.message) {
      props.responseHandler(reponse.message);
      return;
    }
  
    props.responseHandler("Property removed from wishlist.", true);
    await loadWishlistProperties();
  }

  const isAddedToWishlist = (propertyId) => {
    return wishlistProperties.length < 0 ? false : wishlistProperties.find(({ productId }) => productId === propertyId);
  }

  useEffect(() => {
    loadProperty();

    const fetchAllWishlistProperties = async () => {
      await loadWishlistProperties();
    };

    const markPropertyViewed = async () => {
      await PropertyService.log({
        id: params.id,
        logType: PRODUCT_LOG_TYPE.VIEWED,
      });
    };

    fetchAllWishlistProperties();
    markPropertyViewed();
  }, []);

  return (
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
          <h3>{ formatPrice(property.price) }</h3>
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
          <a href={`/customer/add-appointment?id=${property.id}`} className="btn theme-btn-1 mb-3 w-100">Usee-360 Booking</a>
          <a
            className="btn theme-btn-3 mb-3 w-100"
            onClick={() => { isAddedToWishlist(property.id) ? removeWishList(property.id) : addToWishList(property.id); }}
          >
            { isAddedToWishlist(property.id) ? "Remove from wishlist" : "Add to wishlist" }
          </a>
          {
            propertyDocuments && (
              propertyDocuments.map((element, index) => (
                <a href={`${process.env.REACT_APP_API_URL}/${element.file}`} target="_blank" className="btn theme-btn-1 mb-3 w-100" key={index}>View {element.title}</a>
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
          <ViewOffer property={property} responseHandler={props.responseHandler} />
        </div>
      </div>
    </section>
  );
}
