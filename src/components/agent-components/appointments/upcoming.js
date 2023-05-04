import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { getUserDetailsFromJwt } from "../../../utils";

export default function UpcomingAppointments() {
  const [currentPage, setCurrentPage] = useState();
  const [totalPages, setTotalPages] = useState();
  const [list, setList] = useState([]);
  const [appointmentView, setAppointmentView] = useState({});
  const openViewModal = useRef(null);
  const token = JSON.parse(localStorage.getItem("agentToken"));
  const userDetail = getUserDetailsFromJwt();

  const loadAllList = async (page = 1) => {
    let response = await fetch(
      `${process.env.REACT_APP_API_URL}/agent/appointment/list?page=${page}&size=10&type=upcoming`,
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
      setList(response.data);
      setCurrentPage(parseInt(response.page));
      setTotalPages(parseInt(response.totalPage));
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

  const handleViewAppointmentButtonClick = async (id) => {
    if (id) {
      const response = await loadAppointmentFields(id);
      if (response?.id) {
        setAppointmentView({
          id: response.id,
          agentId: response.agentId,
          allotedAgent: response.allotedAgent,
          date: response.appointmentDate,
          time: response?.agentTimeSlot?.fromTime
            ? response.agentTimeSlot.fromTime
            : "",
          customerName: `${response.customerUser.firstName} ${response.customerUser.lastName}`,
          customerEmail: response.customerUser.email,
          customerPhone: response.customerUser.phoneNumber,
          customerPic: `${process.env.REACT_APP_API_URL}/${response.customerUser.profileImage}`,
          agentName: `${response.agentUser.firstName} ${response.agentUser.lastName}`,
          agentPic: `${process.env.REACT_APP_API_URL}/${response.agentUser.profileImage}`,
          supervisorName: response?.allotedAgentUser
            ? `${response.allotedAgentUser.firstName} ${response.allotedAgentUser.lastName}`
            : null,
          properties: response.products,
        });
        openViewModal.current.click();
      }
    }
  };

  useEffect(() => {
    const fetchAllAppointments = async () => {
      await loadAllList();
    };

    fetchAllAppointments();
  }, []);

  return (
    <div>
      <div>
        {
          list && list.length === 0 ? (
            <div>
              <h4 className="no-data">No Data!</h4>
            </div>
          ) : (
            list.map((element, i) => (
              <div key={i} className="tab-data">
                <div className="tabInner-data">
                  <div className="ltn__my-properties-img go-top center">
                    <div>
                      <h1 className="appointment-date mb-1">
                        {moment(element?.appointmentDate).format("D")}
                      </h1>
                      <h3 className="appointment-date mb-0">
                        {moment(element?.appointmentDate).format("MMM")}
                      </h3>
                    </div>
                  </div>
                  <div>
                    <div className="ltn__my-properties-info appointment-info">
                      <h6 className="mb-10 go-top">
                        {element?.customerUser?.firstName}{" "}
                        {element?.customerUser?.lastName}
                      </h6>
                      <small>
                        <i className="icon-clock" />{" "}
                        {element?.agentTimeSlot?.fromTime
                          ? moment(
                              element.agentTimeSlot.fromTime,
                              "hh:mm:ss"
                            ).format("HH:mm")
                          : "-"}
                      </small>
                    </div>
                  </div>
                </div>
                <div className="tabInner-data">
                  <div>
                    <button
                      className="view"
                      onClick={() => handleViewAppointmentButtonClick(element.id)}
                    >
                      <i className="fa-solid fa-eye" /> View
                    </button>
                  </div>
                  <div>
                    {element.allotedAgent === userDetail.id ? (
                      <Link
                        to={{
                          pathname: `/precall/${element.id}/agent`,
                        }}
                      >
                        <button className="joinCall">JOIN CALL</button>
                      </Link>
                    ) : (
                      "Assigned to supervisor"
                    )}
                  </div>
                </div>
              </div>
            ))
          )
        }

        {
          list && list.length > 0 && (
            <div className="ltn__pagination-area text-center">
              <div className="ltn__pagination">
                <ul>
                  <li>
                    <Link
                      to="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage !== 1) {
                          loadAllList(currentPage - 1);
                        }
                      }}
                    >
                      <i className="fas fa-angle-double-left" />
                    </Link>
                  </li>
                  {Array.from(Array(totalPages), (e, i) => {
                    return (
                      <li
                        key={i}
                        className={currentPage == i + 1 ? "active" : null}
                      >
                        <Link
                          to="#"
                          onClick={(e) => {
                            e.preventDefault();
                            loadAllList(i + 1);
                          }}
                        >
                          {i + 1}
                        </Link>
                      </li>
                    );
                  })}
                  <li>
                    <Link
                      to="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage !== totalPages) {
                          loadAllList(currentPage + 1);
                        }
                      }}
                    >
                      <i className="fas fa-angle-double-right" />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
        )}
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
                          <h5 className="p-0 m-0">Customer Name</h5>
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
                                  ? moment(appointmentView.date).format(
                                      "D/MM/YYYY"
                                    )
                                  : "-"}
                              </p>
                            </div>
                            <div className="col">
                              <p>
                                <i className="fa-regular fa-clock"></i>{" "}
                                {appointmentView?.time
                                  ? moment(
                                      appointmentView.time,
                                      "hh:mm:ss"
                                    ).format("HH:mm")
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
                            {appointmentView.allotedAgent !==
                            appointmentView.agentId
                              ? "Supervisor Name"
                              : "Agent Name"}
                          </h5>
                          <p className="p-0 m-o">
                            {appointmentView.supervisorName
                              ? appointmentView.supervisorName
                              : appointmentView?.agentName || "N/A"}
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
    </div>
  );
}
