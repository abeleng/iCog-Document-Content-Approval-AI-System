import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { getNotifications } from '../api/notifications';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  taskId?: string;
  createdAt: string;
  read: boolean;
}

interface NotificationDropdownProps {
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      if (user) {
        try {
          const data = await getNotifications(user.id);
          setNotifications(data);
        } catch (error) {
          console.error('Failed to load notifications:', error);
        }
      }
      setLoading(false);
    };

    loadNotifications();
  }, [user]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task_approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'task_scored':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'anomaly_detected':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-4 z-50">
        <div className="px-4 py-2">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto">
      <div className="px-4 py-2 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
      </div>
      
      {notifications.length === 0 ? (
        <div className="px-4 py-6 text-center text-gray-500 text-sm">
          No notifications yet
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {notifications.slice(0, 5).map((notification) => (
            <div
              key={notification.id}
              className={`px-4 py-3 hover:bg-gray-50 transition-colors ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
            >
              {notification.taskId ? (
                <Link
                  to={`/task/${notification.taskId}`}
                  onClick={onClose}
                  className="block"
                >
                  <div className="flex items-start space-x-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </Link>
              ) : (
                <div className="flex items-start space-x-3">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      <div className="px-4 py-2 border-t border-gray-200">
        <Link
          to="/notifications"
          onClick={onClose}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          View all notifications
        </Link>
      </div>
    </div>
  );
};

export default NotificationDropdown;