import { notifications } from '../mock/notifications';


export const getNotifications = async (userId) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return notifications.filter(notification => notification.userId === userId);
};


export const markNotificationRead = async (notificationId) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  const notification = notifications.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
  }
};


export const createNotification = async (notificationData) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const newNotification = {
    id: `notif_${Date.now()}`,
    ...notificationData,
    createdAt: new Date().toISOString(),
    read: false
  };
  
  notifications.push(newNotification);
  return newNotification;
};