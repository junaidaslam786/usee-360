import React from "react";

import Navbar from "../../components/global-components/navbar";
import PageHeader from "../../components/global-components/header";
import ResetPassword from "../../components/customer-components/reset-password";
import CallToActionV1 from "../../components/section-components/call-to-action-v1";
import Footer from "../../components/global-components/footer";

function CustomerResetPasswordPage() {
  return (
    <div>
      <Navbar />
      <PageHeader headertitle="Account" subheader="Reset Password" />
      <ResetPassword />
      <CallToActionV1 />
      <Footer />
    </div>
  );
}

export default CustomerResetPasswordPage;