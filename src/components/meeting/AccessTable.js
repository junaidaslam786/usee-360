import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import RTCDetect from 'rtc-detect';
import OT from '@opentok/client';
import './AccessTable.css';
import { APPOINTMENT_STATUS, USER_TYPE } from '../../constants';
import { getLoginToken, removeLoginToken } from '../../utils';
import AppointmentService from '../../services/agent/appointment';
import CustomerAppointmentService from '../../services/customer/appointment';
import ProfileService from '../../services/profile';

const AccessTable = (props) => {
  const { appointmentId, userType } = props;
  const token = getLoginToken();
  const history = useHistory();
  const redirectPath = `/${userType}/login?returnUrl=${encodeURIComponent(window.location.pathname)}`;

  if (!token) {
    history.push(redirectPath);
  } else {
    const decodedJwt = JSON.parse(atob(token.split(".")[1]));
    if (decodedJwt.exp * 1000 < Date.now()) {
      removeLoginToken();
      history.push(redirectPath);
    }
  }

  const publicUrl = `${process.env.REACT_APP_PUBLIC_URL}/`;
  const [browserStatus, setBrowserStatus] = useState(0);
  const [microphoneStatus, setMicrophoneStatus] = useState(0);
  const [cameraStatus, setCameraStatus] = useState(0);
  const [speakerStatus, setSpeakerStatus] = useState(0);
  const [screenSharingStatus, setScreenSharingStatus] = useState(0);
  const [audioInputOptions, setAudioInputOptions] = useState([{"label":"------------ Audio ------------"}]);
  const [videoOptions, setVideoOptions] = useState([{"label":"------------ Video ------------"}]);
  const [audioOutputOptions, setAudioOutputOptions] = useState([]);
  const [selectedAudioInput, setSelectedAudioInput] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [selectedBackground, setSelectedBackground] = useState('');
  const [publisher, setPublisher] = useState('');
  const [session, setSession] = useState('');
  const [selectedVideoDevice, setSelectedVideoDevice] = useState('');
  const [selectedAudioOutput, setSelectedAudioOutput] = useState('');
  const [appointment, setAppointment] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [canJoin, setCanJoin] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showBackground, setShowBackground] = useState(false);
  const [videoStreaming, setVideoStreaming] = useState(true);
  const [audioStreaming, setAudioStreaming] = useState(true);
  const [backgrounds, setBackgrounds] = useState([
    {
      "name": "Video Meeting 1",
      "url" : `${publicUrl}assets/video-background/video-meeting-1.jpeg`
    },
    {
      "name": "Video Meeting 2",
      "url" : `${publicUrl}assets/video-background/video-meeting-2.jpg`
    },
    {
      "name": "Video Meeting 3",
      "url" : `${publicUrl}assets/video-background/video-meeting-3.jpg`
    },
    {
      "name": "Video Meeting 4",
      "url" : `${publicUrl}assets/video-background/video-meeting-4.jpg`
    }
  ]);
  const detect = new RTCDetect();

  const getAppointmentDetail = async () => {
    const appointmentData = userType === USER_TYPE.CUSTOMER 
      ? await CustomerAppointmentService.detail(appointmentId)
      : await AppointmentService.detail(appointmentId);
    
    if (appointmentData?.status) {
      if (appointmentData.status === 'completed' || appointmentData.status === 'cancelled') {
        setCanJoin(false);
      }

      setAppointment(appointmentData);
      return appointmentData;
    }

    history.push("/");
  };

  const getSessionToken = async (appointment) => {
    const tokenData = await AppointmentService.sessionToken(appointment.id);
    return (tokenData?.token) ? tokenData.token : "";
  };

  const handleHing = () => {
    publisher.clearVideoFilter();
  }

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
    if (event.target.value === "blur") {
      setShowBackground(false);
      if (OT.hasMediaProcessorSupport()) {
        const videoFilter = {
          type: "backgroundBlur",
          blurStrength: "high",
        };
        publisher.applyVideoFilter(videoFilter);
      }
    } else if (event.target.value === "background") {
      setShowBackground(true);
    } else {
      setShowBackground(false);
      publisher.clearVideoFilter();
    }
  }

  const toggleVideo = () => {
    if (publisher?.publishVideo) {
      publisher.publishVideo(!videoStreaming);
      setVideoStreaming(!videoStreaming);
    }
  }

  const toggleAudio = () => {
    if (publisher?.publishAudio) {
      publisher.publishAudio(!audioStreaming);
      setAudioStreaming(!audioStreaming);
    }
  }

  const handleBackgroundChange = (event) => {
    setSelectedBackground(event.target.value);
    if (event.target.value !== "") {
      if (OT.hasMediaProcessorSupport()) {
        const videoFilter = {
          type: "backgroundReplacement",
          backgroundImgUrl: `${event.target.value}`,
        };
        publisher.applyVideoFilter(videoFilter);
      }
    } else {
      publisher.clearVideoFilter();
    }
  }

  const getUser = async () => {
    const jsonData = await ProfileService.getProfile();
    if (jsonData.userCallBackgroundImages) {
      debugger;
      let backgroundImages = backgrounds;
      backgroundImages.push(...jsonData.userCallBackgroundImages.map((image) => {
        return {
          name: image.name,
          url: `${process.env.REACT_APP_API_URL}/${image.url}`
        }
      }));
      setBackgrounds(backgroundImages);
    }
  };

  useEffect(() => {
    if (token) { 
      const fetchData = async () => {
        const appointmentDetail = await getAppointmentDetail();
        await getUser();

        setLoading(false);
        if (appointmentDetail?.status && (appointmentDetail.status === APPOINTMENT_STATUS.PENDING || appointmentDetail.status === APPOINTMENT_STATUS.INPROGRESS)) {
          const tokToken = await getSessionToken(appointmentDetail);

          if (detect.getAPISupported().isWebRTCSupported) {
            setBrowserStatus(1);
          } else {
            setBrowserStatus(2);
          }

          // We are giving a hard-coded value for session id because if we use actual session id it will load
          // the call instead of precall page
          const session = OT.initSession("46869314", '1_MX40Njg2OTMxNH5-MTY4NTQyNjk0NjMzMX5oWHJES3RyNmR1MnZHQnFTa3hWNWwvS2J-fn4');

          // initialize the publisher
          const publisherOptions = {
            insertMode: "append",
            audioFallbackEnabled: true,
            facingMode: "user",
            publishVideo: true,
            publishAudio: true,
            nameDisplayMode: "on",
            width: "100%",
            height: "380px",
          };

          const publisher = OT.initPublisher(
            "session-preview",
            publisherOptions,
            (error) => {}
          );

          session.connect(tokToken, (error) => {
            if (error) {
              if (error.name === "OT_NOT_CONNECTED") {
                //
              } else {
                //
              }
            } else {
              // If the connection is successful, publish the publisher to the session
              // session.publish(publisher, (error) => {});
            }
          });

          setPublisher(publisher);
          setSession(session);

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
        }
      };
  
      fetchData();

      return () => {
        if (session) {
          session.disconnect();
        }
        
        if (publisher) {
          publisher.destroy();
        }
      };
  
    }
  }, []);

  /*
  useEffect(() => {
    // this is removing the video stream if user click back button in call
    return () => {
      // Function to run when the mutation we're interested in occurs
      const handleMutation = (mutationsList, observer) => {
        for (let mutation of mutationsList) {
          if (mutation.type === 'childList') {
            const elements = document.querySelectorAll('.OT_widget-container');
            if (elements.length > 1) {
              const lastElement = elements[elements.length - 1];
              lastElement.parentNode.remove();
              observer.disconnect();  // Stop observing once we've done the operation
            }
          }
        }
      };

      // Create a new observer
      const observer = new MutationObserver(handleMutation);

      // Start observing the document with the configured parameters
      observer.observe(document.body, { childList: true, subtree: true });
      
      // Clean up function
      return () => observer.disconnect();
    }
  }, []);
  */

  return (
    <main className="main">
      <div className="container">
        <div className="logo_wrap text-center">
          <center>
            <a href="https://usee-360.com" target="_blank"><img src={`${publicUrl}assets/img/meeting-logo.png`} 
            className="w_130"
            /></a>
          </center>
          <center>
            <h1> Visit your new home <br/>
              <span
                className='text_greenish'
                > from home. 
              </span>
            </h1>
          </center>
        </div>

        <div className="row">
          <div className="col-12">
            {
              !loading ? (
                canJoin ? (
                  <div className="vr_connect_welcome">
                    <div className="row">
                      <div className='col-6'>
                        <div id="session-preview"></div>
                        <div className='d-flex justify-content-center mb-2'>
                          <select className='nice-select video-selector1' value={selectedFilter} onChange={(event) => {handleFilterChange(event)}}>
                          <option value={""}>-- Select Filter --</option>
                          <option value={"blur"}>Apply blur</option>
                          <option value={"background"}>Apply background</option>
                        </select>
                        {showBackground && <select className='nice-select video-selector2' value={selectedBackground} onChange={(event) => {handleBackgroundChange(event)}}>
                          <option value={""}>------------ Select Background ------------</option>
                          {backgrounds.map((option, index) => (
                            <option key={index} value={option.url}>
                              {option.name}
                            </option>
                          ))}
                        </select>}
                        </div>
                        {videoStreaming === true && (
                          <span className="video-icon newStyling cursor_pointer" onClick={() => toggleVideo()}>
                            <i className="fa-solid fa-video"></i>
                          </span>
                        )}
                        {videoStreaming === false && (
                          <span className="video-icon newStyling cursor_pointer" onClick={() => toggleVideo()}>
                            <i className="fa-solid fa-video-slash"></i>
                          </span>
                        )}
                        {audioStreaming === true && (
                          <span className="video-icon newStyling cursor_pointer" onClick={() => toggleAudio()}>
                            <i className="fa-solid fa-microphone"></i>
                          </span>
                        )}
                        {audioStreaming === false && (
                          <span className="video-icon newStyling cursor_pointer" onClick={() => toggleAudio()}>
                            <i className="fa-solid fa-microphone-slash"></i>
                          </span>
                        )}
                      </div>
                      <div className='col-6'>
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
                                    filter: selectedFilter,
                                    backgroundImage: selectedBackground,
                                    audioStreaming,
                                    videoStreaming,
                                    appointment,
                                  }
                                }}><button disabled={buttonDisabled} className="video-join-call">JOIN CALL</button></Link>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : (
                  <h3>This appoinment has been completed or canceled. Please create another.</h3>
                )
              ) : (
                "Loading ..."
              )
            }
          </div>
        </div>
      </div> 
    </main>
  );
};

export default AccessTable;
