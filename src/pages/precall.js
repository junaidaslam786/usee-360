import React from "react";

import config from '../config';
import AccessTable from '../components/appointment-components/AccessTable';
import Navbar from '../components/global-components/navbar';
import PageHeader from '../components/global-components/header';
import CallToActionV1 from '../components/section-components/call-to-action-v1';
import Footer from '../components/global-components/footer';

const Precall = () => {
    return <div>
      <AccessTable
        apiKey={config.API_KEY}
        sessionId={config.SESSION_ID}
        token={config.TOKEN}
        loadingDelegate={<div>Loading...</div>}
        opentokClientUrl="https://static.opentok.com/v2/js/opentok.min.js"
      />
    </div>
};

export default Precall;
