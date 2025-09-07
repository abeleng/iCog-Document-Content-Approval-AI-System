import { tasks } from '../mock/tasks';
import { auditTrail } from '../mock/auditTrail';


export const getTasks = async (userId, role) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (role === 'admin') {
    return tasks;
  } else if (role === 'reviewer') {
    return tasks.filter(task => task.reviewerId === userId);
  } else {
    return tasks.filter(task => task.createdBy === userId);
  }
};


export const getTask = async (taskId) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return tasks.find(task => task.id === taskId);
};


export const createTask = async (taskData) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const newTask = {
    id: `task_${Date.now()}`,
    ...taskData,
    createdAt: new Date().toISOString(),
    status: 'draft',
    score: 0
  };
  
  tasks.push(newTask);
  return newTask;
};


export const updateTask = async (taskId, updates) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  if (taskIndex !== -1) {
    tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
    return tasks[taskIndex];
  }
  throw new Error('Task not found');
};


export const getAuditTrail = async (taskId) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return auditTrail.filter(entry => entry.taskId === taskId);
};