import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerDashboard from "./pages/customer/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import MediatorDashboard from "./pages/mediator/Dashboard";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
       <Navbar />
      <div className="pt-16"/> {/* padding so content doesn’t hide under navbar */}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Customer */}
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Mediator */}
        <Route path="/mediator/dashboard" element={<MediatorDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
