// import React, { useEffect, useState } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import AgentAnalyticsService from "../../../services/agent/analytics";

// const PropertiesSoldRented = () => {
//   const [propertiesSoldData, setPropertiesSoldData] = useState([]);
//   const [propertiesRentedData, setPropertiesRentedData] = useState([]);
//   const [startDate, setStartDate] = useState("2023-01-01");
//   const [endDate, setEndDate] = useState(
//     new Date().toISOString().split("T")[0]
//   );

//   const fetchPropertiesData = async () => {
//     const response = await AgentAnalyticsService.propertiesSoldOrRented(
//       startDate,
//       endDate
//     );
//     console.log(response);
//     if (response) {
//       const soldData =
//         response.data.propertiesSold?.map((property) => ({
//           date: new Date(property.date).toLocaleDateString(), // Assuming 'date' is the field with the date information
//           count: 1, // Assuming each entry represents one property sold
//         })) || [];

//       const rentedData =
//         response.data.propertiesRented?.map((property) => ({
//           date: new Date(property.date).toLocaleDateString(), // Assuming 'date' is the field with the date information
//           count: 1, // Assuming each entry represents one property rented
//         })) || [];

//       setPropertiesSoldData(soldData);
//       setPropertiesRentedData(rentedData);
//     }
//   };

//   useEffect(() => {
//     fetchPropertiesData();
//   }, [startDate, endDate]);

//   return (
//     <div style={{ width: "100%", padding: "0.5rem" }}>
//       <div
//         className="agent-report-date-range"
//         style={{
//           display: "flex",
//           justifyContent: "space-around",
//           flexWrap: "wrap",
//         }}
//       >
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
//       <div style={{ marginTop: "20px", width: "100%", height: 300 }}>
//         <h2>Properties Sold</h2>
//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart data={propertiesSoldData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="date" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Line type="monotone" dataKey="count" stroke="#8884d8" />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//       <div style={{ marginTop: "20px", width: "100%", height: 300 }}>
//         <h2>Properties Rented</h2>
//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart data={propertiesRentedData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="date" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Line type="monotone" dataKey="count" stroke="#82ca9d" />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default PropertiesSoldRented;

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import AgentAnalyticsService from "../../../services/agent/analytics";
import { format, parseISO, eachMonthOfInterval, isValid } from "date-fns";

const PropertiesSoldRented = () => {
  const [propertiesSoldData, setPropertiesSoldData] = useState([]);
  const [propertiesRentedData, setPropertiesRentedData] = useState([]);
  const [startDate, setStartDate] = useState("2023-01-01");
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);

  const generateMonthsList = (start, end) => {
    return eachMonthOfInterval({
      start: parseISO(start),
      end: parseISO(end),
    }).map((date) => format(date, "yyyy-MM"));
  };

  const groupByMonth = (properties, monthsList) => {
    const grouped = monthsList.reduce((acc, month) => {
      acc[month] = { date: month, count: 0 };
      return acc;
    }, {});

    properties.forEach((property) => {
      property.productOffers.forEach((offer) => {
        const dateField = offer.acceptedAt;
        if (dateField && isValid(parseISO(dateField))) {
          const month = format(parseISO(dateField), "yyyy-MM");
          if (grouped[month]) {
            grouped[month].count += 1;
          }
        }
      });
    });

    return Object.values(grouped);
  };

  const fetchPropertiesData = async () => {
    try {
      const response = await AgentAnalyticsService.propertiesSoldOrRented(startDate, endDate);
      console.log("Response:", response);
      if (response && response.data) {
        const monthsList = generateMonthsList(startDate, endDate);
        const soldGroupedByMonth = groupByMonth(response.data.propertiesSold || [], monthsList);
        const rentedGroupedByMonth = groupByMonth(response.data.propertiesRented || [], monthsList);
        
        console.log("Sold Grouped by Month:", soldGroupedByMonth);
        console.log("Rented Grouped by Month:", rentedGroupedByMonth);
  
        setPropertiesSoldData(soldGroupedByMonth);
        setPropertiesRentedData(rentedGroupedByMonth);
      }
    } catch (error) {
      console.error("Error fetching properties data:", error);
    }
  };
  

  useEffect(() => {
    fetchPropertiesData();
  }, [startDate, endDate]);

  return (
    <div style={{ width: "100%", padding: "0.5rem" }}>
      <div
        className="agent-report-date-range"
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
        }}
      >
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
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
      <div style={{ marginTop: "20px", width: "100%", height: 300 }}>
        <h2>Properties Sold</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={propertiesSoldData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div style={{ marginTop: "20px", width: "100%", height: 300 }}>
        <h2>Properties Rented</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={propertiesRentedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PropertiesSoldRented;

