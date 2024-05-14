import React, { useEffect, useState } from "react";
import AgentAnalyticsService from "../../../services/agent/analytics";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const PropertyCarbonFootprint = () => {
  const [propertyCarbonData, setPropertyCarbonData] = useState([]);

  const fetchPropertyCarbonData = async () => {
    const response = await AgentAnalyticsService.propertyCarbonData();
    if (response && response.data.rows) {
      const formattedData = response.data.rows.map((property) => ({
        name: property.title,
        co2Saved: parseFloat(property.appointments[0].co2Details.totalCo2SavedValue),
      }));
      setPropertyCarbonData(formattedData);
    }
  };

  useEffect(() => {
    fetchPropertyCarbonData();
  }, []);

  return (
    <div style={{ width: "100%", padding: "0.5rem" }}>
      <div style={{ marginTop: "20px", width: "100%", height: 300 }}>
        <BarChart width={600} height={300} data={propertyCarbonData}>
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

export default PropertyCarbonFootprint;
