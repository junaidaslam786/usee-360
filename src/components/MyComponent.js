import React, { useState } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

const MyComponent = (props) => {
  const [address, setAddress] = useState('');

const handleAddressChange = (event) => {
  setAddress(event.target.value);
};
const mapStyles = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 37.7749,
  lng: -122.4194,
};

const MapContainer = (props) => {
  const { google } = props;

  const handleMapClick = (mapProps, map, clickEvent) => {
    const lat = clickEvent.latLng.lat();
    const lng = clickEvent.latLng.lng();

    // Use the Google Maps Geocoder API to get the address from the lat/lng coordinates
    const geocoder = new google.maps.Geocoder();
    const latLng = new google.maps.LatLng(lat, lng);

    geocoder.geocode({ latLng: latLng }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        setAddress(results[0].formatted_address);
      } else {
        console.error('Geocode was not successful for the following reason: ' + status);
      }
    });
  };

  return (
    <Map
      google={google}
      zoom={14}
      style={mapStyles}
      initialCenter={defaultCenter}
      onClick={handleMapClick}
    >
      <Marker position={{ lat: 37.7749, lng: -122.4194 }} />
    </Map>
  );
};
  return (
    <div>
      <label htmlFor="address">Address:</label>
      <input
        type="text"
        id="address"
        value={address}
        onChange={handleAddressChange}
      />
      <MapContainer google={props.google} />
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCiIUKO-RSjk304mIlR7bq8h4xqbxXrG58',
})(MyComponent);
