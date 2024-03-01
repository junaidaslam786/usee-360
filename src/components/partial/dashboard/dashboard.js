import React, { useContext, useEffect, useState } from "react";
import DashboardFilter from "./dashboard-filter";
import {
  checkAgentDetails,
  getUserDetailsFromJwt,
  getUserDetailsFromJwt2,
  removeLoginToken,
} from "../../../utils";
import { AGENT_TYPE, AGENT_TYPE_LABEL, USER_TYPE } from "../../../constants";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../auth/AuthContext";
import { toast } from "react-toastify";

export default function Dashboard({ type }) {
  const history = useHistory();
  const userDetails = getUserDetailsFromJwt();
  console.log("usersDetails", userDetails);

  useEffect(() => {
    // Only proceed if userDetails exist
    if (userDetails) {
      // Handle agent-specific logic
      if (userDetails.agent.agentType === "agent") {
        checkAgentDetails()
          .then((response) => {
            if (response.user.active === false) {
              toast("Super admin will approve your account in 24 hours");
              removeLoginToken();
              history.push(`/${type}/login`);
            } else {
              // Directly go to the dashboard if the agent is active
              if (history.location.pathname !== `/${type}/dashboard`) {
                history.push(`/${type}/dashboard`);
              }
            }
          })
          .catch((error) => {
            console.error("Error checking agent details:", error);
            toast.error("There was a problem checking your account status.");
          });
      } else {
        // Non-agent users go directly to the dashboard
        if (history.location.pathname !== `/${type}/dashboard`) {
          history.push(`/${type}/dashboard`);
        }
      }
    } else {
      // If no userDetails, redirect to login
      history.push(`/${type}/login`);
    }
  }, [userDetails, type, history]);

  return (
    <React.Fragment>
      <div className="ltn__comment-area mb-50">
        <div className="ltn-author-introducing clearfix">
          <div className="author-img">
            <img
              src={`${process.env.REACT_APP_API_URL}/${userDetails.profileImage}`}
              alt="Author"
            />
          </div>
          <div className="author-info">
            <h6>
              {type === USER_TYPE.CUSTOMER
                ? process.env.REACT_APP_CUSTOMER_ENTITY_LABEL
                : userDetails &&
                  userDetails?.agent?.agentType !== AGENT_TYPE.AGENT
                ? AGENT_TYPE_LABEL[userDetails.agent.agentType]
                : process.env.REACT_APP_AGENT_ENTITY_LABEL}
            </h6>
            <h2>{userDetails.name}</h2>
            <div className="footer-address">
              <ul>
                <li>
                  <div className="footer-address-icon">
                    <i className="icon-call" />
                  </div>
                  <div className="footer-address-info">
                    <p>
                      <a href={`tel:${userDetails.phoneNumber}`}>
                        {userDetails.phoneNumber}
                      </a>
                    </p>
                  </div>
                </li>
                <li>
                  <div className="footer-address-icon">
                    <i className="icon-mail" />
                  </div>
                  <div className="footer-address-info">
                    <p>
                      <a href={`mailto:${userDetails.email}`}>
                        {userDetails.email}
                      </a>
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <DashboardFilter type={type} />
    </React.Fragment>
  );
}
