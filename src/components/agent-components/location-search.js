import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import "./location-search.css";

export default function LocationSearch() {
  const [mapstate, setMap] = useState(null);
  const [center, setCenter] = useState({ lat: 24.466667, lng: 54.366669 });
  const [centerAddress, setCenterAddress] = useState('');
  const [radius, setRadius] = useState(300);
  const [active, setActive] = useState(true);
  const [circle, setCirle] = useState(null);
  const [polygonState, setPolygonState] = useState(null);
  const [drawingManagerState, setDrawingManagerState] = useState('');
  const [properties, setProperties] = useState([]);
  const [markers, setMarkers] = useState([]);

  let map;
  let newMarkers = [];
  let centerMarker = null;
  let drawingManager;
  let polygon;
  const history = useHistory();

  useEffect(() => {
    const google = window.google;
    const geocoder = new google.maps.Geocoder();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const currentLocation = { lat: position.coords.latitude, lng: position.coords.longitude, };
          //const currentLocation = { lat: 24.466667, lng: 54.366669 };
          setCenter(currentLocation);
          map.setCenter(currentLocation);
          setCenterAddress(await reverseGeocode(geocoder, currentLocation));
          centerMarker = addMarkerOnMap(
            map,
            currentLocation,
            "assets/img/icons/map-marker.png",
            { width: 30, height: 40.5 }
          );
        },
        (error) => {
          console.log(error);
        }
      );
    }

    map = new window.google.maps.Map(document.getElementById("map"), {
      center,
      zoom: 17,
    });
    setMap(map);

    const autocomplete = new window.google.maps.places.Autocomplete(
      document.getElementById("autocomplete")
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }

      map.setCenter(place.geometry.location);
      map.setZoom(17);

      if(centerMarker) {
        centerMarker.setPosition(place.geometry.location);
      }
    });

    map.addListener("click", function (event) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      // const infowindow = new google.maps.InfoWindow({
      //   content: "Clicked location: " + lat + ", " + lng,
      // });
      // infowindow.setPosition(event.latLng);
      // infowindow.open(map);
    });

    drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          // google.maps.drawing.OverlayType.MARKER,
          // google.maps.drawing.OverlayType.CIRCLE,
          google.maps.drawing.OverlayType.POLYGON,
          // google.maps.drawing.OverlayType.POLYLINE,
          // google.maps.drawing.OverlayType.RECTANGLE,
        ],
      },
      polygonOptions: {
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        strokeWeight: 2,
        clickable: true,
        editable: true,
        draggable: true,
        zIndex: 1,
      },
    });

    google.maps.event.addListener(
      drawingManager,
      "polygoncomplete",
      function (drawnPolygon) {
        if (polygon) {
          polygon.setMap(null);
          setProperties([]);
          if (newMarkers.length > 0) {
            newMarkers.map((marker) => {
              marker.setMap(null);
            });
          }
        }

        google.maps.event.addListener(
          drawnPolygon,
          "dragend",
          function (event) {
            searchByPolygon(drawnPolygon);
          }
        );
        polygon = drawnPolygon;
        setPolygonState(drawnPolygon);
        searchByPolygon(drawnPolygon);
        drawingManager.setDrawingMode(null);
      }
    );
    setDrawingManagerState(drawingManager);
    drawingManager.setMap(map);
  }, []);

  function handleReset() {
    if (polygonState) {
      setProperties([]);
      if (markers.length > 0) {
        markers.map((marker) => {
          marker.setMap(null);
        });
      }
      polygonState.setMap(null);
      setPolygonState(null);
      drawingManagerState.setDrawingMode(window.google.maps.drawing.OverlayType.POLYGON);
    }
  }

  function searchByPolygon(drawnPolygon) {
    const polygonCoords = drawnPolygon
      .getPath()
      .getArray()
      .map((point) => `${point.lng()} ${point.lat()}`);
    fetch(`${process.env.REACT_APP_API_URL}/home/property/search-polygon`, {
      method: "POST",
      body: JSON.stringify({ coordinates: polygonCoords }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then((data) => {
        setProperties([]);
        if (newMarkers.length > 0) {
          newMarkers.map((marker) => {
            marker.setMap(null);
          });
        }
        newMarkers = [];
        if (data.length > 0) {
          setProperties(data);
          data.map((property) => {
            const position = {
              lat: parseFloat(property.latitude),
              lng: parseFloat(property.longitude),
            };
            const marker = addMarkerOnMap(
              map,
              position,
              "assets/img/icons/property-marker.png",
              { width: 40, height: 40 }
            );
            newMarkers.push(marker);
            marker.addListener("click", function () {
              window.open(
                `${process.env.PUBLIC_URL}/property-details/${property.id}`,
                "_blank"
              );
            });
          });
          setMarkers(newMarkers);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function searchByCircle() {
    fetch(`${process.env.REACT_APP_API_URL}/home/property/search-circle`, {
      method: "POST",
      body: JSON.stringify({ radius, center }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.length > 0) {
          data.map((property) => {
            const position = {
              lat: parseFloat(property.latitude),
              lng: parseFloat(property.longitude),
            };
            const marker = addMarkerOnMap(
              mapstate,
              position,
              "assets/img/icons/property-marker.png",
              { width: 40, height: 40 }
            );
            marker.addListener("click", function () {});
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function handleActive() {
    setActive(!active);
  }

  function reverseGeocode(geocoder, location) {
    return new Promise((resolve, reject) => {
      geocoder.geocode({ location }, function (results, status) {
        if (status == window.google.maps.GeocoderStatus.OK) {
          resolve(results[0].formatted_address);
        } else {
          reject(status);
        }
      });
    });
  }

  function addMarkerOnMap(map, position, icon, icondimensions) {
    const marker = new window.google.maps.Marker({
      position,
      map: map,
      animation: window.google.maps.Animation.DROP,
      icon: {
        url: icon,
        scaledSize: new window.google.maps.Size(
          icondimensions.width,
          icondimensions.height
        ), // Optional: set the size of the icon
      },
    });
    return marker;
  }

  function drawCircle() {
    if (circle) {
      circle.setMap(null);
    }
    const newCircle = new window.google.maps.Circle({
      map: mapstate,
      center: center,
      radius: radius,
      strokeColor: "#0000FF",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#0000FF",
      fillOpacity: 0.35,
    });
    mapstate.setOptions({ draggableCursor: "grab" });
    setCirle(newCircle);
    searchByCircle();
  }

  function handleLogoClick() {
    history.push("/services/properties");
  }

  return (
    <div className="map-container">
      <div className="custom_position"
      >
        <button
          className={`open-button ${active ? "" : "closed-button"}`}
          onClick={handleActive}
        >
          {active ? "Close Search" : "Open Search"}
        </button>
        <button
          className={`open-button-reset ${active ? "" : "closed-button-reset"}`}
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
      <div className={`sidebarforsearch ${active ? "isActive" : ""}`}>
        <img
          src={`${process.env.PUBLIC_URL}/assets/img/logo.png`}
          id="sideabar-logo"
          alt="Logo"
          height="80"
          onClick={handleLogoClick}
          className="cursor_pointer"
        />
        <p>
          You can search the properties in a specific area by drawing shapes on
          maps.{" "}
        </p>
        <br/>
        <p>Move center to your desired location</p>
        <input
          type="text"
          value={centerAddress}
          name="ltn__name"
          id="autocomplete"
          onChange={(event) => {
            setCenterAddress(event.target.value);
          }}
          placeholder="Center your location"
        />
        <div className="scrollable">
          {properties &&
            properties.length > 0 &&
            properties.map((element, i) => (
              <div key={element} className="content-box">
                <img
                  src={`${process.env.REACT_APP_API_URL}/${element?.featuredImage}`}
                  alt="#"
                  className="featured-image-style"
                />
                <div className="content">
                  <h6 className="description mb-2">{element.title}</h6>
                  <span className="location">
                    <i className="flaticon-pin"></i> {element.address}
                  </span>
                </div>
                <div className="product-info-bottom">
                  <div className="product-price">
                    <span>${element.price}</span>
                  </div>
                  <div className="product-price">
                    <button className="btn theme-btn-2 request-now-btn" onClick={() => {window.open(
                    `${process.env.PUBLIC_URL}/property-details/${element.id}`,
                    "_blank"
                  );}}>Open Details</button>
                  </div>
                </div>
              </div>
            ))}
        </div>
         {/*<div className="sidebar-search">
          <input
            type="number"
            value={radius}
            name="ltn__name"
            onChange={(event) => {
              setRadius(parseInt(event.target.value));
            }}
            placeholder="Radius"
          />
          <button onClick={drawCircle}>Draw Cricle</button>
        </div> */}
      </div>
      <div id="map"></div>
      {/* <div className="map-search-buttons">
        <button className="btn theme-btn-3 reset py-2">Reset</button>
      </div> */}
    </div>
  );
}
