import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { initializeStorage, resetToMockData } from './utils/storage';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Incidents from './pages/Incidents';
import Calendar from './pages/Calendar';
import Profile from './pages/Profile';
import PatientAppointments from './pages/PatientAppointments';
import PatientTreatments from './pages/PatientTreatments';
import './App.css';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({
  children,
  allowedRoles
}) => {
  const { isAuthenticated, currentUser } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && currentUser && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Reset data button for testing
const ResetDataButton: React.FC = () => {
  const handleReset = () => {
    resetToMockData();
    window.location.reload();
  };

  // Only show in development mode
  if (import.meta.env.MODE !== 'development') {
    return null;
  }

  return (
    <button
      onClick={handleReset}
      className="fixed bottom-4 right-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-50"
      title="Reset to mock data (Development only)"
    >
      Reset Data
    </button>
  );
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {isAuthenticated ? (
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route
                path="/dashboard"
                element={<Dashboard />}
              />
              <Route
                path="/patients"
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <Patients />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/incidents"
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <Incidents />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/calendar"
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <Calendar />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointments"
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <Calendar />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={<Profile />}
              />
              <Route
                path="/patient-appointments"
                element={
                  <ProtectedRoute allowedRoles={['Patient']}>
                    <PatientAppointments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/treatments"
                element={
                  <ProtectedRoute allowedRoles={['Patient']}>
                    <PatientTreatments />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        ) : (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        )}
        <ResetDataButton />
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  useEffect(() => {
    initializeStorage();
  }, []);

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
