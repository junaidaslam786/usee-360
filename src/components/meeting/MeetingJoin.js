import React, { useState, useEffect } from "react";
import OT from "@opentok/client";
import { useHistory } from "react-router-dom";
import "./incall.css";
import Slideshow from "../homepage/section/Slideshow";
import { USER_TYPE } from "../../constants";
import Modal from "react-modal";
import StreetViewMap from "./street-view-map";
import DocumentModal from "./document-modal";
import {
  getLoginToken,
  getUserDetailsFromJwt,
  removeLoginToken,
} from "../../utils";
import PropertyService from "../../services/agent/property";
import AppointmentService from "../../services/agent/appointment";
import HomepageService from "../../services/homepage";
import WishlistService from "../../services/customer/wishlist";
const fs = require("fs");

const MeetingJoin = (props) => {
  const {
    audioInputDeviceId,
    audioOutputDeviceId,
    videoDeviceId,
    appointment,
    userType,
    appointmentId,
    backgroundImage,
    videoStreamingVal,
    audioStreamingVal,
    filter,
  } = props;

  const token = getLoginToken();
  const history = useHistory();
  const redirectPath = `/${userType}/login?returnUrl=${encodeURIComponent(
    window.location.pathname
  )}`;

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
  const [videoStreaming, setVideoStreaming] = useState(videoStreamingVal);
  const [audioStreaming, setAudioStreaming] = useState(audioStreamingVal);
  const [screenSharing, setScreenSharing] = useState(false);
  const [publisher, setPublisher] = useState("");
  const [screenPublisher, setScreenPublisher] = useState("");
  const [subscriber, setSubscriber] = useState(true);
  const [session, setSession] = useState(true);
  const [propertiesList, setPropertiesList] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(
    appointment.products[0].id
  );
  const [virtualTourUrl, setVirtualTourUrl] = useState("");
  const [virtualTourVideo, setVirtualTourVideo] = useState("");
  const [productImages, setProductImages] = useState("");
  const [defaultImage, setDefaultImage] = useState(true);
  const [agentJoined, setAgentJoined] = useState(false);
  const [customerJoined, setCustomerJoined] = useState(false);
  const [showCancelBtn, setShowCancelBtn] = useState(true);
  const [confirmCancelModal, setConfirmCancelModal] = useState(false);
  const [confirmEndModal, setConfirmEndModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDocumentOpen, setIsDocumentOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [propertyDocuments, setPropertyDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [wishlistProperties, setWishlistProperties] = useState([]);
  const [unReadMessages, setUnReadMessages] = useState({});
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);

  const [cancelMeetingNotes, setCancelMeetingNotes] = useState("");
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [notes, setNotes] = useState("");

  const userDetail = getUserDetailsFromJwt();

  useEffect(() => {
    const handleResize = () => {
      setScreenHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getPropertiesList = async () => {
    const propertyData = await PropertyService.toAllocate();
    if (propertyData?.length > 0) {
      setPropertiesList(
        propertyData.map((property) => {
          return { label: property.title, value: property.id };
        })
      );
    }
  };

  const getPropertyDetail = async (property) => {
    const propertyData = await PropertyService.detail(property);
    if (propertyData) {
      setVirtualTourUrl(null);
      setVirtualTourVideo(null);
      setProductImages(null);
      setDefaultImage(true);
      setLatitude(parseFloat(propertyData.latitude));
      setLongitude(parseFloat(propertyData.longitude));

      const pairs = [];
      if (propertyData?.productDocuments?.length > 0) {
        for (let i = 0; i < propertyData.productDocuments.length; i += 2) {
          const pair = propertyData.productDocuments.slice(i, i + 2);
          pairs.push(pair);
        }
      }
      setPropertyDocuments(pairs);

      if (
        propertyData.virtualTourType === "url" &&
        propertyData.virtualTourUrl
      ) {
        let embedUrl = propertyData.virtualTourUrl;
        const videoId = extractVideoId(propertyData.virtualTourUrl);

        if (videoId) {
          embedUrl = "https://www.youtube.com/embed/" + videoId;
        }

        setVirtualTourUrl(embedUrl);
        setDefaultImage(false);
      } else if (
        propertyData.virtualTourType === "video" &&
        propertyData.virtualTourUrl
      ) {
        setVirtualTourVideo(propertyData.virtualTourUrl);
        setDefaultImage(false);
      } else if (propertyData.productImages.length > 0) {
        setProductImages(propertyData.productImages);
        setDefaultImage(false);
      }
    }
  };

  const extractVideoId = (url) => {
    let videoId;

    // Extract the video ID from the YouTube URL
    if (url.indexOf("youtube.com/watch?v=") !== -1) {
      // Extract the video ID from a URL like "https://www.youtube.com/watch?v=VIDEO_ID_HERE"
      videoId = url.split("v=")[1];
    } else if (url.indexOf("youtu.be/") !== -1) {
      // Extract the video ID from a URL like "https://youtu.be/VIDEO_ID_HERE"
      videoId = url.split("youtu.be/")[1];
    } else if (url.indexOf("youtube.com/embed/") !== -1) {
      // Extract the video ID from a URL like "https://www.youtube.com/embed/VIDEO_ID_HERE"
      videoId = url.split("embed/")[1];
    } else if (url.indexOf("youtube.com/v/") !== -1) {
      // Extract the video ID from a URL like "https://www.youtube.com/v/VIDEO_ID_HERE"
      videoId = url.split("v/")[1];
    }

    // Remove any additional parameters or fragments from the video ID
    if (videoId) {
      const ampersandPosition = videoId.indexOf("&");
      const hashPosition = videoId.indexOf("#");
      if (ampersandPosition !== -1) {
        videoId = videoId.substring(0, ampersandPosition);
      } else if (hashPosition !== -1) {
        videoId = videoId.substring(0, hashPosition);
      }
    }

    return videoId;
  };

  const getSessionToken = async () => {
    const tokenData = await AppointmentService.sessionToken(appointment.id);
    return tokenData?.token ? tokenData.token : "";
  };

  const addLogEntry = async (logType, reason) => {
    await AppointmentService.log({
      id: appointment.id,
      logType,
      reason,
    });
  };

  const updateStatus = async (status) => {
    await AppointmentService.updateStatus({
      id: appointment.id,
      status,
    });
  };

  const toggleVideo = () => {
    if (publisher?.publishVideo) {
      publisher.publishVideo(!videoStreaming);
      setVideoStreaming(!videoStreaming);
    }
  };

  const toggleAudio = () => {
    if (publisher?.publishAudio) {
      publisher.publishAudio(!audioStreaming);
      setAudioStreaming(!audioStreaming);
    }
  };

  // const leaveSession = () => {
  //   completeMeeting(); // This now handles both signaling and API call
  //   sendDisconnectSignal();
  //   if (session) {

  //     session.disconnect();
  //   }
  // };
  const leaveSession = () => {
    sendDisconnectSignal();
    // If a screenPublisher exists, unpublish and destroy it
    if (screenPublisher) {
      session.unpublish(screenPublisher);
      screenPublisher.destroy();
      setScreenPublisher(null);
    }

    // If a publisher exists, unpublish and destroy it
    if (publisher) {
      session.unpublish(publisher);
      publisher.destroy();
      setPublisher(null);
    }

    // Disconnect from the session
    if (session) {
      session.disconnect();
      setSession(null);
    }

    // Navigate to the dashboard or some other page as required
    if (userType === USER_TYPE.AGENT) {
      history.push("/agent/dashboard");
    } else if (userType === USER_TYPE.CUSTOMER) {
      history.push("/customer/dashboard");
    }
  };

  const submitNotes = async () => {
    const requestData = {
      userId: userDetail.id,
      userType: USER_TYPE.AGENT,
      id: appointment.id,
      notes: cancelMeetingNotes,
    };

    const formResponse = await AppointmentService.addNote(requestData);
    if (formResponse?.error && formResponse?.message) {
      props.responseHandler(formResponse.message);
      return;
    }

    props.responseHandler("Note added successfully.", true);
    setNotes("");
    setCancelMeetingNotes("");

    // await loadAllList();
    // setIsNotesModalOpen(false);
    leaveSession();
  };

  const toggleScreenSharing = () => {
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
            { videoSource: "screen", width: "100%", height: "100%" },
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
          publisher.on("streamDestroyed", function (event) {
            if (event.stream.videoType === "screen") {
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
  };

  const getUrl = async (event) => {
    const files = event.target.files;

    let formdata = new FormData();
    formdata.append("featuredImage", files[0]);

    const formResponse = await HomepageService.chatAttachment(formdata);
    const name =
      userType === USER_TYPE.CUSTOMER
        ? `${appointment.customerUser.firstName} ${appointment.customerUser.lastName}`
        : `${appointment.agentUser.firstName} ${appointment.agentUser.lastName}`;

    session.signal(
      {
        type: "msg",
        data: `${name}::${formResponse}`,
      },
      (error) => {
        if (error) {
          //handleError(error);
        } else {
        }
      }
    );
  };

  const sendDisconnectSignal = () => {
    session.signal(
      {
        type: "custom-disconnect",
        data: "User is disconnecting intentionally",
      },
      (error) => {
        if (error) {
        } else {
        }
      }
    );
  };

  const handlePropertyChange = (event) => {
    setSelectedProperty(event.target.value);
    if (userType === USER_TYPE.AGENT) {
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
  };

  const handleCancelModalConfirm = async () => {
    // Do something when the user clicks "Yes"
    setNotes(cancelMeetingNotes);

    // Now call submitNotes to save the cancellation notes
    await submitNotes();
    setCancelMeetingNotes("");
    setConfirmCancelModal(false); // Close the modal
    await updateStatus("cancelled");
    leaveSession();
  };

  const handleCancelModalCancel = () => {
    // Do something when the user clicks "No"
    setConfirmCancelModal(false); // Close the modal
  };

  const handleEndModalConfirm = () => {
    // Do something when the user clicks "Yes"
    setConfirmEndModal(false); // Close the modal
    leaveSession();
  };

  const handleEndModalCancel = () => {
    // Do something when the user clicks "No"
    // setIsNotesModalOpen(true);
    // leaveSession();
    setConfirmEndModal(false); // Close the modal
  };

  const isAddedToWishlist = (propertyId) => {
    return wishlistProperties.length < 0
      ? false
      : wishlistProperties.find(({ productId }) => productId === propertyId);
  };

  const removeWishList = async (propertyId) => {
    if (!token) {
      history.push(redirectPath);
    }

    await WishlistService.removeFromWishlist(propertyId);
    await loadWishlistProperties();
  };

  const addToWishList = async (propertyId) => {
    if (!token) {
      history.push(redirectPath);
    }

    await WishlistService.addToWishlist(propertyId);
    await loadWishlistProperties();
  };

  const loadWishlistProperties = async () => {
    const response = await WishlistService.list();

    if (response?.length > 0) {
      setWishlistProperties(response);
    }
  };

  const openPropertyModal = () => {
    setIsOpen(true);
  };

  const closePropertyModal = () => {
    setIsOpen(false);
  };

  const closeDocumentModal = () => {
    setIsDocumentOpen(false);
  };

  const closeLocationModal = () => {
    setIsLocationOpen(false);
  };

  const handleDocumentModalOpen = (file) => {
    setSelectedDocument(file);
    setIsDocumentOpen(true);
  };

  const handleIncreaseUnReadMessages = (
    senderConnectionId,
    receiverConnectionId
  ) => {
    const slider = document.getElementById("chatArea");
    if (
      senderConnectionId !== receiverConnectionId &&
      slider.classList.contains("slide-out")
    ) {
      setUnReadMessages((prevCounts) => ({
        ...prevCounts,
        [receiverConnectionId]: (prevCounts[receiverConnectionId] || 0) + 1,
      }));
    }
  };

  const handleResetUnReadMessages = (receiverConnectionId) => {
    setUnReadMessages((prevCounts) => ({
      ...prevCounts,
      [receiverConnectionId]: 0,
    }));
  };

  // const completeMeeting = async () => {
  //   // Attempt to send a disconnect signal if the session exists and is connected
  //   if (session && typeof session.isConnected === 'function' && session.isConnected()) {
  //     session.signal({
  //       type: 'userDisconnected',
  //       data: `{ "userId": "${userDetail.id}", "reason": "unexpected" }`,
  //     }, error => {
  //       if (error) {
  //         console.error('Signal error:', error.message);
  //       } else {
  //         console.log('Signal sent');
  //       }
  //     });
  //   }

  //   // Make an API call to your backend to update the meeting status
  //   // Note: Navigator.sendBeacon is used here for reliability during unload
  //   const url = `${process.env.REACT_APP_API_URL}/meeting/complete/${appointment.id}`;
  //   const data = new Blob([JSON.stringify({ status: "completed" })], {type : 'application/json'});
  //   navigator.sendBeacon(url, data);
  // };

  // useEffect(() => {
  //   const handleBeforeUnload = async (event) => {
  //     completeMeeting();
  //     // For `beforeunload` the custom text won't be shown in modern browsers, but it's kept for compatibility
  //     event.returnValue = 'Are you sure you want to leave? The meeting will end.';
  //   };

  //   window.addEventListener('beforeunload', handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //     // Perform any additional cleanup if needed
  //     completeMeeting();
  //   };
  // }, [session, userDetail.id, appointment.id]); // Ensure dependencies are correctly listed

  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        const tokToken = await getSessionToken();

        if (userType === USER_TYPE.AGENT) {
          await getPropertiesList();
          await getPropertyDetail(appointment.products[0].id);
          setSelectedProperty(appointment.products[0].id);
        } else if (userType === USER_TYPE.CUSTOMER) {
          await getPropertyDetail(appointment.products[0].id);
          await loadWishlistProperties();
        }

        if (!publisher) {
          const session = OT.initSession("47639681", appointment.sessionId);
          setSession(session);
          session.on({
            streamCreated: (event) => {
              if (event.stream.videoType === "camera") {
                const screenHeight = window.innerHeight;
                const height = screenHeight <= 690 ? "165px" : "195px";
                const subscriberOptions = {
                  insertMode: "append",
                  nameDisplayMode: "on",
                  width: "100%",
                  height: { height },
                };
                const subscriber = session.subscribe(
                  event.stream,
                  "subscribers",
                  subscriberOptions,
                  (error) => {}
                );
                setSubscriber(subscriber);
                subscriber.on("videoElementCreated", function (event) {});
                var subscriberDisconnectedNotification =
                  document.createElement("div");
                subscriberDisconnectedNotification.className =
                  "subscriberDisconnectedNotification";
                subscriberDisconnectedNotification.innerText =
                  "Stream has been disconnected unexpectedly. Attempting to automatically reconnect...";
                subscriber.element.appendChild(
                  subscriberDisconnectedNotification
                );
                subscriber.on({
                  disconnected: function (event) {
                    subscriberDisconnectedNotification.style.visibility =
                      "visible";
                  },
                  connected: function (event) {
                    subscriberDisconnectedNotification.style.visibility =
                      "hidden";
                  },
                });
                if (userType == USER_TYPE.CUSTOMER) {
                  setAgentJoined(true);
                } else if (userType == "agent") {
                  setCustomerJoined(true);
                }
              } else if (event.stream.videoType === "screen") {
                const subscriberOptions = {
                  insertMode: "replace",
                  width: "100%",
                  height: "100%",
                };
                setVirtualTourUrl(null);
                setVirtualTourVideo(null);
                setProductImages(null);
                setDefaultImage(null);
                const screenshareEle = document.createElement("div");
                const screenPreview = document.getElementById("screen-preview");
                //const ot_element = document.getElementById(`OT`)
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
              if (
                event.reason === "clientDisconnected" &&
                event.stream.videoType === "screen"
              ) {
                setDefaultImage(true);
              }
            },
            connectionCreated: function (event) {},
            connectionDestroyed: function (event) {
              if (userType === "agent") {
                addLogEntry("left", "Customer has left the meeting");
              } else if (userType === "customer") {
                addLogEntry(
                  "left",
                  `${process.env.REACT_APP_AGENT_ENTITY_LABEL} has left the meeting`
                );
              }
            },
            "signal:custom-disconnect": function (event) {
              updateStatus("completed");
              if (userType === "agent") {
                addLogEntry(
                  "left",
                  "Customer has left the meeting by clicking on the endcall button"
                );
                addLogEntry(
                  "completed",
                  "Appointment got completed as customer has ended the call"
                );
              } else if (userType === "customer") {
                addLogEntry(
                  "left",
                  `${process.env.REACT_APP_AGENT_ENTITY_LABEL} has left the meeting by clicking on the endcall button`
                );
                addLogEntry(
                  "completed",
                  "Appointment got completed as agent has ended the call"
                );
              }
              session.disconnect();
            },
            sessionDisconnected: function sessionDisconnectHandler(event) {
              if (userType === USER_TYPE.AGENT) {
                history.push("/agent/dashboard");
              } else if (userType === USER_TYPE.CUSTOMER) {
                history.push("/customer/dashboard");
              }
            },
            sessionReconnecting: function (event) {},
            sessionReconnected: function (event) {},
          });

          const msgHistory = document.querySelector("#history");
          session.on("signal:msg", async (event) => {
            if (
              userType === USER_TYPE.CUSTOMER &&
              event.data.includes("PROPERTY_ID")
            ) {
              await getPropertyDetail(event.data.split(":")[1]);
            } else if (
              userType === USER_TYPE.AGENT &&
              event.data.includes("PROPERTY_ID")
            ) {
            } else if (event.data.includes("::")) {
              const msg = document.createElement("p");
              const content = event.data.split("::");
              msg.textContent = `${content[0]}: `;
              const a = document.createElement("a");
              a.classList.add("download-file-link");
              a.setAttribute("target", "_blank");
              const text = document.createTextNode(content[1].split("/")[1]);
              a.appendChild(text);
              a.href = `${process.env.REACT_APP_API_URL}/${content[1]}`;
              a.download = content[1].split("/")[1];
              msg.appendChild(a);
              msgHistory.appendChild(msg);
              msg.scrollIntoView();

              handleIncreaseUnReadMessages(
                event.from.connectionId,
                session.connection.connectionId
              );
            } else {
              const msg = document.createElement("p");
              msg.textContent = `${event.data}`;
              msg.className =
                event.from.connectionId === session.connection.connectionId
                  ? "mine"
                  : "theirs";
              msgHistory.appendChild(msg);
              msg.scrollIntoView();

              handleIncreaseUnReadMessages(
                event.from.connectionId,
                session.connection.connectionId
              );
            }
          });

          const screenHeight = window.innerHeight;
          const height = screenHeight <= 690 ? "165px" : "195px";

          // initialize the publisher
          const publisherOptions = {
            insertMode: "append",
            audioFallbackEnabled: true,
            facingMode: "user",
            publishVideo: videoStreamingVal,
            publishAudio: audioStreamingVal,
            name:
              userType === USER_TYPE.CUSTOMER
                ? `${appointment.customerUser.firstName} ${appointment.customerUser.lastName}`
                : `${appointment.agentUser.firstName} ${appointment.agentUser.lastName}`,
            nameDisplayMode: "on",
            width: "100%",
            height: { height },
          };

          if (audioInputDeviceId || videoDeviceId) {
            publisherOptions.audioSource = audioInputDeviceId;
            publisherOptions.videoSource = videoDeviceId;
          }

          if (OT.hasMediaProcessorSupport()) {
            if (filter && filter === "blur") {
              publisherOptions.videoFilter = {
                type: "backgroundBlur",
                blurStrength: "high",
              };
            } else if (filter && filter === "background" && backgroundImage) {
              publisherOptions.videoFilter = {
                type: "backgroundReplacement",
                backgroundImgUrl: `${backgroundImage}`,
              };
            }
          }

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
              // If the connection is successful, publish the publisher to the session
              session.publish(publisher, (error) => {});
              if (userType === USER_TYPE.CUSTOMER) {
                setCustomerJoined(true);
                addLogEntry("joined", "Customer has joined the meeting");
              } else if (userType === USER_TYPE.AGENT) {
                setAgentJoined(true);
                addLogEntry(
                  "joined",
                  `${process.env.REACT_APP_AGENT_ENTITY_LABEL} has joined the meeting`
                );
              }
            }
          });

          // Text chat
          const form = document.querySelector("form");
          const msgTxt = document.querySelector("#msgTxt");

          if (form) {
            // Send a signal once the user enters data in the form
            form.addEventListener("submit", (event) => {
              event.preventDefault();
              if (msgTxt.value) {
                const name =
                  userType === USER_TYPE.CUSTOMER
                    ? `${appointment.customerUser.firstName} ${appointment.customerUser.lastName}`
                    : `${appointment.agentUser.firstName} ${appointment.agentUser.lastName}`;
                session.signal(
                  {
                    type: "msg",
                    data: `${name}: ${msgTxt.value}`,
                  },
                  (error) => {
                    if (error) {
                      //handleError(error);
                    } else {
                      msgTxt.value = "";
                    }
                  }
                );
              }
            });
          }
        }
      };

      fetchData();
      return () => {};
    }
  }, [agentJoined, customerJoined]);

  useEffect(() => {
    if (agentJoined && customerJoined && userType === "agent") {
      updateStatus("inprogress");
      setShowCancelBtn(false);
    }
  }, [agentJoined, customerJoined]);

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
    <div id="meetingBody">
      <div id="main" className="row m_0">
        <div id="members" className="col col-sm-9 col-md-3 col-lg-3 bg-sm-dark">
          <div>
            <center>
              <img
                src={`${publicUrl}assets/img/meeting-logo.png`}
                className="w_130 custom_margin"
              />
            </center>
          </div>
          {userType === USER_TYPE.AGENT && (
            <div>
              <select
                className="nice-select w-100 select-margin"
                value={selectedProperty}
                onChange={(event) => {
                  handlePropertyChange(event);
                }}
              >
                {propertiesList.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div id="publisher"></div>
          <div id="subscribers"></div>
          <div id="show-property-documents">
            <button
              className="property-modal-button"
              onClick={openPropertyModal}
            >
              <i className="fa-solid fa-list"></i>
            </button>
            {isOpen && (
              <div className="property-modal-container">
                <button
                  className="property-close-button"
                  onClick={closePropertyModal}
                >
                  X
                </button>
                <div className="property-modal-content">
                  {propertyDocuments.map((pair, index) => (
                    <div className="" key={index}>
                      {pair.map((record, subIndex) => (
                        <div className="" key={subIndex}>
                          <button
                            className="options-buttons"
                            onClick={() => handleDocumentModalOpen(record.file)}
                          >
                            {record.title}
                          </button>
                        </div>
                      ))}
                    </div>
                  ))}
                  <div className="">
                    <div className="">
                      <button
                        className="options-buttons"
                        onClick={() => setIsLocationOpen(true)}
                      >
                        Street View
                      </button>
                    </div>
                    {userType === "customer" && (
                      <div className="">
                        <button
                          className="options-buttons"
                          onClick={() => {
                            isAddedToWishlist(selectedProperty)
                              ? removeWishList(selectedProperty)
                              : addToWishList(selectedProperty);
                          }}
                        >
                          {isAddedToWishlist(selectedProperty)
                            ? "Remove from wishlist"
                            : "Add to wishlist"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div
          id="screen-preview"
          className="col-md-9 col-lg-9 px-0"
          style={{
            backgroundImage: `linear-gradient(
              rgba(0, 0, 0, 0.85), 
              rgba(0, 0, 0, 0.85)
            ),url(${publicUrl}assets/img/default-property.jpg)`,
          }}
        >
          {virtualTourUrl && (
            <iframe
              src={virtualTourUrl}
              id="prop_tour_link"
              className="w_100 h_100"
            ></iframe>
          )}

          {virtualTourVideo && (
            <video width="100%" height="100%" controls>
              <source
                src={`${process.env.REACT_APP_API_URL}/${virtualTourVideo}`}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          )}

          {productImages?.length > 0 && (
            <Slideshow fadeImages={productImages} />
          )}

          {defaultImage && (
            <img src={`${publicUrl}assets/img/default-property.jpg`} />
          )}
        </div>
      </div>
      <div id="chatOptions">
        <div id="toggle2">
          {showCancelBtn && userType === "agent" && (
            <button
              className="call-meeting-button"
              onClick={() => setConfirmCancelModal(true)}
            >
              Cancel Meeting
            </button>
          )}
        </div>

        <div className="d-flex align-items-center">
          {videoStreaming === true && (
            <span
              className="video-icon cursor_pointer"
              onClick={() => toggleVideo()}
            >
              <i className="fa-solid fa-video"></i>
            </span>
          )}

          {videoStreaming === false && (
            <span
              className="video-icon cursor_pointer"
              onClick={() => toggleVideo()}
            >
              <i className="fa-solid fa-video-slash"></i>
            </span>
          )}

          {audioStreaming === true && (
            <span
              className="video-icon cursor_pointer"
              onClick={() => toggleAudio()}
            >
              <i className="fa-solid fa-microphone"></i>
            </span>
          )}

          {audioStreaming === false && (
            <span
              className="video-icon cursor_pointer"
              onClick={() => toggleAudio()}
            >
              <i className="fa-solid fa-microphone-slash"></i>
            </span>
          )}

          {screenSharing === true && userType === "agent" && (
            <span
              className="video-icon cursor_pointer"
              onClick={() => toggleScreenSharing()}
            >
              <i className="fa-solid fa-laptop"></i>
            </span>
          )}

          {screenSharing === false && userType === "agent" && (
            <span
              className="video-icon cursor_pointer"
              onClick={() => toggleScreenSharing()}
            >
              <i className="fa-solid fa-laptop"></i>
            </span>
          )}
          <span
            className="video-icon end-call cursor_pointer"
            onClick={() => setConfirmEndModal(true)}
          >
            <i className="fa-solid fa-phone-slash"></i>
          </span>
        </div>

        <div id="toggle">
          <span className="position-relative">
            <img
              id="ChatIcon2"
              src={`${publicUrl}assets/img/icons/chat.png`}
              onClick={() => {
                let slider = document.getElementById("chatArea");

                if (
                  slider.classList.contains("slide-out") &&
                  session?.connection?.connectionId
                ) {
                  handleResetUnReadMessages(session.connection.connectionId);
                }

                let isOpen = slider.classList.contains("slide-in");

                slider.setAttribute("class", isOpen ? "slide-out" : "slide-in");
              }}
            />
            <span className="badge rounded-pill bg-danger meeting-badge">
              {session?.connection?.connectionId
                ? unReadMessages[session.connection.connectionId] || 0
                : 0}
            </span>
          </span>
        </div>
      </div>
      <div id="chatArea" className={"slide-out"}>
        <div className="minimize-chat">
          <button
            className="minimize-button"
            onClick={() => {
              let slider = document.getElementById("chatArea");

              let isOpen = slider.classList.contains("slide-in");

              slider.setAttribute("class", isOpen ? "slide-out" : "slide-in");
            }}
          >
            <i className="fa fa-window-minimize" aria-hidden="true" />
          </button>
        </div>
        <p id="history"></p>
        <form id="Chatform" encType="multipart/form-data" action="">
          <div>
            <img
              className="chatForm_Avatar1"
              src={`${publicUrl}assets/img/icons/attach-file.png`}
            />
            <input type="file" id="file" name="file" onChange={getUrl} />
          </div>

          <input type="text" placeholder="Input your text here" id="msgTxt" />

          <div>
            <img
              className="chatForm_Avatar2"
              src={`${publicUrl}assets/img/icons/send-icon.png`}
            />
            <input type="submit" id="submit" name="submit" />
          </div>
        </form>
      </div>
      <Modal
        isOpen={confirmEndModal}
        onRequestClose={() => setConfirmEndModal(false)}
        className="MyModal"
        overlayClassName="MyModalOverlay"
        ariaHideApp={false}
      >
        <h2>Complete Meeting</h2>
        <p>
          Are you sure you want to end this call? You won't be able to join this
          appointment again.
        </p>
        <div className="ButtonContainer">
          <button className="btn theme-btn-1" onClick={handleEndModalConfirm}>
            Yes
          </button>
          <button className="btn theme-btn-2" onClick={handleEndModalCancel}>
            No
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={confirmCancelModal}
        onRequestClose={() => setConfirmCancelModal(false)}
        className="MyModal"
        overlayClassName="MyModalOverlay"
        ariaHideApp={false}
      >
        <h2>Cancel Meeting</h2>
        <p>
          Are you sure you want to cancel this appointment? You won't be able to
          join this appointment again.
        </p>
        <textarea
          placeholder="Add cancellation notes..."
          value={cancelMeetingNotes}
          onChange={(e) => setCancelMeetingNotes(e.target.value)}
        />
        <div className="ButtonContainer">
          <button
            className="btn theme-btn-1"
            onClick={handleCancelModalConfirm}
          >
            Yes
          </button>
          <button className="btn theme-btn-2" onClick={handleCancelModalCancel}>
            No
          </button>
        </div>
      </Modal>
      {/* <Modal
        isOpen={isNotesModalOpen}
        onRequestClose={() => setIsNotesModalOpen(false)}
        className="MyModal"
        overlayClassName="MyModalOverlay"
        ariaHideApp={false}
      >
        <h2>Add some notes to remember</h2>
        <label>Add Note</label>
        <textarea onChange={(e) => setNotes(e.target.value)} value={notes} />
        <button className="btn theme-btn-1" onClick={submitNotes}>
          Submit
        </button>
        <button
          className="btn theme-btn-2"
          onClick={() => setIsNotesModalOpen(false)}
        >
          Cancel
        </button>
      </Modal> */}
      <DocumentModal
        isOpen={isDocumentOpen}
        onClose={closeDocumentModal}
        documentUrl={`${process.env.REACT_APP_API_URL}/${selectedDocument}`}
      />
      <StreetViewMap
        latitude={latitude}
        longitude={longitude}
        isOpen={isLocationOpen}
        onClose={closeLocationModal}
      />
    </div>
  );
};

export default MeetingJoin;
