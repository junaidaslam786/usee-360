import React from "react";
import { Link } from "react-router-dom";
import Layout from "./layouts/layout";

export default function MyWishList() {
  let publicUrl = process.env.PUBLIC_URL + "/";

  return (
    <Layout>
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
                  <Link to="/customer/property-details">
                    <img
                      src={publicUrl + "assets/img/product-3/1.jpg"}
                      alt="#"
                    />
                  </Link>
                </td>
                <td>
                  <div className="ltn__my-properties-info">
                    <h6 className="mb-10 go-top">
                      <Link to="/customer/property-details">
                        New Apartment Nice View
                      </Link>
                    </h6>
                    <small>
                      <i className="icon-placeholder" /> Brooklyn, New York,
                      United States
                    </small>
                  </div>
                </td>
                <td>Feb 22, 2022</td>
                <td>
                  <Link to="/customer/property-details">
                    <i className="fa-solid fa-eye"></i> View
                  </Link>
                </td>
                <td>
                  <Link tp="#">
                    <i className="fa-solid fa-trash-can" />
                  </Link>
                </td>
              </tr>
              <tr>
                <td className="ltn__my-properties-img go-top">
                  <Link to="/customer/property-details">
                    <img
                      src={publicUrl + "assets/img/product-3/2.jpg"}
                      alt="#"
                    />
                  </Link>
                </td>
                <td>
                  <div className="ltn__my-properties-info">
                    <h6 className="mb-10 go-top">
                      <Link to="/customer/property-details">
                        New Apartment Nice View
                      </Link>
                    </h6>
                    <small>
                      <i className="icon-placeholder" /> Brooklyn, New York,
                      United States
                    </small>
                  </div>
                </td>
                <td>Feb 22, 2022</td>
                <td>
                  <Link to="/customer/property-details">
                    <i className="fa-solid fa-eye"></i> View
                  </Link>
                </td>
                <td>
                  <Link tp="#">
                    <i className="fa-solid fa-trash-can" />
                  </Link>
                </td>
              </tr>
              <tr>
                <td className="ltn__my-properties-img go-top">
                  <Link to="/customer/property-details">
                    <img
                      src={publicUrl + "assets/img/product-3/3.jpg"}
                      alt="#"
                    />
                  </Link>
                </td>
                <td>
                  <div className="ltn__my-properties-info">
                    <h6 className="mb-10 go-top">
                      <Link to="/customer/property-details">
                        New Apartment Nice View
                      </Link>
                    </h6>
                    <small>
                      <i className="icon-placeholder" /> Brooklyn, New York,
                      United States
                    </small>
                  </div>
                </td>
                <td>Feb 22, 2022</td>
                <td>
                  <Link to="/customer/property-details">
                    <i className="fa-solid fa-eye"></i> View
                  </Link>
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
    </Layout>
  );
}
