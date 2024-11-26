import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import Alert, { AlertProps } from "../components/Notifications/Alert";
import axios from "axios";

// Initialize Socket.io
const socket = io("http://localhost:1000");

const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

const NotificationContainer: React.FC = () => {
  const [notifications, setNotifications] = useState<AlertProps[]>([]);
  const [currentNotification, setCurrentNotification] = useState<AlertProps | null>(null);

  // Listen for notifications from the server
  useEffect(() => {
    socket.on("showAlert", async (notification: AlertProps) => {
      // Format the notification
      const formattedNotification = {
        ...notification,
        alert_type: capitalizeFirstLetter(notification.alert_type), // Capitalize alert_type
      };

      // Manually create timestamp and date
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD
      const formattedTimestamp = currentDate
        .toISOString()
        .replace("T", " ") // Replace 'T' with space
        .split(".")[0];    // Remove milliseconds for 'YYYY-MM-DD HH:mm:ss'

      // Prepare alert payload for posting
      const alertPayload = {
        device_id: formattedNotification.index, // Assuming `index` is the device_id
        alert_type: formattedNotification.alert_type,
        date: formattedDate,
        timestamp: formattedTimestamp,
        details: formattedNotification.message,
      };

      try {
        // Post the alert to the backend
        await axios.post("/api/v1/alert/all", alertPayload);
        console.log("Alert successfully posted");
      } catch (error) {
        console.error("Error posting alert:", error);
      }

      console.log("Notification received");
      setNotifications((prev) => {
        if (!prev.some((notif) => notif === notification)) {
          return [...prev, notification];
        }
        return prev; 
      });
    });
  }, []);

  useEffect(() => {
    if (notifications.length > 0 && !currentNotification) {
      setCurrentNotification(notifications[0]); // Set the first notification as current
    }
  }, [notifications, currentNotification]); // Effect runs when notifications or currentNotification change

  useEffect(() => {
    if (currentNotification) {
      const timer = setTimeout(() => {
        setCurrentNotification(null); // Remove the current notification after a delay
        setNotifications((prev) => prev.slice(1)); // Remove the first notification from the queue
      }, 5000); // 5 seconds display time

      return () => clearTimeout(timer); // Cleanup the timer on re-render
    }
  }, [currentNotification]); // Effect runs when currentNotification changes

  return (
    <div style={{ zIndex: 1000 }} className="fixed bottom-5 right-5 space-y-3">
      {currentNotification && (
        <div className="transform transition-all duration-300 ease-in-out animate-slide-in">
          <Alert alerts={[currentNotification]} />
        </div>
      )}
    </div>
  );
};

export default NotificationContainer;
