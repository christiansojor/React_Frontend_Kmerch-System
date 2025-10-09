import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Plus, Sparkles } from 'lucide-react';

const NewProduct = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [group, setGroup] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // For now, let's use static options — later we can fetch these from backend
  const categories = ['Clothing', 'Accessories', 'Posters', 'Albums', 'Lightsticks'];
  const groups = ['BTS', 'Blackpink', 'EXO', 'Twice', 'NewJeans'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://127.0.0.1:8000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          description,
          price: parseFloat(price),
          image,
          category,
          group,
          stock: parseInt(stock) || 0,
        }),
      });

      if (!res.ok) throw new Error('Failed to create product');
      navigate('/admin/products');
    } catch (err) {
      console.error(err);
      alert('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/admin/products')}
          className="group flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200 mb-6"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Products</span>
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-lg">
            <Plus className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Add New Product
            </h2>
            <p className="text-gray-600 text-sm mt-1">Create a new product in your inventory</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Product Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Product Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full border-2 border-gray-200 rounded-xl p-4 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-gray-900 font-medium"
                placeholder="Enter product name"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
                rows="4"
                className="w-full border-2 border-gray-200 rounded-xl p-4 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-gray-900 resize-none"
                placeholder="Enter product description"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                required
                className="w-full border-2 border-gray-200 rounded-xl p-4 bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-gray-900 font-medium"
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Group */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Group</label>
              <select
                value={group}
                onChange={e => setGroup(e.target.value)}
                required
                className="w-full border-2 border-gray-200 rounded-xl p-4 bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-gray-900 font-medium"
              >
                <option value="">Select group</option>
                {groups.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Price (₱)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold text-lg">₱</span>
                <input
                  type="number"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  required
                  className="w-full border-2 border-gray-200 rounded-xl p-4 pl-10 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-gray-900 font-medium"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
            </div>

            {/* Stock Quantity */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Initial Stock</label>
              <input
                type="number"
                value={stock}
                onChange={e => setStock(e.target.value)}
                min="0"
                className="w-full border-2 border-gray-200 rounded-xl p-4 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-gray-900 font-medium"
                placeholder="Enter stock quantity"
              />
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Image URL</label>
              <input
                type="text"
                value={image}
                onChange={e => setImage(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl p-4 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-gray-900 font-medium"
                placeholder="Enter image URL"
              />
              {image && (
                <img src={image} alt={name} className="mt-4 w-40 h-40 object-cover rounded-xl border border-gray-200 shadow-sm" />
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Create Product
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                disabled={loading}
                className="px-6 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewProduct;
