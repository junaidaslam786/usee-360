import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { AGENT_TYPE } from "../../constants";
import { getUserDetailsFromJwt } from "../../utils";

export default function Sidebar() {
  const [count, setCount] = useState();
  const history = useHistory();
  const token = JSON.parse(localStorage.getItem("agentToken"));
  const userDetail = getUserDetailsFromJwt();

  function handleClick() {
    localStorage.removeItem("agentToken");
    history.push("/agent/login");
  }

  const loadAlertCount = async () => {
    let response = await fetch(
      `${process.env.REACT_APP_API_URL}/agent/alert/unread-count`,
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
      setCount(response);
    }
  };

  useEffect(() => {
    const fetchAlertCount = async () => {
      await loadAlertCount();
    };

    fetchAlertCount();
  }, []);

  return (
    <div className="nav">
      <NavLink to="/agent/dashboard">
        Dashboard
        <i className="fas fa-home" />
      </NavLink>
      <NavLink to="/agent/account-details">
        Account Details
        <i className="fas fa-user" />
      </NavLink>
      <NavLink to="/agent/properties">
        My Properties
        <i className="fa-solid fa-list" />
      </NavLink>
      {
        userDetail?.agent && (
          <NavLink to="/agent/add-property">
            Add Property
            <i className="fa-solid fa-map-location-dot" />
          </NavLink>
        )
      }
      
      <NavLink to="/agent/appointments">
        Appointments
        <i className="fa-solid fa-clock" />
      </NavLink>
      {
        userDetail?.agent && (
          <NavLink to="/agent/add-appointment">
            Add Appointments
            <i className="fa-solid fa-calendar-check"></i>
          </NavLink>
        )
      }
      
      <NavLink to="/agent/alerts">
        Alerts
        <span className="position-relative">
          <i className="fa-solid fa-bell" />
          <span className="badge rounded-pill bg-danger alert-badge">{count}</span>
        </span>
      </NavLink>
      <NavLink to="/agent/calendar">
        My Calendar
          <i className="fa-solid fa-calendar" />
      </NavLink>
      <NavLink to="/agent/my-availability">
        My Availability
        <i className="fa-sharp fa-solid fa-check-to-slot"/>
      </NavLink>
      <a onClick={handleClick} href="#">
        Logout
        <i className="fas fa-sign-out-alt" />
      </a>
    </div>
  );
}
