import React from 'react';

import Navbar from '../components/global/navbar';
import Banner from '../components/homepage/section/banner-v3';
import Aboutv1 from '../components/homepage/section/about-v1';
import Servicev1 from '../components/homepage/section/service-v1';
import Category from '../components/homepage/section/category-v1';
import History from '../components/homepage/section/history';
import CallToActionV1 from '../components/homepage/section/call-to-action-v1';
import Footer from '../components/global/footer';
import Video from '../components/homepage/section/video-v3';

function HomePage() {
  return (
    <div>
      <Navbar />
      <Banner />
      <Aboutv1 />
      <Video />
      <Servicev1 />
      <History />
      <Category />
      <CallToActionV1 />
      <Footer />
    </div>
  );
}

export default HomePage;
