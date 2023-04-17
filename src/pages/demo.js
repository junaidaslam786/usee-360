import React from 'react';

import Navbar from '../components/global-components/navbar';
import PageHeader from '../components/global-components/header';
import ContactForm from '../components/section-components/contact-form';
import CallToActionV1 from '../components/section-components/call-to-action-v1';
import Footer from '../components/global-components/footer';

function DemoPage() {
  return (
    <div>
      <Navbar />
      <PageHeader headertitle="Book a Demo" subheader="Demo" />
      <ContactForm />
      <CallToActionV1 />
      <Footer />
    </div>
  );
}

export default DemoPage;
