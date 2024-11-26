import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import Alert, { AlertProps } from "../components/Notifications/Alert";
import axios from "axios";

// Initialize Socket.io
const socket = io("http://localhost:7000");

const NotificationContainer: React.FC = () => {
  const [notifications, setNotifications] = useState<AlertProps[]>([]);
  const [currentNotification, setCurrentNotification] = useState<AlertProps | null>(null);

  // Listen for notifications from the server
  useEffect(() => {
    socket.on("showAlert", (notification: AlertProps) => {
        
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
    // If there are notifications, set the current notification
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
