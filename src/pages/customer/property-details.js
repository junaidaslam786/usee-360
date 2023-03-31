import React from 'react';

import InsideNavbar from "../../components/global-components/inside-navbar";
import PageHeader from '../../components/global-components/header';
import PropertyDetails from '../../components/customer-components/property-details';

function CustomerPropertyDetailsPage() {
  return (
    <div>
      <InsideNavbar />
      <PageHeader headertitle="Property Details" />
      <PropertyDetails />
    </div>
  );
}

export default CustomerPropertyDetailsPage;