import React from "react";
import Layout from "./layouts/layout";
import DashboardFilter from "../global-components/dashboard/dashboard-filter";
import { getUserDetailsFromJwt } from "../../utils";
import { AGENT_TYPE_LABEL, USER_TYPE } from "../../constants";

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
                <h6>{userDetail?.agent?.agentType ? AGENT_TYPE_LABEL[userDetail.agent.agentType] : process.env.REACT_APP_AGENT_ENTITY_LABEL}</h6>
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
            <DashboardFilter type={USER_TYPE.AGENT}/>
        </Layout>
    );
}
