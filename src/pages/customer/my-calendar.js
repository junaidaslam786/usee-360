import React from "react";

import InsideNavbar from "../../components/global-components/inside-navbar";
import PageHeader from "../../components/global-components/header";
import CustomerCalendar from "../../components/customer-components/calendar";

function CustomerMyCalendarPage() {
  return (
    <div>
      <InsideNavbar />
      <PageHeader headertitle="My Calendar" />
      <CustomerCalendar />
    </div>
  );
}

export default CustomerMyCalendarPage;
