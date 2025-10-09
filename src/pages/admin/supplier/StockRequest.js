// src/pages/admin/supplier/StockRequest.js
import React, { useState, useEffect } from "react";
import { ArrowLeft, Send, Package, DollarSign, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StockRequest = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch products
        const productsRes = await fetch("http://127.0.0.1:8000/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!productsRes.ok) {
          throw new Error(`Products API error: ${productsRes.status}`);
        }
        
        const productData = await productsRes.json();
        setProducts(Array.isArray(productData) ? productData : []);
        console.log("Products loaded:", productData.length);

        // Fetch suppliers
        const supplierRes = await fetch("http://127.0.0.1:8000/api/suppliers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!supplierRes.ok) {
          console.error("Suppliers API error:", supplierRes.status, supplierRes.statusText);
          const errorText = await supplierRes.text();
          console.error("Error details:", errorText);
          showAlert("warning", "Could not load suppliers. Please check if the suppliers API endpoint exists.");
          setSuppliers([]);
        } else {
          const supplierData = await supplierRes.json();
          console.log("Suppliers data:", supplierData);
          setSuppliers(Array.isArray(supplierData) ? supplierData : []);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        showAlert("error", `Failed to load data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const calculateTotal = () => {
    if (quantity && unitPrice) {
      return (parseFloat(unitPrice) * parseInt(quantity, 10)).toFixed(2);
    }
    return "0.00";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const token = localStorage.getItem("token");

    const body = {
      product_id: parseInt(selectedProduct, 10),
      supplier_id: parseInt(selectedSupplier, 10),
      quantity: parseInt(quantity, 10),
    };

    // Add optional fields if provided
    if (unitPrice && unitPrice.trim() !== "") {
      body.unit_price = parseFloat(unitPrice).toFixed(2);
    }

    if (notes.trim()) {
      body.notes = notes.trim();
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/stock-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send stock request");
      }

      showAlert("success", `Stock request sent successfully! Request ID: #${data.id}`);
      
      // Reset form after successful submission
      setSelectedProduct("");
      setSelectedSupplier("");
      setQuantity("");
      setUnitPrice("");
      setNotes("");
    } catch (error) {
      console.error("Error sending stock request:", error);
      showAlert("error", error.message || "Error sending stock request");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Alert */}
        {alert && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
              alert.type === "success"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {alert.type === "success" ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="font-medium">{alert.message}</span>
          </div>
        )}

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-2 mb-6 text-purple-600 hover:text-purple-800 transition-all group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Dashboard</span>
          </button>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-purple-700 mb-2">
              Request Stock from Supplier
            </h1>
            <p className="text-gray-600">
              Fill in the details below to send a stock request
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Selection */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Product <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                  required
                >
                  <option value="">Select a product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.stockQuantity !== undefined && `(Current Stock: ${p.stockQuantity})`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Supplier Selection */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Supplier <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                required
              >
                <option value="">Select a supplier</option>
                {suppliers.length === 0 ? (
                  <option disabled>No suppliers available</option>
                ) : (
                  suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name || s.companyName || s.company_name || s.email || `Supplier #${s.id}`}
                    </option>
                  ))
                )}
              </select>
              {suppliers.length === 0 && (
                <p className="text-sm text-red-500 mt-2">
                  No suppliers found. Please add suppliers first.
                </p>
              )}
            </div>

            {/* Quantity and Unit Price Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Quantity */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                  placeholder="Enter quantity"
                  required
                />
              </div>

              {/* Unit Price */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Unit Price (Optional)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Total Price Display */}
            {quantity && unitPrice && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-semibold">Estimated Total:</span>
                  <span className="text-2xl font-bold text-purple-700">
                    ₱{calculateTotal()}
                  </span>
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>Notes (Optional)</span>
                </div>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all resize-none"
                placeholder="Add any additional information or special requests..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || suppliers.length === 0}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-xl shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                  <span>Sending Request...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Send Request</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StockRequest;