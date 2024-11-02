// LoginPage.tsx
import { useState} from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Handle login submission
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/v1/admin/login", { username, password });
      if (response.data.token) {
        Cookies.set("auth-cookie", response.data.token, { expires: 1 }); // Save token as a cookie for 1 day
        navigate("/"); // Redirect to dashboard or another page after login
        navigate(0); //For Refreshing the Page
      }
    } catch (err: any) {
        setError(err.response.data.message); // Display API error message
        console.error("Login error:", err);
    }
  };

//   // Handle logout
//   const handleLogout = async () => {
//     try {
//       await axios.post("/api/v1/admin/logout");
//       Cookies.remove("auth-token"); // Remove token on logout
//       navigate("/login");
//     } catch (err: any) {
//       console.error("Logout error:", err);
//     }
//   };

  return (
    <div className="flex items-center h-[80vh]">
        <div className="max-w-md w-4/6 mx-auto my-10 p-6 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleLogin}>
            <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                required
            />
            </div>
            <div className="mb-6">
            <label className="block text-gray-700">Password</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                required
            />
            </div>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
            Login
            </button>
        </form>
        </div>
    </div>
  );
};

export default Login;
