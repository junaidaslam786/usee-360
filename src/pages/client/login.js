import React from 'react';

import Navbar from '../../components/global-components/navbar';
import PageHeader from '../../components/global-components/header';
import Login from '../../components/client-components/login';
import CallToActionV1 from '../../components/section-components/call-to-action-v1';
import Footer from '../../components/global-components/footer';

function ClientLoginPage() {
  return (
    <div>
      <Navbar />
      <PageHeader headertitle="Account" subheader="Login" />
      <Login />
      <CallToActionV1 />
      <Footer />
    </div>
  );
}

export default ClientLoginPage;
