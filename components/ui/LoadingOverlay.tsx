import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface LoadingOverlayProps {
  message?: string;
  isVisible: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message = 'Loading...', isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-sm rounded-lg transition-all duration-300">
      <LoadingSpinner size="lg" className="mb-4" />
      <p className="text-slate-200 font-medium animate-pulse">{message}</p>
    </div>
  );
};