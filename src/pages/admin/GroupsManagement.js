import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2, Building2, Calendar } from 'lucide-react';

const GroupsManagement = () => {
  const [groups, setGroups] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    debutYear: '',
    supplierId: '',
    status: 'active'
  });

  useEffect(() => {
    fetchGroups();
    fetchSuppliers();
  }, []);

  const fetchGroups = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://127.0.0.1:8000/api/groups', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setGroups(data);
      }
    } catch (err) {
      console.error('Failed to fetch groups:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://127.0.0.1:8000/api/suppliers', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSuppliers(data);
      }
    } catch (err) {
      console.error('Failed to fetch suppliers:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const url = editingGroup 
        ? `http://127.0.0.1:8000/api/groups/${editingGroup.id}`
        : 'http://127.0.0.1:8000/api/groups';
      
      const res = await fetch(url, {
        method: editingGroup ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setShowModal(false);
        setEditingGroup(null);
        setFormData({ name: '', debutYear: '', supplierId: '', status: 'active' });
        fetchGroups();
      }
    } catch (err) {
      console.error('Failed to save group:', err);
      alert('Failed to save group');
    }
  };

  const handleEdit = (group) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      debutYear: group.debutYear || '',
      supplierId: group.supplier?.id || '',
      status: group.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this group?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://127.0.0.1:8000/api/groups/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        fetchGroups();
      }
    } catch (err) {
      console.error('Failed to delete group:', err);
      alert('Failed to delete group');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-lg">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                K-Pop Groups
              </h2>
              <p className="text-gray-600 text-sm mt-1">Manage artist groups and their companies</p>
            </div>
          </div>
          
          <button
            onClick={() => {
              setEditingGroup(null);
              setFormData({ name: '', debutYear: '', supplierId: '', status: 'active' });
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl font-bold"
          >
            <Plus className="w-5 h-5" />
            Add Group
          </button>
        </div>

        {/* Groups Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map(group => (
            <div key={group.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{group.name}</h3>
                  {group.debutYear && (
                    <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>Debut {group.debutYear}</span>
                    </div>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  group.status === 'active' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {group.status}
                </span>
              </div>
              
              {group.supplier && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-bold text-purple-600 uppercase">Company</span>
                  </div>
                  <p className="font-bold text-gray-900">{group.supplier.companyName || group.supplier.name}</p>
                </div>
              )}
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(group)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-all font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(group.id)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {groups.length === 0 && (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No groups yet. Add your first K-Pop group!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {editingGroup ? 'Edit Group' : 'Add New Group'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Group Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                  className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none"
                  placeholder="e.g. BTS, Blackpink"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Debut Year</label>
                <input
                  type="text"
                  value={formData.debutYear}
                  onChange={e => setFormData({...formData, debutYear: e.target.value})}
                  className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none"
                  placeholder="e.g. 2013"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Entertainment Company</label>
                <select
                  value={formData.supplierId}
                  onChange={e => setFormData({...formData, supplierId: e.target.value})}
                  required
                  className="w-full border-2 border-gray-200 rounded-xl p-3 bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none"
                >
                  <option value="">Select company</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.companyName || s.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                  className="w-full border-2 border-gray-200 rounded-xl p-3 bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-bold"
                >
                  {editingGroup ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingGroup(null);
                  }}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupsManagement;