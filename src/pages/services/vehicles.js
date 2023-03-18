import React from 'react';

import Navbar from '../../components/global-components/navbar';
import PageHeader from '../../components/global-components/header';
import ServiceDetails from '../../components/section-components/service-details';
import Video from '../../components/section-components/video-v3';
import Service from '../../components/section-components/service-v2';
import CallToActionV1 from '../../components/section-components/call-to-action-v1';
import Footer from '../../components/global-components/footer';

function VehiclesServicePage() {
  return (
    <div>
      <Navbar />
      <PageHeader headertitle="Vehicles" subheader="Service" />
      <ServiceDetails />
      <Video />
      <Service />
      <CallToActionV1 />
      <Footer />
    </div>
  );
}

export default VehiclesServicePage;
