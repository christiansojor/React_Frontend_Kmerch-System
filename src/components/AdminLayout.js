import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, Package, Menu, X, Building2, 
  Layers, Send, ShoppingBag, Activity, BarChart3, LogOut
} from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { id: 'products', label: 'Products', icon: Package, path: '/admin/products' },
    { id: 'groups', label: 'Groups', icon: Layers, path: '/admin/groups' },
    { id: 'suppliers', label: 'Suppliers', icon: Building2, path: '/admin/suppliers' },
    { id: 'stock-requests', label: 'Stock Requests', icon: Send, path: '/admin/supplier/stock-request' },
    { id: 'orders', label: 'Purchase Records', icon: ShoppingBag, path: '/admin/orders' },
    { id: 'trading', label: 'Trading History', icon: Activity, path: '/admin/trading' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/admin/analytics' }
  ];

  useEffect(() => {
    const path = location.pathname;
    const found = sidebarItems.find(item => item.path === path);
    if (found) setActivePage(found.id);
  }, [location]);

  const handleNavigation = (item) => {
    setActivePage(item.id);
    navigate(item.path);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-white shadow-2xl transition-all duration-300 flex flex-col border-r border-gray-200`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  K-Dream Admin
                </h1>
                <p className="text-xs text-gray-500 mt-1">Management System</p>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
            </button>
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigation(item)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${!sidebarOpen && 'mx-auto'}`} />
                    {sidebarOpen && <span className="font-medium">{item.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Profile + Logout */}
        {sidebarOpen && (
          <div className="p-4 border-t border-gray-200 relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 p-3 w-full bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 transition-all"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                A
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-900 text-sm">Admin User</p>
                <p className="text-xs text-gray-500">admin@kpop.com</p>
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute bottom-20 left-4 right-4 bg-white shadow-xl rounded-xl border border-gray-100">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Log Out</span>
                </button>
              </div>
            )}
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
