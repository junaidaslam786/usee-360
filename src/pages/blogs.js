import React from 'react';

import Navbar from '../components/global-components/navbar';
import PageHeader from '../components/global-components/header';
import BlogGrid from '../components/blog-components/blog-grid';
import CallToActionV1 from '../components/section-components/call-to-action-v1';
import Footer from '../components/global-components/footer';

function BlogsPage() {
  return (
    <div>
      <Navbar />
      <PageHeader headertitle="Blogs" customclassName="mb-0" />
      <BlogGrid />
      <CallToActionV1 />
      <Footer />
    </div>
  );
}

export default BlogsPage;