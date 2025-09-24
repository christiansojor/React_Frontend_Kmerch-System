import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-black/90 backdrop-blur-md border-b border-white/10' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex justify-between items-center py-4">
          
          {/* Logo Section */}
          <button className="flex items-center space-x-3 group">
            {/* Logo Image Placeholder - Replace with your actual logo */}
            <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105">
              {/* Replace this div with: <img src="your-logo.png" alt="K-Dream Logo" className="w-full h-full object-contain" /> */}
             <img src="/assets/kmerch_logo.png" alt="K-Dream Logo" className="w-full h-full object-contain" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-joyride text-gray-300 font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                K-DREAM
              </h1>
              <p className="text-gray-400 text-xs -mt-1">MERCHANDISE</p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
                onClick={() => {
                    const hero = document.getElementById("hero")
                    if(hero){
                        hero.scrollIntoView({behavior: "smooth"})
                    }
                }}
            >
            <Link to="/" className="relative group">
              <span className="text-gray-300 hover:text-white font-medium transition-colors duration-300">
                Home
              </span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 group-hover:w-full"></div>
            </Link> 
            </button>
                        
            <button className="relative group" 
            onClick={() => {
                const collections = document.getElementById("collections");
                if(collections){
                    collections.scrollIntoView({behavior:"smooth"})
                }
            }}
            >
              <span className="text-gray-300 hover:text-white font-medium transition-colors duration-300">
                <Link to="/">
                Collections
                </Link>
              </span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 group-hover:w-full"></div>
            </button>
            
            <button className="relative group"
                 onClick={() => {
                const trading = document.getElementById("trading");
                if(trading){
                    trading.scrollIntoView({behavior:"smooth"})
                }
            }}
            >
              <span className="text-gray-300 hover:text-white font-medium transition-colors duration-300">
               <Link to="/">
                Trading
                </Link>
              </span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 group-hover:w-full"></div>
            </button>
            
            <button className="relative group"
                onClick={() => {
                    const hero = document.getElementById("hero")
                    if(hero){
                        hero.scrollIntoView({behavior: "smooth"})
                    }
                }}
            >
              <span className="text-gray-300 hover:text-white font-medium transition-colors duration-300">
               <Link to="/">
                Community
                </Link>
              </span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 group-hover:w-full"></div>
            </button>
          </div>

          {/* Auth Buttons & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <Link to="/login" className="px-4 py-2 text-gray-300 hover:text-white font-medium transition-colors duration-300">
                Login
              </Link>
                <Link
                to="/register"
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25">
                Register
                </Link>
              
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white transition-colors duration-300"
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <div className={`w-6 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                <div className={`w-6 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
                <div className={`w-6 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'max-h-96 pb-6' : 'max-h-0'
        }`}>
          <div className="border-t border-white/10 pt-6 space-y-4">
            <button className="block w-full text-left text-gray-300 hover:text-white font-medium transition-colors duration-300 py-2">
              Home
            </button>
            <button className="block w-full text-left text-gray-300 hover:text-white font-medium transition-colors duration-300 py-2">
              Collections
            </button>
            <button className="block w-full text-left text-gray-300 hover:text-white font-medium transition-colors duration-300 py-2">
              Trading
            </button>
            <button className="block w-full text-left text-gray-300 hover:text-white font-medium transition-colors duration-300 py-2">
              Community
            </button>
            
            <div className="border-t border-white/10 pt-4 space-y-3">
              <button className="block w-full text-left text-gray-300 hover:text-white font-medium transition-colors duration-300 py-2">
                Login
              </button>
                <Link
                to="/register"
                > Register
                </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle glow effect on scroll */}
      {isScrolled && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>
      )}
    </nav>
  );
}

export default Navbar;
