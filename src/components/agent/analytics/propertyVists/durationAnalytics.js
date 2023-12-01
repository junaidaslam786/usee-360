import React from 'react';
import './propertyVisitsAnalytics.css'

const DurationAnalytics = ({ durationData }) => {
  return (
    <div className="analytics-card">
      <h2>Call Duration Analytics</h2>
      <table className="analytics-table">
        <thead>
          <tr>
            <th>Property</th>
            <th>Average Duration (Minutes)</th>
          </tr>
        </thead>
        <tbody>
          {durationData.map((data, index) => (
            <tr key={index}>
              <td>{data.propertyName}</td>
              <td>{data.averageDuration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DurationAnalytics;