import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, LogIn } from 'lucide-react';

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const isDemoMode = searchParams.get('demo');

  useEffect(() => {
    if (user) {
      const dashPath = user.role === 'admin' ? '/dash/admin' : 
                     user.role === 'reviewer' ? '/dash/reviewer' : 
                     '/dash/department';
      navigate(dashPath);
    }
  }, [user, navigate]);

  useEffect(() => {
    if (isDemoMode === 'marketing') {
      setSelectedRole('department');
      setEmail('selam@marketing.icog.test');
      setPassword('demo123');
    }
  }, [isDemoMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password, isDemoMode ? selectedRole : undefined);
      
      if (success) {
        // Navigation will be handled by useEffect above
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">iC</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Sign in to iCog
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isDemoMode ? 'Demo Mode - Marketing Department' : 'Access your approval dashboard'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div 
                className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
                role="alert"
                aria-live="polite"
              >
                {error}
              </div>
            )}

            {isDemoMode && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Demo Mode</h3>
                <p className="text-blue-700 text-sm">
                  Select a role to demo the system. Demo credentials are pre-filled.
                </p>
              </div>
            )}

            {isDemoMode && (
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Demo Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={selectedRole}
                  onChange={(e) => {
                    const role = e.target.value;
                    setSelectedRole(role);
                    // Auto-fill credentials based on role
                    if (role === 'admin') {
                      setEmail('abe@icog.test');
                    } else if (role === 'reviewer') {
                      setEmail('miriam@icog.test');
                    } else if (role === 'department') {
                      setEmail('selam@marketing.icog.test');
                    }
                    setPassword('demo123');
                  }}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="reviewer">Reviewer</option>
                  <option value="department">Department User</option>
                </select>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  aria-invalid={error ? 'true' : 'false'}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent pr-10"
                  aria-invalid={error ? 'true' : 'false'}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || (isDemoMode && !selectedRole)}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign in
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Demo Credentials</span>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <div>
                <strong>Admin:</strong> abe@icog.test
              </div>
              <div>
                <strong>Reviewer:</strong> miriam@icog.test
              </div>
              <div>
                <strong>Department:</strong> selam@marketing.icog.test
              </div>
              <div className="text-xs text-gray-500">
                Password for all: demo123
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;