import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { io } from "socket.io-client";

interface Location {
  id: string;
  name: string;
  trackingId: string;
  latitude: number;
  longitude: number;
  timestamp: number;
  // accuracy: number;
}

const Test: React.FC = () => {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [trackingId: string]: L.Marker }>({});
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    // Initialize socket connection
    const socket = io("https://pms-lts-backend.onrender.com");

    // Listen for location updates
    socket.on("locationUpdate", (updatedLocations: { [id: string]: Location }) => {
      setLocations(Object.values(updatedLocations));
    });

    // Listen for user disconnection
    socket.on("userDisconnected", (id: string) => {
      // Remove marker from map and delete from markersRef
      if (markersRef.current[id]) {
        mapRef.current?.removeLayer(markersRef.current[id]);
        delete markersRef.current[id];
      }
    });

    // Clean up the socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  // Function to smoothly animate marker movement
  const smoothMarkerMovement = (marker: L.Marker, newLatLng: L.LatLng) => {
    const startLatLng = marker.getLatLng();
    const duration = 1000; // Transition duration in ms
    let start: number | null = null;

    const latDelta = (newLatLng.lat - startLatLng.lat) / duration;
    const lngDelta = (newLatLng.lng - startLatLng.lng) / duration;

    function animate(timestamp: number) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const newLat = startLatLng.lat + progress * latDelta;
      const newLng = startLatLng.lng + progress * lngDelta;
      if (progress < duration) {
        marker.setLatLng([newLat, newLng]);
        requestAnimationFrame(animate);
      } else {
        marker.setLatLng(newLatLng);
      }
    }

    requestAnimationFrame(animate);
  };

  // Update markers on the map when locations change
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    // Loop through location data to update or create markers
    locations.forEach((location) => {
      const { id, name, trackingId,latitude, longitude } = location;
      const newLatLng = new L.LatLng(latitude, longitude);

      // If marker already exists, update its position smoothly
      if (markersRef.current[id]) {
        smoothMarkerMovement(markersRef.current[id], newLatLng);
      } else {
        // Create a new marker if it doesn't exist
        const marker = L.marker(newLatLng, {
          icon: L.icon({
            iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          }),
        })
          .addTo(map)
          .bindPopup(`Name: ${name}`);

        // Store marker reference
        markersRef.current[id] = marker;
      }
    });

    // Remove any markers that are no longer in locations
    Object.keys(markersRef.current).forEach((id) => {
      if (!locations.find((loc) => loc.id === id)) {
        map.removeLayer(markersRef.current[id]);
        delete markersRef.current[id];
      }
    });
  }, [locations]);

  const SetMapRef: React.FC = () => {
    const map = useMap();
    mapRef.current = map;
    return null;
  };

  return (
    <div className="relative">
      <MapContainer
        center={[16.2487029, 77.3660572]}
        zoom={13}
        style={{ height: "100vh", width: "100%" }}
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <SetMapRef />
      </MapContainer>
    </div>
  );
};

export default Test;
