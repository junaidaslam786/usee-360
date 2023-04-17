import React from 'react';

import InsideNavbar from "../../components/global-components/inside-navbar";
import PageHeader from '../../components/global-components/header';
import Dashboard from '../../components/customer-components/dashboard';

function CustomerDashboardPage() {
  return (
    <div>
      <InsideNavbar />
      <PageHeader headertitle="Dashboard" />
      <Dashboard />
    </div>
  );
}

export default CustomerDashboardPage;