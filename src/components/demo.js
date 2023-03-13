import React from 'react';
import Navbar from './global-components/navbar';
import PageHeader from './global-components/page-header';
import ContactForm from './section-components/contact-form';
import CallToActionV1 from './section-components/call-to-action-v1';
import Footer from './global-components/footer';

const DemoPage = () => {
    return <div>
        <Navbar />
        <PageHeader headertitle="Book a Demo" subheader="Demo" />
        <ContactForm />
        <CallToActionV1 />
        <Footer />
    </div>
}

export default DemoPage