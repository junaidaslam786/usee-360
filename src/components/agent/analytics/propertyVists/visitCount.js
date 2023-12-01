import React from 'react';
import './propertyVisitsAnalytics.css'

const VisitCount = ({ visitData }) => {
  return (
    <div className="analytics-card">
      <h2>Property Visit Counts</h2>
      <table className="analytics-table">
        <thead>
          <tr>
            <th>Property</th>
            <th>Visits</th>
          </tr>
        </thead>
        <tbody>
          {visitData.map((data, index) => (
            <tr key={index}>
              <td>{data.propertyName}</td>
              <td>{data.visits}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VisitCount;
