import React from 'react';
import { OffTargetHit } from '../types';
import { NucleotideCell } from './NucleotideCell';
import { AlertTriangle, Disc, Square, Diamond, AlertCircle } from 'lucide-react';

interface AlignmentRowProps {
  hit: OffTargetHit;
  referenceSequence: string;
  isSelected: boolean;
  onClick: (hit: OffTargetHit) => void;
}

export const AlignmentRow: React.FC<AlignmentRowProps> = ({
  hit,
  referenceSequence,
  isSelected,
  onClick
}) => {
  const getRegionIcon = (region: string) => {
    switch (region) {
      case 'Exon': return <Diamond size={14} className="text-red-400 fill-red-400/20" />;
      case 'Intron': return <Square size={14} className="text-blue-400 fill-blue-400/20" />;
      case 'Intergenic': return <Disc size={14} className="text-emerald-400 fill-emerald-400/20" />;
      case 'Promoter': return <AlertTriangle size={14} className="text-amber-400 fill-amber-400/20" />;
      default: return <AlertCircle size={14} className="text-slate-500" />;
    }
  };

  const displaySeq = hit.sequence.padEnd(20, '-').slice(0, 20);
  const refSeq = referenceSequence.padEnd(20, '-').slice(0, 20);

  return (
    <div 
      onClick={() => onClick(hit)}
      className={`
        group flex items-center py-2 px-2 sm:px-4 rounded-lg cursor-pointer border transition-all duration-200
        ${isSelected 
          ? 'bg-science-900/30 border-science-500 shadow-[0_0_15px_rgba(14,165,233,0.15)]' 
          : 'bg-slate-900 border-transparent hover:bg-slate-800 hover:border-slate-700'
        }
      `}
    >
      <div className="flex bg-slate-950/50 rounded p-1 border border-slate-800/50">
        {displaySeq.split('').map((char, index) => (
          <NucleotideCell
            key={index}
            base={char}
            referenceBase={refSeq[index]}
            isHeader={false}
          />
        ))}
      </div>

      <div className="flex-1 ml-6 flex items-center justify-between min-w-0">
        <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
                <span className={`font-bold text-sm ${hit.geneName ? 'text-slate-200' : 'text-slate-500 italic'}`}>
                    {hit.geneName || 'Intergenic'}
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                    {hit.mismatches} MM
                </span>
                {hit.strand && (
                   <span className="text-xs text-slate-600 font-mono font-bold">{hit.strand}</span>
                )}
            </div>
            <div className="flex items-center space-x-4 text-xs text-slate-500">
                 <div className="flex items-center space-x-1" title={`Region: ${hit.regionType}`}>
                     {getRegionIcon(hit.regionType)}
                     <span>{hit.regionType}</span>
                 </div>
                 <div className="font-mono">
                     {hit.chromosome}:{hit.position.toLocaleString()}
                 </div>
            </div>
        </div>

        <div className="flex flex-col items-end w-24">
            <div className="text-xs font-mono mb-1 flex items-center space-x-1">
                <span className="text-slate-500">CFD</span>
                <span className={`${hit.cfdScore > 0.8 ? 'text-red-400 font-bold' : 'text-slate-300'}`}>
                    {hit.cfdScore.toFixed(2)}
                </span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                    className={`h-full rounded-full ${
                        hit.cfdScore > 0.8 ? 'bg-red-500' : 
                        hit.cfdScore > 0.4 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${hit.cfdScore * 100}%` }}
                />
            </div>
        </div>
      </div>
    </div>
  );
};