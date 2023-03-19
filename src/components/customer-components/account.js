import React, { Component } from "react";
import { Link } from "react-router-dom";
import parse from "html-react-parser";

class MyAccount extends Component {
  render() {
    const publicUrl = `${process.env.PUBLIC_URL}/`;

    return (
      <div className="liton__wishlist-area pb-70">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              {/* PRODUCT TAB AREA START */}
              <div className="ltn__product-tab-area">
                <div className="container">
                  <div className="row">
                    <div className="col-lg-4">
                      <div className="ltn__tab-menu-list mb-50">
                        <div className="nav">
                          <a
                            className="active show"
                            data-bs-toggle="tab"
                            href="#ltn_tab_1_1"
                          >
                            Dashboard
                            <i className="fas fa-home" />
                          </a>
                          <a data-bs-toggle="tab" href="#ltn_tab_1_2">
                            Account Details
                            <i className="fas fa-user" />
                          </a>
                          <a data-bs-toggle="tab" href="#ltn_tab_1_3">
                            My Properties
                            <i className="fa-solid fa-list" />
                          </a>
                          <a data-bs-toggle="tab" href="#ltn_tab_1_4">
                            Add Property
                            <i className="fa-solid fa-map-location-dot" />
                          </a>
                          <a data-bs-toggle="tab" href="#ltn_tab_1_5">
                            Alerts
                            <i className="fa-solid fa-bell" />
                          </a>
                          <a href="/customer/login">
                            Logout
                            <i className="fas fa-sign-out-alt" />
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-8">
                      <div className="tab-content">
                        <div
                          className="tab-pane fade active show"
                          id="ltn_tab_1_1"
                        >
                          <div className="ltn__comment-area mb-50">
                            <div className="ltn-author-introducing clearfix">
                              <div className="author-img">
                                <img
                                  src={publicUrl + "assets/img/blog/author.jpg"}
                                  alt="Author Image"
                                />
                              </div>
                              <div className="author-info">
                                <h6>Agent of Property</h6>
                                <h2>Rosalina D. William</h2>
                                <div className="footer-address">
                                  <ul>
                                    <li>
                                      <div className="footer-address-icon">
                                        <i className="icon-placeholder" />
                                      </div>
                                      <div className="footer-address-info">
                                        <p>Brooklyn, New York, United States</p>
                                      </div>
                                    </li>
                                    <li>
                                      <div className="footer-address-icon">
                                        <i className="icon-call" />
                                      </div>
                                      <div className="footer-address-info">
                                        <p>
                                          <a href="tel:+0123-456789">
                                            +0123-456789
                                          </a>
                                        </p>
                                      </div>
                                    </li>
                                    <li>
                                      <div className="footer-address-icon">
                                        <i className="icon-mail" />
                                      </div>
                                      <div className="footer-address-info">
                                        <p>
                                          <a href="mailto:example@example.com">
                                            example@example.com
                                          </a>
                                        </p>
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="tab-pane fade" id="ltn_tab_1_2">
                          <h4 className="title-2">Account Details</h4>
                          <div className="ltn__myaccount-tab-content-inner">
                            <div className="ltn__form-box">
                              <form action="#">
                                <div className="row mb-50">
                                  <div className="col-md-6">
                                    <label>First name:</label>
                                    <input
                                      type="text"
                                      name="ltn__name"
                                      placeholder="Jon"
                                    />
                                  </div>
                                  <div className="col-md-6">
                                    <label>Last name:</label>
                                    <input
                                      type="text"
                                      name="ltn__lastname"
                                      placeholder="Doe"
                                    />
                                  </div>
                                  <div className="col-md-6">
                                    <label>Display Name:</label>
                                    <input
                                      type="text"
                                      name="ltn__lastname"
                                      placeholder="Ethan"
                                    />
                                  </div>
                                  <div className="col-md-6">
                                    <label>Display Email:</label>
                                    <input
                                      type="email"
                                      name="ltn__lastname"
                                      placeholder="example@example.com"
                                    />
                                  </div>
                                </div>
                                <h4 className="title-2">Change Password</h4>
                                <fieldset>
                                  <div className="row">
                                    <div className="col-md-12">
                                      <label>
                                        Current password (leave blank to leave
                                        unchanged):
                                      </label>
                                      <input type="password" name="ltn__name" />
                                      <label>
                                        New password (leave blank to leave
                                        unchanged):
                                      </label>
                                      <input
                                        type="password"
                                        name="ltn__lastname"
                                      />
                                      <label>Confirm new password:</label>
                                      <input
                                        type="password"
                                        name="ltn__lastname"
                                      />
                                    </div>
                                  </div>
                                </fieldset>
                                <div className="btn-wrapper">
                                  <button
                                    type="submit"
                                    className="btn theme-btn-1 btn-effect-1 text-uppercase"
                                  >
                                    Save Changes
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                        <div className="tab-pane fade" id="ltn_tab_1_3">
                          <div className="ltn__myaccount-tab-content-inner">
                            <div className="ltn__my-properties-table table-responsive">
                              <table className="table">
                                <thead>
                                  <tr>
                                    <th scope="col">My Properties</th>
                                    <th scope="col" />
                                    <th scope="col">Date Added</th>
                                    <th scope="col">Actions</th>
                                    <th scope="col">Delete</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td className="ltn__my-properties-img go-top">
                                      <Link to="/property-details">
                                        <img
                                          src={`${publicUrl}assets/img/product-3/1.jpg`}
                                          alt="#"
                                        />
                                      </Link>
                                    </td>
                                    <td>
                                      <div className="ltn__my-properties-info">
                                        <h6 className="mb-10 go-top">
                                          <Link to="/property-details">
                                            New Apartment Nice View
                                          </Link>
                                        </h6>
                                        <small>
                                          <i className="icon-placeholder" />{" "}
                                          Brooklyn, New York, United States
                                        </small>
                                        <div className="product-ratting">
                                          <ul>
                                            <li>
                                              <a href="#">
                                                <i className="fas fa-star" />
                                              </a>
                                            </li>
                                            <li>
                                              <a href="#">
                                                <i className="fas fa-star" />
                                              </a>
                                            </li>
                                            <li>
                                              <a href="#">
                                                <i className="fas fa-star" />
                                              </a>
                                            </li>
                                            <li>
                                              <a href="#">
                                                <i className="fas fa-star-half-alt" />
                                              </a>
                                            </li>
                                            <li>
                                              <a href="#">
                                                <i className="far fa-star" />
                                              </a>
                                            </li>
                                            <li className="review-total">
                                              {" "}
                                              <a href="#"> ( 95 Reviews )</a>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                    </td>
                                    <td>Feb 22, 2022</td>
                                    <td>
                                      <Link to="#">Edit</Link>
                                    </td>
                                    <td>
                                      <Link tp="#">
                                        <i className="fa-solid fa-trash-can" />
                                      </Link>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="ltn__my-properties-img go-top">
                                      <Link to="/property-details">
                                        <img
                                          src={`${publicUrl}assets/img/product-3/2.jpg`}
                                          alt="#"
                                        />
                                      </Link>
                                    </td>
                                    <td>
                                      <div className="ltn__my-properties-info">
                                        <h6 className="mb-10 go-top">
                                          <Link to="/property-details">
                                            New Apartment Nice View
                                          </Link>
                                        </h6>
                                        <small>
                                          <i className="icon-placeholder" />{" "}
                                          Brooklyn, New York, United States
                                        </small>
                                        <div className="product-ratting">
                                          <ul>
                                            <li>
                                              <a href="#">
                                                <i className="fas fa-star" />
                                              </a>
                                            </li>
                                            <li>
                                              <a href="#">
                                                <i className="fas fa-star" />
                                              </a>
                                            </li>
                                            <li>
                                              <a href="#">
                                                <i className="fas fa-star" />
                                              </a>
                                            </li>
                                            <li>
                                              <a href="#">
                                                <i className="fas fa-star-half-alt" />
                                              </a>
                                            </li>
                                            <li>
                                              <a href="#">
                                                <i className="far fa-star" />
                                              </a>
                                            </li>
                                            <li className="review-total">
                                              {" "}
                                              <a href="#"> ( 95 Reviews )</a>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                    </td>
                                    <td>Feb 22, 2022</td>
                                    <td>
                                      <Link to="#">Edit</Link>
                                    </td>
                                    <td>
                                      <Link tp="#">
                                        <i className="fa-solid fa-trash-can" />
                                      </Link>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="ltn__my-properties-img go-top">
                                      <Link to="/property-details">
                                        <img
                                          src={`${publicUrl}assets/img/product-3/3.jpg`}
                                          alt="#"
                                        />
                                      </Link>
                                    </td>
                                    <td>
                                      <div className="ltn__my-properties-info">
                                        <h6 className="mb-10 go-top">
                                          <Link to="/property-details">
                                            New Apartment Nice View
                                          </Link>
                                        </h6>
                                        <small>
                                          <i className="icon-placeholder" />{" "}
                                          Brooklyn, New York, United States
                                        </small>
                                        <div className="product-ratting">
                                          <ul>
                                            <li>
                                              <a href="#">
                                                <i className="fas fa-star" />
                                              </a>
                                            </li>
                                            <li>
                                              <a href="#">
                                                <i className="fas fa-star" />
                                              </a>
                                            </li>
                                            <li>
                                              <a href="#">
                                                <i className="fas fa-star" />
                                              </a>
                                            </li>
                                            <li>
                                              <a href="#">
                                                <i className="fas fa-star-half-alt" />
                                              </a>
                                            </li>
                                            <li>
                                              <a href="#">
                                                <i className="far fa-star" />
                                              </a>
                                            </li>
                                            <li className="review-total">
                                              {" "}
                                              <a href="#"> ( 95 Reviews )</a>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                    </td>
                                    <td>Feb 22, 2022</td>
                                    <td>
                                      <Link to="#">Edit</Link>
                                    </td>
                                    <td>
                                      <Link tp="#">
                                        <i className="fa-solid fa-trash-can" />
                                      </Link>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div className="ltn__pagination-area text-center">
                              <div className="ltn__pagination">
                                <ul>
                                  <li>
                                    <Link to="#">
                                      <i className="fas fa-angle-double-left" />
                                    </Link>
                                  </li>
                                  <li>
                                    <Link to="#">1</Link>
                                  </li>
                                  <li className="active">
                                    <Link to="#">2</Link>
                                  </li>
                                  <li>
                                    <Link to="#">3</Link>
                                  </li>
                                  <li>
                                    <Link to="#">...</Link>
                                  </li>
                                  <li>
                                    <Link to="#">10</Link>
                                  </li>
                                  <li>
                                    <Link to="#">
                                      <i className="fas fa-angle-double-right" />
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="tab-pane fade" id="ltn_tab_1_4">
                          <div className="ltn__myaccount-tab-content-inner">
                            <h6>Property Description</h6>
                            <div className="row">
                              <div className="col-md-12">
                                <div className="input-item input-item-textarea ltn__custom-icon">
                                  <input
                                    type="text"
                                    name="ltn__name"
                                    placeholder="*Title (mandatory)"
                                  />
                                </div>
                                <div className="input-item input-item-textarea ltn__custom-icon">
                                  <textarea
                                    name="ltn__message"
                                    placeholder="Description"
                                    defaultValue=""
                                  />
                                </div>
                              </div>
                            </div>
                            <h6>Property Price</h6>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="input-item  input-item-textarea ltn__custom-icon">
                                  <input
                                    type="text"
                                    name="ltn__name"
                                    placeholder="Price in $ (only numbers)"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="input-item input-item-textarea ltn__custom-icon">
                                  <input
                                    type="text"
                                    name="ltn__name"
                                    placeholder="After Price Label (ex: /month)"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="input-item input-item-textarea ltn__custom-icon">
                                  <input
                                    type="text"
                                    name="ltn__name"
                                    placeholder="Before Price Label (ex: from)"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="input-item input-item-textarea ltn__custom-icon">
                                  <input
                                    type="text"
                                    name="ltn__name"
                                    placeholder="Yearly Tax Rate"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="input-item input-item-textarea ltn__custom-icon">
                                  <input
                                    type="text"
                                    name="ltn__name"
                                    placeholder="Homeowners Association Fee(monthly)"
                                  />
                                </div>
                              </div>
                            </div>
                            <h6>Select Categories</h6>
                            <div className="row">
                              <div className="col-lg-4 col-md-6">
                                <div className="input-item">
                                  <select className="nice-select">
                                    <option>None</option>
                                    <option>Apartments</option>
                                    <option>Condos</option>
                                    <option>Duplexes</option>
                                    <option>Houses</option>
                                    <option>Industrial</option>
                                    <option>Land</option>
                                    <option>Offices</option>
                                    <option>Retail</option>
                                    <option>Villas</option>
                                  </select>
                                </div>
                              </div>
                              <div className="col-lg-4 col-md-6">
                                <div className="input-item">
                                  <select className="nice-select">
                                    <option>None</option>
                                    <option>Rentals</option>
                                    <option>Sales</option>
                                  </select>
                                </div>
                              </div>
                              <div className="col-lg-4 col-md-6">
                                <div className="input-item">
                                  <select className="nice-select">
                                    <option>no status</option>
                                    <option>Active</option>
                                    <option>hot offer</option>
                                    <option>new offer</option>
                                    <option>open house</option>
                                    <option>sold</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                            <h6>Listing Media</h6>
                            <input
                              type="file"
                              id="myFile"
                              name="filename"
                              className="btn theme-btn-3 mb-10"
                            />
                            <br />
                            <p>
                              <small>
                                * At least 1 image is required for a valid
                                submission.Minimum size is 500/500px.
                              </small>
                              <br />
                              <small>
                                * PDF files upload supported as well.
                              </small>
                              <br />
                              <small>
                                * Images might take longer to be processed.
                              </small>
                            </p>
                            <h6>Video Option</h6>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="input-item">
                                  <select className="nice-select">
                                    <option>Video from</option>
                                    <option>vimeo</option>
                                    <option>youtube</option>
                                  </select>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="input-item input-item-textarea ltn__custom-icon">
                                  <input
                                    type="text"
                                    name="ltn__name"
                                    placeholder="Embed Video ID"
                                  />
                                </div>
                              </div>
                            </div>
                            <h6>Virtual Tour</h6>
                            <div className="input-item input-item-textarea ltn__custom-icon">
                              <textarea
                                name="ltn__message"
                                placeholder="Virtual Tour:"
                                defaultValue=""
                              />
                            </div>
                            <h6>Listing Location</h6>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="input-item input-item-textarea ltn__custom-icon">
                                  <input
                                    type="text"
                                    name="ltn__name"
                                    placeholder="*Address"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="input-item input-item-textarea ltn__custom-icon">
                                  <input
                                    type="text"
                                    name="ltn__name"
                                    placeholder="Country"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="input-item input-item-textarea ltn__custom-icon">
                                  <input
                                    type="text"
                                    name="ltn__name"
                                    placeholder="County / State"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="input-item input-item-textarea ltn__custom-icon">
                                  <input
                                    type="text"
                                    name="ltn__name"
                                    placeholder="City"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="input-item input-item-textarea ltn__custom-icon">
                                  <input
                                    type="text"
                                    name="ltn__name"
                                    placeholder="Neighborhood"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="input-item input-item-textarea ltn__custom-icon">
                                  <input
                                    type="text"
                                    name="ltn__name"
                                    placeholder="Zip"
                                  />
                                </div>
                              </div>
                              <div className="col-lg-12">
                                <div className="property-details-google-map mb-60">
                                  <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9334.271551495209!2d-73.97198251485975!3d40.668170674982946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25b0456b5a2e7%3A0x68bdf865dda0b669!2sBrooklyn%20Botanic%20Garden%20Shop!5e0!3m2!1sen!2sbd!4v1590597267201!5m2!1sen!2sbd"
                                    width="100%"
                                    height="100%"
                                    frameBorder={0}
                                    allowFullScreen
                                    aria-hidden="false"
                                    tabIndex={0}
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="input-item input-item-textarea ltn__custom-icon">
                                  <input
                                    type="text"
                                    name="ltn__name"
                                    placeholder="Latitude (for Google Maps)"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="input-item input-item-textarea ltn__custom-icon">
                                  <input
                                    type="text"
                                    name="ltn__name"
                                    placeholder="Longitude (for Google Maps)"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <label className="checkbox-item">
                                  Enable Google Street View
                                  <input type="checkbox" />
                                  <span className="checkmark" />
                                </label>
                              </div>
                              <div className="col-md-6">
                                <div className="input-item input-item-textarea ltn__custom-icon">
                                  <input
                                    type="text"
                                    name="ltn__name"
                                    placeholder="Google Street View - Camera Angle (value from 0 to 360)"
                                  />
                                </div>
                              </div>
                            </div>
                            <h6>Listing Details</h6>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="input-item input-item-textarea ltn__custom-icon">
                                  <input
                                    type="text"
                                    name="ltn__name"
                                    placeholder="Size in ft2 (*only numbers)"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="input-item input-item-textarea ltn__custom-icon">
                                  <input
                                    type="text"
                                    name="ltn__name"
                                    placeholder="Lot Size in ft2 (*only numbers)"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="input-item input-item-textarea ltn__custom-icon">
                                  <input
                                    type="text"
                                    name="ltn__name"
                                    placeholder="Rooms (*only numbers)"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="input-item input-item-textarea ltn__custom-icon">
                                  <input
                                    type="text"
                                    name="ltn__name"
                                    placeholder="Bedrooms (*only numbers)"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="input-item input-item-textarea ltn__custom-icon">
                                  <input
                                    type="text"
                                    name="ltn__name"
                                    placeholder="Bathrooms (*only numbers)"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="input-item input-item-textarea ltn__custom-icon">
                                  <input
                                    type="text"
                                    name="ltn__name"
                                    placeholder="Custom ID (*text)"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="input-item input-item-textarea ltn__custom-icon">
                                  <input
                                    type="text"
                                    name="ltn__name"
                                    placeholder="Garages (*text)"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="input-item input-item-textarea ltn__custom-icon">
                                  <input
                                    type="text"
                                    name="ltn__name"
                                    placeholder="Year Built (*numeric)"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="input-item input-item-textarea ltn__custom-icon">
                                  <input
                                    type="text"
                                    name="ltn__name"
                                    placeholder="Garage Size (*text)"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="input-item input-item-textarea ltn__custom-icon">
                                  <input
                                    type="text"
                                    name="ltn__name"
                                    placeholder="Available from (*date)"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="input-item input-item-textarea ltn__custom-icon">
                                  <input
                                    type="text"
                                    name="ltn__name"
                                    placeholder="Basement (*text)"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="input-item input-item-textarea ltn__custom-icon">
                                  <input
                                    type="text"
                                    name="ltn__name"
                                    placeholder="Extra Details (*text)"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="input-item input-item-textarea ltn__custom-icon">
                                  <input
                                    type="text"
                                    name="ltn__name"
                                    placeholder="Roofing (*text)"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="input-item input-item-textarea ltn__custom-icon">
                                  <input
                                    type="text"
                                    name="ltn__name"
                                    placeholder="Exterior Material (*text)"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="input-item">
                                  <select className="nice-select">
                                    <option>Structure Type</option>
                                    <option>Not Available</option>
                                    <option>Brick</option>
                                    <option>Wood</option>
                                    <option>Cement</option>
                                  </select>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="input-item">
                                  <select className="nice-select">
                                    <option>Floors No</option>
                                    <option>Not Available</option>
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                  </select>
                                </div>
                              </div>
                              <div className="col-lg-12">
                                <div className="input-item input-item-textarea ltn__custom-icon">
                                  <textarea
                                    name="ltn__message"
                                    placeholder="Owner/Agent notes (*not visible on front end)"
                                    defaultValue=""
                                  />
                                </div>
                              </div>
                            </div>
                            <h6>Select Energy Class</h6>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="input-item">
                                  <select className="nice-select">
                                    <option>
                                      Select Energy Class (EU regulation)
                                    </option>
                                    <option>A+</option>
                                    <option>A</option>
                                    <option>B</option>
                                    <option>C</option>
                                    <option>D</option>
                                    <option>E</option>
                                  </select>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="input-item input-item-textarea ltn__custom-icon">
                                  <input
                                    type="text"
                                    name="ltn__name"
                                    placeholder="Energy Index in kWh/m2a"
                                  />
                                </div>
                              </div>
                            </div>
                            <h6>Amenities and Features</h6>
                            <h6>Interior Details</h6>
                            <div className="row">
                              <div className="col-lg-4 col-md-6">
                                <label className="checkbox-item">
                                  Equipped Kitchen
                                  <input type="checkbox" />
                                  <span className="checkmark" />
                                </label>
                              </div>
                              <div className="col-lg-4 col-md-6">
                                <label className="checkbox-item">
                                  Gym
                                  <input type="checkbox" />
                                  <span className="checkmark" />
                                </label>
                              </div>
                              <div className="col-lg-4 col-md-6">
                                <label className="checkbox-item">
                                  Laundry
                                  <input type="checkbox" />
                                  <span className="checkmark" />
                                </label>
                              </div>
                              <div className="col-lg-4 col-md-6">
                                <label className="checkbox-item">
                                  Media Room
                                  <input type="checkbox" />
                                  <span className="checkmark" />
                                </label>
                              </div>
                            </div>
                            <h6 className="mt-20">Outdoor Details</h6>
                            <div className="row">
                              <div className="col-lg-4 col-md-6">
                                <label className="checkbox-item">
                                  Back yard
                                  <input type="checkbox" />
                                  <span className="checkmark" />
                                </label>
                              </div>
                              <div className="col-lg-4 col-md-6">
                                <label className="checkbox-item">
                                  Basketball court
                                  <input type="checkbox" />
                                  <span className="checkmark" />
                                </label>
                              </div>
                              <div className="col-lg-4 col-md-6">
                                <label className="checkbox-item">
                                  Front yard
                                  <input type="checkbox" />
                                  <span className="checkmark" />
                                </label>
                              </div>
                              <div className="col-lg-4 col-md-6">
                                <label className="checkbox-item">
                                  Garage Attached
                                  <input type="checkbox" />
                                  <span className="checkmark" />
                                </label>
                              </div>
                              <div className="col-lg-4 col-md-6">
                                <label className="checkbox-item">
                                  Hot Bath
                                  <input type="checkbox" />
                                  <span className="checkmark" />
                                </label>
                              </div>
                              <div className="col-lg-4 col-md-6">
                                <label className="checkbox-item">
                                  Pool
                                  <input type="checkbox" />
                                  <span className="checkmark" />
                                </label>
                              </div>
                            </div>
                            <h6 className="mt-20">Utilities</h6>
                            <div className="row">
                              <div className="col-lg-4 col-md-6">
                                <label className="checkbox-item">
                                  Central Air
                                  <input type="checkbox" />
                                  <span className="checkmark" />
                                </label>
                              </div>
                              <div className="col-lg-4 col-md-6">
                                <label className="checkbox-item">
                                  Electricity
                                  <input type="checkbox" />
                                  <span className="checkmark" />
                                </label>
                              </div>
                              <div className="col-lg-4 col-md-6">
                                <label className="checkbox-item">
                                  Heating
                                  <input type="checkbox" />
                                  <span className="checkmark" />
                                </label>
                              </div>
                              <div className="col-lg-4 col-md-6">
                                <label className="checkbox-item">
                                  Natural Gas
                                  <input type="checkbox" />
                                  <span className="checkmark" />
                                </label>
                              </div>
                              <div className="col-lg-4 col-md-6">
                                <label className="checkbox-item">
                                  Ventilation
                                  <input type="checkbox" />
                                  <span className="checkmark" />
                                </label>
                              </div>
                              <div className="col-lg-4 col-md-6">
                                <label className="checkbox-item">
                                  Water
                                  <input type="checkbox" />
                                  <span className="checkmark" />
                                </label>
                              </div>
                            </div>
                            <h6 className="mt-20">Other Features</h6>
                            <div className="row">
                              <div className="col-lg-4 col-md-6">
                                <label className="checkbox-item">
                                  Chair Accessible
                                  <input type="checkbox" />
                                  <span className="checkmark" />
                                </label>
                              </div>
                              <div className="col-lg-4 col-md-6">
                                <label className="checkbox-item">
                                  Elevator
                                  <input type="checkbox" />
                                  <span className="checkmark" />
                                </label>
                              </div>
                              <div className="col-lg-4 col-md-6">
                                <label className="checkbox-item">
                                  Fireplace
                                  <input type="checkbox" />
                                  <span className="checkmark" />
                                </label>
                              </div>
                              <div className="col-lg-4 col-md-6">
                                <label className="checkbox-item">
                                  Smoke detectors
                                  <input type="checkbox" />
                                  <span className="checkmark" />
                                </label>
                              </div>
                              <div className="col-lg-4 col-md-6">
                                <label className="checkbox-item">
                                  Washer and dryer
                                  <input type="checkbox" />
                                  <span className="checkmark" />
                                </label>
                              </div>
                              <div className="col-lg-4 col-md-6">
                                <label className="checkbox-item">
                                  WiFi
                                  <input type="checkbox" />
                                  <span className="checkmark" />
                                </label>
                              </div>
                            </div>
                            <div
                              className="alert alert-warning d-none"
                              role="alert"
                            >
                              Please note that the date and time you requested
                              may not be available. We will contact you to
                              confirm your actual appointment details.
                            </div>
                            <div className="btn-wrapper text-center--- mt-30">
                              <button
                                className="btn theme-btn-1 btn-effect-1 text-uppercase"
                                type="submit"
                              >
                                Submit Property
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="tab-pane fade" id="ltn_tab_1_5">
                          <div className="widget ltn__popular-post-widget ltn__twitter-post-widget">
                            <ul>
                              <li>
                                <div className="popular-post-widget-item clearfix">
                                  <div className="popular-post-widget-img">
                                    <Link to="#">
                                      <i className="fa-solid fa-bell" />
                                    </Link>
                                  </div>
                                  <div className="popular-post-widget-brief">
                                    <p>
                                      Jenna Williams added the property
                                      "Davenham Chestor House" to wishlist
                                    </p>
                                    <div className="ltn__blog-meta">
                                      <ul>
                                        <li className="ltn__blog-date">
                                          <Link to="#">
                                            <i className="far fa-calendar-alt" />
                                            June 22, 2020
                                          </Link>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </li>
                              <li>
                                <div className="popular-post-widget-item clearfix">
                                  <div className="popular-post-widget-img">
                                    <Link to="#">
                                      <i className="fa-solid fa-bell" />
                                    </Link>
                                  </div>
                                  <div className="popular-post-widget-brief">
                                    <p>
                                      Jenna Williams added the property
                                      "Davenham Chestor House" to wishlist
                                    </p>
                                    <div className="ltn__blog-meta">
                                      <ul>
                                        <li className="ltn__blog-date">
                                          <Link to="#">
                                            <i className="far fa-calendar-alt" />
                                            June 22, 2020
                                          </Link>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </li>
                              <li>
                                <div className="popular-post-widget-item clearfix">
                                  <div className="popular-post-widget-img">
                                    <Link to="#">
                                      <i className="fa-solid fa-bell" />
                                    </Link>
                                  </div>
                                  <div className="popular-post-widget-brief">
                                    <p>
                                      Jenna Williams added the property
                                      "Davenham Chestor House" to wishlist
                                    </p>
                                    <div className="ltn__blog-meta">
                                      <ul>
                                        <li className="ltn__blog-date">
                                          <Link to="#">
                                            <i className="far fa-calendar-alt" />
                                            June 22, 2020
                                          </Link>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* PRODUCT TAB AREA END */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MyAccount;
