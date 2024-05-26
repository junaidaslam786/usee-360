import React, { useEffect, useState } from "react";
import AgentAnalyticsService from "../../../services/agent/analytics";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const PropertyListing = () => {
  const [listingsData, setListingsData] = useState({
    propertiesListed: 0,
    revenueGenerated: 0,
    propertiesUnderOffer: 0,
    chartData: [],
  });

  const fetchListingsData = async () => {
    const response = await AgentAnalyticsService.getPropertyListings(
      "2023-01-01",
      "2023-12-31"
    );
    if (response && response.data) {
      const formattedData = response.data.rows.map((row) => ({
        name: row.firstName + " " + row.lastName,
        PropertiesListed: row.products.length,
        PropertiesUnderOffer: 1, // Assuming 1 for each property under offer
      }));

      setListingsData({
        ...listingsData,
        propertiesListed: response.data.rows.length,
        revenueGenerated: response.data.revenue_generated,
        propertiesUnderOffer: response.data.propertiesUnderOffer,
        chartData: formattedData,
      });
    }
  };

  useEffect(() => {
    fetchListingsData();
  }, [fetchListingsData]);

  return (
    <div style={{ width: "100%", padding: "0.5rem" }}>
      <h1>Property Listing</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "5vmin",
        }}
      >
        {/* Listed Properties */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem",
            background: "#00C800",
            width: "40%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <i
              className="fa-solid fa-building"
              style={{ marginRight: "0.5rem", color: "white" }}
            ></i>
            <p style={{ margin: "0", padding: "0", color: "white" }}>
              Listed Properties
            </p>
          </div>
          <p style={{ margin: "0", padding: "0", color: "white" }}>
            {listingsData.propertiesListed}
          </p>
        </div>

        {/* Revenue Generated */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem",
            background: "#00C800",
            width: "40%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <i
              className="fa-solid fa-dollar-sign"
              style={{ marginRight: "0.5rem", color: "white" }}
            ></i>
            <p style={{ margin: "0", padding: "0", color: "white" }}>
              Revenue Generated
            </p>
          </div>
          <p style={{ margin: "0", padding: "0", color: "white" }}>
            {listingsData.revenueGenerated}
          </p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "5vmin",
        }}
      >
        {/* Properties Under Offer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem",
            background: "#00C800",
            width: "40%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <i
              className="fa-solid fa-handshake"
              style={{ marginRight: "0.5rem", color: "white" }}
            ></i>
            <p style={{ margin: "0", padding: "0", color: "white" }}>
              Properties Under Offer
            </p>
          </div>
          <p style={{ margin: "0", padding: "0", color: "white" }}>
            {listingsData.propertiesUnderOffer}
          </p>
        </div>

        {/* Unsold Properties */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem",
            background: "#00C800",
            width: "40%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <i
              className="fa-solid fa-building"
              style={{ marginRight: "0.5rem", color: "white" }}
            ></i>
            <p style={{ margin: "0", padding: "0", color: "white" }}>
              Unsold Properties
            </p>
          </div>
          <p style={{ margin: "0", padding: "0", color: "white" }}>45</p>{" "}
          {/* Assuming 45 unsold properties */}
        </div>
      </div>

      {/* Bar Chart */}
      <div style={{ marginTop: "20px", width: "100%", height: 300 }}>
        <BarChart
          width={500}
          height={300}
          data={listingsData.chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="PropertiesListed" fill="#8884d8" />
          <Bar dataKey="PropertiesUnderOffer" fill="#82ca9d" />
        </BarChart>
      </div>
    </div>
  );
};

export default PropertyListing;
