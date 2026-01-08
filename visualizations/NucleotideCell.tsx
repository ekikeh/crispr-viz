import React from 'react';
import { MismatchHighlight } from './MismatchHighlight';

interface NucleotideCellProps {
  base: string;
  referenceBase: string;
  isHeader?: boolean;
}

export const NucleotideCell: React.FC<NucleotideCellProps> = ({
  base,
  referenceBase,
  isHeader = false
}) => {
  const normalizedBase = base.toUpperCase();
  const normalizedRef = referenceBase.toUpperCase();
  const isMatch = normalizedBase === normalizedRef;

  const getBaseColor = (b: string, faded: boolean) => {
    switch (b) {
      case 'A': return faded ? 'text-emerald-500/40' : 'text-emerald-400';
      case 'T': return faded ? 'text-red-500/40' : 'text-red-400';
      case 'C': return faded ? 'text-blue-500/40' : 'text-blue-400';
      case 'G': return faded ? 'text-amber-500/40' : 'text-amber-400';
      default: return 'text-slate-500';
    }
  };

  if (isHeader) {
    return (
      <div className={`
        w-6 h-8 sm:w-8 sm:h-10 flex items-center justify-center 
        font-mono font-bold text-lg border-b-2 border-slate-600
        ${getBaseColor(normalizedBase, false)}
      `}>
        {normalizedBase}
      </div>
    );
  }

  return (
    <div className="relative w-6 h-8 sm:w-8 sm:h-10 flex items-center justify-center font-mono text-sm sm:text-base border-r border-slate-800/50 last:border-r-0">
      {isMatch ? (
        <span className={`${getBaseColor(normalizedBase, true)}`}>
           •
        </span>
      ) : (
        <div className="relative w-full h-full">
            <MismatchHighlight>
                <div className="flex flex-col items-center justify-center leading-none">
                     <span>{normalizedBase}</span>
                </div>
            </MismatchHighlight>
        </div>
      )}
    </div>
  );
};