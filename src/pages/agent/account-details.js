import React from "react";

import Navbar from "../../components/global-components/navbar";
import PageHeader from "../../components/global-components/header";
import AccountDetails from "../../components/agent-components/account-details";
import CallToActionV1 from "../../components/section-components/call-to-action-v1";
import Footer from "../../components/global-components/footer";

function AgentAccountDetailsPage() {
  return (
    <div>
      <Navbar />
      <PageHeader headertitle="Account Details" />
      <AccountDetails />
      <CallToActionV1 />
      <Footer />
    </div>
  );
}

export default AgentAccountDetailsPage;
