import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, Clock, AlertTriangle, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getNotifications, markNotificationRead } from '../api/notifications';
import { formatDistanceToNow } from 'date-fns';
import SkeletonLoader from '../components/SkeletonLoader';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  taskId?: string;
  createdAt: string;
  read: boolean;
}

const Notifications: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      if (user) {
        try {
          const data = await getNotifications(user.id);
          setNotifications(data.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ));
        } catch (error) {
          console.error('Failed to load notifications:', error);
        }
      }
      setLoading(false);
    };

    loadNotifications();
  }, [user]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task_approved':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'task_scored':
        return <Clock className="h-6 w-6 text-blue-500" />;
      case 'task_assigned':
        return <FileText className="h-6 w-6 text-purple-500" />;
      case 'anomaly_detected':
        return <AlertTriangle className="h-6 w-6 text-red-500" />;
      default:
        return <Bell className="h-6 w-6 text-gray-500" />;
    }
  };

  const getNotificationBgColor = (type: string, read: boolean) => {
    const baseColor = read ? 'bg-white' : 
      type === 'task_approved' ? 'bg-green-50' :
      type === 'task_scored' ? 'bg-blue-50' :
      type === 'task_assigned' ? 'bg-purple-50' :
      type === 'anomaly_detected' ? 'bg-red-50' :
      'bg-gray-50';
    
    return baseColor;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3">
          <Bell className="h-8 w-8 text-gray-700" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-gray-600 mt-1">
                You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications yet</h3>
            <p className="text-gray-600">
              You'll receive notifications here when there's activity on your tasks.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-6 transition-colors hover:bg-gray-50 ${getNotificationBgColor(notification.type, notification.read)}`}
              >
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`text-lg font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </h3>
                        <p className={`mt-1 ${!notification.read ? 'text-gray-700' : 'text-gray-600'}`}>
                          {notification.message}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </p>
                      </div>

                      {/* Unread indicator */}
                      {!notification.read && (
                        <div className="flex-shrink-0 ml-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="mt-4 flex items-center space-x-3">
                      {notification.taskId && (
                        <Link
                          to={`/task/${notification.taskId}`}
                          className="text-sm bg-black text-white px-3 py-1 rounded-lg hover:bg-gray-800 transition-colors"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          View Task
                        </Link>
                      )}
                      
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mark all as read */}
      {unreadCount > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              // Mark all as read
              notifications.forEach(notif => {
                if (!notif.read) {
                  handleMarkAsRead(notif.id);
                }
              });
            }}
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Mark all as read
          </button>
        </div>
      )}
    </div>
  );
};

export default Notifications;