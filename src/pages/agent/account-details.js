import React from "react";

import InsideNavbar from "../../components/global-components/inside-navbar";
import PageHeader from "../../components/global-components/header";
import AccountDetails from "../../components/agent-components/account-details";

function AgentAccountDetailsPage() {
  return (
    <div>
      <InsideNavbar />
      <PageHeader headertitle="Account Details" />
      <AccountDetails />
    </div>
  );
}

export default AgentAccountDetailsPage;
