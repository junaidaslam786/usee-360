import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ViewAppointment from "./appointments/view-appointment";
import { convertGmtToTime } from "../../utils";
import AppointmentService from "../../services/customer/appointment";
import AvailabilityService from "../../services/agent/availability";
import { useStateIfMounted } from "use-state-if-mounted";

export default function Calendar() {
  const [userAppointments, setUserAppointments] = useStateIfMounted([]);
  const [appointmentView, setAppointmentView] = useStateIfMounted(null);
  const openViewModal = useRef(null);

  const loadAllList = async () => {
    const response = await AppointmentService.list({ size: 100 });
    if (response?.data) {
      const agentTimeSlots = await AvailabilityService.listSlots({ all: true });
      let appointmentSlot;
      const calendarData = response.data.map((appointment) => {
        appointmentSlot = agentTimeSlots.find(
          (slot) =>
            slot.fromTime ===
            convertGmtToTime(appointment.appointmentTimeGmt, "HH:mm:ss")
        );
        return {
          id: appointment?.id,
          start: `${appointment.appointmentDate}T${
            appointmentSlot?.fromTime
              ? appointmentSlot.fromTime
              : convertGmtToTime(appointment.appointmentTimeGmt)
          }`,
          end: `${appointment.appointmentDate}T${
            appointmentSlot?.toTime
              ? appointmentSlot.toTime
              : convertGmtToTime(appointment.appointmentTimeGmt)
          }`,
        };
      });

      setUserAppointments(calendarData);
    }
  };

  useEffect(() => {
    const fetchAllAppointments = async () => {
      await loadAllList();
    };

    fetchAllAppointments();
  }, []);

  const handleEventClick = (info) => {
    handleViewAppointmentButtonClick(info.event.id);
  };

  const handleViewAppointmentButtonClick = async (id) => {
    if (id) {
      const response = await AppointmentService.detail(id);
      if (response?.id) {
        setAppointmentView(response);
        openViewModal.current.click();
      }
    }
  };

  return (
    <React.Fragment>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth, timeGridWeek, timeGridDay",
        }}
        initialView="timeGridDay"
        events={userAppointments}
        eventColor={"#00c800"}
        eventContent={(eventInfo) => {
          const eventData = eventInfo.event;
          const startTime = eventData.start?.toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
          });
          const endTime = eventData.end?.toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
          });
          return (
            <div>
              <p className="text_dark_blue">
                {startTime}-{endTime}
              </p>
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
      <ViewAppointment
        target="appointment-details"
        appointment={appointmentView}
      />
    </React.Fragment>
  );
}
