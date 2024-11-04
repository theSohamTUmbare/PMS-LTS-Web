import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
import { io } from "socket.io-client";

interface Location {
  lat: number;
  lng: number;
}

const Map: React.FC = () => {
  const mapRef = useRef<L.Map | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup>(new L.FeatureGroup());
  const markerRef = useRef<L.Marker | null>(null);
  const [location, setLocation] = useState<Location>({ lat: 51.505, lng: -0.09 });

  useEffect(() => {
    const socket = io("http://localhost:7000");

    socket.on("locationUpdate", (newLocation: Location) => {
      setLocation(newLocation);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const initializeMapControls = () => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    // Add the feature group to the map
    drawnItemsRef.current.addTo(map);

    // Initialize Draw Control with Options
    const drawControl = new L.Control.Draw({
      draw: {
        polyline: false,
        marker: false,
        circlemarker: false,
        polygon: {
          allowIntersection: false,
          showArea: true,
        },
        rectangle: {
          shapeOptions: {
            color: "#ff7800",
            weight: 1,
          },
        },
        circle: {
          shapeOptions: {
            color: "#ff7800",
            weight: 1,
          },
        },
      },
      edit: {
        featureGroup: drawnItemsRef.current,
      },
    });

    // Add the draw control to the map
    map.addControl(drawControl); 

    // Event handler for drawn shapes
    const onCreated = (event: L.DrawEvents.Created) => {
      const layer = event.layer;
      drawnItemsRef.current.addLayer(layer);
      if (event.layerType === "circle" && layer instanceof L.Circle) {
        const radius = layer.getRadius();
        const center = layer.getLatLng();
        console.log("Circle created with radius:", radius, "and center:", center);
      } else if (event.layerType === "polygon" && layer instanceof L.Polygon) {
        const latLngs = layer.getLatLngs();
        console.log("Polygon created with coordinates:", latLngs);
      }
    };

    map.on(L.Draw.Event.CREATED, onCreated);

    // Cleanup function to remove the drawing control and event listeners
    return () => {
      map.off(L.Draw.Event.CREATED, onCreated);
      map.removeControl(drawControl); // Remove the draw control on unmount
    };
  };

  useEffect(() => {
    if (!mapRef.current) return;
    const cleanupControls = initializeMapControls();
    return cleanupControls; // Return cleanup function
  }, []); // Only runs once on mount

//   useEffect(() => {
//     if (!mapRef.current) return;

//     const map = mapRef.current;

//     if (markerRef.current) {
//       map.removeLayer(markerRef.current);
//     }

//     markerRef.current = L.marker([location.lat, location.lng])
//       .addTo(map)
//       .bindPopup("Current Location")
//       .openPopup();

//     const updateMarkerPosition = () => {
//       if (markerRef.current) {
//         markerRef.current.setLatLng([location.lat, location.lng]);
//         map.panTo([location.lat, location.lng]);
//       }
//     };

//     updateMarkerPosition();
//   }, [location]); // Update marker when location changes

  const SetMapRef: React.FC = () => {
    const map = useMap();
    mapRef.current = map;
    return null;
  };

  return (
    <div className="relative">
      <MapContainer
        center={[location.lat, location.lng]}
        zoom={13}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <SetMapRef />
      </MapContainer>
    </div>
  );
};

export default Map;
