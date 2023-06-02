import React, { useEffect } from 'react';
import Modal from 'react-modal';
Modal.setAppElement('#quarter');
const StreetViewMap = ({ isOpen, onClose, latitude, longitude }) => {
  useEffect(() => {
    Modal.setAppElement('#quarter'); // Replace '#quarter' with the ID or selector of your root element
  }, []);

  const onAfterOpen = () => {
    createMap();
  };

  const createMap = () => {
    const mapOptions = {
      center: { lat: latitude, lng: longitude },
      zoom: 17,
    };

    const map = new window.google.maps.Map(document.getElementById('map'), mapOptions);

    // Check if street view is available for the given latitude and longitude
    checkIfStreetViewAvailable(map);
  };

  const checkIfStreetViewAvailable = (map) => {
    const streetViewService = new window.google.maps.StreetViewService();
    streetViewService.getPanorama({ location: { lat: latitude, lng: longitude } }, (data, status) => {
      if (status === 'OK') {
        // Street view is available
        const streetView = new window.google.maps.StreetViewPanorama(document.getElementById('map'),
        {
          position: { lat: latitude, lng: longitude },
          pov: { heading: 165, pitch: 0 },
          zoom: 1,
        });
        map.setStreetView(streetView);
      } else {
        // Street view is not available, show regular map
        map.setStreetView(null);
      }
    });
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={onClose} 
      onAfterOpen={onAfterOpen}
      contentLabel="Street/Map View Modal"
      className="document-modal"
      overlayClassName="document-modal-overlay"
      shouldCloseOnOverlayClick={false}
    >
      <button className="property-close-button" onClick={onClose}>
        X
      </button>
      <div id="map" className='street-view-div'></div>
    </Modal>
  );
};

export default StreetViewMap;
