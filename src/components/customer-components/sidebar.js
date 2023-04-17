import React from "react";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom";

export default function Sidebar() {
  const history = useHistory();

  function handleClick() {
    localStorage.removeItem("customerToken");
    history.push("/customer/login");
  }

  return (
    <div className="nav">
      <NavLink to="/customer/dashboard">
        Dashboard
        <i className="fas fa-home" />
      </NavLink>
      <NavLink to="/customer/appointments">
        Appointments
        <i className="fa-solid fa-clock" />
      </NavLink>
      <NavLink to="/customer/add-appointment">
        Add Appointments
        <i className="fa-solid fa-calendar-check"></i>
      </NavLink>
      <NavLink to="/customer/wishlist">
        My Wishlist
        <i className="fa-solid fa-list" />
      </NavLink>
      <NavLink to="/customer/profile">
        My Profile
        <i className="fas fa-user" />
      </NavLink>
      <a onClick={handleClick} href="#">
        Logout
        <i className="fas fa-sign-out-alt" />
      </a>
    </div>
  );
}
