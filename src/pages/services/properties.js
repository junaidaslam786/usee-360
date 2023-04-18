import React from 'react';

import Navbar from '../../components/global-components/navbar';
import PageHeader from '../../components/global-components/header';
import SearchForm from '../../components/section-components/search-form';
import ServiceDetails from '../../components/section-components/service-details';
import Video from '../../components/section-components/video-v3';
import Service from '../../components/section-components/service-v2';
import CallToActionV1 from '../../components/section-components/call-to-action-v1';
import Footer from '../../components/global-components/footer';

function PropertiesServicePage() {
  return (
    <div>
      <Navbar />
      <PageHeader headertitle="Homes" subheader="Service" />
      <SearchForm />
      <ServiceDetails />
      <Video />
      <Service />
      <CallToActionV1 />
      <Footer />
    </div>
  );
}

export default PropertiesServicePage;