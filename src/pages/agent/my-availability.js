import React from "react";

import InsideNavbar from "../../components/global-components/inside-navbar";
import PageHeader from "../../components/global-components/header";
import Availability from "../../components/agent-components/availability";

function AgentAvailabilityPage() {
  return (
    <div>
      <InsideNavbar />
      <PageHeader headertitle="My Availability" />
      <Availability />
    </div>
  );
}

export default AgentAvailabilityPage;
