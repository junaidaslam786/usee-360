import React from 'react';

import Navbar from '../components/global-components/navbar';
import PageHeader from '../components/global-components/header';
import Community from '../components/community-components/community';
import CallToActionV1 from '../components/section-components/call-to-action-v1';
import Footer from '../components/global-components/footer';

function CommunityPage() {
  return (
    <div>
      <Navbar />
      <PageHeader headertitle="Community" customclassName="mb-0" />
      <Community />
      <CallToActionV1 />
      <Footer />
    </div>
  );
}

export default CommunityPage;