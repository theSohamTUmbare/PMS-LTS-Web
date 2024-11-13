import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
import axios from "axios";

interface Location {
  id: string; // Unique identifier for each device
  latitude: number;
  longitude: number;
}

const Map: React.FC = () => {
  const mapRef = useRef<L.Map | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup>(new L.FeatureGroup());
  const [locations, setLocations] = useState<Location[]>([]); // Store multiple device locations

  useEffect(() => {
    // Fetch location data periodically for multiple devices
    const fetchLocations = async () => {
      try {
        const response = await axios.get("/api/v1/locations");
        if (response.data.length >=  0) {
          setLocations(response.data);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    // Fetch locations every 5 seconds
    const interval = setInterval(fetchLocations, 2000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  useEffect(() => { 
    if (!mapRef.current) return;

    const map = mapRef.current;

    // Clear existing markers before adding new ones
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add markers for all device locations
    locations.forEach((location) => {
      L.marker([location.latitude, location.longitude], {
        icon: L.icon({
          iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        }),
      })
        .addTo(map)
        .bindPopup(`Device ID: ${location.id}`);
    });
  }, [locations]);

  const initializeMapControls = () => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    drawnItemsRef.current.addTo(map);

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

    map.addControl(drawControl);

    const onCreated = (event: L.DrawEvents.Created) => {
      const layer = event.layer;
      drawnItemsRef.current.addLayer(layer);
      if (event.layerType === "circle" && layer instanceof L.Circle) {
        console.log("Circle created with radius:", layer.getRadius(), "and center:", layer.getLatLng());
      } else if (event.layerType === "polygon" && layer instanceof L.Polygon) {
        console.log("Polygon created with coordinates:", layer.getLatLngs());
      }
    };

    map.on(L.Draw.Event.CREATED, onCreated);

    return () => {
      map.off(L.Draw.Event.CREATED, onCreated);
      map.removeControl(drawControl);
    };
  };

  useEffect(() => {
    const cleanupControls = initializeMapControls();
    return cleanupControls;
  }, []);

  const SetMapRef: React.FC = () => {
    const map = useMap();
    mapRef.current = map;
    return null;
  };

  return (
    <div className="relative">
      <MapContainer
        center={[16.2487029, 77.3660572]} // Initial map center
        zoom={13}
        style={{ height: "100vh", width: "100%" }}
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)} 
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
