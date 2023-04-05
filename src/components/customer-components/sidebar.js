import React from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

export default function Sidebar() {
  const history = useHistory();

  function handleClick() {
    localStorage.removeItem("customerToken");
    history.push("/customer/login");
  }

  return (
    <div className="nav">
      <Link to="/customer/dashboard">
        Dashboard
        <i className="fas fa-home" />
      </Link>
      <Link to="/customer/appointments">
        Appointments
        <i className="fa-solid fa-clock" />
      </Link>
      <Link to="/customer/wishlist">
        My Wishlist
        <i className="fa-solid fa-list" />
      </Link>
      <Link to="/customer/profile">
        My Profile
        <i className="fas fa-user" />
      </Link>
      <a onClick={handleClick} href="#">
        Logout
        <i className="fas fa-sign-out-alt" />
      </a>
    </div>
  );
}
