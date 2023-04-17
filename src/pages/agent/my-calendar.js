import React from "react";

import InsideNavbar from "../../components/global-components/inside-navbar";
import PageHeader from "../../components/global-components/header";
import AgentCalendar from "../../components/agent-components/calendar";

function AgentMyCalendarPage() {
  return (
    <div>
      <InsideNavbar />
      <PageHeader headertitle="My Calendar" />
      <AgentCalendar />
    </div>
  );
}

export default AgentMyCalendarPage;
