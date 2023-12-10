import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
} from "recharts";
import "./agentReports.css";
import AgentAnalyticsService from "../../../services/agent/analytics";

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
      const transformedData = response.data.rows.map((row) => ({
        name: row.product.title,
        offers: 1, // Since each row is an offer
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

    if (response && response.rows) {
      const formattedData = response.rows.map((row) => ({
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
      <h1 className="agent-report-title">Agent Report</h1>
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
      <div className="agent-report-card">
        <PieChart width={400} height={400}>
          <Pie
            dataKey="accepted"
            data={offerData}
            cx={200}
            cy={200}
            outerRadius={80}
            fill="#82ca9d"
            label
          />
          <Pie
            dataKey="rejected"
            data={offerData}
            cx={200}
            cy={200}
            innerRadius={90}
            outerRadius={110}
            fill="#8884d8"
            label
          />
          <Tooltip />
        </PieChart>
      </div>
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
    </div>
  );
};

export default AgentReport;
