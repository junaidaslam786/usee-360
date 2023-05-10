import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import RTCDetect from 'rtc-detect';
import OT from '@opentok/client';
import './AccessTable.css';
import { USER_TYPE } from '../../constants';

function getToken(userType) {
  let userToken = null;
  if(userType === USER_TYPE.AGENT) {
    const tokenString = localStorage.getItem("agentToken");
    userToken = JSON.parse(tokenString);
  } else if(userType === USER_TYPE.CUSTOMER) {
    const tokenString = localStorage.getItem("customerToken");
    userToken = JSON.parse(tokenString);
  }

  return userToken;
}

const AccessTable = (props) => {

  const { appointmentId, userType } = props;
  const token = getToken(userType);
  const history = useHistory();

  if (!token) {
    if(userType === USER_TYPE.AGENT)
      history.push('/agent/login?returnUrl=' + encodeURIComponent(window.location.pathname));
    else if(userType === USER_TYPE.CUSTOMER)
      history.push("/customer/login?returnUrl=" + encodeURIComponent(window.location.pathname));
    else
      history.push("/");
  } else {
    const decodedJwt = JSON.parse(atob(token.split(".")[1]));
    if (decodedJwt.exp * 1000 < Date.now()) {
      if(userType === USER_TYPE.AGENT){
        localStorage.removeItem("agentToken");
        history.push('/agent/login?returnUrl=' + encodeURIComponent(window.location.pathname));
      } else if(userType === USER_TYPE.CUSTOMER) {
        localStorage.removeItem("customerToken");
        history.push("/customer/login?returnUrl=" + encodeURIComponent(window.location.pathname));
      }
    }
  }

  const publicUrl = `${process.env.PUBLIC_URL}/`;
  const [browserStatus, setBrowserStatus] = useState(0);
  const [microphoneStatus, setMicrophoneStatus] = useState(0);
  const [cameraStatus, setCameraStatus] = useState(0);
  const [speakerStatus, setSpeakerStatus] = useState(0);
  const [screenSharingStatus, setScreenSharingStatus] = useState(0);
  const [audioInputOptions, setAudioInputOptions] = useState([{"label":"------------ Audio ------------"}]);
  const [videoOptions, setVideoOptions] = useState([{"label":"------------ Video ------------"}]);
  const [audioOutputOptions, setAudioOutputOptions] = useState([]);
  const [selectedAudioInput, setSelectedAudioInput] = useState('');
  const [selectedVideoDevice, setSelectedVideoDevice] = useState('');
  const [selectedAudioOutput, setSelectedAudioOutput] = useState('');
  const [appointment, setAppointment] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [canJoin, setCanJoin] = useState(true);
  const detect = new RTCDetect();

  const getAppointmentDetail = async () => {
    let url = '';
    if(userType === USER_TYPE.AGENT) url = `${process.env.REACT_APP_API_URL}/agent/appointment/${appointmentId}`;
    else if(userType === USER_TYPE.CUSTOMER) url = `${process.env.REACT_APP_API_URL}/customer/appointment/${appointmentId}`;
    else ;
    return fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.json())
    .then((appointmentData) => { 
      if(appointmentData.message) {
        alert(appointmentData.message);
        history.push("/");
      } else {
        if(appointmentData.status === 'completed' || appointmentData.status === 'cancelled') {
          setCanJoin(false);
        }
        setAppointment(appointmentData);
      }
    }).catch((error) => {
      console.error("Error:", error);
      history.push("/");
    });
  };

  useEffect(() => {
    if(token) getAppointmentDetail();
    if (detect.getAPISupported().isWebRTCSupported) {
      setBrowserStatus(1);
    } else {
      setBrowserStatus(2);
    }
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        navigator.mediaDevices.enumerateDevices().then((devices) => {
          const audioInputDevices = devices
            .filter((device) => device.kind === "audioinput")
            .map((device) => {
              return { value: device.deviceId, label: device.label };
            });
          setAudioInputOptions(audioInputDevices);
          setSelectedAudioInput(audioInputDevices[0].value);
          setMicrophoneStatus(1);

          const videoDevices = devices
            .filter((device) => device.kind === "videoinput")
            .map((device) => {
              return { value: device.deviceId, label: device.label };
            });
          setVideoOptions(videoDevices);
          setSelectedVideoDevice(videoDevices[0].value);
          setCameraStatus(1);

          const audioOutputDevices = devices
            .filter((device) => device.kind === "audiooutput")
            .map((device) => {
              return { value: device.deviceId, label: device.label };
            });
          setAudioOutputOptions(audioOutputDevices);
          setSelectedAudioOutput(audioOutputDevices[0].value);
          setSpeakerStatus(1);
          setButtonDisabled(false);
        });
      })
      .catch((error) => {
        setMicrophoneStatus(2);
        setCameraStatus(2);
        setSpeakerStatus(2);
      });
    OT.checkScreenSharingCapability(function (response) {
      if (!response.supported || response.extensionRegistered === false) {
        setScreenSharingStatus(2);
      } else if (response.extensionInstalled === false) {
        // Prompt to install the extension
      } else {
        setScreenSharingStatus(1);
      }
    });
  }, []);

  return (
    <main className="main">
      {canJoin && <div className="container">
        <div className="logo_wrap text-center">
            <center>
              <a href="https://usee-360.com" target="_blank"><img src={`${publicUrl}assets/img/meeting-logo.png`} style={{"width":"130px"}} /></a>
            </center>
            <center>
            <h1> Visit your new home <br/>
                <span style={{color:'#00cb04'}}> from home.</span>
              </h1>
            </center>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="vr_connect_welcome">

              <p>You have an appointment at 
                {appointment && appointment.appointmentTime && 
                  <b> {appointment.appointmentTime}</b>} 
                <br /> with
                 {appointment && appointment.agentUser && userType === USER_TYPE.CUSTOMER && 
                  <b> {appointment.agentUser.firstName} {appointment.agentUser.lastName}</b>}
                {appointment && appointment.customerUser && userType === USER_TYPE.AGENT && 
                  <b> {appointment.customerUser.firstName} {appointment.customerUser.lastName}</b>}
              </p>
              <h3>Testing your system</h3>
              <table className='testing_results'>
                <tbody>
                  <tr className='single_drow'>
                    <td className='testing_secn'>Browser</td>
                    <td className='testing_res success_msg' id="browserresult">
                      {browserStatus === 0 && <p>Waiting to check...</p> }
                      {browserStatus === 1 && <p>SUCCESS</p> }
                      {browserStatus === 2 && <p>WebRTC is not supported for this device</p> }
                    </td>
                  </tr>
                  <tr className='single_drow'>
                    <td className='testing_secn'>Microphone</td>
                    <td className='testing_res success_msg' id="browserresult">
                      <select value={selectedAudioInput} onChange={(event) => {setSelectedAudioInput(event.target.value)}}>
                        {audioInputOptions.map((option, index) => (
                          <option key={index} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {/* {microphoneStatus === 0 && <p>Waiting to check...</p> }
                      {microphoneStatus === 1 && <p>SUCCESS</p> }
                      {microphoneStatus === 2 && <p>Microphone permission denied</p> } */}
                    </td> 
                  </tr>
                  <tr className='single_drow'>
                    <td className='testing_secn'>Camera</td>
                    <td className='testing_res success_msg' id="browserresult">
                      <select value={selectedVideoDevice} onChange={(event) => {setSelectedVideoDevice(event.target.value)}}>
                        {videoOptions.map((option, index) => (
                          <option key={index} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {/* {cameraStatus === 0 && <p>Waiting to check...</p> }
                      {cameraStatus === 1 && <p>SUCCESS</p> }
                      {cameraStatus === 2 && <p>Camera permission denied</p> } */}
                    </td> 
                  </tr>
                  {/* <tr className='single_drow'>
                    <td>Speaker</td>
                    <td>
                      <select value={selectedAudioOutput} onChange={(event) => {setSelectedAudioOutput(event.target.value)}}>
                        {audioOutputOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {speakerStatus === 0 && <p>Waiting to check...</p> }
                      {speakerStatus === 1 && <p>SUCCESS</p> }
                      {speakerStatus === 2 && <p>Speaker/AudioOutputDevice permission denied</p> }
                    </td>
                  </tr> */}
                  <tr className='single_drow'>
                    <td className='testing_secn'>Screensharing</td>
                    <td className='testing_res success_msg' id="browserresult">
                      {screenSharingStatus === 0 && <p>Waiting to check...</p> }
                      {screenSharingStatus === 1 && <p>SUCCESS</p> }
                      {screenSharingStatus === 2 && <p>Screensharing is not available for this browser</p> }
                    </td>
                  </tr>
                  <tr className='single_drow'>
                      <Link to={{
                        pathname: `/meeting/${appointmentId}/${userType}`,
                        state: { 
                          audioInputDeviceId: selectedAudioInput, 
                          audioOutputDeviceId: selectedAudioOutput,
                          videoDeviceId: selectedVideoDevice,
                          appointment,
                        }
                      }}><button disabled={buttonDisabled}>JOIN CALL</button></Link>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div> }
      {!canJoin && 
        <div>
          This appoinment has been completed or canceled. Please create another.
        </div>
      }
    </main>
  );
};

export default AccessTable;
