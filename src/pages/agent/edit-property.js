import React from "react";

import InsideNavbar from "../../components/global-components/inside-navbar";
import PageHeader from "../../components/global-components/header";
import AddProperty from "../../components/agent-components/add-property";
import { useParams } from 'react-router';

function AgentEditPropertyPage() {
  const { id } = useParams();

  return (
    <div>
      <InsideNavbar />
      <PageHeader headertitle="Edit Property" />
      <AddProperty id={id}/>
    </div>
  );
}

export default AgentEditPropertyPage;
