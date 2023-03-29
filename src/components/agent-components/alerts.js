import React from "react";
import { Link } from "react-router-dom";
import Layout from "./layouts/layout";

export default function Alerts() {
  return (
    <Layout>
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
                  Jenna Williams added the property "Davenham Chestor House" to
                  wishlist
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
                  Jenna Williams added the property "Davenham Chestor House" to
                  wishlist
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
                  Jenna Williams added the property "Davenham Chestor House" to
                  wishlist
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
    </Layout>
  );
}
