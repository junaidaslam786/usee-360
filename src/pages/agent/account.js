import React from 'react';

import Navbar from '../../components/global-components/navbar';
import PageHeader from '../../components/global-components/header';
import Account from '../../components/agent-components/account';
import CallToActionV1 from '../../components/section-components/call-to-action-v1';
import Footer from '../../components/global-components/footer';

function AgentAccountPage() {
  return (
    <div>
      <Navbar />
      <PageHeader headertitle="My Account" />
      <Account />
      <CallToActionV1 />
      <Footer />
    </div>
  );
}

export default AgentAccountPage;
