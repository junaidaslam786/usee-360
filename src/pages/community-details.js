import React from 'react';

import Navbar from '../components/global-components/navbar';
import PageHeader from '../components/global-components/header';
import CommunityDetails from '../components/community-components/community-details';
import CallToActionV1 from '../components/section-components/call-to-action-v1';
import Footer from '../components/global-components/footer';

function CommunityDetailsPage() {
  return (
    <div>
      <Navbar />
      <PageHeader headertitle="Community Details" customclassName="mb-0" />
      <CommunityDetails />
      <CallToActionV1 />
      <Footer />
    </div>
  );
}

export default CommunityDetailsPage;