import React from "react";

import InsideNavbar from "../../components/global-components/inside-navbar";
import PageHeader from "../../components/global-components/header";
import AddAppointment from "../../components/customer-components/add-appointment";

function CustomerAddAppointmentPage() {
  return (
    <div>
      <InsideNavbar />
      <PageHeader headertitle="Add Appointment" />
      <AddAppointment />
    </div>
  );
}

export default CustomerAddAppointmentPage;
