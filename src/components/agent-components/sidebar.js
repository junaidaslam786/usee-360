import React from "react";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom";

export default function Sidebar() {
  const history = useHistory();

  function handleClick() {
    localStorage.removeItem("agentToken");
    history.push("/agent/login");
  }

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
      <NavLink to="/agent/add-property">
        Add Property
        <i className="fa-solid fa-map-location-dot" />
      </NavLink>
      <NavLink to="/agent/appointments">
        Appointments
        <i className="fa-solid fa-clock" />
      </NavLink>
      <NavLink to="/agent/add-appointment">
        Add Appointments
        <i className="fa-solid fa-calendar-check"></i>
      </NavLink>
      <NavLink to="/agent/alerts">
        Alerts
        <span className="position-relative">
          <i className="fa-solid fa-bell" />
          <span class="badge rounded-pill bg-danger alert-badge">2</span>
        </span>
      </NavLink>
      <a onClick={handleClick} href="#">
        Logout
        <i className="fas fa-sign-out-alt" />
      </a>
    </div>
  );
}
