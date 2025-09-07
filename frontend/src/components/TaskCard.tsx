import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    priority: 'high' | 'medium' | 'low';
    status: string;
    dueDate: string;
    score: number;
    reviewerId?: string;
    createdAt: string;
  };
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'revisions_required': return 'bg-orange-100 text-orange-800';
      case 'approved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Draft';
      case 'under_review': return 'Under Review';
      case 'revisions_required': return 'Revisions Required';
      case 'approved': return 'Approved';
      default: return status;
    }
  };

  return (
    <Link to={`/task/${task.id}`}>
      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all hover:scale-105 transform cursor-pointer">
        {/* Header with Priority Dot and Status */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
            <span className="text-sm font-medium text-gray-600 capitalize">
              {task.priority} Priority
            </span>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
            {getStatusText(task.status)}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
          {task.title}
        </h3>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm font-medium text-gray-900">{task.score}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all ${
                task.score === 100 ? 'bg-green-500' :
                task.score >= 80 ? 'bg-blue-500' :
                task.score >= 60 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${task.score}%` }}
            ></div>
          </div>
        </div>

        {/* Metadata */}
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
          </div>
          
          {task.reviewerId && (
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              <span>Reviewer assigned</span>
            </div>
          )}
          
          <div className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            <span>Created {format(new Date(task.createdAt), 'MMM d')}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TaskCard;