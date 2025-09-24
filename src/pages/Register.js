import { useState, useEffect } from "react";
import { Link } from "react-router-dom";


function Register() {
  const [isVisible, setIsVisible] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-black flex overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-pink-500/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-2xl animate-spin" style={{ animationDuration: '20s' }}></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(56, 182, 255, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(56, 182, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      ></div>

      {/* Left Side - Logo Section */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center p-8 lg:p-16">
        <div className={`text-center transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Logo Container - Replace with your actual logo */}
          <div className="w-48 h-48 lg:w-64 lg:h-64 mx-auto mb-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-3xl flex items-center justify-center overflow-hidden group hover:scale-105 transition-transform duration-500 shadow-2xl shadow-purple-500/25">
            {/* Replace this div with: <img src="/images/logo.png" alt="K-Dream Logo" className="w-full h-full object-contain p-4" /> */}
            <div className="text-center">
              <div className="text-6xl font-black text-white mb-2">K</div>
              <div className="text-sm text-purple-100 font-medium">DREAM</div>
            </div>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-blue-400 bg-clip-text text-transparent">
            K-DREAM
          </h1>
          <p className="text-xl lg:text-2xl font-bold text-pink-400 mb-6">
            MERCHANDISE
          </p>
          
          <div className="space-y-4 text-gray-300">
            <p className="text-lg">Join the ultimate</p>
            <p className="text-lg">K-pop trading community</p>
            
            {/* Animated Features */}
            <div className="mt-8 space-y-3">
              <div className="group flex items-center justify-center space-x-3 p-3 bg-purple-500/10 backdrop-blur-sm border border-purple-500/20 rounded-xl hover:border-purple-500/40 transition-all duration-300">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-purple-400 font-medium">Exclusive Collections</span>
              </div>
              
              <div className="group flex items-center justify-center space-x-3 p-3 bg-pink-500/10 backdrop-blur-sm border border-pink-500/20 rounded-xl hover:border-pink-500/40 transition-all duration-300">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <span className="text-pink-400 font-medium">Safe Transactions</span>
              </div>
              
              <div className="group flex items-center justify-center space-x-3 p-3 bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-xl hover:border-blue-500/40 transition-all duration-300">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <span className="text-blue-400 font-medium">Verified Members</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center p-8 lg:p-16">
        <div className={`w-full max-w-md transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          
          {/* Form Container */}
          <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-lg border border-white/10 rounded-3xl p-8 lg:p-10 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                Join K-Dream
              </h2>
              <p className="text-gray-400">Create your account</p>
            </div>

            <div className="space-y-6">
              {/* Full Name Field */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Full Name"
                  onFocus={() => setFocusedField("fullname")}
                  onBlur={() => setFocusedField("")}
                  className="w-full p-4 bg-transparent border-0 rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all duration-300"
                />
                <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300 ${focusedField === 'fullname' ? 'w-full' : 'w-0'}`}></div>
              </div>

              {/* Email Field */}
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email Address"
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField("")}
                  className="w-full p-4 bg-transparent border-0 rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all duration-300"
                />
                <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 ${focusedField === 'email' ? 'w-full' : 'w-0'}`}></div>
              </div>

              {/* Password Field */}
              <div className="relative">
                <input
                  type="password"
                  placeholder="Password"
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField("")}
                  className="w-full p-4 bg-transparent border-0 rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all duration-300"
                />
                <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-pink-400 to-blue-400 transition-all duration-300 ${focusedField === 'password' ? 'w-full' : 'w-0'}`}></div>
              </div>

              {/* Role Selection */}
              <div className="relative">
                <select
                  onFocus={() => setFocusedField("role")}
                  onBlur={() => setFocusedField("")}
                  className="w-full p-4 bg-transparent border-0 rounded-xl text-white focus:outline-none transition-all duration-300 cursor-pointer"
                  style={{ color: 'white' }}
                >
                  <option value="" className="bg-gray-900 text-gray-400">Select your role</option>
                  <option value="customer" className="bg-gray-900 text-white">Customer - Buy & Trade Merch</option>
                  <option value="mediator" className="bg-gray-900 text-white">Mediator - Facilitate Safe Trading</option>
                  <option value="admin" className="bg-gray-900 text-white">Admin - Platform Management</option>
                </select>
                <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-pink-400 transition-all duration-300 ${focusedField === 'role' ? 'w-full' : 'w-0'}`}></div>
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start space-x-3 text-sm">
                <input 
                  type="checkbox" 
                  className="mt-1 rounded bg-transparent border border-white/20 text-purple-500 focus:ring-purple-500" 
                />
                <label className="text-gray-400 leading-relaxed">
                  I agree to the <span className="text-purple-400 hover:text-purple-300 cursor-pointer">Terms of Service</span> and <span className="text-pink-400 hover:text-pink-300 cursor-pointer">Privacy Policy</span>
                </label>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                className="group relative w-full p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-pink-500/25"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <span className="relative flex items-center justify-center space-x-2">
                  <span>Create Account</span>
                  <span className="transform group-hover:translate-x-1 transition-transform duration-300">✨</span>
                </span>
              </button>
            </div>

            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-400 mb-4">Already part of K-Dream?</p>
                  <button className="group text-purple-400 hover:text-purple-300 font-medium transition-all duration-300">
                <Link to="/login">
                  <span className="relative">
                  Sign in to your account
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300 group-hover:w-full"></div>
                </span>
                </Link>
              </button>
            </div>

            {/* Social Register Options */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gray-900 text-gray-400">Or register with</span>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center px-4 py-3 border border-white/10 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                  <span className="text-lg">📧</span>
                  <span className="ml-2 text-sm">Google</span>
                </button>
                <button className="flex items-center justify-center px-4 py-3 border border-white/10 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                  <span className="text-lg">📱</span>
                  <span className="ml-2 text-sm">Apple</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;