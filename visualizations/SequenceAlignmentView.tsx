import React from 'react';
import { OffTargetHit } from '../types';
import { AlignmentRow } from './AlignmentRow';
import { NucleotideCell } from './NucleotideCell';
import { AlignmentControls } from '../components/AlignmentControls';
import { useUIStore } from '../stores/uiStore';

interface SequenceAlignmentViewProps {
  guideSequence: string;
  hits: OffTargetHit[]; // Should be sorted hits
  selectedHitId: string | null;
  onHitSelect: (hit: OffTargetHit) => void;
}

export const SequenceAlignmentView: React.FC<SequenceAlignmentViewProps> = ({
  guideSequence,
  hits,
  selectedHitId,
  onHitSelect
}) => {
  const { filters, setFilters, sortBy, setSortBy } = useUIStore();

  return (
    <div className="flex flex-col h-full bg-slate-800/50 rounded-lg">
        
        <div className="p-4 border-b border-slate-700 bg-slate-800">
            <AlignmentControls 
                sortBy={sortBy}
                onSortChange={setSortBy}
                filterRegion={filters.region}
                onFilterRegionChange={(val) => setFilters({ region: val })}
                maxMismatches={filters.maxMismatches}
                onMaxMismatchesChange={(val) => setFilters({ maxMismatches: val })}
            />

            <div className="flex items-center pl-2 sm:pl-4 pr-4 py-2 bg-slate-900 rounded-t-lg border-b-2 border-science-500">
                 <div className="flex space-x-0.5 sm:space-x-0">
                     {guideSequence.split('').map((char, i) => (
                         <NucleotideCell 
                            key={`ref-${i}`} 
                            base={char} 
                            referenceBase={char} 
                            isHeader={true} 
                         />
                     ))}
                 </div>
                 <div className="ml-6 text-sm font-bold text-science-400 uppercase tracking-widest">
                     Guide Reference
                 </div>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {hits.length > 0 ? (
                hits.map(hit => (
                    <AlignmentRow
                        key={hit.id}
                        hit={hit}
                        referenceSequence={guideSequence}
                        isSelected={selectedHitId === hit.id}
                        onClick={onHitSelect}
                    />
                ))
            ) : (
                <div className="flex flex-col items-center justify-center h-40 text-slate-500">
                    <p>No off-targets match the current filters.</p>
                </div>
            )}
        </div>

        <div className="p-3 border-t border-slate-700 bg-slate-800 text-xs text-slate-500 flex justify-between">
            <span>Showing {hits.length} potential hits</span>
            <span>Sorted by: {sortBy.replace('_', ' ')}</span>
        </div>
    </div>
  );
};
