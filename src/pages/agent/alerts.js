import React from "react";

import Navbar from "../../components/global-components/navbar";
import PageHeader from "../../components/global-components/header";
import Alerts from "../../components/agent-components/alerts";
import CallToActionV1 from "../../components/section-components/call-to-action-v1";
import Footer from "../../components/global-components/footer";

function AgentAlertsPage() {
  return (
    <div>
      <Navbar />
      <PageHeader headertitle="Alerts" />
      <Alerts />
      <CallToActionV1 />
      <Footer />
    </div>
  );
}

export default AgentAlertsPage;
