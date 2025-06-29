import React, { createContext, useContext, useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, XCircle, Info, X, AlertTriangle } from 'lucide-react';

// Create contexts
const NotificationContext = createContext();
const ConfirmDialogContext = createContext();

// Notification hook
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// Confirm dialog hook
export const useConfirm = () => {
  const context = useContext(ConfirmDialogContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmDialogProvider');
  }
  return context;
};

// Global notification instance (can be used outside React components)
let globalNotificationApi = null;
let globalConfirmApi = null;

// Global functions that work everywhere
export const toast = {
  success: (message, title = 'Success') => {
    if (globalNotificationApi) {
      globalNotificationApi.showSuccess(message, title);
    } else {
      console.log('✅', title + ':', message);
    }
  },
  error: (message, title = 'Error') => {
    if (globalNotificationApi) {
      globalNotificationApi.showError(message, title);
    } else {
      console.error('❌', title + ':', message);
    }
  },
  warning: (message, title = 'Warning') => {
    if (globalNotificationApi) {
      globalNotificationApi.showWarning(message, title);
    } else {
      console.warn('⚠️', title + ':', message);
    }
  },
  info: (message, title = 'Information') => {
    if (globalNotificationApi) {
      globalNotificationApi.showInfo(message, title);
    } else {
      console.info('ℹ️', title + ':', message);
    }
  }
};

export const confirmDialog = async (options = {}) => {
  if (globalConfirmApi) {
    return await globalConfirmApi.showConfirm(options);
  } else {
    // Fallback to browser confirm
    return window.confirm(options.message || 'Are you sure?');
  }
};

// Override the default alert function globally
export const overrideAlerts = () => {
  // Replace window.alert with toast
  window.alert = (message) => {
    toast.info(message, 'Alert');
  };

  // Replace window.confirm with professional dialog
  const originalConfirm = window.confirm;
  window.confirm = async (message) => {
    if (globalConfirmApi) {
      return await confirmDialog({ message });
    }
    return originalConfirm(message);
  };
};

// Notification Provider
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'success',
      title: '',
      message: '',
      duration: 5000,
      ...notification
    };

    setNotifications(prev => [...prev, newNotification]);

    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const showSuccess = (message, title = 'Success') => {
    return addNotification({ type: 'success', title, message, duration: 4000 });
  };

  const showError = (message, title = 'Error') => {
    return addNotification({ type: 'error', title, message, duration: 6000 });
  };

  const showWarning = (message, title = 'Warning') => {
    return addNotification({ type: 'warning', title, message, duration: 5000 });
  };

  const showInfo = (message, title = 'Information') => {
    return addNotification({ type: 'info', title, message, duration: 4000 });
  };

  const api = {
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  // Set global API reference
  useEffect(() => {
    globalNotificationApi = api;
    return () => {
      globalNotificationApi = null;
    };
  }, []);

  return (
    <NotificationContext.Provider value={api}>
      {children}
      <NotificationContainer notifications={notifications} onRemove={removeNotification} />
    </NotificationContext.Provider>
  );
};

// Confirm Dialog Provider
export const ConfirmDialogProvider = ({ children }) => {
  const [dialog, setDialog] = useState(null);

  const showConfirm = async ({
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    type = 'warning',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm = () => {},
    onCancel = () => {}
  } = {}) => {
    return new Promise((resolve) => {
      setDialog({
        title,
        message,
        type,
        confirmText,
        cancelText,
        onConfirm: () => {
          onConfirm();
          setDialog(null);
          resolve(true);
        },
        onCancel: () => {
          onCancel();
          setDialog(null);
          resolve(false);
        }
      });
    });
  };

  const api = { showConfirm };

  // Set global API reference
  useEffect(() => {
    globalConfirmApi = api;
    return () => {
      globalConfirmApi = null;
    };
  }, []);

  return (
    <ConfirmDialogContext.Provider value={api}>
      {children}
      {dialog && <ConfirmDialog dialog={dialog} />}
    </ConfirmDialogContext.Provider>
  );
};

// Individual Notification Component
const Notification = ({ notification, onRemove }) => {
  const getIcon = () => {
    const iconProps = { className: "w-5 h-5" };
    switch (notification.type) {
      case 'success':
        return <CheckCircle {...iconProps} className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle {...iconProps} className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle {...iconProps} className="w-5 h-5 text-yellow-600" />;
      case 'info':
      default:
        return <Info {...iconProps} className="w-5 h-5 text-blue-600" />;
    }
  };

  const getStyles = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getTextColor = () => {
    switch (notification.type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
      default:
        return 'text-blue-800';
    }
  };

  return (
    <div className={`max-w-sm w-full bg-white shadow-lg rounded-lg border-l-4 ${getStyles()} transform transition-all duration-300 ease-in-out animate-slide-in`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          <div className="ml-3 w-0 flex-1">
            {notification.title && (
              <p className={`text-sm font-semibold ${getTextColor()}`}>
                {notification.title}
              </p>
            )}
            <p className={`text-sm ${getTextColor()} ${notification.title ? 'mt-1' : ''}`}>
              {notification.message}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              className="inline-flex text-slate-400 hover:text-slate-600 focus:outline-none transition-colors duration-200"
              onClick={() => onRemove(notification.id)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Notification Container
const NotificationContainer = ({ notifications, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
      <div className="pointer-events-auto space-y-3">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            notification={notification}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  );
};

// Confirm Dialog Component
const ConfirmDialog = ({ dialog }) => {
  const getIcon = () => {
    switch (dialog.type) {
      case 'danger':
        return <XCircle className="w-8 h-8 text-red-600" />;
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-600" />;
      case 'info':
        return <Info className="w-8 h-8 text-blue-600" />;
      case 'warning':
      default:
        return <AlertTriangle className="w-8 h-8 text-yellow-600" />;
    }
  };

  const getIconBg = () => {
    switch (dialog.type) {
      case 'danger':
        return 'bg-red-100';
      case 'success':
        return 'bg-green-100';
      case 'info':
        return 'bg-blue-100';
      case 'warning':
      default:
        return 'bg-yellow-100';
    }
  };

  const getConfirmButtonStyles = () => {
    switch (dialog.type) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
      case 'success':
        return 'bg-green-600 hover:bg-green-700 focus:ring-green-500';
      case 'info':
        return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
      case 'warning':
      default:
        return 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity"
          onClick={dialog.onCancel}
        ></div>

        {/* Center the dialog */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        {/* Dialog */}
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="sm:flex sm:items-start">
            <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${getIconBg()} sm:mx-0 sm:h-10 sm:w-10`}>
              {getIcon()}
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-semibold text-slate-900">
                {dialog.title}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-slate-600">
                  {dialog.message}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
            <button
              type="button"
              className={`w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2.5 text-base font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto sm:text-sm transition-all duration-200 ${getConfirmButtonStyles()}`}
              onClick={dialog.onConfirm}
            >
              {dialog.confirmText}
            </button>
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-lg border border-slate-300 shadow-sm px-4 py-2.5 bg-white text-base font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 sm:w-auto sm:text-sm transition-all duration-200"
              onClick={dialog.onCancel}
            >
              {dialog.cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
