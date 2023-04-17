import React from "react";

import InsideNavbar from "../../components/global-components/inside-navbar";
import PageHeader from "../../components/global-components/header";
import AddProperty from "../../components/agent-components/add-property";

function AgentAddPropertyPage() {
  return (
    <div>
      <InsideNavbar />
      <PageHeader headertitle="Add Property" />
      <AddProperty />
    </div>
  );
}

export default AgentAddPropertyPage;
