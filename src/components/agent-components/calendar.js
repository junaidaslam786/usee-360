import React, { useState, useEffect, useRef } from "react";
import Layout from "./layouts/layout";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ViewAppointment from "./appointments/view-appointment";
import { 
  convertGmtToTime 
} from "../../utils";
import { getLoginToken } from "../../utils";

export default function AgentCalendar() {
  const [userAppointments, setUserAppointments] = useState([]);
  const [appointmentView, setAppointmentView] = useState(null);
  const openViewModal = useRef(null);
  const token = getLoginToken();

  const loadAllList = async () => {
    let response = await fetch(
      `${process.env.REACT_APP_API_URL}/agent/appointment/list?page=1&size=1000`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    response = await response.json();
    if(response?.data) {
      const agentTimeSlots = await loadAgentAvailabilitySlots();
      let appointmentSlot;
      const calendarData = response.data.map(appointment => {
        appointmentSlot = agentTimeSlots.find((slot) => slot.fromTime === convertGmtToTime(appointment.appointmentTimeGmt, "HH:mm:ss"));
        return { 
          id: appointment?.id,
          start: `${appointment.appointmentDate}T${appointmentSlot?.fromTime ? appointmentSlot.fromTime : convertGmtToTime(appointment.appointmentTimeGmt)}`,
          end: `${appointment.appointmentDate}T${appointmentSlot?.toTime ? appointmentSlot.toTime : convertGmtToTime(appointment.appointmentTimeGmt)}`,
        }
      });

      setUserAppointments(calendarData);
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

  const loadAgentAvailabilitySlots = async () => {
    let response = await fetch(
      `${process.env.REACT_APP_API_URL}/agent/availability/list-slots?all=true`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const responseResult = await response.json();
    if (responseResult) {
      return responseResult;
    }
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
      if (response?.id) {
        setAppointmentView(response);
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
              <p className="text_dark_blue"
               >{startTime}-{endTime}</p>
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
      <ViewAppointment target="appointment-details" appointment={appointmentView}/>
    </Layout>
  );
}
