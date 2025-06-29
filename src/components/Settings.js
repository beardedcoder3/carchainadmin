import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Settings as SettingsIcon, 
  User, 
  Monitor, 
  Sun, 
  Moon, 
  Save, 
  Eye, 
  EyeOff,
  Palette,
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const Settings = () => {
  const { user, changePassword } = useAuth();
  const { theme, changeTheme } = useTheme();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordChangeStatus, setPasswordChangeStatus] = useState(null);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [settings, setSettings] = useState({
    // Admin Credentials
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    adminUsername: user?.username || 'carchainadmin'
  });

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleThemeChange = (newTheme) => {
    changeTheme(newTheme);
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleInputChange('companyLogo', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSettings = async () => {
    // Handle password change separately if passwords are provided
    if (settings.newPassword || settings.currentPassword) {
      await handlePasswordChange();
      return;
    }
    
    // Save other settings logic will be implemented later
    console.log('Saving general settings:', settings);
    alert('Settings saved successfully!');
  };

  const handlePasswordChange = async () => {
    // Clear any previous status
    setPasswordChangeStatus(null);
    
    // Validation
    if (!settings.currentPassword || !settings.newPassword) {
      setPasswordChangeStatus({
        type: 'error',
        message: 'Please enter both current and new password.'
      });
      return;
    }
    
    if (settings.newPassword !== settings.confirmPassword) {
      setPasswordChangeStatus({
        type: 'error',
        message: 'New passwords do not match!'
      });
      return;
    }

    if (settings.newPassword.length < 8) {
      setPasswordChangeStatus({
        type: 'error',
        message: 'New password must be at least 8 characters long.'
      });
      return;
    }

    setPasswordLoading(true);

    try {
      const result = await changePassword(settings.currentPassword, settings.newPassword);
      
      if (result.success) {
        setPasswordChangeStatus({
          type: 'success',
          message: 'Password changed successfully!'
        });
        
        // Clear password fields
        setSettings(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      } else {
        setPasswordChangeStatus({
          type: 'error',
          message: result.message || 'Failed to change password.'
        });
      }
    } catch (error) {
      setPasswordChangeStatus({
        type: 'error',
        message: 'Network error. Please try again.'
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default values?')) {
      // Reset to default values
      setSettings({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        adminUsername: user?.username || 'carchainadmin'
      });
      changeTheme('light');
      alert('Settings reset to default values.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center">
                <SettingsIcon className="w-8 h-8 mr-3 text-red-600" />
                Settings
              </h1>
              <p className="text-slate-600 mt-1">Configure your inspection portal preferences</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleResetSettings}
                className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-all duration-200 font-medium"
              >
                Reset to Default
              </button>
              <button
                onClick={handleSaveSettings}
                className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                <Save className="w-5 h-5 mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 max-w-4xl mx-auto space-y-6">
        
        {/* Theme Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
            <Palette className="w-6 h-6 mr-3 text-red-600" />
            Appearance
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-3 block">
                Theme Preference
                <span className="ml-2 text-xs text-slate-500">(Current: {theme})</span>
              </label>
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    theme === 'light' 
                      ? 'border-red-500 bg-red-50 ring-2 ring-red-200' 
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <Sun className="w-6 h-6 mx-auto mb-2 text-amber-500" />
                  <div className="text-sm font-medium text-slate-900">Light</div>
                  <div className="text-xs text-slate-500 mt-1">Default theme</div>
                </button>
                
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    theme === 'dark' 
                      ? 'border-red-500 bg-red-50 ring-2 ring-red-200' 
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <Moon className="w-6 h-6 mx-auto mb-2 text-slate-600" />
                  <div className="text-sm font-medium text-slate-900">Dark</div>
                  <div className="text-xs text-slate-500 mt-1">Dark mode</div>
                </button>
                
                <button
                  onClick={() => handleThemeChange('system')}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    theme === 'system' 
                      ? 'border-red-500 bg-red-50 ring-2 ring-red-200' 
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <Monitor className="w-6 h-6 mx-auto mb-2 text-slate-600" />
                  <div className="text-sm font-medium text-slate-900">System</div>
                  <div className="text-xs text-slate-500 mt-1">Auto detect</div>
                </button>
              </div>
              
              {/* Theme preview */}
              <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                <div className="text-sm text-slate-600">
                  <strong>Theme Preview:</strong> The changes will be applied immediately across the entire application.
                  {theme === 'system' && (
                    <span className="block mt-1 text-xs text-slate-500">
                      System theme follows your device's appearance settings.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Login Management */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
            <Shield className="w-6 h-6 mr-3 text-red-600" />
            Admin Login Management
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                <User className="w-4 h-4 inline mr-1" />
                Admin Username
              </label>
              <input
                type="text"
                value={settings.adminUsername}
                onChange={(e) => handleInputChange('adminUsername', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                placeholder="Enter admin username"
                disabled
              />
              <p className="text-xs text-slate-500 mt-1">Username cannot be changed</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Change Password</h3>
            
            {/* Password Change Status */}
            {passwordChangeStatus && (
              <div className={`mb-6 p-4 rounded-lg flex items-center ${
                passwordChangeStatus.type === 'success' 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                {passwordChangeStatus.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
                )}
                <p className={`text-sm ${
                  passwordChangeStatus.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {passwordChangeStatus.message}
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={settings.currentPassword}
                    onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                    placeholder="Enter current password"
                    disabled={passwordLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    disabled={passwordLoading}
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={settings.newPassword}
                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                    placeholder="Enter new password"
                    disabled={passwordLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    disabled={passwordLoading}
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={settings.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                    placeholder="Confirm new password"
                    disabled={passwordLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    disabled={passwordLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Change Password Button */}
            {(settings.currentPassword || settings.newPassword || settings.confirmPassword) && (
              <div className="mt-6">
                <button
                  onClick={handlePasswordChange}
                  disabled={passwordLoading}
                  className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {passwordLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Changing Password...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5 mr-2" />
                      Change Password
                    </>
                  )}
                </button>
              </div>
            )}
            
            {settings.newPassword && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-800">
                  <strong>Password Requirements:</strong>
                  <ul className="mt-2 space-y-1 list-disc list-inside">
                    <li>At least 8 characters long</li>
                    <li>Include uppercase and lowercase letters</li>
                    <li>Include at least one number</li>
                    <li>Include at least one special character</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;