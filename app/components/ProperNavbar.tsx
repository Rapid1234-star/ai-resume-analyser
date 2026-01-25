import React, { useState } from "react";
import { Link, useLocation } from "react-router";
import { usePuterStore } from "~/lib/puter";

const ProperNavbar: React.FC = () => {
  const { auth } = usePuterStore();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                RESUMIND
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-8">
            <Link
              to="/dashboard"
              className={`text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 ${
                isActive("/dashboard") ? "text-indigo-600" : ""
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/upload"
              className={`text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 ${
                isActive("/upload") ? "text-indigo-600" : ""
              }`}
            >
              Upload
            </Link>
            {auth.isAuthenticated && (
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200"
              >
                Logout
              </button>
            )}
          </div>

          {/* Username display on right */}
          {auth.isAuthenticated && (
            <div className="hidden md:flex items-center">
              <span className="text-sm text-gray-500">
                {auth.user ? (auth.user as any).displayName || (auth.user as any).username || (auth.user as any).email || 'User' : 'User'}
              </span>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <svg
                className={`${isMobileMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Close icon */}
              <svg
                className={`${isMobileMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}>
        <div className="pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
          <Link
            to="/dashboard"
            className={`block pl-3 pr-4 py-2 text-base font-medium ${
              isActive("/dashboard")
                ? "text-indigo-600 bg-indigo-50 border-indigo-600"
                : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600 border-transparent"
            } border-l-4`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/upload"
            className={`block pl-3 pr-4 py-2 text-base font-medium ${
              isActive("/upload")
                ? "text-indigo-600 bg-indigo-50 border-indigo-600"
                : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600 border-transparent"
            } border-l-4`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Upload
          </Link>
          {auth.isAuthenticated && (
            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default ProperNavbar;
