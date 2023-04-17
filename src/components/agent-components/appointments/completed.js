import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function CompletedAppointments() {
  let publicUrl = process.env.PUBLIC_URL + "/";

  return (
    <div className="ltn__myaccount-tab-content-inner">
      <div className="ltn__my-properties-table table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Appointments</th>
              <th scope="col" />
              <th scope="col" />
              <th scope="col">Actions</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="ltn__my-properties-img go-top">
                <h3 className="appointment-date">23 Mar</h3>
              </td>
              <td>
                <div className="ltn__my-properties-info appointment-info">
                  <h6 className="mb-10 go-top">Saad Jamil</h6>
                  <small>
                    <i className="icon-clock" /> 2:09 PM 24/02/2023
                  </small>
                </div>
              </td>
              <td></td>
              <td>
                <Link
                  to="#"
                  data-bs-toggle="modal"
                  data-bs-target="#appointment-details"
                >
                  <i className="fa-solid fa-eye" /> View
                </Link>
              </td>
              <td>
                <strong>Not Updated</strong>
              </td>
            </tr>
            <tr>
              <td className="ltn__my-properties-img go-top">
                <h3 className="appointment-date">20 Mar</h3>
              </td>
              <td>
                <div className="ltn__my-properties-info appointment-info">
                  <h6 className="mb-10 go-top">Saad Jamil</h6>
                  <small>
                    <i className="icon-clock" /> 2:09 PM 24/02/2023
                  </small>
                </div>
              </td>
              <td></td>
              <td>
                <Link
                  to="#"
                  data-bs-toggle="modal"
                  data-bs-target="#appointment-details"
                >
                  <i className="fa-solid fa-eye" /> View
                </Link>
              </td>
              <td>
                <strong>Not Updated</strong>
              </td>
            </tr>
            <tr>
              <td className="ltn__my-properties-img go-top">
                <h3 className="appointment-date">21 Feb</h3>
              </td>
              <td>
                <div className="ltn__my-properties-info appointment-info">
                  <h6 className="mb-10 go-top">Saad Jamil</h6>
                  <small>
                    <i className="icon-clock" /> 2:09 PM 24/02/2023
                  </small>
                </div>
              </td>
              <td></td>
              <td>
                <Link
                  to="#"
                  data-bs-toggle="modal"
                  data-bs-target="#appointment-details"
                >
                  <i className="fa-solid fa-eye" /> View
                </Link>
              </td>
              <td>
                <strong>Not Updated</strong>
              </td>
            </tr>
            <tr>
              <td className="ltn__my-properties-img go-top">
                <h3 className="appointment-date">18 Feb</h3>
              </td>
              <td>
                <div className="ltn__my-properties-info appointment-info">
                  <h6 className="mb-10 go-top">Saad Jamil</h6>
                  <small>
                    <i className="icon-clock" /> 2:09 PM 24/02/2023
                  </small>
                </div>
              </td>
              <td></td>
              <td>
                <Link
                  to="#"
                  data-bs-toggle="modal"
                  data-bs-target="#appointment-details"
                >
                  <i className="fa-solid fa-eye" /> View
                </Link>
              </td>
              <td>
                <strong>Not Updated</strong>
              </td>
            </tr>
            <tr>
              <td className="ltn__my-properties-img go-top">
                <h3 className="appointment-date">11 Jan</h3>
              </td>
              <td>
                <div className="ltn__my-properties-info appointment-info">
                  <h6 className="mb-10 go-top">Saad Jamil</h6>
                  <small>
                    <i className="icon-clock" /> 2:09 PM 24/02/2023
                  </small>
                </div>
              </td>
              <td></td>
              <td>
                <Link
                  to="#"
                  data-bs-toggle="modal"
                  data-bs-target="#appointment-details"
                >
                  <i className="fa-solid fa-eye" /> View
                </Link>
              </td>
              <td>
                <strong>Not Updated</strong>
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
      <div className="ltn__modal-area ltn__add-to-cart-modal-area">
        <div className="modal fade" id="appointment-details" tabIndex={-1}>
          <div className="modal-dialog modal-md" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="ltn__quick-view-modal-inner pb-2">
                  <div className="modal-product-item">
                    <div className="row">
                      <div className="col-12">
                        <h4 className="mb-5">Booking # 112245</h4>
                        <div>
                          <h5 className="p-0 m-0">Agent Name</h5>
                          <p className="p-0 m-o">Paul Smith</p>
                        </div>
                        <div>
                          <h5 className="p-0 m-0">Company</h5>
                          <p className="p-0 m-o">Foxtons Web</p>
                        </div>
                        <div>
                          <h5 className="p-0 m-0">Booking Time</h5>
                          <div className="row">
                            <div className="col">
                              <p className="p-0 m-o">
                                <i className="fa-regular fa-calendar"></i>{" "}
                                28/03/2023
                              </p>
                            </div>
                            <div className="col">
                              <p>
                                <i className="fa-regular fa-clock"></i> 10:00 PM
                              </p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h5 className="p-0 m-0">Contact Info</h5>
                          <p className="p-0 m-o">
                            <i className="fa-regular fa-envelope"></i>{" "}
                            info@usee360.com <br />
                            <i className="fa-regular fa-address-book"></i> +1 (111)
                            222 333
                          </p>
                        </div>
                        <div>
                          <h5 className="p-0 m-0">Customer Name</h5>
                          <p className="p-0 m-o">Alex Smith</p>
                        </div>
                        <div>
                          <h5 className="p-0 m-0">Property</h5>
                          <Link
                            to="/property-details"
                            className="close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          >
                            <img
                              className="mt-2"
                              src={publicUrl + "assets/img/product-3/1.jpg"}
                              height="150"
                            />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
