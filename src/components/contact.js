import React from 'react';
import Navbar from './global-components/navbar';
import PageHeader from './global-components/page-header';
import ContactInfo from './section-components/contact-info';
import CallToActionV1 from './section-components/call-to-action-v1';
import Footer from './global-components/footer';

const ContactPage = () => {
    return <div>
        <Navbar />
        <PageHeader headertitle="Contact Us" subheader="Contact" />
        <ContactInfo />
        <CallToActionV1 />
        <Footer />
    </div>
}

export default ContactPage

