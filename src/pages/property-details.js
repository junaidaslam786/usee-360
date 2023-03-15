import React from 'react';

import Navbar from '../components/global-components/navbar';
import PageHeader from '../components/global-components/header';
import ProductSlider from '../components/property-components/slider';
import ProductDetails from '../components/property-components/details';
import CallToActionV1 from '../components/section-components/call-to-action-v1';
import Footer from '../components/global-components/footer';

function PropertyDetailsPage() {
  return (
    <div>
      <Navbar />
      <PageHeader headertitle="Product Details" customclass="mb-0" />
      <ProductSlider />
      <ProductDetails />
      <CallToActionV1 />
      <Footer />
    </div>
  );
}

export default PropertyDetailsPage;
