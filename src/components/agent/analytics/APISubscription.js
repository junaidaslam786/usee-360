import React from "react";

const APISubscription = () => {
  return (
    <div style={{ width: "100%", padding: "0.5rem" }}>
      <h1>API Subscription</h1>
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
              className="fa-solid fa-video"
              style={{ marginRight: "0.5rem", color: "white" }}
            ></i>
            <p style={{ margin: "0", padding: "0", color: "white" }}>
              Listed API's
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
              className="fa-solid fa-video"
              style={{ marginRight: "0.5rem", color: "white" }}
            ></i>
            <p style={{ margin: "0", padding: "0", color: "white" }}>
              Unlisted API's
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
              className="fa-solid fa-video"
              style={{ marginRight: "0.5rem", color: "white" }}
            ></i>
            <p style={{ margin: "0", padding: "0", color: "white" }}>
              Subscribed API's
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
              className="fa-solid fa-video"
              style={{ marginRight: "0.5rem", color: "white" }}
            ></i>
            <p style={{ margin: "0", padding: "0", color: "white" }}>
                Unsubscribed API's
            </p>
          </div>
          <p style={{ margin: "0", padding: "0", color: "white" }}>45</p>
        </div>
      </div>
    </div>
  );
};

export default APISubscription;
