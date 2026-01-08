import React from 'react';
import { ArrowUpNarrowWide, Filter, SlidersHorizontal } from 'lucide-react';

export type SortOption = 'SCORE_DESC' | 'SCORE_ASC' | 'MISMATCH_ASC' | 'POSITION';

interface AlignmentControlsProps {
  sortBy: SortOption;
  onSortChange: (opt: SortOption) => void;
  filterRegion: string;
  onFilterRegionChange: (region: string) => void;
  maxMismatches: number;
  onMaxMismatchesChange: (num: number) => void;
}

export const AlignmentControls: React.FC<AlignmentControlsProps> = ({
  sortBy,
  onSortChange,
  filterRegion,
  onFilterRegionChange,
  maxMismatches,
  onMaxMismatchesChange
}) => {
  return (
    <div className="flex flex-wrap items-center gap-4 bg-slate-900 p-3 rounded-lg border border-slate-700 mb-4">
      <div className="flex items-center space-x-2 border-r border-slate-700 pr-4">
          <ArrowUpNarrowWide size={16} className="text-slate-400" />
          <span className="text-xs font-semibold text-slate-500 uppercase">Sort</span>
          <select 
            value={sortBy} 
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded px-2 py-1.5 outline-none focus:border-science-500"
          >
            <option value="SCORE_DESC">High Risk First</option>
            <option value="SCORE_ASC">Low Risk First</option>
            <option value="MISMATCH_ASC">Fewest Mismatches</option>
            <option value="POSITION">Genomic Position</option>
          </select>
      </div>

      <div className="flex items-center space-x-2">
          <Filter size={16} className="text-slate-400" />
          <span className="text-xs font-semibold text-slate-500 uppercase">Region</span>
          <select 
            value={filterRegion} 
            onChange={(e) => onFilterRegionChange(e.target.value)}
            className="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded px-2 py-1.5 outline-none focus:border-science-500"
          >
            <option value="ALL">All Regions</option>
            <option value="Exon">Exons Only</option>
            <option value="Intron">Introns Only</option>
            <option value="Promoter">Promoters</option>
            <option value="Intergenic">Intergenic</option>
          </select>
      </div>

      <div className="flex items-center space-x-3 ml-auto">
          <SlidersHorizontal size={16} className="text-slate-400" />
          <div className="flex flex-col">
              <div className="flex justify-between text-[10px] text-slate-500 uppercase font-semibold mb-1">
                  <span>Max Mismatches</span>
                  <span className="text-science-400">{maxMismatches}</span>
              </div>
              <input 
                type="range" 
                min="1" max="6" step="1" 
                value={maxMismatches}
                onChange={(e) => onMaxMismatchesChange(parseInt(e.target.value))}
                className="w-32 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-science-500"
              />
          </div>
      </div>
    </div>
  );
};