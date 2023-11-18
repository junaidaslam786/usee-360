import React from "react";

const PropertyListing = () => {
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
          <p style={{ margin: "0", padding: "0", color: "white" }}>45</p>
        </div>
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
              Unlisted Properties
            </p>
          </div>
          <p style={{ margin: "0", padding: "0", color: "white" }}>45</p>
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
              Sold Properties
            </p>
          </div>
          <p style={{ margin: "0", padding: "0", color: "white" }}>45</p>
        </div>
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
          <p style={{ margin: "0", padding: "0", color: "white" }}>45</p>
        </div>
      </div>
    </div>
  );
};

export default PropertyListing;
