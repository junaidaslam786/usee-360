import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AgentAnalyticsService from "../../../services/agent/analytics";
import VideoCall from "./VideoCall";
import PropertyListing from "./PropertyListing";
import APISubscription from "./APISubscription";
import AgentReport from "./agentReport";
import ReportDownload from "./Reports";

const AnalyticsPage = () => {
  useEffect(() => {
    // const response = await AgentAnalyticsService.getTokensDetails();
    
    const fetchTokensDetails = async () => {
      const response = await AgentAnalyticsService.getTokensDetails();
      console.log(response);
    }
    fetchTokensDetails();
  },[]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Analytics Page</h1>
     
      <ReportDownload />
      <VideoCall />
      <PropertyListing />
      <APISubscription />
      <AgentReport />

    </div>
  );
};

export default AnalyticsPage;
