import React from 'react';

export const SkeletonIdeogram: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full h-full flex flex-col justify-center space-y-4 p-6 ${className}`}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 animate-pulse">
          <div className="w-8 h-4 bg-slate-800 rounded"></div>
          <div 
            className="h-4 bg-slate-800 rounded flex-1 relative overflow-hidden" 
            style={{ width: `${Math.max(40, 100 - i * 8)}%` }}
          >
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-700/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const SkeletonCircos: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full h-full flex items-center justify-center ${className}`}>
      <div className="relative w-96 h-96 rounded-full border-8 border-slate-800 animate-pulse flex items-center justify-center">
        <div className="w-80 h-80 rounded-full border-4 border-slate-800/50"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-slate-800/10 to-transparent rounded-full animate-spin-slow"></div>
      </div>
    </div>
  );
};

export const SkeletonAlignment: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full space-y-3 ${className}`}>
       <div className="h-10 bg-slate-800 rounded w-full mb-6"></div>
       {Array.from({ length: 10 }).map((_, i) => (
         <div key={i} className="flex items-center space-x-4 p-2 rounded bg-slate-800/20">
            <div className="w-60 h-8 bg-slate-800 rounded animate-pulse"></div>
            <div className="flex-1 h-6 bg-slate-800/50 rounded animate-pulse delay-100"></div>
         </div>
       ))}
    </div>
  );
};