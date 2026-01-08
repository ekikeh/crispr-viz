import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorBannerProps {
  title?: string;
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ 
  title = "Error", 
  message, 
  onDismiss, 
  className = '' 
}) => {
  return (
    <div className={`bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start ${className}`}>
      <AlertCircle className="text-red-400 w-5 h-5 mt-0.5 flex-shrink-0" />
      <div className="ml-3 flex-1">
        <h3 className="text-sm font-medium text-red-300">{title}</h3>
        <p className="text-sm text-red-200/80 mt-1 leading-relaxed">{message}</p>
      </div>
      {onDismiss && (
        <button 
          onClick={onDismiss}
          className="ml-auto -mx-1.5 -my-1.5 p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg focus:ring-2 focus:ring-red-500/50"
        >
          <span className="sr-only">Dismiss</span>
          <X size={16} />
        </button>
      )}
    </div>
  );
};