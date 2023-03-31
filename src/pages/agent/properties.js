import React from "react";

import InsideNavbar from "../../components/global-components/inside-navbar";
import PageHeader from "../../components/global-components/header";
import MyProperties from "../../components/agent-components/my-properties";

function AgentMyPropertiesPage() {
  return (
    <div>
      <InsideNavbar />
      <PageHeader headertitle="My Properties" />
      <MyProperties />
    </div>
  );
}

export default AgentMyPropertiesPage;
