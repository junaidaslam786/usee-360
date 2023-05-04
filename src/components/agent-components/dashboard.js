import React, { useState, useEffect } from "react";
import Layout from "./layouts/layout";
import UpcomingAppointments from "./appointments/upcoming";
import CompletedAppointments from "./appointments/completed";
import SelectorDate from "./DateSelector/SelectorDate";
import { getUserDetailsFromJwt } from "../../utils";
import Appointments from "./appointments";

export default function Dashboard() {
    const userDetail = getUserDetailsFromJwt();

    return (
        <Layout>
            <div className="ltn__comment-area mb-50">
            <div className="ltn-author-introducing clearfix">
              <div className="author-img">
                <img
                  src={`${process.env.REACT_APP_API_URL}/${userDetail.profileImage}`}
                  alt="Author Image"
                />
              </div>
              <div className="author-info">
                <h6>{process.env.REACT_APP_AGENT_ENTITY_LABEL}</h6>
                <h2>{userDetail.name}</h2>
                <div className="footer-address">
                  <ul>
                    <li>
                      <div className="footer-address-icon">
                        <i className="icon-call" />
                      </div>
                      <div className="footer-address-info">
                        <p>
                          <a href="#">{userDetail.phoneNumber}</a>
                        </p>
                      </div>
                    </li>
                    <li>
                      <div className="footer-address-icon">
                        <i className="icon-mail" />
                      </div>
                      <div className="footer-address-info">
                        <p>
                          <a href="#">{userDetail.email}</a>
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            </div>
            <SelectorDate />
            <div className="ltn__myaccount-tab-content-inner">
                <div className="ltn__my-properties-table table-responsive">
                <ul
                  class="nav nav-pills pb-2"
                  id="pills-tab"
                  role="tablist"
                  style={{ borderBottom: "1px solid #e5eaee", margin: "0 10px" }}
                >
                  <li class="nav-item" role="presentation">
                    <button
                      class="nav-link active customColor"
                      id="pills-upcoming-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-upcoming"
                      type="button"
                      role="tab"
                      aria-controls="pills-upcoming"
                      aria-selected="true"
                    >
                      Upcoming
                    </button>
                  </li>
                </ul>
                <div class="tab-content" id="pills-tabContent">
                  <div
                    class="tab-pane fade show active"
                    id="pills-upcoming"
                    role="tabpanel"
                    aria-labelledby="pills-upcoming-tab"
                  >
                    <UpcomingAppointments />
                  </div>
                </div>
              </div>
            </div>
        </Layout>
    );
}
