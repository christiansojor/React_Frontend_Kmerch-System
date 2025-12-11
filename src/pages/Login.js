import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsVisible(true);
  }, []);

const handleLogin = async (e) => {
  e.preventDefault();
  if (isLoading) return;

  setIsLoading(true);
  setError("");

  try {
    const response = await fetch("http://127.0.0.1:8000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Login failed");
      return;
    }

    // ✅ SAVE TOKEN & ROLES
    localStorage.setItem("token", data.token);
    localStorage.setItem("roles", JSON.stringify(data.roles));
    localStorage.setItem("user", JSON.stringify(data.user));

    console.log("Token saved:", data.token);
    console.log("Roles saved:", data.roles);
    console.log("User saved:", data.user);

    // ✅ DETERMINE DASHBOARD PATH
    let dashboardPath;
    if (data.roles.includes("ROLE_ADMIN")) {
      dashboardPath = "/admin/dashboard";
    } 
    else if (data.roles.includes("ROLE_STAFF")) {
      dashboardPath = "/admin/dashboard";
    } 
    else if (data.roles.includes("ROLE_SUPPLIER")) {
      dashboardPath = "/supplier/dashboard";
    } 
    else if (data.roles.includes("ROLE_MEDIATOR")) {
      dashboardPath = "/mediator/dashboard";
    } 
    else {
      dashboardPath = "/customer/dashboard";
    }

    // ✅ REPLACE HISTORY & NAVIGATE
    navigate(dashboardPath, { replace: true });
    
    // ✅ PUSH DASHBOARD AGAIN TO BLOCK BACK NAVIGATION
    setTimeout(() => {
      window.history.pushState(null, '', dashboardPath);
    }, 0);

  } catch (err) {
    setError("Something went wrong. Please try again.");
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-black flex overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-purple-500/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-pink-500/10 to-blue-500/10 rounded-full blur-2xl animate-spin" style={{ animationDuration: '20s' }}></div>
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
          <div className="w-48 h-48 lg:w-64 lg:h-64 mx-auto mb-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-3xl flex items-center justify-center overflow-hidden group hover:scale-105 transition-transform duration-500 shadow-2xl shadow-blue-500/25">
            <div className="text-center">
              <div className="text-6xl font-black text-white mb-2">K</div>
              <div className="text-sm text-blue-100 font-medium">DREAM</div>
            </div>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 bg-clip-text text-transparent">
            K-DREAM
          </h1>
          <p className="text-xl lg:text-2xl font-bold text-purple-400 mb-6">
            MERCHANDISE
          </p>
          
          <div className="space-y-4 text-gray-300">
            <p className="text-lg">Welcome back to the ultimate</p>
            <p className="text-lg">K-pop trading community</p>
            
            <div className="mt-8 space-y-3">
              <div className="group flex items-center justify-center space-x-3 p-3 bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-xl hover:border-blue-500/40 transition-all duration-300">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-blue-400 font-medium">Authentic Merchandise</span>
              </div>
              
              <div className="group flex items-center justify-center space-x-3 p-3 bg-purple-500/10 backdrop-blur-sm border border-purple-500/20 rounded-xl hover:border-purple-500/40 transition-all duration-300">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <span className="text-purple-400 font-medium">Secure Trading</span>
              </div>
              
              <div className="group flex items-center justify-center space-x-3 p-3 bg-pink-500/10 backdrop-blur-sm border border-pink-500/20 rounded-xl hover:border-pink-500/40 transition-all duration-300">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <span className="text-pink-400 font-medium">Global Community</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center p-8 lg:p-16">
        <div className={`w-full max-w-md transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          
          <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-lg border border-white/10 rounded-3xl p-8 lg:p-10 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-400">Sign in to your account</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-10">
              {/* Email Field with Floating Label */}
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-0 pt-2 pb-2 bg-transparent border-0 border-b-2 border-white/20 text-white text-base focus:outline-none focus:border-transparent transition-all duration-300 peer"
                />
                <label
                  htmlFor="email"
                  className="absolute left-0 top-2 text-gray-400 text-base transition-all duration-300 pointer-events-none peer-focus:top-[-20px] peer-focus:text-xs peer-focus:text-blue-400 peer-valid:top-[-20px] peer-valid:text-xs peer-valid:text-blue-400"
                >
                  Email Address
                </label>
                {/* Animated bottom border - expands from center */}
                <span className="absolute bottom-0 left-1/2 h-[2px] bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-400 -translate-x-1/2 w-0 peer-focus:w-full"></span>
              </div>

              {/* Password Field with Floating Label */}
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-0 pt-2 pb-2 bg-transparent border-0 border-b-2 border-white/20 text-white text-base focus:outline-none focus:border-transparent transition-all duration-300 peer"
                />
                <label
                  htmlFor="password"
                  className="absolute left-0 top-2 text-gray-400 text-base transition-all duration-300 pointer-events-none peer-focus:top-[-20px] peer-focus:text-xs peer-focus:text-purple-400 peer-valid:top-[-20px] peer-valid:text-xs peer-valid:text-purple-400"
                >
                  Password
                </label>
                {/* Animated bottom border - expands from center */}
                <span className="absolute bottom-0 left-1/2 h-[2px] bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-400 -translate-x-1/2 w-0 peer-focus:w-full"></span>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm pt-2">
              </div>

              {/* Login Button */}
              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="group relative w-full p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <span className="relative flex items-center justify-center space-x-2">
                  <span>{isLoading ? "Signing In..." : "Sign In"}</span>
                  {!isLoading && (
                    <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                  )}
                </span>
              </button>
            </div>

            {/* Register Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-400 mb-4">New to K-Dream?</p>
              <button className="group text-blue-400 hover:text-blue-300 font-medium transition-all duration-300">
                <a href="/register">
                  <span className="relative">
                    Create an account
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 group-hover:w-full"></div>
                  </span>
                </a>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;