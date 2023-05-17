import React from 'react';

import Navbar from '../components/global-components/navbar';
import PageHeader from '../components/global-components/header';
import NewsGrid from '../components/news-components/news-grid';
import CallToActionV1 from '../components/section-components/call-to-action-v1';
import Footer from '../components/global-components/footer';

function NewsPage() {
  return (
    <div>
      <Navbar />
      <PageHeader headertitle="News" customclassName="mb-0" />
      <NewsGrid />
      <CallToActionV1 />
      <Footer />
    </div>
  );
}

export default NewsPage;