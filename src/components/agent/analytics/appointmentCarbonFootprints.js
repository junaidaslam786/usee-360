import React, { useEffect, useState } from "react";
import AgentAnalyticsService from "../../../services/agent/analytics";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const AppointmentCarbonFootprint = () => {
  const [appointmentCarbonData, setAppointmentCarbonData] = useState([]);

  const fetchAppointmentCarbonData = async () => {
    const response = await AgentAnalyticsService.appointmentCarbonData();
    if (response && response.data.rows) {
      const formattedData = response.data.rows.map((appointment) => ({
        name: `Appointment on ${appointment.appointmentDate}`,
        co2Saved: parseFloat(appointment.co2Details.totalCo2SavedValue),
      }));
      setAppointmentCarbonData(formattedData);
    }
  };

  useEffect(() => {
    fetchAppointmentCarbonData();
  }, []);

  return (
    <div style={{ width: "100%", padding: "0.5rem" }}>
      <h1>Appointment Carbon Footprint</h1>
      <div style={{ marginTop: "20px", width: "100%", height: 300 }}>
        <BarChart width={600} height={300} data={appointmentCarbonData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="co2Saved" fill="#82ca9d" />
        </BarChart>
      </div>
    </div>
  );
};

export default AppointmentCarbonFootprint;
