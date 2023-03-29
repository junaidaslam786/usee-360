import React from 'react';

import Navbar from '../../components/global-components/navbar';
import PageHeader from '../../components/global-components/header';
import Dashboard from '../../components/customer-components/dashboard';
import CallToActionV1 from '../../components/section-components/call-to-action-v1';
import Footer from '../../components/global-components/footer';

function CustomerDashboardPage() {
  return (
    <div>
      <Navbar />
      <PageHeader headertitle="Dashboard" />
      <Dashboard />
      <CallToActionV1 />
      <Footer />
    </div>
  );
}

export default CustomerDashboardPage;