import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import Alert, {AlertProps} from '../components/Notifications/Alert'

// Initialize Socket.io
const socket = io("http://localhost:7000");

const NotificationContainer: React.FC = () => {
  const [notifications, setNotifications] = useState<AlertProps[]>([]);
  const [currentNotification, setCurrentNotification] = useState<AlertProps | null>(null);

  useEffect(() => {
    // Listen for notifications from the server
    socket.on("showAlert", (notification: AlertProps) => {
        console.log('Notification recieved')
      setNotifications((prev) => [...prev, notification]);
    });
  }, []);

  useEffect(() => {
    if (!currentNotification && notifications.length > 0) {
      const nextNotification = notifications[0];
      setCurrentNotification(nextNotification);

      const timer = setTimeout(() => {
        setCurrentNotification(null);
        setNotifications((prev) => prev.slice(1));
      }, 2000); // 3 seconds display time

      return () => clearTimeout(timer);
    }
  }, [currentNotification, notifications]);


  return (
    <div style={{zIndex: 1000}} className="fixed bottom-5 right-5 space-y-3">
      {currentNotification && (
        <div className="transform transition-all duration-300 ease-in-out animate-slide-in">
          <Alert alerts={[currentNotification]}/>
        </div>
      )}
    </div>
  );
};

export default NotificationContainer;
