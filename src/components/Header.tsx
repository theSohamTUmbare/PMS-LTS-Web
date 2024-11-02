import { useContext, useState } from "react";
import Logo from "../assets/react.svg";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../utils/AuthMiddleware";
import axios from "axios";
import Cookies from "js-cookie";

const Header = () => {
  const user: string | null = useContext(UserContext);

  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call the logout API
      await axios.post("/api/v1/admin/logout"); // Adjust the endpoint as needed

      // Remove the token from cookies
      Cookies.remove("auth-cookie");

      // Navigate to the login page after logging out
      navigate("/login");

      // Reload the page to update context and state
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="bg-slate-900 py-4">
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo Section */}
        <div className="flex items-center gap-x-4">
          <img className="w-10" src={Logo} alt="Logo" />
          <span className="text-white text-xl font-bold">
            <Link to="/">PMS-LTS</Link>
          </span>
        </div>

        {/* Links Section */}
        <div className="hidden md:flex items-center gap-x-6 text-white">
          <Link to="/dashboard" className="hover:text-blue-400">
            Manage Roles
          </Link>
          <Link to="/live-map" className="hover:text-blue-400">
            Live Map
          </Link>
          <Link to="/communication" className="hover:text-blue-400">
            Communication
          </Link>
          <Link to="/location-history" className="hover:text-blue-400">
            Location History
          </Link>
          <Link to="/alerts" className="block hover:text-blue-400">
            Alerts and Notifications
          </Link>
        </div>

        {/* User and Login/Logout Section */}
        <div className="hidden md:flex items-center">
          {user ? (
            <div className="flex items-center gap-x-4">
              <Link to="/profile" className="flex items-center gap-x-2 text-white">
                <FontAwesomeIcon icon={faUser} />
                <span className="text-lg font-bold">{user}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login">
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Login
              </button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white">
            <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} size="lg" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-slate-800 text-white px-4 py-3 space-y-3">
          <Link to="/dashboard" className="block hover:text-blue-400">
            Manage Roles
          </Link>
          <Link to="/live-map" className="block hover:text-blue-400">
            Live Map
          </Link>
          <Link to="/communication" className="block hover:text-blue-400">
            Communication
          </Link>
          <Link to="/location-history" className="block hover:text-blue-400">
            Location History
          </Link>
          <Link to="/alerts" className="block hover:text-blue-400">
            Alerts and Notifications
          </Link>
          {user ? (
            <div className="mt-3">
              <Link to="/profile" className="flex items-center gap-x-2 hover:text-blue-400">
                <FontAwesomeIcon icon={faUser} />
                <span className="text-lg font-bold">{user}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-3"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="block mt-3">
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full">
                Login
              </button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Header;
