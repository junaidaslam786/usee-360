import React from "react";

import Navbar from "../../components/global-components/navbar";
import PageHeader from "../../components/global-components/header";
import Register from "../../components/agent-components/register";
import CallToActionV1 from "../../components/section-components/call-to-action-v1";
import Footer from "../../components/global-components/footer";

function AgentRegisterPage() {
  return (
    <div>
      <Navbar />
      <PageHeader headertitle="Account" subheader="Register" />
      <Register />
      <CallToActionV1 />
      <Footer />
    </div>
  );
}

export default AgentRegisterPage;
