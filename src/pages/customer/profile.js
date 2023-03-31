import React from 'react';

import InsideNavbar from "../../components/global-components/inside-navbar";
import PageHeader from '../../components/global-components/header';
import MyProfile from '../../components/customer-components/my-profile';

function CustomerProfilePage() {
  return (
    <div>
      <InsideNavbar />
      <PageHeader headertitle="My Profile" />
      <MyProfile />
    </div>
  );
}

export default CustomerProfilePage;