import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginMock, logoutMock, getCurrentUser } from '../api/auth';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'reviewer' | 'department';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role?: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const user = await loginMock(email, password, role);
      if (user) {
        setUser(user);
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    logoutMock();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};