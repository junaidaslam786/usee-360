import React from 'react';

import Navbar from '../components/global-components/navbar';
import Banner from '../components/section-components/banner';
import SearchForm from '../components/section-components/search-form';
import Aboutv1 from '../components/section-components/about-v1';
import Featuresv1 from '../components/section-components/features-v1';
import ProSlider from '../components/section-components/product-slider-v1';
import Category from '../components/section-components/category-v1';
import History from '../components/section-components/history';
import CallToActionV1 from '../components/section-components/call-to-action-v1';
import Footer from '../components/global-components/footer';

function HomePage() {
  return (
    <div>
      <Navbar />
      <Banner />
      <SearchForm />
      <Aboutv1 />
      <Featuresv1 customClass="ltn__feature-area section-bg-1 pt-120 pb-90 mb-120---" />
      <History />
      <Category />
      <ProSlider />
      <CallToActionV1 />
      <Footer />
    </div>
  );
}

export default HomePage;
