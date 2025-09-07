import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NotFound: React.FC = () => {
  const { user } = useAuth();

  const getDashboardPath = () => {
    if (!user) return '/';
    return `/dash/${user.role === 'admin' ? 'admin' : user.role === 'reviewer' ? 'reviewer' : 'department'}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center">
            <span className="text-white font-bold text-2xl">iC</span>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-200 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
          <p className="text-gray-600 text-lg max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to={getDashboardPath()}
            className="inline-flex items-center px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-all hover:scale-105 shadow-lg"
          >
            <Home className="h-5 w-5 mr-2" />
            Go to Dashboard
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-6 py-3 bg-white text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Go Back
          </button>
        </div>

        {/* Help Links */}
        <div className="mt-12 text-sm text-gray-500">
          <p>Need help? Try these links:</p>
          <div className="flex justify-center space-x-6 mt-2">
            <Link to="/search" className="hover:text-gray-700 transition-colors">
              Search
            </Link>
            <a href="#" className="hover:text-gray-700 transition-colors">
              Help Center
            </a>
            <a href="#" className="hover:text-gray-700 transition-colors">
              Contact Support
            </a>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gray-200 rounded-full opacity-50"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-gray-100 rounded-full opacity-30"></div>
      <div className="absolute top-1/2 left-20 w-16 h-16 bg-gray-150 rounded-full opacity-40"></div>
    </div>
  );
};

export default NotFound;