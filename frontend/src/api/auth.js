import { users } from '../mock/users';


export const loginMock = async (email, password, demoRole) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let user;
  
  if (demoRole) {
    // Demo mode - find user by role
    user = users.find(u => u.role === demoRole);
  } else {
    // Normal mode - find user by email
    user = users.find(u => u.email === email);
  }
  
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  }
  
  return null;
};


export const logoutMock = () => {
  localStorage.removeItem('currentUser');
};


export const getCurrentUser = () => {
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
};