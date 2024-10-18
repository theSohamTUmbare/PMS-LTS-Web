import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import Management from "./pages/Management";
import AuthMiddleware from "./utils/AuthMiddleware";

function App() {
  return (
    <Router>
      <Routes>
        {/* If there is written anything inside the custom component it is passed as prop in children */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/manage"
          element={
            <AuthMiddleware>
              <Layout>
                <Management />
              </Layout>
            </AuthMiddleware>
          }
        />
        <Route
          path="/login"
          element={
              <Layout>
                Login
              </Layout>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
