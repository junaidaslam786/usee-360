import React from "react";

class AddressInput extends React.Component {
  constructor(props) {
    super(props);
    this.addressInputRef = React.createRef();
    this.mapRef = React.createRef();
    this.map = null;
  }

  componentDidMount() {
    const google = window.google;
    this.map = new google.maps.Map(this.mapRef.current, {
      center: { lat: 37.7749, lng: -122.4194 },
      zoom: 13,
    });
  }

  handleAddressSubmit = () => {
    const google = window.google;
    const geocoder = new google.maps.Geocoder();
    const address = this.mapRef.current.value;

    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK") {
        const location = results[0].geometry.location;
        this.map.setCenter(location);
        new google.maps.Marker({
          position: location,
          map: this.map,
        });
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  };

  render() {
    return (
      <div>
        <input type="text" placeholder="Enter your address" />
        <button onClick={this.handleAddressSubmit}>Submit</button>
        <div ref={this.mapRef} style={{ width: "100%", height: "400px" }}></div>
      </div>
    );
  }
}

export default AddressInput;
