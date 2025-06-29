import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { LogOut, User, ChevronDown, Settings as SettingsIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setShowDropdown(false);
  };

  const handleSettings = () => {
    navigate('/settings');
    setShowDropdown(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="flex justify-between items-center px-8 py-4">
        {/* Left side - could add breadcrumbs or page title here */}
        <div className="flex items-center">
        
        </div>
        
        {/* Right side - User menu */}
        <div className="flex items-center space-x-4">
          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-slate-900">
                  {user?.username || 'Admin'}
                </div>
                <div className="text-xs text-slate-500">Administrator</div>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-200">
                  <p className="text-sm font-medium text-slate-900">{user?.username}</p>
                  <p className="text-xs text-slate-500">Administrator Account</p>
                </div>
                
                <button
                  onClick={handleSettings}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center transition-colors duration-200"
                >
                  <SettingsIcon className="w-4 h-4 mr-3" />
                  Settings
                </button>
                
                <div className="border-t border-slate-200 mt-2 pt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        ></div>
      )}
    </header>
  );
};

export default Header;