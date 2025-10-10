import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, ArrowUp, ArrowDown, ShoppingCart, Package,
  Clock, FileText, Send
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalRevenue: { value: '₱1,234,567', change: '+12.5%', positive: true },
    totalOrders: { value: '2,341', change: '+15.3%', positive: true },
    totalProducts: { value: '456', change: '+8.2%', positive: true },
    pendingRequests: { value: '23', change: '-5.1%', positive: false }
  });

  // ... rest of your state (recentOrders, stockRequests, topProducts)

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-emerald-100 text-emerald-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="px-8 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Export Report
            </button>
            <button
              onClick={() => navigate('/admin/supplier/stock-request')}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              New Stock Request
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-8">
        {/* Your stats, tables, and other content here */}
        {/* ... rest of your dashboard content ... */}
      </div>
    </>
  );
};

export default AdminDashboard;