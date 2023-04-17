import React from 'react';

import InsideNavbar from "../../components/global-components/inside-navbar";
import PageHeader from '../../components/global-components/header';
import Appointments from '../../components/customer-components/appointments';

function CustomerAppointmentsPage() {
  return (
    <div>
      <InsideNavbar />
      <PageHeader headertitle="Appointments" />
      <Appointments />
    </div>
  );
}

export default CustomerAppointmentsPage;