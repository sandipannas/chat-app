import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ChatPage from './pages/ChatPage';

function AppRoutes() {
  const { user, login, signup, updateProfile, loading } = useAuth();

  if (user) {
    return (
      <Routes>
        <Route 
          path="/chat" 
          element={<ChatPage currentUser={user} onUpdateProfile={updateProfile} />} 
        />
        <Route path="*" element={<Navigate to="/chat" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={<LoginPage onLogin={login} loading={loading} />} 
      />
      <Route 
        path="/signup" 
        element={<SignupPage onSignup={signup} loading={loading} />} 
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <div className="h-screen overflow-hidden">
            <AppRoutes />
          </div>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;