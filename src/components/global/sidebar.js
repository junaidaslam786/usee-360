import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { getUserDetailsFromJwt, removeLoginToken } from "../../utils";
import {
  AGENT_TYPE,
  AGENT_USER_ACCESS_TYPE_VALUE,
  USER_TYPE,
} from "../../constants";
import AlertService from "../../services/agent/alert";
import { useStateIfMounted } from "use-state-if-mounted";

export default function Sidebar({ type, responseHandler }) {
  const history = useHistory();
  const [count, setCount] = useStateIfMounted();
  const userDetail = getUserDetailsFromJwt();

  const handleClick = () => {
    removeLoginToken();
    history.push(`/${type}/login`);
  };

  useEffect(() => {
    const fetchAlertCount = async () => {
      const response = await AlertService.unReadCount();
      if (response?.error && response?.message) {
        responseHandler(response.message);
        setTimeout(() => {
          handleClick();
        }, 2000);
        return;
      }

      setCount(response);
    };

    fetchAlertCount();
  }, []);

  return (
    <div className="nav">
      <NavLink to={`/${type}/dashboard`}>
        Dashboard
        <i className="fas fa-home" />
      </NavLink>

      <NavLink to={`/${type}/profile`}>
        My Profile
        <i className="fas fa-user" />
      </NavLink>

      <NavLink to={`/${type}/appointments`}>
        Appointments
        <i className="fa-solid fa-clock" />
      </NavLink>

      <NavLink to={`/${type}/add-appointment`}>
        Add Appointments
        <i className="fa-solid fa-calendar-check"></i>
      </NavLink>

      <NavLink to={`/${type}/payment`}>
        Payments
        <i className="fa-solid fa-credit-card"></i>
      </NavLink>

      <NavLink to={`/${type}/analytics-page`}>
        Analytics
        <i className="fa-solid fa-analytics"></i>
      </NavLink>

      {type === USER_TYPE.AGENT ? (
        <React.Fragment>
          <NavLink
            to="/agent/properties"
            isActive={(match, location) => {
              const { pathname } = location;
              return (
                pathname === "/agent/properties" ||
                pathname.includes("/agent/property-details")
              );
            }}
          >
            My Properties
            <i className="fa-solid fa-list" />
          </NavLink>

          {(userDetail?.agent?.agentType === AGENT_TYPE.AGENT ||
            userDetail?.agentAccessLevels?.find(
              (level) =>
                level.accessLevel === AGENT_USER_ACCESS_TYPE_VALUE.ADD_PROPERTY
            )) && (
            <NavLink
              to="/agent/add-property"
              isActive={(match, location) => {
                const { pathname } = location;
                return (
                  pathname === "/agent/add-property" ||
                  pathname.includes("/agent/edit-property")
                );
              }}
            >
              Add Property
              <i className="fa-solid fa-map-location-dot" />
            </NavLink>
          )}

          <NavLink to="/agent/alerts">
            Alerts
            <span className="position-relative">
              <i className="fa-solid fa-bell" />
              <span className="badge rounded-pill bg-danger alert-badge">
                {count}
              </span>
            </span>
          </NavLink>

          {userDetail?.agent?.agentType !== AGENT_TYPE.STAFF && (
            <NavLink to="/agent/users">
              Users
              <i className="fas fa-users" />
            </NavLink>
          )}

          <NavLink to="/agent/availability">
            My Availability
            <i className="fa-sharp fa-solid fa-check-to-slot" />
          </NavLink>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <NavLink
            to={`/customer/wishlist`}
            isActive={(match, location) => {
              const { pathname } = location;
              return (
                pathname === "/customer/wishlist" ||
                pathname.includes("/customer/property-details")
              );
            }}
          >
            My Wishlist
            <i className="fa-solid fa-list" />
          </NavLink>
        </React.Fragment>
      )}

      <NavLink to={`/${type}/calendar`}>
        My Calendar
        <i className="fa-solid fa-calendar" />
      </NavLink>

      <a onClick={handleClick} href="#">
        Logout
        <i className="fas fa-sign-out-alt" />
      </a>
    </div>
  );
}
