import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { AGENT_TYPE } from "../../constants";

export default function Sidebar() {
  const [count, setCount] = useState();
  const [agentType, setAgentType] = useState(AGENT_TYPE.AGENT);
  const history = useHistory();
  const token = JSON.parse(localStorage.getItem("agentToken"));

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

  const getUser = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/user/profile`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const jsonData = await response.json();
    setAgentType(jsonData.agent.agentType);
  };

  useEffect(() => {
    const fetchAlertCount = async () => {
      await loadAlertCount();
    };

    const fetchUserDetails = async () => {
      await getUser();
    };

    fetchAlertCount();
    fetchUserDetails();
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
        agentType === AGENT_TYPE.AGENT && (
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
        agentType === AGENT_TYPE.AGENT && (
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
        <i class="fa-sharp fa-solid fa-check-to-slot"/>
      </NavLink>
      <a onClick={handleClick} href="#">
        Logout
        <i className="fas fa-sign-out-alt" />
      </a>
    </div>
  );
}
