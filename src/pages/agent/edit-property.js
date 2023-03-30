import React from "react";

import Navbar from "../../components/global-components/navbar";
import PageHeader from "../../components/global-components/header";
import AddProperty from "../../components/agent-components/add-property";
import CallToActionV1 from "../../components/section-components/call-to-action-v1";
import Footer from "../../components/global-components/footer";
import { useParams } from 'react-router';

function AgentEditPropertyPage() {
  const { id } = useParams();

  return (
    <div>
      <Navbar />
      <PageHeader headertitle="Edit Property" />
      <AddProperty id={id}/>
      <CallToActionV1 />
      <Footer />
    </div>
  );
}

export default AgentEditPropertyPage;
