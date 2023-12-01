import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import './agentReports.css';

const AgentReport = () => {
  const visitData = [
    { name: 'Property 1', visits: 12 },
    { name: 'Property 2', visits: 19 },
    { name: 'Property 3', visits: 7 },
  ];

  const offerData = [
    { name: 'Property 1', offers: 3, accepted: 2, rejected: 1 },
    { name: 'Property 2', offers: 5, accepted: 3, rejected: 2 },
    { name: 'Property 3', offers: 2, accepted: 1, rejected: 1 },
  ];

  return (
    <div className="agent-report-container">
      <h1 className="agent-report-title">Agent Report</h1>
      <div className="agent-report-card">
        <BarChart width={600} height={300} data={visitData}>
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
            isAnimationActive={false}
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
