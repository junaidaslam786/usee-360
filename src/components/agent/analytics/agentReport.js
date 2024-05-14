import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import "./agentReports.css";
import AgentAnalyticsService from "../../../services/agent/analytics";
import PropertyCarbonFootprint from "./propertyCarbonFootprint";
import AppointmentCarbonFootprint from "./appointmentCarbonFootprints";

const AgentReport = () => {
  const [propertyVisits, setPropertyVisits] = useState([]);
  const [offerData, setOfferData] = useState([]);
  const [offerCounts, setOfferCounts] = useState({});

  const fetchOfferData = async () => {
    const response = await AgentAnalyticsService.getPropertyOffers(
      "2023-01-01",
      "2023-12-31"
    );
    if (response && response.data.rows) {
      let uniqueKey = 0;
      const transformedData = response.data.rows.map((row) => ({
        uniqueKey: uniqueKey++, // Ensure a unique key for each item
        name: row.product.title,
        offers: 1,
        accepted: row.status === "accepted" ? 1 : 0,
        rejected: row.status === "rejected" ? 1 : 0,
        pending: row.status === "pending" ? 1 : 0,
      }));
      setOfferData(transformedData);
      setOfferCounts({
        accepted: response.data.acceptedOffers,
        rejected: response.data.rejectedOffers,
        pending: response.data.pendingOffers,
      });
    }
  };

  const fetchVisitData = async () => {
    const response = await AgentAnalyticsService.getPropertyVisits(
      "2023-01-01",
      "2023-12-31"
    );
    console.log("visits", response);

    if (response.data && response.data.rows) {
      const formattedData = response.data.rows.map((row) => ({
        name: row.title,
        visits: row.productViews.length,
      }));
      setPropertyVisits(formattedData);
    }
  };

  useEffect(() => {
    fetchOfferData();
    fetchVisitData();
  }, []);

  return (
    <div className="agent-report-container">
      {/* <h1 className="agent-report-title">Agent Report</h1> */}

      {/* Property Visits Bar Chart */}
      <div className="agent-report-card">
        <BarChart width={600} height={300} data={propertyVisits}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="visits" fill="#8884d8" />
        </BarChart>
      </div>

      {/* Property Offers Bar Chart */}
      <div className="agent-report-card">
        <BarChart width={600} height={300} data={offerData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="accepted" fill="#82ca9d" />
          <Bar dataKey="rejected" fill="#8884d8" />
          <Bar dataKey="pending" fill="#ffc658" />
        </BarChart>
      </div>

      {/* Property Visits Table */}
      <div className="agent-report-card">
        <h2 className="agent-report-subtitle">Property Visits Overview</h2>
        <table className="agent-report-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Visits</th>
            </tr>
          </thead>
          <tbody>
            {propertyVisits.map((visit, index) => (
              <tr key={index}>
                <td>{visit.name}</td>
                <td>{visit.visits}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Property Offers Table */}
      <div className="agent-report-card">
        <h2 className="agent-report-subtitle">Offers Overview</h2>
        <table className="agent-report-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Offers Made</th>
              <th>Accepted</th>
              <th>Rejected</th>
            </tr>
          </thead>
          <tbody>
            {offerData.map((data, index) => (
              <tr key={index}>
                <td>{data.name}</td>
                <td>{data.offers}</td>
                <td>{data.accepted}</td>
                <td>{data.rejected}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        
        {/* Carbon Footprints */}
        <div className="agent-report-card">
          <h2 className="agent-report-subtitle">Property Carbon Footprints</h2>
          <PropertyCarbonFootprint />
        </div>
        <div className="agent-report-card">
          <h2 className="agent-report-subtitle">Appointment Carbon Footprints</h2>
          <AppointmentCarbonFootprint />
        </div>
    </div>
  );
};

export default AgentReport;
