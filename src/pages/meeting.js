import React from 'react';

import config from '../config';
import MeetingJoin from '../components/appointment-components/MeetingJoin';

const Meeting = (props) => {
  return <div>
      <MeetingJoin
        apiKey={config.API_KEY}
        sessionId={config.SESSION_ID}
        token={config.TOKEN}
        loadingDelegate={<div>Loading...</div>}
        opentokClientUrl="https://static.opentok.com/v2/js/opentok.min.js"
        devicePreference={props.location.state}
      />
  </div>
}

export default Meeting
