import React from 'react';

import Navbar from '../../components/global-components/navbar';
import PageHeader from '../../components/global-components/header';
import MyProfile from '../../components/customer-components/my-profile';
import CallToActionV1 from '../../components/section-components/call-to-action-v1';
import Footer from '../../components/global-components/footer';

function CustomerProfilePage() {
  return (
    <div>
      <Navbar />
      <PageHeader headertitle="My Profile" />
      <MyProfile />
      <CallToActionV1 />
      <Footer />
    </div>
  );
}

export default CustomerProfilePage;