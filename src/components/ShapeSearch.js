import React, { useState, useRef } from "react";
import GoogleMapReact from "google-map-react";
import { DrawingManager } from "react-google-maps";

const ShapeSearch = ({ apiKey }) => {
  const [polygon, setPolygon] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const mapRef = useRef(null);

  const handlePolygonComplete = (polygon) => {
    setPolygon(polygon);
  };

  const handleSearch = () => {
    const bounds = polygon.getBounds();
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    // Perform a search based on the addresses within the polygon using the Google Maps Places API
    const service = new window.google.maps.places.PlacesService(mapRef.current);
    service.nearbySearch({
      bounds: {
        north: ne.lat(),
        east: ne.lng(),
        south: sw.lat(),
        west: sw.lng(),
      },
      type: "address",
    }, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setSearchResults(results);
      }
    });
  };

  return 
    <>
    <div style={{ height: "100vh", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: apiKey }}
        defaultCenter={{ lat: 37.7749, lng: -122.4194 }}
        defaultZoom={12}
        onGoogleApiLoaded={({ map }) => {
          mapRef.current = map;
        }}
      >
        <DrawingManager
          onPolygonComplete={handlePolygonComplete}
          defaultOptions={{
            drawingControl: true,
            drawingControlOptions: {
              position: window.google.maps.ControlPosition.TOP_CENTER,
              drawingModes: ["polygon"],
            },
            polygonOptions: {
              editable: true,
            },
          }}
        />
      </GoogleMapReact>
      {polygon && (
        <div>
          <button onClick={handleSearch}>Search within polygon</button>
        </div>
      )}
      {searchResults.length > 0 && (
        <div>
          <h2>Search results:</h2>
          <ul>
            {searchResults.map((result) => (
              <li key={result.place_id}>{result.formatted_address}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
    </>
};

export default ShapeSearch;
