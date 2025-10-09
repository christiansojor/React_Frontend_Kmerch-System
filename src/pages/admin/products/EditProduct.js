import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Save } from 'lucide-react';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({ name: '', description: '', price: '', image: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {

      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://127.0.0.1:8000/api/products/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch product');
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    const handleSubmit = async (e) => {
  e.preventDefault();

  // <-- Add this line
  console.log(product);  // This will log the entire product object, including image

  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://127.0.0.1:8000/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(product)
    });
    if (!res.ok) throw new Error('Failed to update product');
    alert('Product updated!');
    navigate('/admin/products');
  } catch (err) {
    console.error(err);
    alert('Failed to update product');
  }
};

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://127.0.0.1:8000/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(product)
      });
      if (!res.ok) throw new Error('Failed to update product');
      alert('Product updated!');
      navigate('/admin/products');
    } catch (err) {
      console.error(err);
      alert('Failed to update product');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mb-4"></div>
        <p className="text-gray-600 font-medium text-lg">Loading product...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/admin/products')}
          className="group flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200 mb-6"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Products</span>
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-lg">
            <Package className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Edit Product
            </h2>
            <p className="text-gray-600 text-sm mt-1">Update product information</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleChange}
                className="w-full border-2 border-gray-200 rounded-xl p-4 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-gray-900 font-medium"
                placeholder="Enter product name"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Description
              </label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                rows="4"
                className="w-full border-2 border-gray-200 rounded-xl p-4 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-gray-900 resize-none"
                placeholder="Enter product description"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Price (₱)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold text-lg">
                  ₱
                </span>
                <input
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-xl p-4 pl-10 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-gray-900 font-medium"
                  placeholder="0.00"
                  step="0.01"
                  required
                />
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Image URL
              </label>
              <input
                type="text"
                name="image"
                value={product.image}
                onChange={handleChange}
                className="w-full border-2 border-gray-200 rounded-xl p-4 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-gray-900 font-medium"
                placeholder="Enter image URL"
              />
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="mt-4 w-40 h-40 object-cover rounded-xl border border-gray-200 shadow-sm"
                />
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-bold text-lg"
              >
                <Save className="w-5 h-5" />
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                className="px-6 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">
                Editing Product ID: <span className="font-bold">#{id}</span>
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Make sure all information is accurate before saving
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
