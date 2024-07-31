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
import Modal from "react-modal";


export default function Sidebar({ type, responseHandler }) {
  const history = useHistory();
  const [count, setCount] = useStateIfMounted();
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const userDetail = getUserDetailsFromJwt();

  const handleDeleteModalOpen = () => {
    setConfirmDeleteModal(true);
  };

  const handleDeleteModalCancel = () => {
    setConfirmDeleteModal(false); // Close the modal
  };

  const handleClick = () => {
    removeLoginToken();
    setConfirmDeleteModal(false);
    responseHandler("Logged out successfully", true);
    history.push(`/${type}/login`);
  };

  useEffect(() => {
    const fetchAlertCount = async () => {
      const response = await AlertService.unReadCount();
      console.log(response);
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

  // useEffect(() => {
  //   const fetchAlertCount = async () => {
  //     let response;
  //     if (userDetail.userType === USER_TYPE.AGENT) {
  //       response = await AlertService.unReadCount();
  //     } else if (userDetail.userType === USER_TYPE.CUSTOMER) {
  //       response = await CustomerAlertService.unReadCount();
  //     } else {
  //       return; // or handle unexpected user type
  //     }

  //     if (response?.error && response?.message) {
  //       responseHandler(response.message);
  //       setTimeout(() => {
  //         handleClick();
  //       }, 2000);
  //     } else {
  //       setCount(response);
  //     }
  //   };

  //   fetchAlertCount();
  // }, [userDetail.userType]); 
  // useEffect(() => {
  //   const fetchAlertCount = async () => {
  //     let response;
      
  //     // Determine which alert service to use based on the user type
  //     if (userDetail.userType === USER_TYPE.AGENT) {
  //       response = await AlertService.unReadCount();
  //     } else if (userDetail.userType === USER_TYPE.CUSTOMER) {
  //       response = await CustomerAlertService.unReadCount();
  //     } else {
  //       console.log("Unexpected user type:", userDetail.userType);
  //       return; // Exit if user type is not recognized
  //     }
  
  //     // Handle response
  //     if (response?.error && response?.message) {
  //       responseHandler(response.message);
  //       // Consider removing automatic logout on error unless it's specifically related to auth issues
  //       // setTimeout(() => {
  //       //   handleClick();
  //       // }, 2000);
  //     } else {
  //       setCount(response); // Assuming response directly contains the count, adjust if it's nested within the response object
  //     }
  //   };
  
  //   fetchAlertCount();
  // }, [userDetail.userType]); // Re-fetch alert count when user type changes
  

  const isAgent = userDetail?.agent?.agentType === AGENT_TYPE.AGENT;

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
      {isAgent && (
        <>
          <NavLink to={`/${type}/payment`}>
            Payments & Wallet
            <i className="fa-solid fa-credit-card"></i>
          </NavLink>
          <NavLink to={`/${type}/subscription`}>
            Subscription
            <i className="fa-solid fa-file"></i>
          </NavLink>
          <NavLink to={`/${type}/analytics-page`}>
            Analytics & Reports
            <i className="fa-solid fa-bar-chart"></i>
          </NavLink>
        </>
      )}

      {type === USER_TYPE.CUSTOMER && (
        <NavLink to="/customer/alerts">
          Alerts
          <span className="position-relative">
            <i className="fa-solid fa-bell" />
            <span className="badge rounded-pill bg-danger alert-badge">
              {count}
            </span>
          </span>
        </NavLink>
      )}
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
      <a onClick={handleDeleteModalOpen} href="#">
        Logout
        <i className="fas fa-sign-out-alt" />
      </a>
      <Modal
        isOpen={confirmDeleteModal}
        onRequestClose={() => setConfirmDeleteModal(false)}
        className="MyModal Cancelled"
        overlayClassName="MyModalOverlay"
        ariaHideApp={false}
      >
        <h2>Confirmation</h2>
        <p>Are you sure you want to logout?</p>
        <div className="ButtonContainer">
          <button
            className="btn theme-btn-1 modal-btn-custom"
            onClick={handleClick}
          >
            Yes
          </button>
          <button
            className="btn theme-btn-2 modal-btn-custom"
            onClick={handleDeleteModalCancel}
          >
            No
          </button>
        </div>
      </Modal>
    </div>
  );
}
