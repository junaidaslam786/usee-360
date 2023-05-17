import React from 'react';

import Navbar from '../components/global-components/navbar';
import PageHeader from '../components/global-components/header';
import BlogDetails from '../components/blog-components/blog-details';
import CallToActionV1 from '../components/section-components/call-to-action-v1';
import Footer from '../components/global-components/footer';

function BlogDetailsPage() {
  return (
    <div>
      <Navbar />
      <PageHeader headertitle="Blog Details" customclassName="mb-0" />
      <BlogDetails />
      <CallToActionV1 />
      <Footer />
    </div>
  );
}

export default BlogDetailsPage;