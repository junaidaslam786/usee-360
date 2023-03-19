import React from "react";

import config from "../config";
import AccessTable from "../components/appointment-components/AccessTable";

const Precall = () => {
  return (
    <div>
      <AccessTable
        apiKey={config.API_KEY}
        sessionId={config.SESSION_ID}
        token={config.TOKEN}
        loadingDelegate={<div>Loading...</div>}
        opentokClientUrl="https://static.opentok.com/v2/js/opentok.min.js"
      />
    </div>
  );
};

export default Precall;
