import React from "react";
import MeetingJoin from '../components/appointment-components/MeetingJoin';
import AccessTable from '../components/appointment-components/AccessTable';
import { useHistory, useParams } from 'react-router-dom';

const Meeting = (props) => {
  let { id, usertype } = useParams();
  const history = useHistory();
  if(!props.location.state) {
    history.push(`/precall/${id}/${usertype}`);
    return (
      <div>
        <AccessTable
          appointmentId={id}
          userType={usertype}
        />
      </div>
    );
  } else {
    const {
      audioInputDeviceId, 
      audioOutputDeviceId, 
      videoDeviceId, 
      appointment,
      filter,
      backgroundImage,
      audioStreaming,
      videoStreaming
    } = props.location.state;
    return (
      <div>
        <MeetingJoin
          audioInputDeviceId={audioInputDeviceId}
          audioOutputDeviceId={audioOutputDeviceId}
          videoDeviceId={videoDeviceId}
          appointment={appointment}
          appointmentId={id}
          userType={usertype}
          filter={filter}
          backgroundImage={backgroundImage}
          videoStreamingVal={videoStreaming}
          audioStreamingVal={audioStreaming}
        />
      </div>
    );
  }
};

export default Meeting;
