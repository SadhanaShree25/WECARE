import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import Dashboard from './Pages/Dashboard';
import SupportPage from './Pages/SupportPage';
import Reg from './Pages/Reg';
import AIChatbot from './Pages/AIChatbot';
import History from './Pages/History';
import SelfCare from './Pages/SelfCare';
import { useAuth } from './AuthContext';
import ProfilePage from './Pages/ProfilePage';


function AppRouter() {
  const { currentUser } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<Reg />} />
      <Route path="/login" element={<Reg />} />
      

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={currentUser ? <Dashboard /> : <Navigate to="/register" />}
      />
      <Route
        path="/support"
        element={currentUser ? <SupportPage /> : <Navigate to="/register" />}
      />
      <Route
        path="/chatbot"
        element={currentUser ? <AIChatbot /> : <Navigate to="/register" />}
      />
      <Route
        path="/history"
        element={currentUser ? <History /> : <Navigate to="/register" />}
      />
      <Route
        path="/selfcare"
        element={currentUser ? <SelfCare /> : <Navigate to="/register" />}
      />

      <Route path="/profile" element={<ProfilePage />} />


      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );

}
  console.log('HomePage rendered');


export default AppRouter;