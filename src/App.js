import React, { useEffect, useState } from 'react';
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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    overrideAlerts();
  }, []);

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
    document.body.classList.remove('sidebar-open');
  };

  const openMobileSidebar = () => {
    setIsMobileSidebarOpen(true);
    document.body.classList.add('sidebar-open');
  };

  return (
    <NotificationProvider>
      <ConfirmDialogProvider>
        <ThemeProvider>
          <AuthProvider>
            <Router>
              <Routes>
                <Route path="/public-report/:reportId" element={<PublicReport />} />
                
                <Route path="/*" element={
                  <ProtectedRoute>
                    <div className="flex h-screen bg-gray-100">
                      {/* Mobile Menu Button */}
                      <button 
                        className="mobile-menu-toggle"
                        onClick={openMobileSidebar}
                        aria-label="Open navigation menu"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                      </button>

                      {/* Mobile Overlay */}
                      {isMobileSidebarOpen && (
                        <div 
                          className="mobile-sidebar-overlay"
                          onClick={closeMobileSidebar}
                        />
                      )}

                      {/* Sidebar */}
                      <Sidebar 
                        isOpen={isMobileSidebarOpen} 
                        onClose={closeMobileSidebar}
                      />
                      
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
                                <h1 className="text-2xl font-bold text-gray-900">Page Not Found</h1>
                                <p className="mt-4 text-gray-600">The page you're looking for doesn't exist.</p>
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