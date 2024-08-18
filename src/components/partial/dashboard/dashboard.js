import React, { useEffect, useState } from "react";
import DashboardFilter from "./dashboard-filter";
import {
  checkAgentDetails,
  getUserDetailsFromJwt,
  getUserType,
  removeLoginToken,
} from "../../../utils";

import { AGENT_TYPE, USER_TYPE } from "../../../constants";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

export default function Dashboard({ type }) {
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const details = getUserDetailsFromJwt();
      if (!details) {
        toast.error("Authentication failed. Redirecting to login.");
        history.push(`/${type}/login`);
      } else {
        setUserDetails(details);
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [type, history]);

  useEffect(() => {
    const checkAgentStatus = async () => {
      if (!userDetails) return;

      const userType = getUserType();
      console.log('User Type:', userType);
      console.log('User Details:', userDetails);

      if (userType === USER_TYPE.AGENT && userDetails.agent) {
        try {
          const response = await checkAgentDetails();
          console.log('Agent Details Response:', response);

          if (!response.user.active) {
            toast.info("Super admin will approve your account in 24 hours");
            removeLoginToken();
            history.push(`/${type}/login`);
          }
        } catch (error) {
          console.error("Error checking agent details:", error);
          toast.error("There was a problem checking your account status.");
          removeLoginToken();
          history.push(`/${type}/login`);
        }
      } else {
        if (history.location.pathname !== `/${type}/dashboard`) {
          history.push(`/${type}/dashboard`);
        }
      }
    };

    checkAgentStatus();
  }, [userDetails, type, history]);

  if (isLoading) {
    return <div>Loading...</div>; // Display a loading message while user details are fetched
  }

  if (!userDetails) {
    return <div>Error loading user details.</div>; // Display an error message if userDetails couldn't be fetched
  }

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
                : AGENT_TYPE[userDetails.agentType] ||
                  process.env.REACT_APP_AGENT_ENTITY_LABEL}
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
