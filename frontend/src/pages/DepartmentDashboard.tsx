import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Upload, History, Filter, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getTasks } from '../api/tasks';
import TaskCard from '../components/TaskCard';
import SkeletonLoader from '../components/SkeletonLoader';

const DepartmentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPriority, setFilterPriority] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    const loadTasks = async () => {
      if (user) {
        try {
          const data = await getTasks(user.id, user.role);
          setTasks(data);
        } catch (error) {
          console.error('Failed to load tasks:', error);
        }
      }
      setLoading(false);
    };

    loadTasks();
  }, [user]);

  const filteredTasks = tasks.filter(task => {
    if (filterPriority && task.priority !== filterPriority) return false;
    if (filterStatus && task.status !== filterStatus) return false;
    return true;
  });

  const getStatusCounts = () => {
    return {
      active: tasks.filter(t => t.status === 'under_review' || t.status === 'draft').length,
      pending: tasks.filter(t => t.status === 'under_review').length,
      completed: tasks.filter(t => t.status === 'approved').length
    };
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>Dashboard</li>
          <li className="before:content-['/'] before:mx-2">Department</li>
          <li className="before:content-['/'] before:mx-2 text-gray-900 font-medium">
            {user?.department || 'Marketing'}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {user?.department || 'Marketing'} Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your content approval tasks and track progress
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-xl">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Submissions</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.active}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.completed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
  <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/task/new"
            className="flex items-center p-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-all hover:scale-105"
          >
            <Plus className="h-5 w-5 mr-3" />
            Create Task
          </Link>
          
          <button className="flex items-center p-4 bg-gray-100 text-gray-900 rounded-xl hover:bg-gray-200 transition-all hover:scale-105">
            <Upload className="h-5 w-5 mr-3" />
            Quick Upload
          </button>
          
          <Link
            to="/dash/department/iterations"
            className="flex items-center p-4 bg-gray-100 text-gray-900 rounded-xl hover:bg-gray-200 transition-all hover:scale-105"
          >
            <History className="h-5 w-5 mr-3" />
            View Iterations
          </Link>
        </div>
      </div>

      
      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                aria-label="Filter by priority"
              >
                <option value="">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                aria-label="Filter by status"
              >
                <option value="">All Status</option>
                <option value="draft">Draft</option>
                <option value="under_review">Under Review</option>
                <option value="revisions_required">Revisions Required</option>
                <option value="approved">Approved</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setFilterPriority('');
                  setFilterStatus('');
                }}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-3 py-1 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-600 mb-4">
              {tasks.length === 0 
                ? "You haven't created any tasks yet." 
                : "No tasks match your current filters."}
            </p>
            {tasks.length === 0 && (
              <Link
                to="/task/new"
                className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Task
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentDashboard;