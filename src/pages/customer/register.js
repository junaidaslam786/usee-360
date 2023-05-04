import React from 'react';

import Navbar from '../../components/global-components/navbar';
import PageHeader from '../../components/global-components/header';
import Register from '../../components/customer-components/register';
import Footer from '../../components/global-components/footer';

function CustomerRegisterPage() {
  return (
    <div>
      <Navbar page="register"/>
      <PageHeader headertitle="Account" subheader="Register" />
      <Register />
      <Footer page="register"/>
    </div>
  );
}

export default CustomerRegisterPage;
