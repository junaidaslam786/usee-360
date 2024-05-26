import React from "react";

import VideoCall from "./VideoCall";
import PropertyListing from "./PropertyListing";
import APISubscription from "./APISubscription";
import AgentReport from "./agentReport";
import ReportDownload from "./Reports";


const AnalyticsPage = () => {


  return (
    <div style={{ padding: "20px" }}>
      <h1>Analytics Page</h1>
     
      <ReportDownload />
      <VideoCall />
      <APISubscription />
      <PropertyListing />
      <AgentReport />
      

    </div>
  );
};

export default AnalyticsPage;
