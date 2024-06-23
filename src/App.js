import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './App.css';

// Fixing marker icon issue in React-Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fixing the marker icon issue by merging the default options with custom icon URLs
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Latitude of the target location
const targetLat = 49.1320;
// Longitude of the target location
const targetLon = -122.8714;

// Function to calculate the distance between two geographic coordinates using the Haversine formula help from Chat GPT
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

const App = () => {
  // State to store the user's current position
  const [position, setPosition] = useState(null);
  // State to store the calculated distance
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      // Get the current position of the user
      navigator.geolocation.getCurrentPosition((pos) => {
        // Latitude of the user's position
        const lat = pos.coords.latitude;
        // Longitude of the user's position
        const lon = pos.coords.longitude;
        // Update the state with the user's position
        setPosition([lat, lon]);
        // Calculate the distance to the target location
        const dist = calculateDistance(lat, lon, targetLat, targetLon);
        // Update the state with the calculated distance, rounded to two decimal places
        setDistance(dist.toFixed(2));
      }, (error) => {
        // Log any error that occurs while getting the location
        console.error('Error getting location:', error);
        // Alert the user if the location cannot be retrieved
        alert('Unable to retrieve your location.');
      });
    } else {
      // Alert the user if the browser does not support geolocation
      alert('Geolocation is not supported by your browser.');
    }
  }, []);

  return (
    <div className="App">
      <h1>Your Location and Distance to KPU Surrey Library</h1>
      <div id="map">
        {position ? (
          <MapContainer center={position} zoom={13} style={{ height: "400px", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© OpenStreetMap contributors"
            />
            <Marker position={position}>
              <Popup>Your location</Popup>
            </Marker>
            <Marker position={[targetLat, targetLon]}>
              <Popup>KPU Surrey Library location</Popup>
            </Marker>
          </MapContainer>
        ) : (
          <p>Loading map...</p>
        )}
      </div>
      {distance && (
        <p>Distance to KPU Surrey Library: {distance} km</p>
      )}
    </div>
  );
}

export default App;
