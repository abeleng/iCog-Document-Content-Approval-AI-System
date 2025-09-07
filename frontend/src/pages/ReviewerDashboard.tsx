import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Star, FileText, Calendar, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getTasks } from '../api/tasks';
import { formatDistanceToNow } from 'date-fns';
import SkeletonLoader from '../components/SkeletonLoader';

const ReviewerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const getStatusCounts = () => {
    return {
      assigned: tasks.filter(t => t.status === 'under_review').length,
      completed: tasks.filter(t => t.status === 'approved' || t.score > 0).length,
      total: tasks.length
    };
  };

  const statusCounts = getStatusCounts();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTimeElapsed = (submittedAt: string) => {
    return formatDistanceToNow(new Date(submittedAt), { addSuffix: true });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Reviewer Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Review assigned tasks and provide scoring feedback
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Assigned Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.assigned}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-xl">
              <Star className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed Reviews</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.completed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-xl">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Assigned</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.total}</p>
            </div>
          </div>
        </div>
      </div>


      {/* Assigned Tasks */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Assigned Tasks</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Refresh Tasks
            </button>
            <button
              onClick={() => alert('Demo: This would show filtering options for assigned tasks')}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              Filter Tasks
            </button>
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks assigned</h3>
            <p className="text-gray-600">
              You don't have any tasks assigned for review yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
                      <span className="text-sm font-medium text-gray-600 capitalize">
                        {task.priority} Priority
                      </span>
                      {task.attachments && task.attachments.length > 0 && (
                        <span className="text-sm text-gray-500">
                          • {task.attachments.length} attachment{task.attachments.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {task.title}
                    </h3>

                    <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Submitted {getTimeElapsed(task.createdAt)}
                      </div>
                    </div>

                    {/* AI Pre-score */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-gray-600">🤖 AI Baseline: </span>
                        <span className="font-semibold text-purple-600">
                          {task.id === 'marketing-newsletter-2025-01' ? '76%' : 'Pending'}
                        </span>
                        <span className="text-xs text-purple-500 ml-1">(reference only)</span>
                      </div>
                      
                      {task.score > 0 && (
                        <div>
                          <span className="text-sm text-gray-600">👤 Your Score: </span>
                          <span className="font-semibold text-green-600">{task.score}%</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 ml-6">
                    <Link
                      to={`/task/${task.id}`}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                      View Task
                    </Link>
                    <Link
                      to={`/task/${task.id}/score`}
                      className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                    >
                      {task.score > 0 ? 'Update Score' : 'Score Task'}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewerDashboard;