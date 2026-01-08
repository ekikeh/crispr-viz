import { useGuideRNAStore } from '../stores/guideRNAStore';
import { useOffTargetStore } from '../stores/offTargetStore';
import { useUIStore } from '../stores/uiStore';
import { useFilteredHits } from './useFilteredHits';

export const useAnalysisData = () => {
  const guide = useGuideRNAStore();
  const offTargets = useOffTargetStore();
  const ui = useUIStore();
  const processed = useFilteredHits();

  const riskSummary = {
    high: processed.hits.filter(h => h.cfdScore > 0.8 || h.regionType === 'Exon').length,
    medium: processed.hits.filter(h => h.cfdScore > 0.4 && h.cfdScore <= 0.8).length,
    low: processed.hits.filter(h => h.cfdScore <= 0.4).length
  };

  return {
    guide,
    offTargets,
    ui,
    processed,
    riskSummary,
    hasResults: offTargets.hits.length > 0
  };
};
