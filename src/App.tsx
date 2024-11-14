import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import Layout from "./layouts/Layout";
import Hero from "./components/Hero";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Management from "./pages/Management";
import Map from "./pages/Map";
import AuthMiddleware from "./utils/AuthMiddleware";
import CellAssign from "./pages/CellAssign";
import { UserContext } from "./utils/AuthMiddleware";
import PrisonerDetails from "./pages/PrisonerDetails";

function App() {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    // Attempt to fetch user data if logged in
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/v1/admin/verify-token"); // Verify token endpoint
        if (response.data.isAuthenticated) {
          setUser(response.data.name); // Set user name or any other info you want to pass down
        }
      } catch (error) {
        console.error("User not authenticated:", error);
      }
    };
    fetchUser();
  }, []);
  return (
    <UserContext.Provider value={user}>
      <Router>
        <Routes>
          {/* If there is written anything inside the custom component it is passed as prop in children */}
          <Route
            path="/"
            element={
              <Layout>
                <Hero />
                <Home />
              </Layout>
            }
          />
          <Route
            path="/dashboard"
            element={
              <AuthMiddleware>
                <Layout>
                  <Management />
                </Layout>
              </AuthMiddleware>
            }
          />
          <Route
            path="/prisoner-details/:id"
            element={
              <AuthMiddleware>
                <Layout>
                  <PrisonerDetails />
                </Layout>
              </AuthMiddleware>
            }
          />
          <Route
            path="/live-map"
            element={
              <AuthMiddleware>
                <Layout>
                  <Map />
                </Layout>
              </AuthMiddleware>
            }
          />
          <Route
            path="/login"
            element={
              
              <Layout>
                {user ? <Navigate to="/" /> :<Login />}
              </Layout>
              
            }
          />
          <Route
            path="/cell-assign"
            element={
                <Layout>
                  <CellAssign />
                </Layout>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
