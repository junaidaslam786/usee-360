import React from "react";
import MeetingJoin from '../components/appointment-components/MeetingJoin';

const Meeting = (props) => {

  const { appointment } = props;
  return (
    <div>
      <MeetingJoin
        appointment={appointment}
      />
    </div>
  );
};

export default Meeting;
