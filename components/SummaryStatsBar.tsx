import React from 'react';
import { OffTargetHit } from '../types';
import { AlertTriangle, MapPin, List, ShieldAlert } from 'lucide-react';

interface SummaryStatsBarProps {
  hits: OffTargetHit[];
  currentGuideName?: string;
}

export const SummaryStatsBar: React.FC<SummaryStatsBarProps> = ({ hits, currentGuideName }) => {
  const totalHits = hits.length;
  const highRisk = hits.filter(h => h.cfdScore > 0.8 || h.regionType === 'Exon').length;
  const chromosomes = new Set(hits.map(h => h.chromosome)).size;
  
  // Find self-target (perfect match)
  const onTarget = hits.find(h => h.mismatches === 0);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex items-center justify-between">
        <div>
          <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Total Off-Targets</p>
          <p className="text-2xl font-bold text-slate-100">{totalHits}</p>
        </div>
        <div className="bg-slate-700 p-2 rounded-full text-slate-400">
           <List size={20} />
        </div>
      </div>

      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex items-center justify-between">
        <div>
          <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">High Risk Sites</p>
          <p className={`text-2xl font-bold ${highRisk > 0 ? 'text-red-400' : 'text-emerald-400'}`}>{highRisk}</p>
        </div>
        <div className={`p-2 rounded-full ${highRisk > 0 ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
           <ShieldAlert size={20} />
        </div>
      </div>

      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex items-center justify-between">
        <div>
          <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Chromosomes</p>
          <p className="text-2xl font-bold text-slate-100">{chromosomes}</p>
        </div>
        <div className="bg-slate-700 p-2 rounded-full text-slate-400">
           <MapPin size={20} />
        </div>
      </div>

      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex flex-col justify-center">
        <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">On-Target Check</p>
        {onTarget ? (
           <div className="flex items-center text-emerald-400 text-sm font-medium">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
              Found at {onTarget.chromosome}:{onTarget.position.toLocaleString()}
           </div>
        ) : (
           <div className="flex items-center text-amber-400 text-sm font-medium">
              <AlertTriangle size={14} className="mr-2" />
              Not found in this dataset
           </div>
        )}
      </div>
    </div>
  );
};