import React from 'react';
import Navbar from './global-components/navbar';
import Banner from './section-components/banner';
import SearchForm from './section-components/search-form';
import Aboutv1 from './section-components/about-v1';
import Featuresv1 from './section-components/features-v1';
import ProSlider from './section-components/product-slider-v1';
import Category from './section-components/category-v1';
import History from './section-components/history';
import CallToActionV1 from './section-components/call-to-action-v1';
import Footer from './global-components/footer';

const HomePage = () => {
    return <div>
        <Navbar />
        <Banner />
        <SearchForm />
        <Aboutv1 />
        <Featuresv1 customClass="ltn__feature-area section-bg-1 pt-120 pb-90 mb-120---"/>
        <History />
        <Category />
        <ProSlider />
        <CallToActionV1 />
        <Footer />
    </div>
}

export default HomePage

