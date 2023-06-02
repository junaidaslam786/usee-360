import React from 'react';

import Navbar from '../components/global/navbar';
import PageHeader from '../components/global/header';
import AboutV5 from '../components/homepage/section/about-v5';
import ServiceV1 from '../components/homepage/section/service-v1';
import Category from '../components/homepage/section/category-v2';
import CallToActionV1 from '../components/homepage/section/call-to-action-v1';
import Footer from '../components/global/footer';

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
