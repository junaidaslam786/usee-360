// import React, { useEffect, useState } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
// } from "recharts";
// import "./agentReports.css";
// import AgentAnalyticsService from "../../../services/agent/analytics";
// import PropertyCarbonFootprint from "./propertyCarbonFootprint";
// import AppointmentCarbonFootprint from "./appointmentCarbonFootprints";
// import { off } from "process";
// import PropertiesSoldRented from "./propertiesSoldRented";

// const AgentReport = () => {
//   const [propertyVisits, setPropertyVisits] = useState([]);
//   const [offerData, setOfferData] = useState([]);
//   const [offerCounts, setOfferCounts] = useState({});
//   const [startDate, setStartDate] = useState("2023-01-01");
//   const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
//   const [offersStartDate, setOffersStartDate] = useState("2023-01-01");
//   const [offersEndDate, setOffersEndDate] = useState(new Date().toISOString().split("T")[0]);

//   const fetchOfferData = async () => {
//     const response = await AgentAnalyticsService.getPropertyOffers(
//       offersStartDate,
//       offersEndDate
//     );
//     if (response && response.data.rows) {
//       let uniqueKey = 0;
//       const transformedData = response.data.rows.map((row) => ({
//         uniqueKey: uniqueKey++, // Ensure a unique key for each item
//         name: row.product.title,
//         offers: 1,
//         accepted: row.status === "accepted" ? 1 : 0,
//         rejected: row.status === "rejected" ? 1 : 0,
//         pending: row.status === "pending" ? 1 : 0,
//       }));
//       setOfferData(transformedData);
//       setOfferCounts({
//         accepted: response.data.acceptedOffers,
//         rejected: response.data.rejectedOffers,
//         pending: response.data.pendingOffers,
//       });
//     }
//   };

//   const fetchVisitData = async () => {
//     const response = await AgentAnalyticsService.getPropertyVisits(
//       startDate,
//       endDate
//     );
//     console.log("visits", response);

//     if (response.data && response.data.rows) {
//       const formattedData = response.data.rows.map((row) => ({
//         name: row.title,
//         visits: row.productViews.length,
//       }));
//       setPropertyVisits(formattedData);
//     }
//   };

//   useEffect(() => {
//     fetchOfferData();
//     fetchVisitData();
//   }, [startDate, endDate, offersStartDate, offersEndDate]);

//   return (
//     <div className="agent-report-container">
      
//       <div className="agent-report-card">
        
//         <PropertiesSoldRented />
//       </div>

//       {/* Property Visits Bar Chart */}
//       {/* <div className="agent-report-card">
//         <BarChart width={600} height={300} data={propertyVisits}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="name" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Bar dataKey="visits" fill="#8884d8" />
//         </BarChart>
//       </div> */}

//       {/* Property Offers Bar Chart */}
//       <div className="agent-report-card">
//         <BarChart width={600} height={300} data={offerData}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="name" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Bar dataKey="accepted" fill="#82ca9d" />
//           <Bar dataKey="rejected" fill="#8884d8" />
//           <Bar dataKey="pending" fill="#ffc658" />
//         </BarChart>
//       </div>

      

//       {/* Property Visits Table */}
//       <div className="agent-report-card">
//         <h2 className="agent-report-subtitle">Property Visits Overview</h2>
//         <div className="agent-report-date-range" style={{display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap'}}>
//         <label>
//           Start Date:
//           <input
//             type="date"
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//             // style={{height: '30px'}}
//           />
//         </label>
//         <label>
//           End Date:
//           <input
//             type="date"
//             value={endDate}
//             onChange={(e) => setEndDate(e.target.value)}
//           />
//         </label>
//       </div>
//         <table className="agent-report-table">
//           <thead>
//             <tr>
//               <th>Property</th>
//               <th>Visits</th>
//             </tr>
//           </thead>
//           <tbody>
//             {propertyVisits.map((visit, index) => (
//               <tr key={index}>
//                 <td>{visit.name}</td>
//                 <td>{visit.visits}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Property Offers Table */}
//       <div className="agent-report-card">
//         <h2 className="agent-report-subtitle">Offers Overview</h2>
//         <div className="agent-report-date-range" style={{display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap'}}>
//         <label>
//           Start Date:
//           <input
//             type="date"
//             value={offersStartDate}
//             onChange={(e) => setOffersStartDate(e.target.value)}
//             // style={{height: '30px'}}
//           />
//         </label>
//         <label>
//           End Date:
//           <input
//             type="date"
//             value={offersEndDate}
//             onChange={(e) => setOffersEndDate(e.target.value)}
//           />
//         </label>
//       </div>
//         <table className="agent-report-table">
//           <thead>
//             <tr>
//               <th>Property</th>
//               <th>Offers Made</th>
//               <th>Accepted</th>
//               <th>Rejected</th>
//             </tr>
//           </thead>
//           <tbody>
//             {offerData.map((data, index) => (
//               <tr key={index}>
//                 <td>{data.name}</td>
//                 <td>{data.offers}</td>
//                 <td>{data.accepted}</td>
//                 <td>{data.rejected}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
        
//       {/* Carbon Footprints */}
//       <div className="agent-report-card">
//         <h2 className="agent-report-subtitle">Property Carbon Footprints</h2>
//         <PropertyCarbonFootprint />
//       </div>
//       <div className="agent-report-card">
//         <h2 className="agent-report-subtitle">Appointment Carbon Footprints</h2>
//         <AppointmentCarbonFootprint />
//       </div>
//     </div>
//   );
// };

// export default AgentReport;


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
import PropertiesSoldRented from "./propertiesSoldRented";

const AgentReport = () => {
  const [propertyVisits, setPropertyVisits] = useState([]);
  const [offerData, setOfferData] = useState([]);
  const [offerCounts, setOfferCounts] = useState({});
  const [startDate, setStartDate] = useState("2023-01-01");
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [offersStartDate, setOffersStartDate] = useState("2023-01-01");
  const [offersEndDate, setOffersEndDate] = useState(new Date().toISOString().split("T")[0]);

  const fetchOfferData = async () => {
    const response = await AgentAnalyticsService.getPropertyOffers(
      offersStartDate,
      offersEndDate
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
      startDate,
      endDate
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
  }, [startDate, endDate, offersStartDate, offersEndDate]);

  return (
    <div className="agent-report-container">
      
      <div className="agent-report-card">
        
        <PropertiesSoldRented />
      </div>

      {/* Property Visits Bar Chart */}
      {/* <div className="agent-report-card">
        <BarChart width={600} height={300} data={propertyVisits}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="visits" fill="#8884d8" />
        </BarChart>
      </div> */}

      

      {/* Property Visits Table */}
      <div className="agent-report-card">
        <h2 className="agent-report-subtitle">Property Visits Overview</h2>
        <div className="agent-report-date-range" style={{display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap'}}>
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            // style={{height: '30px'}}
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
      </div>
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
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
      </div>

      {/* Property Offers Table */}
      <div className="agent-report-card">
        <h2 className="agent-report-subtitle">Offers Overview</h2>
        <div className="agent-report-date-range" style={{display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap'}}>
        <label>
          Start Date:
          <input
            type="date"
            value={offersStartDate}
            onChange={(e) => setOffersStartDate(e.target.value)}
            // style={{height: '30px'}}
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={offersEndDate}
            onChange={(e) => setOffersEndDate(e.target.value)}
          />
        </label>
      </div>
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
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
        
      {/* Carbon Footprints */}
      {/* <div className="agent-report-card">
        <h2 className="agent-report-subtitle">Property Carbon Footprints</h2>
        <PropertyCarbonFootprint />
      </div> */}
      <div className="agent-report-card">
        <h2 className="agent-report-subtitle">Appointment Carbon Footprints</h2>
        <AppointmentCarbonFootprint />
      </div>
    </div>
  );
};

export default AgentReport;
