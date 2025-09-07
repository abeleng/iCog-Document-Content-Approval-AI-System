import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, Clock, Star, FileText, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getTasks } from '../api/tasks';
import { format } from 'date-fns';
import SkeletonLoader from '../components/SkeletonLoader';

const IterationInbox: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      if (user) {
        try {
          const data = await getTasks(user.id, user.role);
          // Filter for tasks that need revisions
          const revisionsNeeded = data.filter(task => 
            task.status === 'revisions_required' || 
            (task.score > 0 && task.score < 100)
          );
          setTasks(revisionsNeeded);
        } catch (error) {
          console.error('Failed to load tasks:', error);
        }
      }
      setLoading(false);
    };

    loadTasks();
  }, [user]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
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
      {/* Breadcrumb */}
      <nav className="mb-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li><Link to="/dash/department" className="hover:text-gray-700">Dashboard</Link></li>
          <li className="before:content-['/'] before:mx-2">Iteration Inbox</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Iteration Inbox</h1>
        <p className="text-gray-600 mt-2">
          Tasks requiring revisions and resubmission
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-xl">
              <RefreshCw className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Needs Revision</p>
              <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-xl">
              <Clock className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">
                {tasks.filter(t => new Date(t.dueDate) < new Date()).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {tasks.length > 0 ? Math.round(tasks.reduce((sum, task) => sum + task.score, 0) / tasks.length) : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Tasks Requiring Revision</h2>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No revisions needed</h3>
            <p className="text-gray-600">
              All your tasks are either approved or haven't been reviewed yet.
            </p>
            <Link
              to="/dash/department"
              className="inline-flex items-center mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {tasks.map((task) => (
              <div key={task.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
                      <span className="text-sm font-medium text-gray-600 capitalize">
                        {task.priority} Priority
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <Star className="h-4 w-4 mr-1 text-yellow-500" />
                        Score: {task.score}%
                      </div>
                      {new Date(task.dueDate) < new Date() && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                          Overdue
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {task.title}
                    </h3>

                    <div className="text-sm text-gray-600 mb-4">
                      <p><strong>Due Date:</strong> {format(new Date(task.dueDate), 'MMM d, yyyy')}</p>
                      <p><strong>Last Updated:</strong> {format(new Date(task.createdAt), 'MMM d, yyyy')}</p>
                    </div>

                    {/* Mock Reviewer Feedback */}
                    <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <h4 className="font-medium text-green-900">👤 Human Reviewer Feedback</h4>
                      </div>
                      <div className="space-y-2 text-sm text-orange-800">
                        <div>
                          <strong>Issues:</strong> Missing budget justification section and specific performance metrics.
                        </div>
                        <div>
                          <strong>Required Changes:</strong>
                          <ul className="list-disc list-inside mt-1 space-y-1">
                            <li>Add detailed budget breakdown with justification</li>
                            <li>Include specific KPIs and measurement methodology</li>
                            <li>Provide supporting data for projected outcomes</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* AI Suggestions */}
                    {task.id === 'marketing-newsletter-2025-01' && (
                      <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <h4 className="font-medium text-purple-900">🤖 AI Suggestions (Optional)</h4>
                        </div>
                        <div className="space-y-2">
                          <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors">
                            💡 Apply AI suggestion: "Add specific metrics for campaign performance"
                          </button>
                          <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors">
                            💡 Apply AI suggestion: "Provide budget justification paragraph"
                          </button>
                        </div>
                        <p className="text-xs text-purple-600 mt-2">
                          These are AI-generated suggestions. Human reviewer feedback takes priority.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-2 ml-6">
                    <Link
                      to={`/task/${task.id}`}
                      className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium text-center"
                    >
                      Edit & Resubmit
                    </Link>
                    
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                      View Feedback
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Completion Progress</span>
                    <span className="text-sm font-medium text-gray-900">{task.score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full transition-all"
                      style={{ width: `${task.score}%` }}
                    ></div>
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

export default IterationInbox;