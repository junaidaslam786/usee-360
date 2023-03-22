import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RTCDetect from 'rtc-detect';
import OT from '@opentok/client';
import './AccessTable.css';

const AccessTable = (props) => {

  const publicUrl = `${process.env.PUBLIC_URL}/`;
  const [browserStatus, setBrowserStatus] = useState(0);
  const [microphoneStatus, setMicrophoneStatus] = useState(0);
  const [cameraStatus, setCameraStatus] = useState(0);
  const [speakerStatus, setSpeakerStatus] = useState(0);
  const [screenSharingStatus, setScreenSharingStatus] = useState(0);
  const [audioInputOptions, setAudioInputOptions] = useState([{"label":"------------ Audio ------------"}]);
  const [videoOptions, setVideoOptions] = useState([{"label":"------------ Video ------------"}]);
  const [audioOutputOptions, setAudioOutputOptions] = useState([]);
  const [selectedAudioInput, setSelectedAudioInput] = useState(null);
  const [selectedVideoDevice, setSelectedVideoDevice] = useState(null);
  const [selectedAudioOutput, setSelectedAudioOutput] = useState(null);
  const detect = new RTCDetect();

  useEffect(() => {
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
    <main class="main">
      <div class="container">
        <div class="logo_wrap text-center" style={{display: 'flex', justifyContent:'space-between', alignItems:'center'}}>
            <center>
              <a href="https://usee-360.com" target="_blank"><img src={`${publicUrl}assets/img/meeting-logo.png`} style={{"width":"130px"}} /></a>
            </center>
            <center>
            <h1> Visit your new home <br/>
                <span> from home.</span>
              </h1>
            </center>
        </div>

        <div class="row">
          <div class="col-12">
            <div class="vr_connect_welcome">

              <p>Today, you have an appointment at <span>19:16</span> with your customer, <span>saad jamil.</span>
              </p>
              <h3>Testing your system</h3>
              <table style={{ "width" : "50%" }}>
                <tr>
                  <td>Browser</td>
                  <td>
                    {browserStatus === 0 && <p>Waiting to check...</p> }
                    {browserStatus === 1 && <p>SUCCESS</p> }
                    {browserStatus === 2 && <p>WebRTC is not supported for this device</p> }
                  </td>
                </tr>
                <tr>
                  <td>Microphone</td>
                  <td>
                    <select value={selectedAudioInput} onChange={(event) => {setSelectedAudioInput(event.target.value)}}>
                      {audioInputOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {microphoneStatus === 0 && <p>Waiting to check...</p> }
                    {microphoneStatus === 1 && <p>SUCCESS</p> }
                    {microphoneStatus === 2 && <p>Microphone permission denied</p> }
                  </td> 
                </tr>
                <tr>
                  <td>Camera</td>
                  <td>
                    <select value={selectedVideoDevice} onChange={(event) => {setSelectedVideoDevice(event.target.value)}}>
                      {videoOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {cameraStatus === 0 && <p>Waiting to check...</p> }
                    {cameraStatus === 1 && <p>SUCCESS</p> }
                    {cameraStatus === 2 && <p>Camera permission denied</p> }
                  </td> 
                </tr>
                {/* <tr>
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
                <tr>
                  <td>Screensharing</td>
                  <td>
                    {screenSharingStatus === 0 && <p>Waiting to check...</p> }
                    {screenSharingStatus === 1 && <p>SUCCESS</p> }
                    {screenSharingStatus === 2 && <p>Screensharing is not available for this browser</p> }
                  </td>
                </tr>
                <tr>
                  <Link to={{
                    pathname: "/meeting",
                    state: { 
                      audioInputDeviceId: selectedAudioInput, 
                      audioOutputDeviceId: selectedAudioOutput,
                      videoDeviceId: selectedVideoDevice
                    }
                  }}><button disabled="disabled">JOIN CALL</button></Link>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AccessTable;
