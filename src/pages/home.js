import React from 'react';

import Navbar from '../components/global-components/navbar';
import Banner from '../components/section-components/banner-v3';
import Aboutv1 from '../components/section-components/about-v1';
import Servicev1 from '../components/section-components/service-v1';
import Category from '../components/section-components/category-v1';
import History from '../components/section-components/history';
import CallToActionV1 from '../components/section-components/call-to-action-v1';
import Footer from '../components/global-components/footer';

function HomePage() {
  return (
    <div>
      <Navbar />
      <Banner />
      <Aboutv1 />
      <Servicev1 />
      <History />
      <Category />
      <CallToActionV1 />
      <Footer />
    </div>
  );
}

export default HomePage;
