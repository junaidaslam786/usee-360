import React, { useContext, useEffect } from "react";
import DashboardFilter from "./dashboard-filter";
import {
  getUserDetailsFromJwt,
  getUserDetailsFromJwt2,
  removeLoginToken,
} from "../../../utils";
import { AGENT_TYPE, AGENT_TYPE_LABEL, USER_TYPE } from "../../../constants";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../auth/AuthContext";

export default function Dashboard({ type }) {
  const history = useHistory();
  // const userDetail = getUserDetailsFromJwt();
  // console.log("userDetail", userDetail);
  const { isAuthenticated, userDetails, role, loading } =
    useContext(AuthContext);
  console.log("userDetails", userDetails);
  console.log("role", role);
  console.log("isAuthenticated", isAuthenticated);

  // useEffect(() => {
  //   if (!userDetail) {
  //     removeLoginToken();
  //     history.push(`/${type}/login`);
  //   }
  // }, [userDetail]);

  useEffect(() => {
    if (loading) return; // Exit early while loading is true

    // Redirect logic
    if (!isAuthenticated) {
      history.push(`/${type}/login`);
    } else if (type === USER_TYPE.CUSTOMER && role !== USER_TYPE.CUSTOMER) {
      history.push("/customer/login");
    } else if (type === USER_TYPE.AGENT && role !== USER_TYPE.AGENT) {
      history.push("/agent/login");
    }
    // Since we're using `type` from props, ensure it aligns with `role` stored in context
  }, [isAuthenticated, role, history, type, loading]); // Include `loading` in dependency array

  if (loading) {
    return <div>Loading...</div>; // Or any other loading indicator
  }

  if (!userDetails) {
    return null; // Or some loading indicator or redirect
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
