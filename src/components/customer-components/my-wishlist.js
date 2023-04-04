import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import Layout from "./layouts/layout";

export default function MyWishlist() {
  const [list, setList] = useState([]);

  const token = JSON.parse(sessionStorage.getItem("customerToken"));
  const loadAllList = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/customer/wishlist/list`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setList(response.data);
      });
  };

  const removeFromWishlist = async (id) => {
    await axios
      .delete(`${process.env.REACT_APP_API_URL}/customer/wishlist/remove/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        loadAllList();
      });
  };

  useEffect(() => {
    loadAllList();
  }, []);

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
                <th scope="col">Delete</th>
              </tr>
            </thead>
            <tbody>
              {list && list.length === 0 ? (
                <tr>
                  <td className="no-data">No Data!</td>
                </tr>
              ) : (
                list.map((element, i) => (
                  <tr key={i}>
                    <td className="ltn__my-properties-img go-top">
                      <img
                        src={`${process.env.REACT_APP_API_URL}/${element.product.featuredImage}`}
                        alt="#"
                      />
                    </td>
                    <td>
                      <div className="ltn__my-properties-info">
                        <h6 className="mb-10 go-top">
                          <Link
                            to={`/customer/property-details/${element.product.id}`}
                          >
                            {element.product.title}
                          </Link>
                        </h6>
                        <small>
                          <i className="icon-placeholder" />{" "}
                          {element.product.address}
                        </small>
                      </div>
                    </td>
                    <td>
                      {moment(element.product.createdAt).format("MMMM d, YYYY")}
                    </td>
                    <td>
                      <button
                        onClick={() => removeFromWishlist(element.product.id)}
                      >
                        <i className="fa-solid fa-trash-can" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {/* <div className="ltn__pagination-area text-center">
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
          </div> */}
        </div>
      </div>
    </Layout>
  );
}
