import React, { useState, useEffect, useRef } from "react";
import Layout from "./layouts/layout";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Link } from "react-router-dom";
import moment from "moment";

export default function CustomerCalendar() {
  const publicUrl = `${process.env.PUBLIC_URL}/`;
  const [userAppointments, setUserAppointments] = useState([]);
  const [appointmentView, setAppointmentView] = useState({});
  const openViewModal = useRef(null);

  const token = JSON.parse(localStorage.getItem("customerToken"));

  const loadAllList = async () => {
    let response = await fetch(
      `${process.env.REACT_APP_API_URL}/customer/appointment/list?page=1&size=1000`,
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
      if(response.data) {
        const calendarData = response.data.map(appointment => {
          return { 
            id: appointment?.id,
            start: `${appointment.appointmentDate}T${appointment.agentTimeSlot?.fromTime}`,
            end: `${appointment.appointmentDate}T${appointment.agentTimeSlot?.toTime}`,
          }
        })
        setUserAppointments(calendarData);
      }
    }
  };

  const loadAppointmentFields = async (appointmentId) => {
    return fetch(
      `${process.env.REACT_APP_API_URL}/customer/appointment/${appointmentId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((data) => data.json());
  };

  useEffect(() => {
    const fetchAllAppointments = async () => {
      await loadAllList();
    };

    fetchAllAppointments();
  }, []);

  const handleEventClick = (info) => {
    console.log(info.event.id);
    handleViewAppointmentButtonClick(info.event.id)
  };

  const handleViewAppointmentButtonClick = async (id) => {
    if (id) {
      const response = await loadAppointmentFields(id);
      let appointmentAgentName = `${response.agentUser.firstName} ${response.agentUser.lastName}`;
      let appointmentAgentPic = `${process.env.REACT_APP_API_URL}/${response.agentUser.profileImage}`;
      let appointmentAgentEmail = response.agentUser.email;
      let appointmentAgentPhone = response.agentUser.phoneNumber;
      if (response.allotedAgent !== response.agentId && response?.allotedAgentUser) {
        appointmentAgentName = `${response.allotedAgentUser.firstName} ${response.allotedAgentUser.lastName}`;
        appointmentAgentPic = `${process.env.REACT_APP_API_URL}/${response.allotedAgentUser.profileImage}`;
        appointmentAgentEmail = response.allotedAgentUser.email;
        appointmentAgentPhone = response.allotedAgentUser.phoneNumber;
      }

      if (response) {
        setAppointmentView({
          id: response.id,
          agentId: response.agentId,
          allotedAgent: response.allotedAgent,
          date: response.appointmentDate,
          time: response?.agentTimeSlot?.fromTime ? response.agentTimeSlot.fromTime : "",
          customerName: `${response.customerUser.firstName} ${response.customerUser.lastName}`,
          customerPic: `${process.env.REACT_APP_API_URL}/${response.customerUser.profileImage}`,
          agentName: appointmentAgentName,
          agentPic: appointmentAgentPic,
          agentEmail: appointmentAgentEmail,
          agentPhone: appointmentAgentPhone,
          properties: response.products,
        });
        openViewModal.current.click();
      }
    }
  };

  return (
    <Layout>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth, timeGridWeek, timeGridDay'
        }}
        initialView="timeGridDay"
        events={userAppointments}
        eventColor={'#00c800'}
        eventContent={(eventInfo) => {
          const eventData = eventInfo.event;
          const startTime= eventData.start?.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit' });
          const endTime= eventData.end?.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit' });
          return (
            <div>
              <p style={{"color":"#171b2a"}}>{startTime}-{endTime}</p>
            </div>
          );
        }}
        eventClick={handleEventClick}
      />
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
                          <h5 className="p-0 m-0">
                            {
                              appointmentView.allotedAgent !== appointmentView.agentId ? "Supervisor Name" : `${process.env.REACT_APP_AGENT_ENTITY_LABEL} Name`
                            }
                          </h5>
                          <p className="p-0 m-o">
                            {appointmentView?.agentName || "N/A"}
                          </p>
                        </div>
                        <div>
                          <img
                            className="mt-2"
                            src={appointmentView?.agentPic || "N/A"}
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
                                  ? moment(appointmentView.time, "h:mm").format(
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
                            {appointmentView?.agentEmail || "N/A"}
                            <br />
                            <i className="fa-regular fa-address-book"></i>{" "}
                            {appointmentView?.agentPhone || "N/A"}
                          </p>
                        </div>
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
                        {appointmentView?.properties
                          ? appointmentView?.properties.map((element, i) => (
                              <div key={element.id}>
                                <h5 className="p-0 m-0 my-2">
                                  Property: {element.title}
                                </h5>
                                <Link
                                  to={`/customer/property-details/${element.id}`}
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
                        <Link
                          to={{
                            pathname: `/precall/${appointmentView.id}/customer`,
                            state: {
                              appointment: appointmentView,
                            },
                          }}
                        >
                          <button className="py-2" data-bs-dismiss="modal">JOIN CALL</button>
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
