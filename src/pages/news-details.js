import React from 'react';

import Navbar from '../components/global-components/navbar';
import PageHeader from '../components/global-components/header';
import NewsDetails from '../components/news-components/news-details';
import CallToActionV1 from '../components/section-components/call-to-action-v1';
import Footer from '../components/global-components/footer';

function NewsDetailsPage() {
  return (
    <div>
      <Navbar />
      <PageHeader headertitle="News Details" customclassName="mb-0" />
      <NewsDetails />
      <CallToActionV1 />
      <Footer />
    </div>
  );
}

export default NewsDetailsPage;