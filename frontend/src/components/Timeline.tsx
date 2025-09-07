import React from 'react';
import { format } from 'date-fns';
import { 
  FileText, 
  UserPlus, 
  CheckCircle, 
  Upload, 
  Bot, 
  Clock, 
  Star,
  AlertTriangle 
} from 'lucide-react';

interface TimelineEntry {
  id: string;
  action: string;
  actor: string;
  actorName: string;
  timestamp: string;
  details: string;
  reviewTime?: number;
}

interface TimelineProps {
  entries: TimelineEntry[];
}

const Timeline: React.FC<TimelineProps> = ({ entries }) => {
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'task_created':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'draft_submitted':
        return <Upload className="h-4 w-4 text-green-500" />;
      case 'ai_precheck_completed':
        return <Bot className="h-4 w-4 text-purple-500" />;
      case 'reviewer_assigned':
        return <UserPlus className="h-4 w-4 text-orange-500" />;
      case 'reviewer_scored':
        return <Star className="h-4 w-4 text-yellow-500" />;
      case 'task_approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'revisions_requested':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'task_created':
        return 'bg-blue-100 border-blue-200';
      case 'draft_submitted':
        return 'bg-green-100 border-green-200';
      case 'ai_precheck_completed':
        return 'bg-purple-100 border-purple-200';
      case 'reviewer_assigned':
        return 'bg-orange-100 border-orange-200';
      case 'reviewer_scored':
        return 'bg-yellow-100 border-yellow-200';
      case 'task_approved':
        return 'bg-green-100 border-green-200';
      case 'revisions_requested':
        return 'bg-red-100 border-red-200';
      default:
        return 'bg-gray-100 border-gray-200';
    }
  };

  const getActionTitle = (action: string) => {
    switch (action) {
      case 'task_created':
        return 'Task Created';
      case 'draft_submitted':
        return 'Draft Submitted';
      case 'ai_precheck_completed':
        return 'AI Pre-check Completed';
      case 'reviewer_assigned':
        return 'Reviewer Assigned';
      case 'reviewer_scored':
        return 'Review Completed';
      case 'task_approved':
        return 'Task Approved';
      case 'revisions_requested':
        return 'Revisions Requested';
      default:
        return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
        <p>No activity yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry, index) => (
        <div key={entry.id} className="flex space-x-4">
          {/* Timeline line */}
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${getActionColor(entry.action)}`}>
              {getActionIcon(entry.action)}
            </div>
            {index < entries.length - 1 && (
              <div className="w-0.5 h-8 bg-gray-200 mt-2"></div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 pb-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">
                  {getActionTitle(entry.action)}
                </p>
                <p className="text-sm text-gray-600">
                  by {entry.actorName}
                  {entry.reviewTime && (
                    <span className="text-gray-500 ml-1">
                      • Review time: {entry.reviewTime}m
                    </span>
                  )}
                </p>
              </div>
              <time className="text-sm text-gray-500">
                {format(new Date(entry.timestamp), 'MMM d, h:mm a')}
              </time>
            </div>
            <p className="text-sm text-gray-700 mt-1">
              {entry.details}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;