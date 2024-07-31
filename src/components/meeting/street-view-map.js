


import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useJsApiLoader, GoogleMap, StreetViewPanorama } from '@react-google-maps/api';

const libraries = ["places", "drawing"];

const StreetViewMap = ({ isOpen, onClose, latitude, longitude }) => {
  const [map, setMap] = useState(null);

  const { isLoaded, } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBIjbPr5V0gaRCzgQQ-oN0eW25WvGoALVY",
    // googleMapsApiKey: process.env.GOOGLE_API_KEY,
    libraries,
  });

  useEffect(() => {
    Modal.setAppElement('#quarter'); 
  }, []);

  const containerStyle = {
    width: '100%', // Adjust the width as needed
    height: '100%', // Adjust the height as needed
  };

  const center = {
    lat: latitude,
    lng: longitude
  };

  const streetViewOptions = {
    position: center,
    pov: { heading: 165, pitch: 0 },
    zoom: 1,
    visible: true,
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Street/Map View Modal"
      className="document-modal"
      overlayClassName="document-modal-overlay"
      shouldCloseOnOverlayClick={true}
    >
      <button className="property-close-button" onClick={onClose}>X</button>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={17}
        onLoad={map => setMap(map)}
      >
        { /* Street View Panorama */
          map && (
            <StreetViewPanorama
              options={streetViewOptions}
            />
          )
        }
      </GoogleMap>
    </Modal>
  );
};

export default StreetViewMap;
