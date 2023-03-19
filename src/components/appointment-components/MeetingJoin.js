import React, { useState, useEffect } from 'react';
import OT from '@opentok/client';
import { cond } from 'lodash';

const MeetingJoin = (props) => {  
  const {
    apiKey,
    sessionId,
    token,
    devicePreference
  } = props;
  console.log(devicePreference);
  OT.getDevices(function(error, devices) {
    const audioInputDevices = devices.filter(device => device.kind === 'audioInput').map(device => {
      return { value: device.deviceId, label: device.label} 
    });
    console.log(audioInputDevices);
    const videoDevices = devices.filter(device => device.kind === 'videoInput').map(device => {
      return { value: device.deviceId, label: device.label} 
    });
    console.log(videoDevices);
  });
  // var audioInputDevices;
  // var videoInputDevices;
  // const session = OT.initSession(apiKey, sessionId);
  // OT.getDevices(function(error, devices) {
  //   audioInputDevices = devices.filter(function(element) {
  //     return element.kind == "audioInput";
  //   });
  //   videoInputDevices = devices.filter(function(element) {
  //     return element.kind == "videoInput";
  //   });
  //   const session = OT.initSession(apiKey, sessionId);
  //   const publisherProperties = {
  //     insertMode: "append",
  //     audioFallbackEnabled: true,
  //     facingMode: "user",
  //     audioSource: audioInputDevices[0].deviceId,
  //     videoSource: videoInputDevices[0].deviceId
  //   };
  //   const publisher = OT.initPublisher('video-stream', publisherProperties, function (error) {
  //     if (error) {
  //       console.log(error);
  //     } else {
  //       console.log("Publisher initialized.");
  //     }
  //   });
  //   publisher.on({
  //     accessAllowed: function (event) {
  //       console.log(event);
  //     },
  //     accessDenied: function (event) {
  //       console.log(event);
  //     }
  //   });
  // });
  // console.log(devicePreference);

  // useEffect(()=>{
  //   session.on({
  //     connectionCreated: function (event) {
  //       console.log('Connection created' + event);
  //       console.log(event);
  //     },
  //     connectionDestroyed: function (event) {
  //       console.log('Connection destroyed');
  //       console.log(event);
  //     },
  //     sessionDisconnected: function sessionDisconnectHandler(event) {
  //       // The event is defined by the SessionDisconnectEvent class
  //       console.log('Disconnected from the session.');
  //       if (event.reason == 'networkDisconnected') {
  //         alert('Your network connection terminated.')
  //       }
  //     },
  //     sessionReconnecting: function() {
  //       // Display a user interface notification.
  //     },
  //     sessionReconnected: function() {
  //       // Adjust user interface.
  //     },
  //   });
  //   // Replace token with your own value:
  //   session.connect(token, function(error) {
  //     if (error) {
  //       console.log('Unable to connect: ', error.message);
  //     } else {
  //       session.publish(publisher, function(error) {
  //         if (error) {
  //           console.log(error);
  //         } else {
  //           console.log('Publishing a stream.');
  //         }
  //       });
  //       console.log('Connected to the session.');
  //     }
  //   });
	//}, [])

  const session = OT.initSession('46869314', '2_MX40Njg2OTMxNH5-MTY3OTIzNjA5MDk5Nn5aaW5aUVFXVUhFMFRiVDlJMlB3aUhIT1l-fn4');

  // Subscribe to a newly created stream
  session.on('streamCreated', (event) => {
    const subscriberOptions = {
      insertMode: 'append',

    };
    session.subscribe(event.stream, 'subscriber', subscriberOptions, (error) => {

    });
  });

  session.on('sessionDisconnected', (event) => {
    console.log('You were disconnected from the session.', event.reason);
  });

  // initialize the publisher
  const publisherOptions = {
    insertMode: "append",
    audioFallbackEnabled: true,
    facingMode: "user",
  };
  if(devicePreference) {
    publisherOptions.audioSource = devicePreference.audioInputDeviceId;
    publisherOptions.videoSource = devicePreference.videoDeviceId;
  }
  const publisher = OT.initPublisher('video-stream', publisherOptions, (error) =>{

  });

  // Connect to the session
  session.connect('T1==cGFydG5lcl9pZD00Njg2OTMxNCZzaWc9NmRhMGQ3Yzk5ODU0MjUxZDMzZDUwYjBjNGIxYzUwYTU0YzVhNTE0NzpzZXNzaW9uX2lkPTJfTVg0ME5qZzJPVE14Tkg1LU1UWTNPVEl6TmpBNU1EazVObjVhYVc1YVVWRlhWVWhGTUZSaVZEbEpNbEIzYVVoSVQxbC1mbjQmY3JlYXRlX3RpbWU9MTY3OTIzNjIwOCZub25jZT0wLjY0MjY4NzU1NzU0NjUxODcmcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTY3OTMyMjYwNyZjb25uZWN0aW9uX2RhdGE9Zmlyc3RuYW1lJTNEWmFrcmlhJmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9', (error) => {
    if (error) {
      
    } else {
      // If the connection is successful, publish the publisher to the session
      session.publish(publisher, (error) => {

      });
    }
  });
  
  return (
    <div id="video-stream"></div>
  );
}

export default MeetingJoin
