import React, { Component } from "react";
import { Link } from "react-router-dom";
class ShopDetails extends Component {
  render() {
    const publicUrl = `${process.env.PUBLIC_URL}/`;

    return (
      <div className="ltn__shop-details-area pb-10">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-md-12">
              <div className="ltn__shop-details-inner ltn__page-details-inner mb-60">
                <div className="ltn__blog-meta">
                  <ul>
                    <li className="ltn__blog-category">
                      <Link to="#">Featured</Link>
                    </li>
                    <li className="ltn__blog-category">
                      <Link className="bg-orange" to="#">
                        For Rent
                      </Link>
                    </li>
                    <li className="ltn__blog-date">
                      <i className="far fa-calendar-alt" />
                      May 19, 2021
                    </li>
                  </ul>
                </div>
                <h1>New Apartment Nice View</h1>
                <label>
                  <span className="ltn__secondary-color">
                    <i className="flaticon-pin" />
                  </span>{" "}
                  Belmont Gardens, Chicago
                </label>
                <h4 className="title-2">Description</h4>
                <p>
                  Massa tempor nec feugiat nisl pretium. Egestas fringilla
                  phasellus faucibus scelerisque eleifend donec Porta nibh
                  venenatis cras sed felis eget velit aliquet. Neque volutpat ac
                  tincidunt vitae semper quis lectus. Turpis in eu mi bibendum
                  neque egestas congue quisque. Sed elementum tempus egestas sed
                  sed risus pretium quam. Dignissim sodales ut eu sem. Nibh
                  mauris cursus mattis molestee iaculis at erat pellentesque. Id
                  interdum velit laoreet id donec ultrices tincidunt.
                </p>
                <h4 className="title-2">Facts and Features</h4>
                <div className="property-detail-feature-list clearfix mb-45">
                  <ul>
                    <li>
                      <div className="property-detail-feature-list-item">
                        <i className="flaticon-double-bed" />
                        <div>
                          <h6>Living Room</h6>
                          <small>20 x 16 sq feet</small>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="property-detail-feature-list-item">
                        <i className="flaticon-double-bed" />
                        <div>
                          <h6>Garage</h6>
                          <small>20 x 16 sq feet</small>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="property-detail-feature-list-item">
                        <i className="flaticon-double-bed" />
                        <div>
                          <h6>Dining Area</h6>
                          <small>20 x 16 sq feet</small>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="property-detail-feature-list-item">
                        <i className="flaticon-double-bed" />
                        <div>
                          <h6>Bedroom</h6>
                          <small>20 x 16 sq feet</small>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="property-detail-feature-list-item">
                        <i className="flaticon-double-bed" />
                        <div>
                          <h6>Bathroom</h6>
                          <small>20 x 16 sq feet</small>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="property-detail-feature-list-item">
                        <i className="flaticon-double-bed" />
                        <div>
                          <h6>Gym Area</h6>
                          <small>20 x 16 sq feet</small>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="property-detail-feature-list-item">
                        <i className="flaticon-double-bed" />
                        <div>
                          <h6>Garden</h6>
                          <small>20 x 16 sq feet</small>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="property-detail-feature-list-item">
                        <i className="flaticon-double-bed" />
                        <div>
                          <h6>Parking</h6>
                          <small>20 x 16 sq feet</small>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="ltn__shop-details-tab-content-inner--- ltn__shop-details-tab-inner-2 ltn__product-details-review-inner mb-60">
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
                </div>
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
}

export default ShopDetails;
