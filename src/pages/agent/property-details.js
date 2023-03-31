import React from "react";

import InsideNavbar from "../../components/global-components/inside-navbar";
import PageHeader from "../../components/global-components/header";
import PropertyDetails from "../../components/agent-components/property-details";

function AgentPropertyDetailsPage() {
  return (
    <div>
      <InsideNavbar />
      <PageHeader headertitle="Property Details" />
      <PropertyDetails />
    </div>
  );
}

export default AgentPropertyDetailsPage;
