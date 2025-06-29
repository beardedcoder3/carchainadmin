import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider, ConfirmDialogProvider, overrideAlerts } from './utils/notifications';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Reports from './components/Reports';
import Settings from './components/Settings';
import PublicReport from './components/PublicReport';
import './App.css';

function App() {
  // Initialize global alert overrides
  useEffect(() => {
    overrideAlerts();
  }, []);

  return (
    <NotificationProvider>
      <ConfirmDialogProvider>
        <ThemeProvider>
          <AuthProvider>
            <Router>
              <Routes>
                {/* 🌍 PUBLIC ROUTES - No authentication required */}
                <Route path="/public-report/:reportId" element={<PublicReport />} />
                
                {/* 🔐 PROTECTED ROUTES - Authentication required */}
                <Route path="/*" element={
                  <ProtectedRoute>
                    <div className="flex h-screen bg-gray-100">
                      <Sidebar />
                      <div className="flex-1 flex flex-col overflow-hidden">
                        <Header />
                        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                          <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/reports" element={<Reports />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="*" element={
                              <div className="bg-white p-6 rounded-lg shadow">
                                <h1 className="text-2xl font-bold">Page Not Found</h1>
                                <p className="mt-4">The page you're looking for doesn't exist.</p>
                              </div>
                            } />
                          </Routes>
                        </main>
                      </div>
                    </div>
                  </ProtectedRoute>
                } />
              </Routes>
            </Router>
          </AuthProvider>
        </ThemeProvider>
      </ConfirmDialogProvider>
    </NotificationProvider>
  );
}

export default App;