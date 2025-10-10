import React, { useState, useEffect } from 'react';
import { Eye, Edit2, Trash2, Plus, X, Search } from 'lucide-react';

// Update this to match your Symfony backend URL
const API_BASE = 'http://localhost:8000/api/suppliers';

export default function SupplierManagement() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    status: 'active'
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_BASE);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to fetch suppliers: ${res.status} ${text.substring(0, 100)}`);
      }
      const data = await res.json();
      setSuppliers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setModalMode('add');
    setFormData({
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      status: 'active'
    });
    setShowModal(true);
  };

  const handleView = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/${id}`);
      if (!res.ok) throw new Error('Failed to fetch supplier');
      const data = await res.json();
      setSelectedSupplier(data);
      setModalMode('view');
      setShowModal(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/${id}`);
      if (!res.ok) throw new Error('Failed to fetch supplier');
      const data = await res.json();
      setFormData({
        companyName: data.companyName || '',
        contactPerson: data.contactPerson || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        status: data.status || 'active'
      });
      setSelectedSupplier(data);
      setModalMode('edit');
      setShowModal(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this supplier?')) return;
    
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete supplier');
      await fetchSuppliers();
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async () => {
    try {
      const url = modalMode === 'add' ? API_BASE : `${API_BASE}/${selectedSupplier.id}`;
      const method = modalMode === 'add' ? 'POST' : 'PUT';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) throw new Error(`Failed to ${modalMode} supplier`);
      
      await fetchSuppliers();
      setShowModal(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const filteredSuppliers = suppliers.filter(s => 
    s.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Supplier Management</h1>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Plus size={20} />
              Add Supplier
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="text-left p-3 font-semibold">ID</th>
                    <th className="text-left p-3 font-semibold">Company Name</th>
                    <th className="text-left p-3 font-semibold">Contact Person</th>
                    <th className="text-left p-3 font-semibold">Email</th>
                    <th className="text-left p-3 font-semibold">Phone</th>
                    <th className="text-left p-3 font-semibold">Status</th>
                    <th className="text-center p-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSuppliers.map(supplier => (
                    <tr key={supplier.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{supplier.id}</td>
                      <td className="p-3">{supplier.companyName}</td>
                      <td className="p-3">{supplier.contactPerson || '-'}</td>
                      <td className="p-3">{supplier.email || '-'}</td>
                      <td className="p-3">{supplier.phone || '-'}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          supplier.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {supplier.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleView(supplier.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            title="View"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleEdit(supplier.id)}
                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(supplier.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredSuppliers.length === 0 && (
                <div className="text-center py-8 text-gray-500">No suppliers found</div>
              )}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold">
                {modalMode === 'view' ? 'View Supplier' : modalMode === 'edit' ? 'Edit Supplier' : 'Add Supplier'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            {modalMode === 'view' ? (
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Company Name</label>
                  <p className="text-gray-900">{selectedSupplier?.companyName}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Person</label>
                  <p className="text-gray-900">{selectedSupplier?.contactPerson || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{selectedSupplier?.email || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Phone <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center">
                        <span className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-l-lg text-gray-700 select-none">
                        +82
                        </span>
                        <input
                        type="tel"
                        value={formData.phone.replace(/^\+82/, '')} // show only digits after +82
                        onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, ''); // digits only
                            if (value.length > 10) value = value.slice(0, 10); // max 10 digits
                            handleInputChange('phone', `+82${value}`);
                        }}
                        placeholder="Enter phone number"
                        className={`flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            formData.phone && !/^\+82\d{8,10}$/.test(formData.phone)
                            ? 'border-red-500'
                            : 'border-gray-300'
                        }`}
                        />
                    </div>
                    {formData.phone && !/^\+82\d{8,10}$/.test(formData.phone) && (
                        <p className="text-red-500 text-sm mt-1">
                        Must contain 8–10 digits after +82.
                        </p>
                    )}
                    </div>


                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                  <p className="text-gray-900">{selectedSupplier?.address || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    selectedSupplier?.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedSupplier?.status}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
<div>
  <label className="block text-sm font-semibold text-gray-700 mb-1">
    Email <span className="text-red-500">*</span>
  </label>
  <input
    type="email"
    value={formData.email}
    onChange={(e) => handleInputChange('email', e.target.value)}
    placeholder="example@company.com"
    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
      formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        ? 'border-red-500'
        : 'border-gray-300'
    }`}
  />
  {formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
    <p className="text-red-500 text-sm mt-1">Please enter a valid email address.</p>
  )}
</div>

               <div>
  <label className="block text-sm font-semibold text-gray-700 mb-1">
    Phone <span className="text-red-500">*</span>
  </label>
  <div className="flex items-center">
    <span className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-l-lg text-gray-700 select-none">
      +82
    </span>
    <input
      type="tel"
      value={formData.phone.replace(/^\+82/, '')} // only show digits after +82
      onChange={(e) => {
        let value = e.target.value.replace(/\D/g, ''); // allow only digits
        if (value.length > 10) value = value.slice(0, 10); // limit to 10 digits
        handleInputChange('phone', `+82${value}`);
      }}
      placeholder="Enter phone number"
      className={`flex-1 px-3 py-2 border rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
        formData.phone && !/^\+82\d{8,10}$/.test(formData.phone)
          ? 'border-red-500'
          : 'border-gray-300'
      }`}
    />
  </div>
  {formData.phone && !/^\+82\d{8,10}$/.test(formData.phone) && (
    <p className="text-red-500 text-sm mt-1">
      Must contain 8–10 digits after +82.
    </p>
  )}
</div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex gap-3 justify-end pt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {modalMode === 'add' ? 'Add Supplier' : 'Update Supplier'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}