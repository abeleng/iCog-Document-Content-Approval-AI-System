import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import DepartmentDashboard from './pages/DepartmentDashboard';
import ReviewerDashboard from './pages/ReviewerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CreateTask from './pages/CreateTask';
import TaskDetail from './pages/TaskDetail';
import ReviewScoring from './pages/ReviewScoring';
import IterationInbox from './pages/IterationInbox';
import Notifications from './pages/Notifications';
import Search from './pages/Search';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Header from './components/Header';

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dash/department" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        
        <Route path="/dash/department" element={
          <ProtectedRoute>
            <Header />
            <DepartmentDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/dash/reviewer" element={
          <ProtectedRoute roles={['reviewer']}>
            <Header />
            <ReviewerDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/dash/admin" element={
          <ProtectedRoute roles={['admin']}>
            <Header />
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/task/new" element={
          <ProtectedRoute>
            <Header />
            <CreateTask />
          </ProtectedRoute>
        } />
        
        <Route path="/task/:taskId" element={
          <ProtectedRoute>
            <Header />
            <TaskDetail />
          </ProtectedRoute>
        } />
        
        <Route path="/task/:taskId/score" element={
          <ProtectedRoute roles={['reviewer']}>
            <Header />
            <ReviewScoring />
          </ProtectedRoute>
        } />
        
        <Route path="/dash/department/iterations" element={
          <ProtectedRoute>
            <Header />
            <IterationInbox />
          </ProtectedRoute>
        } />
        
        <Route path="/notifications" element={
          <ProtectedRoute>
            <Header />
            <Notifications />
          </ProtectedRoute>
        } />
        
        <Route path="/search" element={
          <ProtectedRoute>
            <Header />
            <Search />
          </ProtectedRoute>
        } />
        
        <Route path="/settings" element={
          <ProtectedRoute>
            <Header />
            <Settings />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <Header />
            <Profile />
          </ProtectedRoute>
        } />
        
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;