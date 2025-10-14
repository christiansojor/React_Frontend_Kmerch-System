import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Plus, Eye, Package, Search, Filter } from 'lucide-react';

const ProductManagement = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStock, setFilterStock] = useState('all');

  const BASE_URL = 'http://127.0.0.1:8000';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token') || '';
        const response = await fetch(`${BASE_URL}/api/products`, {
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
        alert('Failed to fetch products: ' + err.message);
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
      const token = localStorage.getItem('token') || '';
      
      const response = await fetch(`${BASE_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete product');
      }

      setProducts(products.filter(p => p.id !== id));
      alert('Product deleted successfully!');
      
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete product: ' + err.message);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    return `${BASE_URL}${imagePath}`;
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      active: 'bg-purple-50 text-purple-700 border-purple-200',
      inactive: 'bg-gray-50 text-gray-700 border-gray-200',
      discontinued: 'bg-pink-50 text-pink-700 border-pink-200'
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-pink-50 border border-pink-200">
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-bold text-pink-700">{stock}</span>
        </div>
      );
    }
    
    if (stock < 10) {
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-purple-50 border border-purple-200">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          <span className="text-sm font-bold text-purple-700">{stock}</span>
        </div>
      );
    }
    
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-50 border border-blue-200">
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        <span className="text-sm font-bold text-blue-700">{stock}</span>
      </div>
    );
  };

  // Get unique categories
  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.group?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.groupName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    
    const matchesStock = filterStock === 'all' ||
                        (filterStock === 'out' && (product.stockQuantity ?? 0) === 0) ||
                        (filterStock === 'low' && (product.stockQuantity ?? 0) > 0 && (product.stockQuantity ?? 0) < 10) ||
                        (filterStock === 'in' && (product.stockQuantity ?? 0) >= 10);
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-5 flex items-center justify-between max-w-[1600px] mx-auto">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">
              Product Management
            </h2>
            <p className="text-gray-500 font-medium text-sm">Manage your K-pop merchandise inventory</p>
          </div>
          <button
            onClick={() => navigate('/admin/products/new')}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-md transition-all duration-200 flex items-center gap-2 font-medium text-sm"
          >
            <Plus className="w-4 h-4" strokeWidth={1.5} />
            Add Product
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="p-6 max-w-[1600px] mx-auto">
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-medium text-sm"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-medium text-sm bg-white"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
              <select
                value={filterStock}
                onChange={(e) => setFilterStock(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-medium text-sm bg-white"
              >
                <option value="all">All Stock</option>
                <option value="in">In Stock</option>
                <option value="low">Low Stock</option>
                <option value="out">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                  <Package className="w-5 h-5 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-white">All Products</h3>
              </div>
              <span className="px-3 py-1.5 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg text-sm font-bold text-white">
                {filteredProducts.length} products
              </span>
            </div>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-2 border-purple-300 border-t-purple-600 mb-4"></div>
                <p className="text-gray-600 font-medium text-lg">Loading products...</p>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" strokeWidth={1.5} />
              <p className="text-gray-400 font-medium">No products found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Image</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Group</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Status</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-all">
                      <td className="px-6 py-3">
                        <span className="font-mono text-xs font-bold text-purple-600">#{product.id}</span>
                      </td>
                      <td className="px-6 py-3">
                        {getImageUrl(product.image) ? (
                          <img
                            src={getImageUrl(product.image)}
                            alt={product.name}
                            className="w-14 h-14 object-cover rounded-lg border border-gray-200"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center border border-gray-200"
                          style={{ display: getImageUrl(product.image) ? 'none' : 'flex' }}
                        >
                          <Package className="w-6 h-6 text-purple-400" strokeWidth={1.5} />
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900 text-sm">
                            {product.name}
                          </span>
                          {product.subcategory && (
                            <span className="text-xs text-gray-500 mt-0.5">{product.subcategory}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        {product.group?.name || product.groupName ? (
                          <span className="text-sm text-gray-700 font-medium">
                            {product.group?.name || product.groupName}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-6 py-3">
                        {product.category ? (
                          <span className="text-sm text-gray-700 font-medium">{product.category}</span>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-6 py-3">
                        <span className="text-base font-bold text-purple-600">₱{product.price?.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-3">
                        {getStockBadge(product.stockQuantity)}
                      </td>
                      <td className="px-6 py-3">
                        {getStatusBadge(product.status)}
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleView(product.id)}
                            className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-md transition-all"
                            title="View"
                          >
                            <Eye className="w-4 h-4" strokeWidth={1.5} />
                          </button>
                          <button
                            onClick={() => handleEdit(product.id)}
                            className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-md transition-all"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" strokeWidth={1.5} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg hover:shadow-md transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" strokeWidth={1.5} />
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