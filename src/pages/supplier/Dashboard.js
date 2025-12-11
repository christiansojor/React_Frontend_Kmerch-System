import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp, 
  AlertCircle,
  Filter,
  Search,
  Eye,
  DollarSign,
  Calendar,
  Trash2,
  LogOut
} from 'lucide-react';

const SupplierDashboard = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [alert, setAlert] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/api/stock-requests', {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch requests');
      }

      const data = await response.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      showAlert('error', 'Failed to load stock requests');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://127.0.0.1:8000/api/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('roles');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const handleAction = async (id, action) => {
    setActionLoading(id);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:8000/api/stock-requests/${id}/${action}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${action} request`);
      }

      const result = await response.json();
      
      const newStatus = action === 'accept' ? 'accepted' : 'declined';
      setRequests(reqs => reqs.map(r => 
        r.id === id ? { ...r, status: newStatus } : r
      ));
      
      showAlert('success', result.message || `Request ${newStatus} successfully!`);
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error:', error);
      showAlert('error', error.message || `Failed to ${action} request`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(id);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:8000/api/stock-requests/${id}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete request');
      }

      setRequests(reqs => reqs.filter(r => r.id !== id));
      showAlert('success', 'Request deleted successfully!');
      setDeleteConfirm(null);
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error deleting request:', error);
      showAlert('error', error.message || 'Failed to delete request');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
      case 'declined': return 'bg-red-100 text-red-800 border-red-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'declined': return <XCircle className="w-4 h-4" />;
      case 'completed': return <Package className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filteredRequests = requests.filter(req => {
    const matchesStatus = filterStatus === 'all' || req.status?.toLowerCase() === filterStatus;
    const matchesSearch = !searchTerm || 
      req.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.id?.toString().includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status?.toLowerCase() === 'pending').length,
    accepted: requests.filter(r => r.status?.toLowerCase() === 'accepted').length,
    declined: requests.filter(r => r.status?.toLowerCase() === 'declined').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Alert */}
        {alert && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-fade-in ${
              alert.type === 'success'
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}
          >
            {alert.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="font-medium">{alert.message}</span>
          </div>
        )}

        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-purple-700">Supplier Dashboard</h1>
                  <p className="text-gray-600">Manage your stock requests</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <span className="text-2xl font-bold text-purple-700">{stats.total}</span>
                <span className="text-gray-600">Total Requests</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-semibold">Logout</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-semibold mb-1">Total</p>
                  <p className="text-3xl font-bold text-blue-700">{stats.total}</p>
                </div>
                <Package className="w-10 h-10 text-blue-400 opacity-50" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-4 border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-semibold mb-1">Pending</p>
                  <p className="text-3xl font-bold text-yellow-700">{stats.pending}</p>
                </div>
                <Clock className="w-10 h-10 text-yellow-400 opacity-50" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-semibold mb-1">Accepted</p>
                  <p className="text-3xl font-bold text-green-700">{stats.accepted}</p>
                </div>
                <CheckCircle className="w-10 h-10 text-green-400 opacity-50" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-4 border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-600 text-sm font-semibold mb-1">Declined</p>
                  <p className="text-3xl font-bold text-red-700">{stats.declined}</p>
                </div>
                <XCircle className="w-10 h-10 text-red-400 opacity-50" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by product name or request ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="declined">Declined</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          {filteredRequests.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No requests found</h3>
              <p className="text-gray-500">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your filters' 
                  : 'Stock requests will appear here'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-purple-100 to-pink-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-purple-700">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-purple-700">Product</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-purple-700">Quantity</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-purple-700">Unit Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-purple-700">Total</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-purple-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-purple-700">Date</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-purple-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-purple-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm font-semibold text-gray-700">
                          #{req.id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-purple-500" />
                          <span className="font-medium text-gray-800">
                            {req.product?.name || req.productName || 'Unknown Product'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-700 font-semibold">{req.quantity}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-gray-700">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span>{req.unitPrice ? `₱${parseFloat(req.unitPrice).toFixed(2)}` : 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-purple-700">
                          {req.unitPrice && req.quantity 
                            ? `₱${(parseFloat(req.unitPrice) * parseInt(req.quantity)).toFixed(2)}`
                            : 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(req.status)}`}>
                          {getStatusIcon(req.status)}
                          {req.status || 'pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedRequest(req)}
                            className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-all"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          {req.status?.toLowerCase() === 'pending' && (
                            <>
                              <button
                                onClick={() => handleAction(req.id, 'accept')}
                                disabled={actionLoading === req.id}
                                className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-all disabled:opacity-50"
                                title="Accept"
                              >
                                <CheckCircle className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleAction(req.id, 'decline')}
                                disabled={actionLoading === req.id}
                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all disabled:opacity-50"
                                title="Decline"
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => setDeleteConfirm(req.id)}
                            disabled={actionLoading === req.id}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all disabled:opacity-50"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-purple-700">Request Details</h2>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-600 font-semibold">Request ID</span>
                    <span className="font-mono text-lg font-bold text-purple-700">#{selectedRequest.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-semibold">Status</span>
                    <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(selectedRequest.status)}`}>
                      {getStatusIcon(selectedRequest.status)}
                      {selectedRequest.status || 'pending'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-5 h-5 text-purple-600" />
                      <span className="text-sm text-gray-600 font-semibold">Product</span>
                    </div>
                    <p className="text-lg font-bold text-gray-800">
                      {selectedRequest.product?.name || selectedRequest.productName || 'Unknown'}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-5 h-5 text-purple-600" />
                      <span className="text-sm text-gray-600 font-semibold">Quantity</span>
                    </div>
                    <p className="text-lg font-bold text-gray-800">{selectedRequest.quantity}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-gray-600 font-semibold">Unit Price</span>
                    </div>
                    <p className="text-lg font-bold text-gray-800">
                      {selectedRequest.unitPrice ? `₱${parseFloat(selectedRequest.unitPrice).toFixed(2)}` : 'N/A'}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5 text-purple-600" />
                      <span className="text-sm text-gray-600 font-semibold">Total Amount</span>
                    </div>
                    <p className="text-lg font-bold text-purple-700">
                      {selectedRequest.unitPrice && selectedRequest.quantity 
                        ? `₱${(parseFloat(selectedRequest.unitPrice) * parseInt(selectedRequest.quantity)).toFixed(2)}`
                        : 'N/A'}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 col-span-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      <span className="text-sm text-gray-600 font-semibold">Created Date</span>
                    </div>
                    <p className="text-lg font-bold text-gray-800">
                      {selectedRequest.createdAt 
                        ? new Date(selectedRequest.createdAt).toLocaleString()
                        : 'N/A'}
                    </p>
                  </div>
                </div>

                {selectedRequest.notes && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-gray-600 font-semibold mb-2">Notes</p>
                    <p className="text-gray-800">{selectedRequest.notes}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  {selectedRequest.status?.toLowerCase() === 'pending' && (
                    <>
                      <button
                        onClick={() => handleAction(selectedRequest.id, 'accept')}
                        disabled={actionLoading === selectedRequest.id}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Accept Request
                      </button>
                      <button
                        onClick={() => handleAction(selectedRequest.id, 'decline')}
                        disabled={actionLoading === selectedRequest.id}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:from-orange-700 hover:to-orange-800 transition-all disabled:opacity-50"
                      >
                        <XCircle className="w-5 h-5" />
                        Decline Request
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => {
                      setDeleteConfirm(selectedRequest.id);
                      setSelectedRequest(null);
                    }}
                    disabled={actionLoading === selectedRequest.id}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50"
                  >
                    <Trash2 className="w-5 h-5" />
                    Delete Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Delete Request?</h2>
              <p className="text-gray-600">
                Are you sure you want to delete request #{deleteConfirm}? This action cannot be undone.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={actionLoading === deleteConfirm}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-semibold disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={actionLoading === deleteConfirm}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {actionLoading === deleteConfirm ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-5 h-5" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierDashboard;