import React from "react";

import Navbar from "../../components/global-components/navbar";
import PageHeader from "../../components/global-components/header";
import Login from "../../components/agent-components/login";
import CallToActionV1 from "../../components/section-components/call-to-action-v1";
import Footer from "../../components/global-components/footer";

function AgentLoginPage() {
  return (
    <div>
      <Navbar />
      <PageHeader headertitle="Account" subheader="Login" />
      <Login />
      <Footer />
    </div>
  );
}

export default AgentLoginPage;
