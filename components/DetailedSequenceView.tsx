import React from 'react';
import { OffTargetHit } from '../types';

interface DetailedSequenceViewProps {
  guideSequence: string;
  hit: OffTargetHit;
}

export const DetailedSequenceView: React.FC<DetailedSequenceViewProps> = ({ guideSequence, hit }) => {
  const guide = guideSequence.toUpperCase();
  const target = hit.sequence.toUpperCase();
  
  // Create arrays for rendering
  const guideArr = guide.padEnd(20, '-').split('');
  const targetArr = target.padEnd(20, '-').split('');
  
  return (
    <div className="bg-slate-950 rounded-xl p-6 border border-slate-800 shadow-inner overflow-x-auto">
      <div className="min-w-[500px]">
        {/* Labels */}
        <div className="flex text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest pl-20">
          <span>5'</span>
          <span className="flex-1 text-center">Protospacer Sequence (20nt)</span>
          <span>3'</span>
          <span className="ml-4 w-12 text-center">PAM</span>
        </div>

        {/* Guide Sequence */}
        <div className="flex items-center mb-1">
          <span className="w-20 text-xs text-science-400 font-bold uppercase tracking-wider text-right pr-4">Guide</span>
          <div className="flex space-x-1">
            {guideArr.map((char, i) => (
              <div key={i} className="w-8 h-10 bg-slate-900 rounded border border-slate-800 flex items-center justify-center font-mono font-bold text-slate-400">
                {char}
              </div>
            ))}
          </div>
          <div className="ml-4 w-12 h-10 flex items-center justify-center font-mono font-bold text-slate-600 border border-transparent">
             NGG
          </div>
        </div>

        {/* Mismatch Indicators */}
        <div className="flex items-center mb-1 h-4">
          <span className="w-20"></span>
          <div className="flex space-x-1">
             {targetArr.map((char, i) => {
               const match = char === guideArr[i];
               return (
                 <div key={i} className="w-8 flex justify-center">
                   {!match && <div className="w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_5px_rgba(239,68,68,0.8)]"></div>}
                   {match && <div className="w-0.5 h-2 bg-slate-800"></div>}
                 </div>
               );
             })}
          </div>
        </div>

        {/* Target Sequence */}
        <div className="flex items-center">
          <span className="w-20 text-xs text-slate-300 font-bold uppercase tracking-wider text-right pr-4">Target</span>
          <div className="flex space-x-1">
            {targetArr.map((char, i) => {
              const match = char === guideArr[i];
              return (
                <div 
                  key={i} 
                  className={`
                    w-8 h-10 rounded border flex items-center justify-center font-mono font-bold transition-all
                    ${match 
                      ? 'bg-slate-900 border-slate-700 text-slate-200' 
                      : 'bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)] scale-105 z-10'
                    }
                  `}
                >
                  {char}
                </div>
              );
            })}
          </div>
          {/* Mock PAM for display - assumes NGG context or matches guide */}
          <div className="ml-4 w-12 h-10 bg-slate-900 rounded border border-science-900/50 flex items-center justify-center font-mono font-bold text-science-500">
             NGG
          </div>
        </div>
      </div>
    </div>
  );
};