import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerDashboard from "./pages/customer/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import MediatorDashboard from "./pages/mediator/Dashboard";
import Navbar from "./components/Navbar";

function AppContent() {
  const location = useLocation();

  // List of routes where Navbar should be hidden
  const hideNavbarRoutes = [
    "/customer/dashboard",
    "/admin/dashboard",
    "/mediator/dashboard",
  ];

  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && (
        <>
          <Navbar />
          <div className="pt-16" /> {/* Padding only when Navbar is visible */}
        </>
      )}

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboards */}
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/mediator/dashboard" element={<MediatorDashboard />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
