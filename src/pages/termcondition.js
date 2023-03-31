import React from 'react';

import Navbar from '../components/global-components/navbar';
import PageHeader from '../components/global-components/header';
import TermAndConditions from '../components/section-components/term-and-condition';
import CallToActionV1 from '../components/section-components/call-to-action-v1';
import Footer from '../components/global-components/footer';

function Termsconditions() {
  return (
    <div>
      <Navbar />
      <PageHeader headertitle="TERMS AND CONDITIONS" subheader="TERMS AND CONDITIONS" />
      <TermAndConditions />
      <CallToActionV1 />
      <Footer />
    </div>
  );
}

export default Termsconditions;
