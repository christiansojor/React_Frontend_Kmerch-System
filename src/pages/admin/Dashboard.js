import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, ShoppingCart, Package, TrendingUp, DollarSign, ArrowUp, ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

console.log("AdminDashboard mounted");

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState([
    { label: 'Total Revenue', value: '₱1,234,567', change: '+12.5%', positive: true, icon: DollarSign, color: 'bg-emerald-500' },
    { label: 'Active Users', value: '8,456', change: '+8.2%', positive: true, icon: Users, color: 'bg-blue-500' },
    { label: 'Total Orders', value: '2,341', change: '+15.3%', positive: true, icon: ShoppingCart, color: 'bg-purple-500' },
    { label: 'Products Listed', value: '456', change: '-2.1%', positive: false, icon: Package, color: 'bg-orange-500' }
  ]);

  const recentOrders = [
    { id: '#ORD-001', customer: 'Kim Sunoo', item: 'BTS - BE Album', amount: '₱1,250', status: 'Completed', date: '2025-09-28' },
    { id: '#ORD-002', customer: 'Park Jimin', item: 'BLACKPINK Photocard Set', amount: '₱2,100', status: 'Processing', date: '2025-09-28' },
    { id: '#ORD-003', customer: 'Lee Minho', item: 'Stray Kids Lightstick', amount: '₱3,500', status: 'Shipped', date: '2025-09-27' },
    { id: '#ORD-004', customer: 'Choi Yuna', item: 'TWICE Poster Collection', amount: '₱850', status: 'Pending', date: '2025-09-27' },
    { id: '#ORD-005', customer: 'Jung Hoseok', item: 'EXO Trading Cards', amount: '₱1,750', status: 'Completed', date: '2025-09-26' }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              K-pop Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Welcome back, Admin!</p>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg">
            Export Report
          </button>
        </div>
      </header>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-gray-600 text-sm font-medium mb-2">{stat.label}</p>
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                    <div className="flex items-center gap-1">
                      {stat.positive ? <ArrowUp className="w-4 h-4 text-green-600" /> : <ArrowDown className="w-4 h-4 text-red-600" />}
                      <span className={`text-sm font-semibold ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>{stat.change}</span>
                      <span className="text-gray-500 text-sm">vs last month</span>
                    </div>
                  </div>
                  <div className={`${stat.color} p-3 rounded-xl`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 mb-6">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
              View All
            </button>
          </div>
          <div className="overflow-x-auto p-6">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders.map((order, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{order.customer}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{order.item}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{order.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => navigate('/admin/products')}
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-4"
          >
            <Package className="w-8 h-8" />
            <div className="text-left">
              <h3 className="font-bold text-lg">Manage Products</h3>
              <p className="text-purple-100 text-sm">Create, edit, and delete products</p>
            </div>
          </button>

          <button className="bg-gradient-to-r from-pink-600 to-pink-700 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-4">
            <Users className="w-8 h-8" />
            <div className="text-left">
              <h3 className="font-bold text-lg">Manage Users</h3>
              <p className="text-pink-100 text-sm">View all customers</p>
            </div>
          </button>

          <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-4">
            <TrendingUp className="w-8 h-8" />
            <div className="text-left">
              <h3 className="font-bold text-lg">View Analytics</h3>
              <p className="text-blue-100 text-sm">Detailed reports</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
