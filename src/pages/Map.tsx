import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  useMap
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L, { LatLng, MarkerOptions, PolylineOptions, CircleMarkerOptions } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { AlertType } from "../components/Notifications/Alert";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

interface Location {
  id: string;
  name: string;
  trackingId: string;
  latitude: number;
  longitude: number;
  timestamp: number;
}

interface CustomOptions extends MarkerOptions, PolylineOptions, CircleMarkerOptions {
  geofenceId?: string; // Add your custom property here
}

export interface GeofenceCircle {
  geofence_id: string;
  name?: string;
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
  shape: 'Polygon';
  alert_type?: "Informational" | "Warning" | "Critical";
  type?: "Positive" | "Negative";
  coordinates: { lat: number; lng: number }[];
}

export interface GeofenceRectangle {
  geofence_id: string;
  name?: string;
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

const Map: React.FC = () => {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [trackingId: string]: L.Marker }>({});
  const featureGroupRef = useRef<L.FeatureGroup>(new L.FeatureGroup());
  const [locations, setLocations] = useState<Location[]>([]);
  const [geofences, setGeofences] = useState<Geofence[]>([]);
  const [currentGeofence, setCurrentGeofence] = useState<GeofenceCircle | GeofenceRectangle | GeofencePolygon | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const prevLocationsRef = useRef<Location[]>([]);

  useEffect(() => {
    // Fetch geofences from your API
    const fetchGeofences = async () => {
      try {
        const response = await axios.get('/api/v1/geofence/all'); // Replace with your API endpoint
        const data = response.data;

        // Map API response to the appropriate Geofence type
        const mappedGeofences: Geofence[] = data.map((geofence: any) => {
          if (geofence.shape === 'Circle') {
            return {
              geofence_id: geofence.geofence_id,
              shape: 'Circle',
              radius: geofence.radius,
              center_lat: geofence.center_lat,
              center_lng: geofence.center_lng,
              alert_type: geofence.alert_type,
              type: geofence.type,
              name: geofence.name,
            } as GeofenceCircle;
          } else if (geofence.shape === 'Polygon') {
            return {
              geofence_id: geofence.geofence_id,
              shape: 'Polygon',
              coordinates: geofence.coordinates,
              alert_type: geofence.alert_type,
              type: geofence.type,
              name: geofence.name,
            } as GeofencePolygon;
          } else if (geofence.shape === 'Rectangle') {
            return {
              geofence_id: geofence.geofence_id,
              shape: 'Rectangle',
              coordinates: geofence.coordinates,
              alert_type: geofence.alert_type,
              type: geofence.type,
              name: geofence.name,
            } as GeofenceRectangle;
          }
          return null;
        }).filter(Boolean);

        setGeofences(mappedGeofences);
      } catch (error) {
        console.error("Error fetching geofences", error);
      }
    };

    fetchGeofences();
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      // Add geofences to the map on initial render
      geofences.forEach(geofence => {
        let layer: L.Layer;
        
        if (geofence.shape === 'Circle') {
          const circle = L.circle([geofence.center_lat, geofence.center_lng], {
            radius: geofence.radius,
            color: 'blue',
            fillColor: 'blue',
            fillOpacity: 0.05
          });
          layer = circle;
          featureGroupRef.current.addLayer(layer);
        } else if (geofence.shape === 'Polygon') {
          const polygon = L.polygon(geofence.coordinates.map(coord => [coord.lat, coord.lng]), {
            color: 'red',
            fillColor: 'red',
            fillOpacity: 0.05,
          });
          layer = polygon;
          featureGroupRef.current.addLayer(layer);
        } else if (geofence.shape === 'Rectangle') {
          const rectangle = L.rectangle(geofence.coordinates.map(coord => [coord.lat, coord.lng]), {
            color: 'green',
            weight: 1
          });
          layer = rectangle;
          featureGroupRef.current.addLayer(layer);
        }

      });

      // Add feature group to the map
      mapRef.current.addLayer(featureGroupRef.current);
    }
  }, [geofences]);

  useEffect(() => {
    prevLocationsRef.current = locations;
  }, [locations]);

  useEffect(() => {
    const socket = io("https://pms-lts-backend.onrender.com");

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

  const checkMarkerInGeofence = (marker: Location, geofence: Geofence): boolean => {
  const { latitude, longitude } = marker;
  const markerLatLng = new L.LatLng(latitude, longitude);

  if (geofence.shape === "Circle") {
    // Check if the marker is within the circle's radius
    const circleCenter = new L.LatLng(geofence.center_lat, geofence.center_lng);
    const distance = markerLatLng.distanceTo(circleCenter);
    return distance <= geofence.radius;
  } else if (geofence.shape === "Polygon" || geofence.shape === "Rectangle") {
    // Check if the marker is within the polygon/rectangle
    const latLngs = geofence.coordinates.map(coord => new L.LatLng(coord.lat, coord.lng));
    const polygon = L.polygon(latLngs);
    return polygon.getBounds().contains(markerLatLng);
  }

  return false;
};


const onCreated = (e: L.DrawEvents.Created) => {
  const layer = e.layer;
  const geofenceId = uuidv4();
  (layer.options as CustomOptions).geofenceId = geofenceId;
  if (layer instanceof L.Circle) {
    setShowForm(true);
    const geofence: GeofenceCircle = {
      geofence_id: geofenceId,
      shape: 'Circle',
      radius: layer.getRadius(),
      center_lat: layer.getLatLng().lat,
      center_lng: layer.getLatLng().lng,
      type: 'Positive',
      alert_type: 'Informational',
    };
    setCurrentGeofence(geofence);
    setGeofences(prev => [...prev, geofence]); // Add new geofence to state
  } else if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
    setShowForm(true);
    const coordinates = (layer.getLatLngs() as LatLng[] | LatLng[][]).flatMap((latLng: LatLng | LatLng[]) =>
      Array.isArray(latLng)
        ? latLng.map(({ lat, lng }: LatLng) => ({ lat, lng }))
        : [{ lat: (latLng as LatLng).lat, lng: (latLng as LatLng).lng }]
    );
    
    const geofence: GeofenceRectangle | GeofencePolygon = {
      geofence_id: geofenceId,
      shape: layer instanceof L.Polygon ? 'Polygon' : 'Rectangle',
      type: 'Positive',
      alert_type: 'Informational',
      coordinates,
    };
    setCurrentGeofence(geofence);
    setGeofences(prev => [...prev, geofence]); // Add new geofence to state
  }
};
  const onDeleted = (e: L.DrawEvents.Deleted) => {
    const layers = e.layers;
    const deletedIds: string[] = [];
  
    // Collect the IDs of the deleted layers
    layers.eachLayer((layer) => {
      if ('geofenceId' in layer.options) {
        deletedIds.push(layer.options.geofenceId as string);
      }
    });

    // console.log(deletedIds);
  
    // Remove the geofences with matching IDs
    setGeofences((prev) =>
      prev.filter((geofence) => !deletedIds.includes(geofence.geofence_id))
    );
  
    console.log("Deleted geofences:", deletedIds);
  };
  

  useEffect(() => {
    const socket = io("https://pms-lts-backend.onrender.com");
    locations.forEach((location) => {
      geofences.forEach((geofence) => {
        // const prevLocations = prevLocationsRef.current;
        const isInGeofence = checkMarkerInGeofence(location, geofence);
        // const prevLocation = prevLocations[index];
        // const prevIsInGeofence = prevLocation ? checkMarkerInGeofence(prevLocation, geofence) : null;
        const alertType = geofence.alert_type === 'Critical' ? AlertType.Critical : geofence.alert_type === 'Warning' ? AlertType.Warning : AlertType.Informational;
        // console.log(geofence);
        // console.log(isInGeofence);
        if ((isInGeofence && geofence.type === 'Positive')) {
          console.log(
            `Marker ${location.id} entered geofence ${geofence.geofence_id}`
          );
          socket.emit('newAlert', {device_id: location.trackingId, alert_type: alertType, message: `${location.name} Entered the ${geofence.name} Geofence`});
        } else if((!isInGeofence && geofence.type === 'Negative')) {
          console.log(
            `Marker ${location.id} exited geofence ${geofence.geofence_id}`
          );
          socket.emit('newAlert', {device_id: location.id, alert_type: alertType, message: `${location.name} Exited the ${geofence.name} Geofence`});
        }
      });
    });
  }, [locations, geofences]);

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    // console.log(geofences);

    locations.forEach((location) => {
      const { id, name, latitude, longitude } = location;
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
          .bindPopup(`Name: ${name}`)
          .openPopup();

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
      
      console.log(updatedGeofence);

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
        ref={mapRef}
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
              rectangle: { showArea: false } as any,
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
         {/* Loop through geofences and add them to the map
         {geofences.map((geofence) => {
          if (geofence.shape === 'Circle') {
            return (
              <Circle
                key={geofence.geofence_id}
                center={[geofence.center_lat, geofence.center_lng] as LatLngTuple}
                radius={geofence.radius}
                color="blue"
                fill
              >
                <Popup>{geofence.name}</Popup>
              </Circle>
            );
          } else if (geofence.shape === 'Polygon') {
            const coordinates = geofence.coordinates.map(coord => [coord.lat, coord.lng] as LatLngTuple);
            return (
              <Polygon
                key={geofence.geofence_id}
                positions={coordinates}
                color="green"
              >
                <Popup>{geofence.name}</Popup>
              </Polygon>
            );
          } else if (geofence.shape === 'Rectangle') {
            const coordinates = geofence.coordinates.map(coord => [coord.lat, coord.lng] as LatLngTuple);
            return (
              <Polygon
                key={geofence.geofence_id}
                positions={coordinates}
                color="red"
                fillOpacity={0.2}
              >
                <Popup>{geofence.name}</Popup>
              </Polygon>
            );
          }
          return null;
        })} */}
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

export default Map;
