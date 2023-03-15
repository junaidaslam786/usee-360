import React from 'react';

import Navbar from '../components/global-components/navbar';
import PageHeader from '../components/global-components/header';
import Grid from '../components/property-components/grid';
import CallToActionV1 from '../components/section-components/call-to-action-v1';
import Footer from '../components/global-components/footer';

function PropertyGridPage() {
  return (
    <div>
      <Navbar />
      <PageHeader headertitle="Property Grid" />
      <Grid />
      <CallToActionV1 />
      <Footer />
    </div>
  );
}

export default PropertyGridPage;
