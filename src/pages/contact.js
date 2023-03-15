import React from 'react';

import Navbar from '../components/global-components/navbar';
import PageHeader from '../components/global-components/header';
import ContactInfo from '../components/section-components/contact-info';
import CallToActionV1 from '../components/section-components/call-to-action-v1';
import Footer from '../components/global-components/footer';

function ContactPage() {
  return (
    <div>
      <Navbar />
      <PageHeader headertitle="Contact Us" subheader="Contact" />
      <ContactInfo />
      <CallToActionV1 />
      <Footer />
    </div>
  );
}

export default ContactPage;
