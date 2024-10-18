// AuthMiddleware.jsx
import React, { useEffect, useState, createContext } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

export const UserContext = createContext<string | null>(null);

interface Props {
  children: React.ReactNode;
}

const AuthMiddleware = ({ children }: Props) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(false); // Use null to indicate loading state
  const [user, setUser] = useState<string | null>("");
  const token = Cookies.get("auth-token"); // Get the JWT from the cookie

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const response = await axios.post("/api/verify-token"); //TODO:  Replace with your actual API endpoint
          setIsAuthenticated(response.data.isAuthenticated); // Set the authentication state
          setUser(response.data.user);
        } catch (error) {
          console.error("Token verification failed:", error);
          setIsAuthenticated(false); // Set to false if there's an error
        }
      } else {
        setIsAuthenticated(false); // No token means not authenticated
      }
    };

    verifyToken(); // Call the verification function
  }, [token]);

  // Redirect to login page if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>; // Render children if authenticated
};

export default AuthMiddleware;
