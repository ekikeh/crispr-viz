import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  label?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, label, className = '' }) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-xs font-medium text-slate-400">{label}</span>
          <span className="text-xs font-medium text-science-400">{Math.round(progress)}%</span>
        </div>
      )}
      <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-science-500 h-2.5 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
        >
          {/* Animated shimmer effect */}
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
        </div>
      </div>
    </div>
  );
};