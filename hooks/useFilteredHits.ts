import { useMemo } from 'react';
import { useOffTargetStore } from '../stores/offTargetStore';
import { useUIStore } from '../stores/uiStore';

export const useFilteredHits = () => {
  const hits = useOffTargetStore(state => state.hits);
  const { filters, sortBy } = useUIStore();

  const filteredHits = useMemo(() => {
    return hits.filter(hit => {
       // Score filter
       if (hit.cfdScore < filters.minScore) return false;
       
       // Mismatch filter
       if (hit.mismatches > filters.maxMismatches) return false;

       // Region filter
       if (filters.region !== 'ALL' && hit.regionType.toUpperCase() !== filters.region.toUpperCase()) return false;
       
       return true;
    });
  }, [hits, filters.minScore, filters.maxMismatches, filters.region]);

  const sortedHits = useMemo(() => {
     return [...filteredHits].sort((a, b) => {
        switch (sortBy) {
            case 'SCORE_DESC': return b.cfdScore - a.cfdScore;
            case 'SCORE_ASC': return a.cfdScore - b.cfdScore;
            case 'MISMATCH_ASC': return a.mismatches - b.mismatches;
            case 'POSITION': 
               return a.chromosome.localeCompare(b.chromosome, undefined, {numeric: true}) || a.position - b.position;
            default: return 0;
        }
     });
  }, [filteredHits, sortBy]);

  return { hits, filteredHits, sortedHits };
};
