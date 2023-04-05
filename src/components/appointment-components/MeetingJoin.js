import React, { useState, useEffect } from "react";
import OT from "@opentok/client";
import { useHistory } from 'react-router-dom';
import "./incall.css";
import Slideshow from "../Slideshow";
const fs = require('fs');

function getToken(userType) {
  let userToken = null;
  if(userType === "agent") {
    const tokenString = localStorage.getItem("agentToken");
    userToken = JSON.parse(tokenString);
  } else if(userType === "customer") {
    const tokenString = localStorage.getItem("customerToken");
    userToken = JSON.parse(tokenString);
  }

  return userToken;
}

const MeetingJoin = (props) => {
  const { 
    audioInputDeviceId, 
    audioOutputDeviceId, 
    videoDeviceId, 
    appointment,
    userType,
    appointmentId
  } = props;

  const token = getToken(userType);
  const history = useHistory();

  if (!token) {
    if(userType === "agent")
      history.push("/agent/login");
    else if(userType === "customer")
      history.push("/customer/login");
    else
      history.push("/");
  } else {
    const decodedJwt = JSON.parse(atob(token.split(".")[1]));
    if (decodedJwt.exp * 1000 < Date.now()) {
      if(userType === "agent"){
        localStorage.removeItem("agentToken");
        history.push("/agent/login");
      } else if(userType === "customer") {
        localStorage.removeItem("customerToken");
        history.push("/customer/login");
      }
    }
  }

  const publicUrl = `${process.env.PUBLIC_URL}/`;
  const [videoStreaming, setVideoStreaming] = useState(true);
  const [audioStreaming, setAudioStreaming] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [publisher, setPublisher] = useState(null);
  const [screenPublisher, setScreenPublisher] = useState(null);
  const [subscriber, setSubscriber] = useState(true); 
  const [session, setSession] = useState(true);
  const [propertiesList, setPropertiesList] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [virtualTourUrl, setVirtualTourUrl] = useState(null);
  const [virtualTourVideo, setVirtualTourVideo] = useState(null);
  const [productImages, setProductImages] = useState(null);
  const [defaultImage, setDefaultImage] = useState(true);
  const agentJWTToken = JSON.parse(localStorage.getItem("agentToken"));
  const customerJWTToken = JSON.parse(localStorage.getItem("customerToken"));

  const getPropertiesList = async () => {
    return fetch(`${process.env.REACT_APP_API_URL}/property/list?page=1&size=1000`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json", 
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.json())
    .then((propertyData) => {
      setPropertiesList(propertyData.data.map((property) => {
        return { label: property.description, value: property.id };
      }));                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
    }).catch((error) => {
      console.error("Error:", error);
    });
  };

  const getPropertyDetail = async (property) => {
    return fetch(`${process.env.REACT_APP_API_URL}/property/${property}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json", 
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.json())
    .then((propertyData) => { 
      setVirtualTourUrl(null);
      setVirtualTourVideo(null);
      setProductImages(null);
      if(propertyData.virtualTourType === "url" && propertyData.virtualTourUrl) {
        setVirtualTourUrl(propertyData.virtualTourUrl);
        setDefaultImage(false);
      } else if(propertyData.virtualTourType === "video" && propertyData.virtualTourUrl) {
        setVirtualTourVideo(propertyData.virtualTourUrl);
        setDefaultImage(false);
      }
      if(propertyData.productImages.length > 0) {
        setProductImages(propertyData.productImages);
        setDefaultImage(false);
      }
    }).catch((error) => {
      console.error("Error:", error);
    });
  };

  const getSessionToken = async () => {
    if(userType === "agent") {
      return fetch(`${process.env.REACT_APP_API_URL}/agent/appointment/session-token/${appointment.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => response.json())
      .then((tokenData) => {
        return tokenData.token;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
      }).catch((error) => {
        console.error("Error:", error);
      });
    } else if(userType === "customer") {
      return fetch(`${process.env.REACT_APP_API_URL}/agent/appointment/session-token/${appointment.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => response.json())
      .then((tokenData) => {
        return tokenData.token;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
      }).catch((error) => {
        console.error("Error:", error);
      });
    }
  };

  useEffect(async () => {
    const tokToken = await getSessionToken();
    if(userType === "agent") { 
      getPropertiesList();
      getPropertyDetail(appointment.products[0].id);
      setSelectedProperty(appointment.products[0].id);
    }
    const session = OT.initSession('46869314', appointment.sessionId);
    setSession(session);
    session.on({
      streamCreated: (event) => {
        if(event.stream.videoType === "camera") {
          const subscriberOptions = { insertMode: "append", nameDisplayMode: 'on' };
          const subscriber = session.subscribe(
            event.stream,
            "subscribers",
            subscriberOptions,
            (error) => {}
          );
          setSubscriber(subscriber);
          subscriber.on('videoElementCreated', function(event) {
  
          });
          var subscriberDisconnectedNotification = document.createElement("div");
          subscriberDisconnectedNotification.className =
            "subscriberDisconnectedNotification";
          subscriberDisconnectedNotification.innerText =
            "Stream has been disconnected unexpectedly. Attempting to automatically reconnect...";
          subscriber.element.appendChild(subscriberDisconnectedNotification);
          subscriber.on({
            disconnected: function (event) {
              subscriberDisconnectedNotification.style.visibility = "visible";
            },
            connected: function (event) {
              subscriberDisconnectedNotification.style.visibility = "hidden";
            },
          });
        } else if(event.stream.videoType === "screen") {
          const subscriberOptions = { insertMode: "replace", width: '100%',
          height: '100%' };
          setVirtualTourUrl(null);
          setVirtualTourVideo(null);
          setProductImages(null);
          setDefaultImage(null);
          const screenshareEle = document.createElement("div");
          const screenPreview = document.getElementById("screen-preview");
          //const ot_element = document.getElementById(`OT`)
          console.log(event.stream)
          screenPreview.appendChild(screenshareEle);
          const subscriber = session.subscribe(
            event.stream,
            screenshareEle,
            subscriberOptions,
            (error) => {}
          );
        }
      },
      streamDestroyed: (event) => {
        if(event.reason === "clientDisconnected" && event.stream.videoType === "screen"){
          setDefaultImage(true);
        }
      },
      connectionCreated: function (event) {
        console.log("Connection created" + event);
      },
      connectionDestroyed: function (event) {
        console.log("Connection destroyed");
      },
      sessionDisconnected: function sessionDisconnectHandler(event) {
        console.log("You were disconnected from the session.", event.reason);
        // setTimeout(function() {
        //   session.connect(token, function(error) {
        //     if (error) {
        //       console.error('Failed to reconnect to the session:', error.message);
        //     } else {
        //       console.log('Session reconnected.');
        //     }
        //   });
        // }, 5000);
      },
      sessionReconnecting: function () {
        console.log("Session reconn");
      },
      sessionReconnected: function () {
      },
    });

    const msgHistory = document.querySelector("#history");
    session.on("signal:msg", (event) => {
      if(userType === 'customer' && event.data.includes("PROPERTY_ID")) {
        console.log(event.data);
        getPropertyDetail(event.data.split(':')[1]);
      }
      const msg = document.createElement("p");
      msg.textContent = event.data;

      // console.log(event.files[0])
      // fs.copyFile('source.txt', 'destination.txt', (err) => {
      //   if (err) throw err;
      //   console.log('source.txt was copied to destination.txt');
      // });

      // Insert anchor tag to download uploaded file to the directory
      // const a = document.createElement("a");
      // const text = document.createTextNode(' Download');
      // a.appendChild(text)
      // a.href =`${publicUrl}assets/img/icons/chat.png`;
      // a.download = "file.png";
      // msg.appendChild(a)

      msg.className =
        event.from.connectionId === session.connection.connectionId
          ? "mine"
          : "theirs";
      msgHistory.appendChild(msg);
      msg.scrollIntoView();
    });

    // initialize the publisher
    const publisherOptions = {
      insertMode: "append",
      audioFallbackEnabled: true,
      facingMode: "user",
      publishVideo: true,
      publishAudio: true,
      name: userType === "customer" ? `${appointment.customerUser.firstName} ${appointment.customerUser.lastName}` : 
      `${appointment.agentUser.firstName} ${appointment.agentUser.lastName}`,
      nameDisplayMode: 'on'
    };
    if (audioInputDeviceId || videoDeviceId) {
      publisherOptions.audioSource = audioInputDeviceId;
      publisherOptions.videoSource = videoDeviceId;
    }
    // if (OT.hasMediaProcessorSupport()) {
    //   publisherOptions.videoFilter = {
    //     type: "backgroundReplacement",
    //     backgroundImgUrl: "http://localhost:3000/assets/img/video-meeting-1.jpeg",
    //   };
    // }
    const publisher = OT.initPublisher(
      "publisher",
      publisherOptions,
      (error) => {}
    );
    setPublisher(publisher);
    // Connect to the session
    session.connect(tokToken, (error) => {
      if (error) {
        if (error.name === "OT_NOT_CONNECTED") {
          //
        } else {
          //
        }
      } else {
        console.log(publisher.element);
        // If the connection is successful, publish the publisher to the session
        session.publish(publisher, (error) => {});
      }
    });
    // Text chat
    const form = document.querySelector("form");
    const msgTxt = document.querySelector("#msgTxt");

    // Send a signal once the user enters data in the form
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      session.signal(
        {
          type: "msg",
          data: msgTxt.value,
        },
        (error) => {
          if (error) {
            //handleError(error);
          } else {
            msgTxt.value = "";
          }
        }
      );
    });
  }, []);

  function toggleVideo() {
    publisher.publishVideo(!videoStreaming);
    setVideoStreaming(!videoStreaming);
  }

  function toggleAudio() {
    publisher.publishAudio(!audioStreaming);
    setAudioStreaming(!audioStreaming);
  }

  function toggleScreenSharing() {
    if (screenSharing) {
      screenPublisher.destroy();
      setScreenPublisher(null);
      setScreenSharing(false);
    } else {
      const screenshareEle = document.createElement("div");
      OT.checkScreenSharingCapability(function (response) {
        if (!response.supported || response.extensionRegistered === false) {
          alert("This browser does not support screen sharing");
        } else if (response.extensionInstalled === false) {
          // Prompt to install the extension.
        } else {
          // Screen sharing is available. Publish the screen.
          const screenPreview = document.getElementById("screen-preview");
          screenPreview.appendChild(screenshareEle);
          const publisher = OT.initPublisher(
            screenshareEle,
            { videoSource: "screen", width: '100%',
            height: '100%' },
            function (error) {
              if (error) {
                // Look at error.message to see what went wrong.
              } else {
                session.publish(publisher, function (error) {
                  if (error) {
                    // Look error.message to see what went wrong.
                  }
                });
                setScreenSharing(true);
                setScreenPublisher(publisher);
              }
            }
          );
          publisher.on('streamDestroyed', function(event) {
            if (event.stream.videoType === 'screen') {
              setDefaultImage(true);
            }
          });
        }
      });
      setVirtualTourUrl(null);
      setVirtualTourVideo(null);
      setProductImages(null);
      setDefaultImage(null);
    }
  }

  function getUrl(event) {
    const files = event.target.files;
    console.log(files[0])
    // const response = await channel.sendImage(files[0]);
  }

  async function handlePropertyChange (event) {
    setSelectedProperty(event.target.value);
    if(userType === "agent") {
      session.signal(
        {
          type: "msg",
          data: `PROPERTY_ID:${event.target.value}`,
        },
        (error) => {
          if (error) {
          } else {
          }
        }
      );
      getPropertyDetail(event.target.value);
    }
  }

  return (
    <div id="meetingBody">
      <div id="main" className="row" style={{ margin: "0" }}>
        <div id="members" className="col col-sm-9 col-md-3 col-lg-3 bg-sm-dark">
          <div>
            <center>
              <img
                src={`${publicUrl}assets/img/meeting-logo.png`}
                style={{ width: "130px", margin: "25px 0 16px 0" }}
              />
            </center>
          </div>
          {userType === "agent" && <div>
              <select class="nice-select" value={selectedProperty} onChange={(event) => {handlePropertyChange(event)}}>
                {propertiesList.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
          </div>}
          <div id="publisher"></div>
          <div id="subscribers"></div>
        </div>
        <div id="screen-preview" className="col-md-9 col-lg-9">
          {virtualTourUrl && (
            <iframe
            src={virtualTourUrl}
            id="prop_tour_link"
            style={{ width: "100%", height: "100%" }}
          ></iframe>
          )}
          {virtualTourVideo && (
            <video width="100%" height="100%" controls>
              <source src={`http://localhost:8000/${virtualTourVideo}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          {productImages && (
            <Slideshow fadeImages={productImages}/>
          )}
          {defaultImage && (
            <img src={`${publicUrl}assets/img/default-property.jpg`} />
          )}
        </div>
      </div>
      <div id="chatOptions">
        <div id="toggle2">
          <img
            id="ChatIcon2"
            src={`${publicUrl}assets/img/icons/chat.png`}
            onClick={() => {
              let slider = document.getElementById("chatArea");

              let isOpen = slider.classList.contains("slide-in");

              slider.setAttribute("class", isOpen ? "slide-out" : "slide-in");
            }}
          />
        </div>

        <div>
          {videoStreaming === true && (
            <img
              src={`${publicUrl}assets/img/icons/video-selected.png`}
              onClick={() => toggleVideo()}
            />
          )}
          {videoStreaming === false && (
            <img
              src={`${publicUrl}assets/img/icons/video-not-selected.png`}
              onClick={() => toggleVideo()}
            />
          )}
          {audioStreaming === true && (
            <img
              src={`${publicUrl}assets/img/icons/mic-selected.png`}
              onClick={() => toggleAudio()}
            />
          )}
          {audioStreaming === false && (
            <img
              src={`${publicUrl}assets/img/icons/mic-not-selected.png`}
              onClick={() => toggleAudio()}
            />
          )}
          {screenSharing === true && (
            <img
              src={`${publicUrl}assets/img/icons/share.png`}
              onClick={() => toggleScreenSharing()}
            />
          )}
          {screenSharing === false && (
            <img
              src={`${publicUrl}assets/img/icons/share.png`}
              onClick={() => toggleScreenSharing()}
            />
          )}
        </div>

        <div id="toggle">
          <img
            id="ChatIcon2"
            src={`${publicUrl}assets/img/icons/chat.png`}
            onClick={() => {
              let slider = document.getElementById("chatArea");

              let isOpen = slider.classList.contains("slide-in");

              slider.setAttribute("class", isOpen ? "slide-out" : "slide-in");
            }}
          />
        </div>
      </div>
      <div id="chatArea" className={"slide-out"}>
        <p id="history"></p>
        <form id="Chatform" encType="multipart/form-data" action="">

          {/* <div>
          <img style={{position:'absolute', height:'32px', maxWidth:'32px', left:'0'}}
            src={`${publicUrl}assets/img/icons/attach-file.png`}
          />
          <input type="file" id="file" name="file" onChange={getUrl} />
          </div> */}

          <input type="text" placeholder="Input your text here" id="msgTxt" />

          <div>
          <img style={{position:'absolute', height:'32px', maxWidth:'32px', right:'0'}}
            src={`${publicUrl}assets/img/icons/send-icon.png`}
          />
          <input type="submit" id="submit" name="submit" />
          </div>

        </form>
      </div>
    </div>
  );
};

export default MeetingJoin;
