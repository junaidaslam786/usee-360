import React from 'react';

import Navbar from '../components/global-components/navbar';
import PageHeader from '../components/global-components/header';
import ContactForm from '../components/section-components/contact-form';
import Footer from '../components/global-components/footer';

function DemoPage() {
  return (
    <div>
      <Navbar />
      <PageHeader headertitle="Book a Demo" subheader="Demo" />
      <ContactForm />
      <Footer />
    </div>
  );
}

export default DemoPage;
