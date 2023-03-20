import React, { useState, useEffect } from "react";
import OT from "@opentok/client";
import { cond } from "lodash";

const MeetingJoin = (props) => {  
  const {
    apiKey,
    sessionId,
    token,
    devicePreference
  } = props;
  const publicUrl = `${process.env.PUBLIC_URL}/`;
  const [videoStreaming, setVideoStreaming] = useState(true);
  const [audioStreaming, setAudioStreaming] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [publisher, setPublisher] = useState(null);
  const [screenPublisher, setScreenPublisher] = useState(null);
  const [subscriber, setSubscriber] = useState(true);
  const [session, setSession] = useState(true);

  useEffect( () => {
    const session = OT.initSession(apiKey, sessionId);
    setSession(session);
    // Subscribe to a newly created stream
    session.on({
      streamCreated: (event) => {
        const subscriberOptions = { insertMode: 'append' };
        const subscriber = session.subscribe(event.stream, 'subscribers', subscriberOptions, (error) => {});
        setSubscriber(subscriber);
        var subscriberDisconnectedNotification = document.createElement('div');
        subscriberDisconnectedNotification.className = 'subscriberDisconnectedNotification';
        subscriberDisconnectedNotification.innerText =
          'Stream has been disconnected unexpectedly. Attempting to automatically reconnect...';
        console.log(subscriber.element);
        subscriber.element.appendChild(subscriberDisconnectedNotification);
        subscriber.on({
          disconnected: function(event) {
            subscriberDisconnectedNotification.style.visibility = 'visible';
          },
          connected: function(event) {
            subscriberDisconnectedNotification.style.visibility = 'hidden';
          }
        });
      },
      connectionCreated: function (event) {
        console.log('Connection created' + event);
      },
      connectionDestroyed: function (event) {
        console.log('Connection destroyed');
      },
      sessionDisconnected: function sessionDisconnectHandler(event) {
        // The event is defined by the SessionDisconnectEvent class
        console.log('You were disconnected from the session.', event.reason);
      },
      sessionReconnecting: function() {
        // Display a user interface notification.
      },
      sessionReconnected: function() {
        // Adjust user interface.
      },
    });

    const msgHistory = document.querySelector('#history');
    session.on('signal:msg', (event) => {
      const msg = document.createElement('p');
      msg.textContent = event.data;
      msg.className = event.from.connectionId === session.connection.connectionId ? 'mine' : 'theirs';
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
    };
    if(devicePreference) {
      publisherOptions.audioSource = devicePreference.audioInputDeviceId;
      publisherOptions.videoSource = devicePreference.videoDeviceId;
    }
    if (OT.hasMediaProcessorSupport()) {
      publisherOptions.videoFilter = {
        type: 'backgroundBlur',
        blurStrength: 'high'
      };
    }
    const publisher = OT.initPublisher('publisher', publisherOptions, (error) => {

    });
    setPublisher(publisher);
    // Connect to the session
    session.connect(token, (error) => {
      if (error) {
        if (error.name === "OT_NOT_CONNECTED") {
          //
        } else {
          //
        }
      } else {
        console.log(publisher.element);
        // If the connection is successful, publish the publisher to the session
        session.publish(publisher, (error) => {

        });
      }
    });
    // Text chat
    const form = document.querySelector('form');
    const msgTxt = document.querySelector('#msgTxt');

    // Send a signal once the user enters data in the form
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      session.signal({
        type: 'msg',
        data: msgTxt.value
      }, (error) => {
        if (error) {
          //handleError(error);
        } else {
          msgTxt.value = '';
        }
      });
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
    if(screenSharing) {
      screenPublisher.destroy();
      setScreenPublisher(null);
      setScreenSharing(false);
    } else {
      OT.checkScreenSharingCapability(function(response) {
        if(!response.supported || response.extensionRegistered === false) {
          // This browser does not support screen sharing.
        } else if (response.extensionInstalled === false) {
          // Prompt to install the extension.
        } else {
          // Screen sharing is available. Publish the screen.
          const publisher = OT.initPublisher('screen-preview',
            {videoSource: 'screen'},
            function(error) {
              if (error) {
                // Look at error.message to see what went wrong.
              } else {
                session.publish(publisher, function(error) {
                  if (error) {
                    // Look error.message to see what went wrong.
                  }
                });
                setScreenSharing(true);
                setScreenPublisher(publisher);
              }
            }
          );

        }
      });
    }
  }
  
  return (
    <>
      <div id="">
        <div id="publisher"></div>
        <div id="subscribers"></div>
        <div id="screen-preview"></div> 
      </div>
      <div>
        {videoStreaming === true && <img src={`${publicUrl}assets/img/icons/video-selected.png`} onClick={() => toggleVideo()} />}
        {videoStreaming === false && <img src={`${publicUrl}assets/img/icons/video-not-selected.png`} onClick={() => toggleVideo()} />}
        {audioStreaming === true && <img src={`${publicUrl}assets/img/icons/mic-selected.png`} onClick={() => toggleAudio()} />}
        {audioStreaming === false && <img src={`${publicUrl}assets/img/icons/mic-not-selected.png`} onClick={() => toggleAudio()} />}
        {screenSharing === true && <img src={`${publicUrl}assets/img/icons/share.png`} onClick={() => toggleScreenSharing()} />}
        {screenSharing === false && <img src={`${publicUrl}assets/img/icons/share.png`} onClick={() => toggleScreenSharing()} />}
      </div>
      <div id="textchat">
         <p id="history"></p>
         <form>
              <input type="text" placeholder="Input your text here" id="msgTxt"></input>
         </form>
      </div>
    </>
  );

  return <div id="video-stream"></div>;
};

export default MeetingJoin;
