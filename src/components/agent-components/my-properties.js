import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";

export default function MyProperties() {
  const [page, setPage] = useState(1);
  const [list, setList] = useState([]);

  const token = JSON.parse(sessionStorage.getItem("agentToken"));
  const loadAllList = async () => {
    let response = await fetch(
      `${process.env.REACT_APP_API_URL}/property/list?page=${page}&size=10`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    response = await response.json();
    if (response) {
      setList(response.data);
    }
  };

  useEffect(() => {
    loadAllList();
  }, [page]);

  return (
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
            {list && list.length === 0 ? (
              <tr>
                <td className="no-data">No Data!</td>
              </tr>
            ) : (
              list.map((element, i) => (
                <tr key={i}>
                  <td className="ltn__my-properties-img go-top">
                    <Link to="#">
                      <img src={element?.featuredImage} alt="#" />
                    </Link>
                  </td>
                  <td>
                    <div className="ltn__my-properties-info">
                      <h6 className="mb-10 go-top">
                        <Link to="#">{element?.title}</Link>
                      </h6>
                      <small>
                        <i className="icon-placeholder" /> {element?.address}
                      </small>
                    </div>
                  </td>
                  <td>{moment(element?.createdAt).format("MMMM d, YYYY")}</td>
                  <td>
                    <Link to="#">Edit</Link>
                  </td>
                  <td>
                    <Link to="#">
                      <i className="fa-solid fa-trash-can" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
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
