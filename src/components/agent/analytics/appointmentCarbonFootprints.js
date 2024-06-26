import React, { useEffect, useState } from "react";
import AgentAnalyticsService from "../../../services/agent/analytics";
import "./agentReports.css";

const AppointmentCarbonFootprint = () => {
  const [appointmentCarbonData, setAppointmentCarbonData] = useState([]);

  const fetchAppointmentCarbonData = async () => {
    const response = await AgentAnalyticsService.appointmentCarbonData();
    if (response && response.data.rows) {
      const formattedData = response.data.rows.map((appointment) => ({
        id: appointment.id,
        productName: appointment.products[0]?.title || "N/A",
        agentName: `${appointment.agentUser.firstName} ${appointment.agentUser.lastName}`,
        customerName: `${appointment.customerUser.firstName} ${appointment.customerUser.lastName}`,
        callTime: `${appointment.agentTimeSlot.fromTime} - ${appointment.agentTimeSlot.toTime}`,
        co2Details: appointment.co2Details?.totalCo2SavedText || "N/A",
      }));
      setAppointmentCarbonData(formattedData);
    }
  };

  useEffect(() => {
    fetchAppointmentCarbonData();
  }, []);

  return (
    <div style={{ width: "100%", padding: "0.5rem" }}>
      {/* <div className="agent-report-card"> */}
        {/* <h2 className="agent-report-subtitle">Appointment Carbon Footprints</h2> */}
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          <table className="agent-report-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Agent Name</th>
                <th>Customer Name</th>
                <th>Call Time</th>
                <th>CO2 Details</th>
              </tr>
            </thead>
            <tbody>
              {appointmentCarbonData.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.productName}</td>
                  <td>{appointment.agentName}</td>
                  <td>{appointment.customerName}</td>
                  <td>{appointment.callTime}</td>
                  <td>{appointment.co2Details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    // </div>
  );
};

export default AppointmentCarbonFootprint;
