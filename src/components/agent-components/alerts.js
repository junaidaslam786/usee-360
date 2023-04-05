import React, { useState, useEffect } from "react";
import Layout from "./layouts/layout";
import moment from "moment";

export default function Alerts() {
  const [list, setList] = useState([]);
  const token = JSON.parse(localStorage.getItem("agentToken"));

  const loadAllList = async () => {
    let response = await fetch(
      `${process.env.REACT_APP_API_URL}/agent/alert/list`,
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
      setList(response);
    }
  };

  useEffect(() => {
    const fetchAllAlerts = async () => {
      await loadAllList();
    };

    fetchAllAlerts();
  }, []);

  return (
    <Layout>
      <div className="widget ltn__popular-post-widget ltn__twitter-post-widget">
        <ul>
          {list && list.length === 0 ? (
            <li>No Data!</li>
          ) : (
            list.map((element, i) => (
              <li key={element.id}>
                <div className="popular-post-widget-item clearfix">
                  <div className="popular-post-widget-img">
                    <i className="fa-solid fa-bell" />
                  </div>
                  <div className="popular-post-widget-brief">
                    <p dangerouslySetInnerHTML={{ __html: element.text }}></p>
                    <div className="ltn__blog-meta">
                      <ul>
                        <li className="ltn__blog-date">
                          <i className="far fa-calendar-alt" />
                          {moment.utc(element.createdAt).format("D/MM/YYYY")}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </Layout>
  );
}
