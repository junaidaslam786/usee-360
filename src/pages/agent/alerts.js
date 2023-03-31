import React from "react";

import InsideNavbar from "../../components/global-components/inside-navbar";
import PageHeader from "../../components/global-components/header";
import Alerts from "../../components/agent-components/alerts";

function AgentAlertsPage() {
  return (
    <div>
      <InsideNavbar />
      <PageHeader headertitle="Alerts" />
      <Alerts />
    </div>
  );
}

export default AgentAlertsPage;
