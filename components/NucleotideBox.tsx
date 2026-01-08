import React from 'react';

interface NucleotideBoxProps {
  base?: string;
  index: number;
  isActive?: boolean;
  onClick?: () => void;
}

export const NucleotideBox: React.FC<NucleotideBoxProps> = ({ 
  base, 
  index, 
  isActive = false,
  onClick 
}) => {
  
  const getBaseColor = (char?: string) => {
    switch (char) {
      case 'A': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]';
      case 'T': return 'bg-red-500/10 text-red-400 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.2)]';
      case 'C': return 'bg-blue-500/10 text-blue-400 border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.2)]';
      case 'G': return 'bg-amber-500/10 text-amber-400 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]';
      default: return 'bg-slate-800 border-slate-700 text-slate-500';
    }
  };

  const baseClass = getBaseColor(base);
  const activeClass = isActive 
    ? 'ring-2 ring-science-500 border-science-500 scale-110 z-10' 
    : 'hover:border-slate-500';

  return (
    <div 
      onClick={onClick}
      className={`
        relative w-8 h-10 sm:w-10 sm:h-12 flex items-center justify-center 
        rounded-md border text-lg sm:text-xl font-mono font-bold transition-all duration-150 cursor-text select-none
        ${baseClass} ${activeClass}
      `}
    >
      {base || (
        <span className="opacity-20 text-xs font-sans font-normal">{index + 1}</span>
      )}
      
      {/* Caret for active state */}
      {isActive && (
        <div className="absolute bottom-1 w-4 h-0.5 bg-science-400 animate-pulse rounded-full" />
      )}
    </div>
  );
};