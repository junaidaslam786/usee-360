import React from "react";
import MeetingJoin from '../components/appointment-components/MeetingJoin';

const Meeting = (props) => {

  return (
    <div>
      <MeetingJoin
        appointmentsProps={props.location.state}
      />
    </div>
  );
};

export default Meeting;
