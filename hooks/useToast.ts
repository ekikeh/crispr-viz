import { toast, ToastOptions } from 'react-hot-toast';

export const useToast = () => {
  const success = (message: string, options?: ToastOptions) => {
    toast.success(message, {
      style: {
        background: '#0f172a',
        color: '#fff',
        border: '1px solid #10b981',
      },
      iconTheme: {
        primary: '#10b981',
        secondary: '#0f172a',
      },
      ...options,
    });
  };

  const error = (message: string, options?: ToastOptions) => {
    toast.error(message, {
      style: {
        background: '#0f172a',
        color: '#fff',
        border: '1px solid #ef4444',
      },
      iconTheme: {
        primary: '#ef4444',
        secondary: '#0f172a',
      },
      ...options,
    });
  };

  const info = (message: string, options?: ToastOptions) => {
    toast(message, {
      icon: 'ℹ️',
      style: {
        background: '#0f172a',
        color: '#fff',
        border: '1px solid #3b82f6',
      },
      ...options,
    });
  };

  const loading = (message: string, options?: ToastOptions) => {
    return toast.loading(message, {
      style: {
        background: '#0f172a',
        color: '#fff',
        border: '1px solid #64748b',
      },
      ...options,
    });
  };

  const dismiss = (toastId?: string) => {
    toast.dismiss(toastId);
  };

  return { success, error, info, loading, dismiss };
};