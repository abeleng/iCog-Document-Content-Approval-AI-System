import React from 'react';
import { User, Mail, Shield, Calendar, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

const Profile: React.FC = () => {
  const { user } = useAuth();

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'reviewer':
        return 'bg-blue-100 text-blue-800';
      case 'department':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">User not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-2">
          Manage your profile information and account details
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Cover and Avatar Section */}
        <div className="relative h-32 bg-gradient-to-r from-gray-900 to-gray-700">
          <div className="absolute -bottom-12 left-8">
            <div className="relative">
              <div className="w-24 h-24 bg-gray-300 rounded-full border-4 border-white flex items-center justify-center">
                <User className="h-12 w-12 text-gray-600" />
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="pt-16 pb-8 px-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <div className="flex items-center space-x-3 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(user.role)}`}>
                  {user.role === 'admin' ? 'Administrator' :
                   user.role === 'reviewer' ? 'Reviewer' :
                   'Department User'}
                </span>
                {user.department && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                    {user.department}
                  </span>
                )}
              </div>
            </div>
            
            <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
              Edit Profile
            </button>
          </div>

          {/* Profile Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Mail className="h-5 w-5 text-gray-600" />
                  <h3 className="font-medium text-gray-900">Email Address</h3>
                </div>
                <p className="text-gray-700">{user.email}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Shield className="h-5 w-5 text-gray-600" />
                  <h3 className="font-medium text-gray-900">Role & Permissions</h3>
                </div>
                <p className="text-gray-700 capitalize mb-1">{user.role}</p>
                <div className="text-sm text-gray-600">
                  {user.role === 'admin' && (
                    <ul className="list-disc list-inside space-y-1">
                      <li>Full system access</li>
                      <li>User management</li>
                      <li>Audit trail viewing</li>
                      <li>System configuration</li>
                    </ul>
                  )}
                  {user.role === 'reviewer' && (
                    <ul className="list-disc list-inside space-y-1">
                      <li>Review assigned tasks</li>
                      <li>Score submissions</li>
                      <li>Provide feedback</li>
                      <li>Approve/reject tasks</li>
                    </ul>
                  )}
                  {user.role === 'department' && (
                    <ul className="list-disc list-inside space-y-1">
                      <li>Create tasks</li>
                      <li>Submit drafts</li>
                      <li>View feedback</li>
                      <li>Manage iterations</li>
                    </ul>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  <h3 className="font-medium text-gray-900">Last Login</h3>
                </div>
                <p className="text-gray-700">
                  {user.lastLogin 
                    ? format(new Date(user.lastLogin), 'PPP p')
                    : 'Never'
                  }
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <h3 className="font-medium text-gray-900">Account Status</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-700 text-sm font-medium">Active</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Demo account with full access
                </p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Logged in</p>
                    <p className="text-xs text-gray-600">Accessed the system</p>
                  </div>
                  <span className="text-xs text-gray-500">Today</span>
                </div>
                
                {user.role === 'department' && (
                  <>
                    <div className="flex items-center justify-between py-2 border-t border-gray-200">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Task created</p>
                        <p className="text-xs text-gray-600">January 2025 Marketing Newsletter</p>
                      </div>
                      <span className="text-xs text-gray-500">2 days ago</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-t border-gray-200">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Draft submitted</p>
                        <p className="text-xs text-gray-600">Uploaded newsletter_draft_v2.pdf</p>
                      </div>
                      <span className="text-xs text-gray-500">3 days ago</span>
                    </div>
                  </>
                )}
                
                {user.role === 'reviewer' && (
                  <>
                    <div className="flex items-center justify-between py-2 border-t border-gray-200">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Task reviewed</p>
                        <p className="text-xs text-gray-600">Scored newsletter task 85/100</p>
                      </div>
                      <span className="text-xs text-gray-500">1 day ago</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-t border-gray-200">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Task assigned</p>
                        <p className="text-xs text-gray-600">Assigned to review Q1 campaign</p>
                      </div>
                      <span className="text-xs text-gray-500">2 days ago</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Demo Notice */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Demo Account:</strong> This is a demonstration account. 
              In a production system, you would be able to edit your profile information, 
              upload a profile picture, and manage additional account settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;