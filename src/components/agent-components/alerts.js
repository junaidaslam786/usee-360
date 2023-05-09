import React, { useState, useEffect, useRef } from "react";
import Layout from "./layouts/layout";
import { Link, useHistory } from "react-router-dom";
import moment from "moment";
import { USER_ALERT_MODE, USER_ALERT_TYPE, DEFAULT_CURRENCY } from "../../constants";
import { getUserDetailsFromJwt } from "../../utils";

export default function Alerts() {
  const [list, setList] = useState([]);
  const token = JSON.parse(localStorage.getItem("agentToken"));
  const [appointmentView, setAppointmentView] = useState({});
  const [offerView, setOfferView] = useState({});
  const openViewModal = useRef(null);
  const openOfferModal = useRef(null);
  const userDetail = getUserDetailsFromJwt();
  const history = useHistory();

  const loadAllList = async () => {
    let response = await fetch(
      `${process.env.REACT_APP_API_URL}/agent/alert/list`,
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
      setList(response);
    }
  };

  const loadAppointmentFields = async (appointmentId) => {
    return fetch(
      `${process.env.REACT_APP_API_URL}/agent/appointment/${appointmentId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((data) => data.json());
  };

  const loadOfferFields = async (offerId) => {
    return fetch(
      `${process.env.REACT_APP_API_URL}/property/offer/${offerId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((data) => data.json());
  };

  const formatAlertText = (alert) => {
    let text = "";
    const customerName = `<b>${alert.user.firstName} ${alert.user.lastName}</b>`;
    const productTitle = `<b>"${alert.product.title}"</b>`;
  
    switch(alert.alertMode) {
      case USER_ALERT_MODE.WISHLIST: 
        text = `${customerName} removed the property ${productTitle} from wishlist`;
        if (alert.alertType == USER_ALERT_TYPE.WISHLIST_ADDED) {
          text = `${customerName} added the property ${productTitle} to wishlist`;
        }
        
        break;
      case USER_ALERT_MODE.INTEREST: 
        text = `${customerName} is interested in property ${productTitle}`;
        if (alert.alertType == USER_ALERT_TYPE.NOT_INTERESTED) {
          text = `${customerName} is not interested in property ${productTitle}`;
        }

        break;
      case USER_ALERT_MODE.OFFER: 
        text = `${customerName} made an offer to the property ${productTitle}`;

        break;
      case USER_ALERT_MODE.APPOINTMENT: 
        text = `${customerName} made an appointment for the property ${productTitle}`;

        break;
      case USER_ALERT_MODE.SNAGLIST: 
        text = `${customerName} has updated the snaglist for the property ${productTitle}`;
        if (alert.alertType == USER_ALERT_TYPE.SNAGLIST_APPROVED) {
          text = `${customerName} has approved the snaglist for the property ${productTitle}`;
        }
        
        break;
      default:
        break;
    }
    
    return <p onClick={() => handleAlertClick(alert)} dangerouslySetInnerHTML={{ __html: text }} />;
  }

  const handleAlertClick = async (alert) => {
    if (alert.alertMode === USER_ALERT_MODE.OFFER) {
      await handleViewOfferButtonClick(alert.keyId);
    }

    if (alert.alertMode === USER_ALERT_MODE.APPOINTMENT) {
      await handleViewAppointmentButtonClick(alert.keyId);
    }

    if (alert.alertMode === USER_ALERT_MODE.SNAGLIST) {
      history.push(`/agent/property-details/${alert.productId}`);
    }
  }

  const handleViewOfferButtonClick = async (id) => {
    if (id) {
      const response = await loadOfferFields(id);
      if (response?.id) {
        setOfferView({
          id: response.id,
          productId: response.productId,
          amount: response.amount,
          notes: response.notes,
        });
        openOfferModal.current.click();
      }
    }
  };

  const handleViewAppointmentButtonClick = async (id) => {
    if (id) {
      const response = await loadAppointmentFields(id);
      if (response?.id) {
        setAppointmentView({
          id: response.id,
          agentId: response.agentId,
          allotedAgent: response.allotedAgent,
          date: response.appointmentDate,
          time: response?.agentTimeSlot?.fromTime ? response.agentTimeSlot.fromTime : "",
          customerName: `${response.customerUser.firstName} ${response.customerUser.lastName}`,
          customerEmail: response.customerUser.email,
          customerPhone: response.customerUser.phoneNumber,
          customerPic: `${process.env.REACT_APP_API_URL}/${response.customerUser.profileImage}`,
          agentName: `${response.agentUser.firstName} ${response.agentUser.lastName}`,
          agentPic: `${process.env.REACT_APP_API_URL}/${response.agentUser.profileImage}`,
          supervisorName: response?.allotedAgentUser ? `${response.allotedAgentUser.firstName} ${response.allotedAgentUser.lastName}` : null,
          properties: response.products,
        });
        openViewModal.current.click();
      }
    }
  };

  useEffect(() => {
    const fetchAllAlerts = async () => {
      await loadAllList();
    };

    fetchAllAlerts();
  }, []);

  return (
    <Layout>
      <div className="widget ltn__popular-post-widget ltn__twitter-post-widget">
        <ul>
          {list && list.length === 0 ? (
            <li>No Data!</li>
          ) : (
            list.map((element, i) => (
              <li key={element.id}>
                <div className="popular-post-widget-item clearfix">
                  <div className="popular-post-widget-img">
                    <i className="fa-solid fa-bell" />
                  </div>
                  <div className="popular-post-widget-brief">
                    { formatAlertText(element) }
                    <div className="ltn__blog-meta">
                      <ul>
                        <li className="ltn__blog-date">
                          <i className="far fa-calendar-alt" />
                          {moment.utc(element.createdAt).format("D/MM/YYYY")}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
      <span
        ref={openViewModal}
        data-bs-toggle="modal"
        data-bs-target="#appointment-details"
      ></span>
      <div className="ltn__modal-area ltn__add-to-cart-modal-area">
        <div className="modal fade" id="appointment-details" tabIndex={-1}>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="ltn__quick-view-modal-inner pb-2">
                  <div className="modal-product-item">
                    <div className="row">
                      <div className="col-12">
                        <h4 className="mb-5">
                          Booking # {appointmentView?.id || "N/A"}
                        </h4>
                      </div>
                      <div className="col-lg-6">
                        <div>
                          <h5 className="p-0 m-0">{ process.env.REACT_APP_CUSTOMER_ENTITY_LABEL } Name</h5>
                          <p className="p-0 m-o">
                            {appointmentView?.customerName || "N/A"}
                          </p>
                        </div>
                        <div>
                          <img
                            className="mt-2"
                            src={appointmentView?.customerPic || "N/A"}
                            height="150"
                          />
                        </div>
                        <div>
                          <h5 className="p-0 m-0 mt-2">Booking Time</h5>
                          <div className="row">
                            <div className="col">
                              <p className="p-0 m-o">
                                <i className="fa-regular fa-calendar"></i>{" "}
                                {appointmentView?.date
                                  ? moment(appointmentView.date)
                                      .format("D/MM/YYYY")
                                  : "-"}
                              </p>
                            </div>
                            <div className="col">
                              <p>
                                <i className="fa-regular fa-clock"></i>{" "}
                                {appointmentView?.time
                                  ? moment(appointmentView.time, "hh:mm:ss").format(
                                      "HH:mm"
                                    )
                                  : "-"}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h5 className="p-0 m-0">Contact Info</h5>
                          <p className="p-0 m-o">
                            <i className="fa-regular fa-envelope"></i>{" "}
                            {appointmentView?.customerEmail || "N/A"}
                            <br />
                            <i className="fa-regular fa-address-book"></i>{" "}
                            {appointmentView?.customerPhone || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div>
                          <h5 className="p-0 m-0">
                            {
                              appointmentView.allotedAgent !== appointmentView.agentId ? "Supervisor Name" : `${process.env.REACT_APP_AGENT_ENTITY_LABEL} Name`
                            }
                          </h5>
                          <p className="p-0 m-o">
                            {
                              appointmentView.supervisorName ? appointmentView.supervisorName : (appointmentView?.agentName || "N/A")
                            }
                          </p>
                        </div>
                        <div>
                          <img
                            className="mt-2"
                            src={appointmentView?.agentPic || "N/A"}
                            height="150"
                          />
                        </div>
                        {appointmentView?.properties
                          ? appointmentView?.properties.map((element, i) => (
                              <div key={element.id}>
                                <h5 className="p-0 m-0 my-2">
                                  Property: {element.title}
                                </h5>
                                <Link
                                  to={`/agent/property-details/${element.id}`}
                                  className="close"
                                  data-bs-dismiss="modal"
                                  aria-label="Close"
                                >
                                  <img
                                    className="mt-2"
                                    src={
                                      element?.featuredImage
                                        ? `${process.env.REACT_APP_API_URL}/${element?.featuredImage}`
                                        : ""
                                    }
                                    height="150"
                                  />
                                </Link>
                              </div>
                            ))
                          : ""}
                      </div>
                      <div className="col-lg-12 mt-20">
                        {
                          appointmentView.allotedAgent === userDetail.id ? (
                            <Link
                            to={{
                              pathname: `/precall/${appointmentView.id}/agent`,
                              state: {
                                appointment: appointmentView,
                              },
                            }}
                          >
                            <button className="py-2" data-bs-dismiss="modal">JOIN CALL</button>
                          </Link>
                          ) : (
                            <div className='supervisor-text'>Assigned to supervisor</div>
                          )
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <span
        ref={openOfferModal}
        data-bs-toggle="modal"
        data-bs-target="#offer-details"
      ></span>
      <div className="ltn__modal-area ltn__add-to-cart-modal-area">
        <div className="modal fade" id="offer-details" tabIndex={-1}>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="ltn__quick-view-modal-inner pb-2">
                  <div className="modal-product-item">
                    <div className="row">
                      <div className="col-12">
                        <div className="ltn__my-properties-table table-responsive">
                          <table className="table">
                            <thead>
                              <tr>
                                <th scope="col">Amount</th>
                                <th scope="col">{ process.env.REACT_APP_CUSTOMER_ENTITY_LABEL } comment</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>
                                  {DEFAULT_CURRENCY} { offerView.amount }
                                </td>
                                <td>
                                  { offerView.notes }
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div className="row mt-20">
                      <div className="col-lg-4">
                        <Link to={`/agent/property-details/${offerView?.productId}`}>
                          <button 
                            className="btn theme-btn-1 btn-effect-1 text-uppercase" 
                            data-bs-dismiss="modal"
                          >
                            View Property
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
