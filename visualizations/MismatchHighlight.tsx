import React from 'react';

interface MismatchHighlightProps {
  children: React.ReactNode;
}

export const MismatchHighlight: React.FC<MismatchHighlightProps> = ({ children }) => {
  return (
    <div className="absolute inset-0 z-0 bg-red-500/20 border border-red-500 rounded animate-pulse flex items-center justify-center">
      <div className="absolute inset-0 bg-red-500/10 blur-sm rounded" />
      <div className="relative z-10 font-bold text-white shadow-black drop-shadow-md">
        {children}
      </div>
    </div>
  );
};