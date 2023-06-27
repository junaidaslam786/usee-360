import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { 
  VIRTUAL_TOUR_TYPE, 
  PRODUCT_LOG_TYPE 
} from "../../../constants";
import Slideshow from "../../homepage/section/Slideshow";
import { formatCreatedAtTimestamp, formatPrice, getLoginToken, setPropertyMetaData } from "../../../utils";
import HomepageService from "../../../services/homepage";
import WishlistService from "../../../services/customer/wishlist";
import PropertyService from "../../../services/agent/property";

export default function PropertyDetails(props) {
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
  const [wishlistProperties, setWishlistProperties] = useState([]);

  const token = getLoginToken();
  const history = useHistory();
  const params = useParams();
  const redirectPath = `/customer/login?returnUrl=${encodeURIComponent(window.location.pathname)}`;

  const loadProperty = async () => {
    const response = await HomepageService.propertyDetail(params.id);
    if (response?.error && response?.message) {
      props.responseHandler(response.message);
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
    setAgentName(
      `${response?.user?.firstName} ${response?.user?.lastName}`
    );

    if (response?.productImages?.length > 0) {
      setPropertyImages([{ id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', image: response.featuredImage }, ...response.productImages]);
    }

    if (response?.productDocuments?.length > 0) {
      setPropertyDocuments(response.productDocuments);
    }
  }

  const makeOfferHandler = () => {
    history.push(
      !token 
      ? `/customer/login?returnUrl=${encodeURIComponent(`/customer/property-details/${params.id}`)}` 
      : `/customer/property-details/${params.id}`
    );
  }

  const makeAppointmentHandler = async () => {
    history.push(
      !token 
      ?  `/customer/login?returnUrl=${encodeURIComponent(`/customer/add-appointment?id=${params.id}`)}`
      : `/customer/add-appointment?id=${params.id}`
    );
  }

  const loadWishlistProperties = async () => {
    const response = await WishlistService.list();

    if (response?.length > 0) {
      setWishlistProperties(response);
    }
  }

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
  }

  const removeWishList = async (propertyId) => {
    if (!token) {
      history.push(redirectPath);
      return;
    }

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
    window.scrollTo(0, 0);
    loadProperty();

    if (token) {
      const markPropertyViewed = async () => {
        await PropertyService.log({
          id: params.id,
          logType: PRODUCT_LOG_TYPE.VIEWED,
        });
      };

      const fetchAllWishlistProperties = async () => {
        await loadWishlistProperties();
      };
      
      markPropertyViewed();
      fetchAllWishlistProperties();
    }
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
              <h2 className="mb-50">{ formatPrice(property.price) }</h2>
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
                <a
                  className="btn theme-btn-3 mb-3 w-100"
                  onClick={() => { isAddedToWishlist(property.id) ? removeWishList(property.id) : addToWishList(property.id); }}
                >
                  { isAddedToWishlist(property.id) ? "Remove from wishlist" : "Add to wishlist" }
                </a>
                {
                  (property?.virtualTourType && property?.virtualTourType === VIRTUAL_TOUR_TYPE.URL) && (
                    <a href={property.virtualTourUrl} target="_blank" className="btn theme-btn-3 mb-3 w-100">View Tour</a>
                  )
                }
                {
                  propertyDocuments && (
                    propertyDocuments.map((element, index) => (
                      <a href={`${process.env.REACT_APP_API_URL}/${element.file}`} target="_blank" className="btn theme-btn-3 mb-3 w-100" key={index}>View {element.title}</a>
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
