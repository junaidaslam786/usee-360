import React from 'react';

import Navbar from '../../components/global-components/navbar';
import PageHeader from '../../components/global-components/header';
import PropertyDetails from '../../components/customer-components/property-details';
import CallToActionV1 from '../../components/section-components/call-to-action-v1';
import Footer from '../../components/global-components/footer';

function CustomerPropertyDetailsPage() {
  return (
    <div>
      <Navbar />
      <PageHeader headertitle="Property Details" />
      <PropertyDetails />
      <CallToActionV1 />
      <Footer />
    </div>
  );
}

export default CustomerPropertyDetailsPage;