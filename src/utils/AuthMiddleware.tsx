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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<string | null>("");
  const token = Cookies.get("auth-cookie");

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const response = await axios.get("/api/v1/admin/verify-token");
          // console.log(response.data);
          setIsAuthenticated(response.data.isAuthenticated);
          setUser(response.data.name);
        } catch (error) {
          console.error("Token verification failed:", error);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    verifyToken();
  }, [token]);

  if (isAuthenticated === null) {
    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export default AuthMiddleware;
