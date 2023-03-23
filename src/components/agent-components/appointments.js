import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Appointments() {
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
                <Link to="#">
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
                <Link to="#">
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
                <Link to="#">
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
                <Link to="#">
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
                <Link to="#">
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
    </div>
  );
}
