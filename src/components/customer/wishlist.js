import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { formatCreatedAtTimestamp } from "../../utils";
import WishlistService from "../../services/customer/wishlist";
import { useStateIfMounted } from "use-state-if-mounted";

export default function Wishlist(props) {
  const [list, setList] = useStateIfMounted([]);

  const loadAllList = async () => {
    const response = await WishlistService.list();
    if (response?.error && response?.message) {
      props.responseHandler(response.message);
      return;
    }

    setList(response);
  };

  const removeFromWishlist = async (id) => {
    const reponse = await WishlistService.removeFromWishlist(id);
    if (reponse?.error && reponse?.message) {
      props.responseHandler(reponse.message);
      return;
    }

    props.responseHandler("Property removed from wishlist.", true);
    await loadAllList();
  };

  useEffect(() => {
    const fetchAllWishlists = async () => {
      await loadAllList();
    };

    fetchAllWishlists();
  }, []);

  return (
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
                    <div className="myProperties-img">
                      <img
                        src={`${process.env.REACT_APP_API_URL}/${element?.product?.featuredImage}`}
                        alt="#"
                      />
                    </div>
                  </td>
                  <td>
                    <div className="ltn__my-properties-info">
                      <h6 className="mb-10 go-top">
                        <Link
                          to={`/customer/property-details/${element?.product?.id}`}
                        >
                          {element?.product?.title}
                        </Link>
                      </h6>
                      <small>
                        <i className="icon-placeholder" />{" "}
                        {element?.product?.address}
                      </small>
                    </div>
                  </td>
                  <td>
                    {element?.createdAt
                      ? formatCreatedAtTimestamp(
                          element.createdAt,
                          "MMMM D, YYYY"
                        )
                      : "-"}
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
  );
}
