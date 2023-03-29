import React from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

export default function Sidebar() {
  const history = useHistory();

  function handleClick() {
    sessionStorage.removeItem("agentToken");
    history.push("/agent/login");
  }

  return (
    <div className="nav">
      <Link to="/agent/dashboard">
        Dashboard
        <i className="fas fa-home" />
      </Link>
      <Link to="/agent/account-details">
        Account Details
        <i className="fas fa-user" />
      </Link>
      <Link to="/agent/properties">
        My Properties
        <i className="fa-solid fa-list" />
      </Link>
      <Link to="/agent/add-property">
        Add Property
        <i className="fa-solid fa-map-location-dot" />
      </Link>
      <Link to="/agent/appointments">
        Appointments
        <i className="fa-solid fa-clock" />
      </Link>
      <Link to="/agent/add-appointment">
        Add Appointments
        <i className="fa-solid fa-calendar-check"></i>
      </Link>
      <Link to="/agent/alerts">
        Alerts
        <i className="fa-solid fa-bell" />
      </Link>
      <a onClick={handleClick} href="#">
        Logout
        <i className="fas fa-sign-out-alt" />
      </a>
    </div>
  );
}
