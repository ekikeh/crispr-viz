import React from 'react';
import { Filter } from 'lucide-react';

interface FilterControlsProps {
  regionFilter: string;
  onRegionChange: (val: string) => void;
  minScore: number;
  onMinScoreChange: (val: number) => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({ 
  regionFilter, 
  onRegionChange,
  minScore,
  onMinScoreChange 
}) => {
  return (
    <div className="flex items-center space-x-4">
      {/* Region Filter */}
      <div className="flex items-center space-x-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700">
          <Filter size={14} className="text-slate-500" />
          <select 
             value={regionFilter} 
             onChange={e => onRegionChange(e.target.value)}
             className="bg-transparent text-xs text-slate-300 outline-none cursor-pointer border-none focus:ring-0 py-0"
          >
              <option value="ALL">All Regions</option>
              <option value="EXON">Exons Only</option>
              <option value="INTRON">Introns Only</option>
              <option value="INTERGENIC">Intergenic</option>
          </select>
      </div>
      
      {/* Score Filter */}
      <div className="flex items-center space-x-3 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700">
          <span className="text-xs text-slate-500 font-medium">Min Risk Score:</span>
          <input 
             type="range" 
             min="0" max="1" step="0.1" 
             value={minScore} 
             onChange={e => onMinScoreChange(parseFloat(e.target.value))}
             className="w-24 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-science-500"
          />
          <span className="text-xs text-science-400 w-6 font-mono font-bold">{minScore}</span>
      </div>
    </div>
  );
};