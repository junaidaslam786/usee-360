import React from "react";
import Layout from "./layouts/layout";
import { getUserDetailsFromJwt } from "../../utils";
import { USER_TYPE } from "../../constants";
import DashboardFilter from "../global-components/dashboard/dashboard-filter";

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
            <h6>Customer</h6>
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
        <DashboardFilter type={ USER_TYPE.CUSTOMER }/>
      </div>
    </Layout>
  );
}
