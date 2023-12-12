import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import ViewOffer from "./view-offer";
import { VIRTUAL_TOUR_TYPE, PRODUCT_LOG_TYPE } from "../../../constants";
import Slideshow from "../../homepage/section/Slideshow";
import WishlistService from "../../../services/customer/wishlist";
import PropertyService from "../../../services/agent/property";
import { formatPrice, getLoginToken, setPropertyMetaData } from "../../../utils";

export default function Details(props) {
  // State variables
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
  const history = useHistory();
  const token = getLoginToken(); 
  const redirectPath = `/customer/login?returnUrl=${encodeURIComponent(
    window.location.pathname
  )}`;

  const postPropertyViewLog = async (propertyId) => {
    try {
      const logData = {
        id: propertyId,
        logType: "viewed"
      };

      await PropertyService.addPropertyLog(logData);
    } catch (error) {
      console.error('Error posting property view log:', error);
      // Handle the error appropriately
    }
  };

  const loadProperty = useCallback(async () => {
    try {
      const response = await PropertyService.detail(params.id);
      if (response?.error && response?.message) {
        props.responseHandler(response.message);
        return;
      }

      setProperty(response);

      postPropertyViewLog(params.id);

      if (response?.productMetaTags) {
        const {
          typeMetaTag,
          categoryTypeMetaTag,
          unitMetaTag,
          areaMetaTag,
          bedroomsMetaTag,
        } = setPropertyMetaData(response.productMetaTags);
        setPropertyType(typeMetaTag);
        setPropertyCategoryType(categoryTypeMetaTag);
        setPropertyUnit(unitMetaTag);
        setPropertyArea(areaMetaTag);
        setPropertyBedrooms(bedroomsMetaTag);
      }

      // setAgentImage(response?.user?.profileImage);
      // setAgentName(`${response?.user?.firstName} ${response?.user?.lastName}`);

      if (response?.productImages?.length > 0) {
        setPropertyImages([
          {
            id: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
            image: response.featuredImage,
          },
          ...response.productImages,
        ]);
      }

      if (response?.productDocuments?.length > 0) {
        setPropertyDocuments(response.productDocuments);
      }
    } catch (error) {
      console.error("Error fetching property details:", error);
    }
  }, [params.id, props]);

  const loadWishlistProperties = useCallback(async () => {
    const response = await WishlistService.list();
    if (response?.length > 0) {
      setWishlistProperties(response);
    }
  }, [token]);

  const addToWishList = async (propertyId) => {
    if (!token) {
      history.push(redirectPath);
      return;
    }

    const response = await WishlistService.addToWishlist(propertyId);
    if (response?.error && response?.message) {
      props.responseHandler(response.message);
      return;
    }

    props.responseHandler("Property added to wishlist.", true);
    await loadWishlistProperties();
  };

  const removeWishList = async (propertyId) => {
    if (!token) {
      history.push(redirectPath);
      return;
    }

    const response = await WishlistService.removeFromWishlist(propertyId);
    if (response?.error && response?.message) {
      props.responseHandler(response.message);
      return;
    }

    props.responseHandler("Property removed from wishlist.", true);
    await loadWishlistProperties();
  };

  const isAddedToWishlist = useCallback((propertyId) => {
    return wishlistProperties.some(({ productId }) => productId === propertyId);
  }, [wishlistProperties]);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadProperty();
    if (token) {
      loadWishlistProperties();
    }
  }, [loadProperty, loadWishlistProperties, token, params.id]);
  return (
    <section>
      {
        propertyImages?.length > 0 ? (
          <Slideshow fadeImages={propertyImages} />
        ) : (
          <img
            className="mb-50"
            src={`${process.env.REACT_APP_API_URL}/${property.featuredImage}`}
            alt={property.title}
          />
        )
      }
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
          <div><p>{property.description}</p></div>
        </div>
        <div className="col-md-5">
          <a href={`/customer/add-appointment?id=${property.id}`} className="btn theme-btn-1 mb-3 w-100">Usee-360 Booking</a>
          <button
            className={`btn theme-btn-${isAddedToWishlist(property.id) ? '2' : '3'} mb-3 w-100`}
            onClick={() => isAddedToWishlist(property.id) ? removeWishList(property.id) : addToWishList(property.id)}
          >
            {isAddedToWishlist(property.id) ? "Remove from wishlist" : "Add to wishlist"}
          </button>
          {
            propertyDocuments?.map((element, index) => (
              <a href={`${process.env.REACT_APP_API_URL}/${element.file}`} target="_blank" rel="noopener noreferrer" className="btn theme-btn-1 mb-3 w-100" key={index}>View {element.title}</a>
            ))
          }
          {
            property?.virtualTourType === VIRTUAL_TOUR_TYPE.URL && (
              <a href={property.virtualTourUrl} target="_blank" rel="noopener noreferrer" className="btn theme-btn-3 mb-3">View Tour</a>
            )
          }
        </div>
        {
          property?.virtualTourType === VIRTUAL_TOUR_TYPE.VIDEO && (
            <div className="property-detail-feature-list clearfix mb-45">
              <video width="100%" height="100%" controls>
                <source src={`${process.env.REACT_APP_API_URL}/${property.virtualTourUrl}`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )
        }
        <ViewOffer property={property} responseHandler={props.responseHandler} />
      </div>
    </section>
  );
}  