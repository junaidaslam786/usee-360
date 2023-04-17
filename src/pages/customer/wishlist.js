import React from 'react';

import InsideNavbar from "../../components/global-components/inside-navbar";
import PageHeader from '../../components/global-components/header';
import MyWishlist from '../../components/customer-components/my-wishlist';

function CustomerWishlistPage() {
  return (
    <div>
      <InsideNavbar />
      <PageHeader headertitle="My Wishlist" />
      <MyWishlist />
    </div>
  );
}

export default CustomerWishlistPage;