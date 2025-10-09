import React, { useState, useEffect } from 'react';
import { ShoppingCart, TrendingUp, Home, User, Search, Heart } from 'lucide-react';

const UserDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('ecommerce');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://127.0.0.1:8000/api/products', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : undefined
          }
        });

        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'ecommerce', label: 'E-Commerce', icon: ShoppingCart },
    { id: 'trading', label: 'Trading', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-cyan-50 to-purple-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Loading products...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-purple-50 to-pink-50">

      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-16 h-16 rounded-lg flex items-center justify-center overflow-hidden">
                <img 
                  src="/assets/kmerch_logo.png" 
                  alt="KMerch Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
                ShopTrade
              </h1>
            </div>
            
            {currentPage === 'ecommerce' && (
              <div className="flex-1 max-w-md mx-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Heart size={24} className="text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                <ShoppingCart size={24} className="text-gray-600" />
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all ${
                    isActive
                      ? 'text-cyan-600 border-b-2 border-cyan-600'
                      : 'text-gray-600 hover:text-cyan-600'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentPage === 'home' && (
          <div className="text-center py-20">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to ShopTrade
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Your one-stop destination for shopping and trading
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <button
                onClick={() => setCurrentPage('ecommerce')}
                className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <ShoppingCart size={48} className="mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">E-Commerce</h3>
                <p>Browse and purchase products</p>
              </button>
              <button
                onClick={() => setCurrentPage('trading')}
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <TrendingUp size={48} className="mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Trading</h3>
                <p>Explore trading opportunities</p>
              </button>
            </div>
          </div>
        )}

        {currentPage === 'ecommerce' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
                Our Products
              </h2>
              <p className="text-gray-600">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} available
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-600 text-lg">
                  {searchQuery ? 'No products match your search.' : 'No products available.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all hover:scale-105 group flex flex-col"
                  >
                    <div className="relative">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-cyan-100 to-purple-100 flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                      <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                        <Heart size={20} className="text-gray-600 hover:text-red-500" />
                      </button>
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                      <p className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent mb-4">
                        ₱{product.price}
                      </p>
                      <div className="mt-auto space-y-2">
                        <button className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-2 rounded-lg hover:shadow-lg transition-all font-medium">
                          Buy Now
                        </button>
                        <button className="w-full border-2 border-cyan-500 text-cyan-600 py-2 rounded-lg hover:bg-cyan-50 transition-all font-medium">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {currentPage === 'trading' && (
          <div className="text-center py-20">
            <TrendingUp size={64} className="mx-auto mb-4 text-purple-600" />
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
              Trading Platform
            </h2>
            <p className="text-gray-600 text-lg">
              Trading features coming soon...
            </p>
          </div>
        )}

        {currentPage === 'profile' && (
          <div className="text-center py-20">
            <User size={64} className="mx-auto mb-4 text-cyan-600" />
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
              User Profile
            </h2>
            <p className="text-gray-600 text-lg">
              Profile features coming soon...
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;