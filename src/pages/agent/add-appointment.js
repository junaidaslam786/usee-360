import React from "react";

import InsideNavbar from "../../components/global-components/inside-navbar";
import PageHeader from "../../components/global-components/header";
import AddAppointment from "../../components/agent-components/add-appointment";

function AgentAddAppointmentPage() {
  return (
    <div>
      <InsideNavbar />
      <PageHeader headertitle="Add Appointment" />
      <AddAppointment />
    </div>
  );
}

export default AgentAddAppointmentPage;
