import { createContext, useContext, useState } from 'react';
import Toast from '../components/ui/Toast';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    show: false,
    type: '',
    message: '',
    onConfirm: null
  });

  const showToast = (type, message, onConfirm = null) => {
    setToast({
      show: true,
      type,
      message,
      onConfirm
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* هنا بقى التوست global */}
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onConfirm={toast.onConfirm}
        onClose={hideToast}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  return useContext(ToastContext);
};