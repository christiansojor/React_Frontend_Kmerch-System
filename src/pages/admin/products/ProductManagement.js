import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Plus, ArrowLeft, Eye, Package } from 'lucide-react';

const ProductManagement = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = sessionStorage.getItem('token') || '';
        const response = await fetch('http://127.0.0.1:8000/api/products', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleView = (id) => navigate(`/admin/products/view/${id}`);
  const handleEdit = (id) => navigate(`/admin/products/edit/${id}`);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const token = sessionStorage.getItem('token') || '';
      const response = await fetch(`http://127.0.0.1:8000/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to delete product');
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete product.');
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      active: 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200',
      inactive: 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border-gray-200',
      discontinued: 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200'
    };
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold border ${statusStyles[status] || statusStyles.active}`}>
        {status?.toUpperCase() || 'ACTIVE'}
      </span>
    );
  };

  const getStockBadge = (stockQuantity) => {
    const stock = stockQuantity ?? 0;
    
    if (stock === 0) {
      return (
        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 shadow-sm">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-bold text-red-700">{stock}</span>
          <span className="text-xs text-red-600 font-medium">Out of Stock</span>
        </div>
      );
    }
    
    if (stock < 10) {
      return (
        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 shadow-sm">
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          <span className="text-sm font-bold text-orange-700">{stock}</span>
          <span className="text-xs text-orange-600 font-medium">Low Stock</span>
        </div>
      );
    }
    
    return (
      <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 shadow-sm">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-sm font-bold text-green-700">{stock}</span>
        <span className="text-xs text-green-600 font-medium">In Stock</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="group flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
              <span className="font-medium">Back to Dashboard</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-lg">
                <Package className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Product Management
              </h1>
            </div>
          </div>
          <button
            onClick={() => navigate('/admin/products/new')}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
          >
            <Plus className="w-5 h-5" /> Add New Product
          </button>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mb-4"></div>
                <p className="text-gray-600 font-medium text-lg">Loading products...</p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No products found</p>
              <p className="text-gray-400 text-sm mt-2">Start by adding your first product</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 border-b-2 border-purple-200">
                    <th className="px-6 py-5 text-left text-xs font-bold text-purple-900 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-5 text-left text-xs font-bold text-purple-900 uppercase tracking-wider">Image</th>
                    <th className="px-6 py-5 text-left text-xs font-bold text-purple-900 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-5 text-left text-xs font-bold text-purple-900 uppercase tracking-wider">Group</th>
                    <th className="px-6 py-5 text-left text-xs font-bold text-purple-900 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-5 text-left text-xs font-bold text-purple-900 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-5 text-left text-xs font-bold text-purple-900 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-5 text-left text-xs font-bold text-purple-900 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-5 text-center text-xs font-bold text-purple-900 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 group">
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 shadow-sm">
                          <span className="text-sm font-bold text-purple-700">{product.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg shadow-md ring-2 ring-purple-100"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-base font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                            {product.name}
                          </span>
                          {product.subcategory && (
                            <span className="text-xs text-gray-500 mt-0.5">{product.subcategory}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {product.groupName ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-lg bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 text-sm font-medium border border-indigo-200">
                            {product.groupName}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {product.category ? (
                          <span className="text-sm text-gray-700 font-medium">{product.category}</span>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 shadow-sm">
                          <span className="text-base font-bold text-emerald-700">₱{product.price?.toFixed(2)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStockBadge(product.stockQuantity)}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(product.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleView(product.id)}
                            className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(product.id)}
                            className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg hover:from-red-600 hover:to-rose-600 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
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
    </div>
  );
};

export default ProductManagement;