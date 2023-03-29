import React from 'react';

import Navbar from '../../components/global-components/navbar';
import PageHeader from '../../components/global-components/header';
import MyWishlist from '../../components/customer-components/my-wishlist';
import CallToActionV1 from '../../components/section-components/call-to-action-v1';
import Footer from '../../components/global-components/footer';

function CustomerWishlistPage() {
  return (
    <div>
      <Navbar />
      <PageHeader headertitle="My Wishlist" />
      <MyWishlist />
      <CallToActionV1 />
      <Footer />
    </div>
  );
}

export default CustomerWishlistPage;