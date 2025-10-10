import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// Public Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Dashboards
import CustomerDashboard from "./pages/customer/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import MediatorDashboard from "./pages/mediator/Dashboard";
import SupplierDashboard from "./pages/supplier/Dashboard";

// Admin Layout (wraps admin pages with sidebar)
import AdminLayout from "./components/AdminLayout";

// Admin Pages
import StockRequest from "./pages/admin/supplier/StockRequest";
import GroupsManagement from './pages/admin/GroupsManagement';
import SupplierManagement from './pages/admin/supplier/SupplierManagement';


// Admin Product CRUD
import ProductManagement from "./pages/admin/products/ProductManagement";
import NewProduct from "./pages/admin/products/NewProduct";
import EditProduct from "./pages/admin/products/EditProduct";
import ViewProduct from "./pages/admin/products/ViewProduct";

import Navbar from "./components/Navbar";

function AppContent() {
  const location = useLocation();

  // Navbar visible only on these public routes
  const navbarRoutes = ["/", "/login", "/register"];
  const showNavbar = navbarRoutes.includes(location.pathname);

  return (
    <>
      {showNavbar && (
        <>
          <Navbar />
          <div className="pt-16" /> {/* Padding so content doesn't hide under navbar */}
        </>
      )}

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard routes (without AdminLayout - direct access) */}
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/mediator/dashboard" element={<MediatorDashboard />} />
        <Route path="/supplier/dashboard" element={<SupplierDashboard />} />

        {/* Admin routes with shared sidebar layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="supplier/stock-request" element={<StockRequest />} />
          <Route path="groups" element={<GroupsManagement />} />
          <Route path="/admin/suppliers" element={<SupplierManagement />} />

          
          {/* Admin Product CRUD */}
          <Route path="products" element={<ProductManagement />} />
          <Route path="products/new" element={<NewProduct />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="products/view/:id" element={<ViewProduct />} />
        </Route>
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