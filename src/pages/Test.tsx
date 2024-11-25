import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  FeatureGroup,
  useMap,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { io } from "socket.io-client";

interface Location {
  id: string;
  name: string;
  trackingId: string;
  latitude: number;
  longitude: number;
  timestamp: number;
}

interface Geofence {
  id: string;
  shape: L.Circle | L.Polygon | L.Rectangle;
}

const MapWithGeofencing: React.FC = () => {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [trackingId: string]: L.Marker }>({});
  const featureGroupRef = useRef<L.FeatureGroup>(new L.FeatureGroup());
  const [locations, setLocations] = useState<Location[]>([]);
  const [geofences, setGeofences] = useState<Geofence[]>([]);

  useEffect(() => {
    const socket = io("http://localhost:7000");

    socket.on(
      "locationUpdate",
      (updatedLocations: { [id: string]: Location }) => {
        setLocations(Object.values(updatedLocations));
      }
    );

    socket.on("userDisconnected", (id: string) => {
      if (markersRef.current[id]) {
        mapRef.current?.removeLayer(markersRef.current[id]);
        delete markersRef.current[id];
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const smoothMarkerMovement = (marker: L.Marker, newLatLng: L.LatLng) => {
    const startLatLng = marker.getLatLng();
    const duration = 1000;
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

  const checkMarkerInGeofence = (marker: Location, geofence: Geofence) => {
    const { latitude, longitude } = marker;
    const markerLatLng = new L.LatLng(latitude, longitude);

    if (geofence.shape instanceof L.Circle) {
      return geofence.shape.getBounds().contains(markerLatLng);
    } else if (
      geofence.shape instanceof L.Polygon ||
      geofence.shape instanceof L.Rectangle
    ) {
      return geofence.shape.getBounds().contains(markerLatLng);
    }
    return false;
  };

  const onCreated = (e: L.DrawEvents.Created) => {
    const layer = e.layer;

    const geofence = {
      id: `${Date.now()}`,
      shape: layer,
    };
    setGeofences((prev) => [...prev, geofence]);

    if (layer instanceof L.Circle) {
      console.log("Circle Geofence:", layer.getLatLng(), layer.getRadius());
    } else if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
      console.log("Polygon/Rectangle Geofence:", layer.getLatLngs());
    }
  };

  const onDeleted = (e: L.DrawEvents.Deleted) => {
    const layers = e.layers;
    const deletedIds = Object.values(layers._layers).map(
      (layer: any) => layer._leaflet_id
    );
    setGeofences((prev) =>
      prev.filter((geofence) => !deletedIds.includes(geofence.id))
    );
  };

  useEffect(() => {
    locations.forEach((location) => {
      geofences.forEach((geofence) => {
        const isInGeofence = checkMarkerInGeofence(location, geofence);
        if (isInGeofence) {
          console.log(`Marker ${location.id} entered geofence ${geofence.id}`);
        } else {
          console.log(`Marker ${location.id} exited geofence ${geofence.id}`);
        }
      });
    });
  }, [locations, geofences]);

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    locations.forEach((location) => {
      const { id, name, trackingId, latitude, longitude } = location;
      const newLatLng = new L.LatLng(latitude, longitude);

      if (markersRef.current[id]) {
        smoothMarkerMovement(markersRef.current[id], newLatLng);
      } else {
        const marker = L.marker(newLatLng, {
          icon: L.icon({
            iconUrl:
              "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
            iconSize: [25, 41],  
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          }),
        })
          .addTo(map)
          .bindPopup(`Name: ${name}`);

        markersRef.current[id] = marker;
      }
    });

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

        {/* FeatureGroup for managing geofences */}
        <FeatureGroup>
          <EditControl
            position="topright"
            onCreated={onCreated}
            onDeleted={onDeleted}
            draw={{
              rectangle: { showArea: false },
              polygon: true,
              circle: true,
              polyline: false,
              marker: false,
              circlemarker: false,
            }}
          />
        </FeatureGroup>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {/* Render markers
        {locations.map((location) => (
          <Marker key={location.id} position={[location.latitude, location.longitude]} />
        ))} */}

        <SetMapRef />
      </MapContainer>
    </div>
  );
};

export default MapWithGeofencing;
