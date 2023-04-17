import React from 'react';

import Navbar from '../components/global-components/navbar';
import PageHeader from '../components/global-components/header';
import ProductDetails from '../components/property-components/details';
import CallToActionV1 from '../components/section-components/call-to-action-v1';
import Footer from '../components/global-components/footer';

function PropertyDetailsPage() {
  return (
    <div>
      <Navbar />
      <PageHeader headertitle="Product Details" customclassName="mb-0" />
      <ProductDetails />
      <CallToActionV1 />
      <Footer />
    </div>
  );
}

export default PropertyDetailsPage;
