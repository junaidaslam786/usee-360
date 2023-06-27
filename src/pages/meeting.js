import React, { useState } from "react";
import MeetingJoin from '../components/meeting/MeetingJoin';
import AccessTable from '../components/meeting/AccessTable';
import { useHistory, useParams } from 'react-router-dom';
import { setResponseHandler } from "../utils";
import ResponseHandler from "../components/partial/response-handler";

const Meeting = (props) => {
  const [responseMessage, setResponseMessage] = useState();

  const setResponseMessageHandler = (response, isSuccess = false) => {
    setResponseMessage(setResponseHandler(response, isSuccess));
  }
  
  let { id, usertype } = useParams();
  const history = useHistory();

  if (!props.location.state) {
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
          responseHandler={setResponseMessageHandler}
        />
        <ResponseHandler response={responseMessage} type={usertype} />
      </div>
    );
  }
};

export default Meeting;
