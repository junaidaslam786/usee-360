import React from 'react';

import Navbar from '../components/global-components/navbar';
import PageHeader from '../components/global-components/header';
import AboutV5 from '../components/section-components/about-v5';
import ServiceV1 from '../components/section-components/service-v1';
import Category from '../components/section-components/category-v2';
import CallToActionV1 from '../components/section-components/call-to-action-v1';
import Footer from '../components/global-components/footer';

function ServicePage() {
  return (
    <div>
      <Navbar />
      <PageHeader headertitle="What We Do" subheader="Service" />
      <AboutV5 />
      <ServiceV1 />
      <Category />
      <CallToActionV1 />
      <Footer />
    </div>
  );
}

export default ServicePage;
