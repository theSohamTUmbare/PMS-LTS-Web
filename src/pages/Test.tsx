import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  FeatureGroup,
  useMap,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L, { LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { io } from "socket.io-client";
// import { v4 as uuidv4 } from "uuid";
import axios from "axios";

interface Location {
  id: string;
  name: string;
  trackingId: string;
  latitude: number;
  longitude: number;
  timestamp: number;
}

export interface GeofenceCircle {
  geofence_id: string;
  name?: string;
  layer?: L.Circle;
  shape: 'Circle';
  alert_type?: "Informational" | "Warning" | "Critical";
  type?: "Positive" | "Negative";
  radius: number;
  center_lat: number;
  center_lng: number;
}

export interface GeofencePolygon {
  geofence_id: string;
  name?: string;
  layer?: L.Polygon;
  shape: 'Polygon';
  alert_type?: "Informational" | "Warning" | "Critical";
  type?: "Positive" | "Negative";
  coordinates: { lat: number; lng: number }[];
}

export interface GeofenceRectangle {
  geofence_id: string;
  name?: string;
  layer?: L.Rectangle;
  shape: 'Rectangle';
  alert_type?: "Informational" | "Warning" | "Critical";
  type?: "Positive" | "Negative";
  coordinates: { lat: number; lng: number }[];
}

export type Geofence = GeofenceCircle | GeofencePolygon | GeofenceRectangle;
// interface Geofence {
//   id: string;
//   shape: L.Circle | L.Polygon | L.Rectangle;
// }

const MapWithGeofencing: React.FC = () => {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [trackingId: string]: L.Marker }>({});
  const featureGroupRef = useRef<L.FeatureGroup>(new L.FeatureGroup());
  const [locations, setLocations] = useState<Location[]>([]);
  const [geofences, setGeofences] = useState<Geofence[]>([]);
  const [currentGeofence, setCurrentGeofence] = useState<GeofenceCircle | GeofenceRectangle | GeofencePolygon | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    const socket = io("http://localhost:1000");

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

    if (geofence.layer instanceof L.Circle) {
      return geofence.layer.getBounds().contains(markerLatLng);
    } else if (
      geofence.layer instanceof L.Polygon ||
      geofence.layer instanceof L.Rectangle
    ) {
      return geofence.layer.getBounds().contains(markerLatLng);
    }
    return false;
  };

  const onCreated = (e: L.DrawEvents.Created) => {
    const layer = e.layer;
    const geofenceId = uuidv4();
    if (layer instanceof L.Circle) {
      setShowForm(true);
      const geofence: GeofenceCircle = {
        geofence_id: geofenceId,
        layer: layer,
        shape: 'Circle',
        radius: layer.getRadius(),
        center_lat: layer.getLatLng().lat,
        center_lng: layer.getLatLng().lng,
        type: 'Positive',
        alert_type: 'Warning',
      };
      setCurrentGeofence(geofence);
    }
    else if (layer instanceof L.Rectangle) {
      setShowForm(true);
      const geofence: GeofenceRectangle = {
        geofence_id: geofenceId,
        layer: layer,
        shape: 'Rectangle',
        type: 'Positive',
        alert_type: 'Warning',
        coordinates: (layer.getLatLngs() as LatLng[]).map(({ lat, lng }: LatLng) => ({ lat, lng }))
      };
      setCurrentGeofence(geofence);
      
    }
    else if(layer instanceof L.Rectangle){
      setShowForm(true);
      const geofence: GeofenceRectangle = {
        geofence_id: geofenceId,
        layer: layer,
        shape: 'Rectangle',
        type: 'Positive',
        alert_type: 'Warning',
        coordinates: (layer.getLatLngs() as LatLng[]).map(({ lat, lng }: LatLng) => ({ lat, lng }))
      };
      setCurrentGeofence(geofence);

    }

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
      prev.filter((geofence) => !deletedIds.includes(geofence.geofence_id))
    );
  };

  useEffect(() => {
    locations.forEach((location) => {
      geofences.forEach((geofence) => {
        const isInGeofence = checkMarkerInGeofence(location, geofence);
        if (isInGeofence) {
          console.log(
            `Marker ${location.id} entered geofence ${geofence.geofence_id}`
          );
        } else {
          console.log(
            `Marker ${location.id} exited geofence ${geofence.geofence_id}`
          );
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

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (currentGeofence) {
      const updatedGeofence: typeof currentGeofence = {
        ...currentGeofence,
        ...formData,
      };

      delete updatedGeofence.layer;
      try {
        const response = await axios.post("/api/v1/geofence/add", updatedGeofence);
        console.log("Geofence saved:", response.data);
        setGeofences((prev) => [...prev, updatedGeofence]);

        setShowForm(false);
        setFormData({});
        setCurrentGeofence(null);

      } catch (error) {
        console.error("Error saving geofence:", error);
      }
    }
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
      {showForm && (<div>
      {/* Overlay */}
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-10"></div>

      {/* Form */}
      <div
        style={{ zIndex: 1000 }}
        className="fixed inset-0 flex items-center justify-center"
      >
        <form
          onSubmit={handleFormSubmit}
          className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Enter Geofence Details
          </h3>

          {/* Geofence Name */}
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Geofence Name:
            <input
              type="text"
              name="name"
              value={formData.name ?? ''}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </label>

          {/* Geofence Type */}
          <label className="block mb-4 text-sm font-medium text-gray-700">
            Geofence Type:
            <select
              name="type"
              value={formData.type ?? 'Positive'}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              required
            >
              <option value="Positive">Positive</option>
              <option value="Negative">Negative</option>
            </select>
          </label>

          {/* Alert Type */}
          <label className="block mb-4 text-sm font-medium text-gray-700">
            Alert Type:
            <select
              name="alert_type"
              value={formData.alert_type ?? "Informational"}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="Informational">Informational</option>
              <option value="Warning">Warning</option>
              <option value="Critical">Critical</option>
            </select>
          </label>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save Geofence
            </button>
          </div>
        </form>
      </div>
    </div>
      )}
    </div>
  );
};

export default MapWithGeofencing;
