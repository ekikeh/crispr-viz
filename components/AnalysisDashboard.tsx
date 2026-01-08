import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalysisData } from '../hooks/useAnalysisData';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { ChromosomeIdeogram } from '../visualizations/ChromosomeIdeogram';
import { CircosPlot } from '../visualizations/CircosPlot';
import { SequenceAlignmentView } from '../visualizations/SequenceAlignmentView';
import { OffTargetHit } from '../types';
import { OffTargetDetailPanel } from './OffTargetDetailPanel';
import { SummaryStatsBar } from './SummaryStatsBar';
import { ViewToggle } from './ViewToggle';
import { FilterControls } from './FilterControls';
import { ExportMenu } from './ExportMenu';
import { EmptyState } from './ui/EmptyState';
import { SkeletonIdeogram, SkeletonCircos } from './SkeletonLoaders';
import { AlertTriangle, FilterX, RefreshCcw } from 'lucide-react';

export const AnalysisDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { guide, offTargets, ui, processed } = useAnalysisData();
  const { 
    activeVisualization, setVisualization, 
    filters, setFilters, 
    selectedHitId, 
    detailPanelOpen 
  } = ui;
  
  const selectedHit = useMemo(() => 
    offTargets.hits.find(h => h.id === selectedHitId) || null,
  [offTargets.hits, selectedHitId]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
  const [isChartLoading, setIsChartLoading] = useState(false);

  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');

  // Resize Observer
  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Simulate loading when switching views for smoother UX
  useEffect(() => {
    setIsChartLoading(true);
    const timer = setTimeout(() => setIsChartLoading(false), 300);
    return () => clearTimeout(timer);
  }, [activeVisualization]);

  const onTargetLocation = useMemo(() => {
      const target = offTargets.hits.find(h => h.mismatches === 0);
      if (target) return { chromosome: target.chromosome, position: target.position };
      return undefined;
  }, [offTargets.hits]);

  const handleHitSelect = (hit: OffTargetHit) => {
    navigate(`/analysis/${hit.id}`);
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
      if (!selectedHit || processed.filteredHits.length === 0) return;
      const currentIndex = processed.filteredHits.findIndex(h => h.id === selectedHit.id);
      if (currentIndex === -1) return;

      let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
      if (newIndex >= processed.filteredHits.length) newIndex = 0;
      if (newIndex < 0) newIndex = processed.filteredHits.length - 1;

      navigate(`/analysis/${processed.filteredHits[newIndex].id}`);
  };

  const handleCloseDetail = () => {
    navigate('/analysis');
  };

  const handleResetFilters = () => {
      setFilters({ region: 'ALL', minScore: 0 });
  };

  if (!offTargets.hits.length) return null;

  return (
    <div className="flex flex-col h-full space-y-4 max-w-[1920px] mx-auto">
      
      {/* Stats Header */}
      <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-4">
          <SummaryStatsBar hits={processed.filteredHits} currentGuideName={guide.targetGene || 'Target'} />
          <div className="ml-auto no-print">
              <ExportMenu 
                  hits={processed.filteredHits} 
                  guideInfo={{ targetGene: guide.targetGene || 'Unknown', sequence: guide.sequence }}
                  visualizationId="main-visualization-container"
              />
          </div>
      </div>

      {/* Main Visualization Row */}
      <div className="flex-1 min-h-[500px] flex flex-col lg:flex-row gap-6">
         
         {/* Left Column: Visualization */}
         <div className="lg:w-3/5 bg-slate-800/50 rounded-xl border border-slate-700 p-4 flex flex-col relative transition-all duration-300 print:w-full print:border-none">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 z-10 no-export gap-3">
               <ViewToggle viewMode={activeVisualization} onChange={setVisualization} />
               <FilterControls 
                  regionFilter={filters.region} 
                  onRegionChange={(val) => setFilters({ region: val })}
                  minScore={filters.minScore} 
                  onMinScoreChange={(val) => setFilters({ minScore: val })}
               />
            </div>
            
            <div 
                id="main-visualization-container" 
                ref={containerRef} 
                className="flex-1 w-full min-h-[400px] h-full relative overflow-hidden bg-slate-900 rounded-lg border border-slate-800 print:bg-white print:border-none"
                role="figure"
                aria-label={`${activeVisualization === 'LINEAR' ? 'Chromosome Ideogram' : 'Circos Plot'} showing off-target hits`}
            >
                {isChartLoading ? (
                    activeVisualization === 'LINEAR' ? <SkeletonIdeogram /> : <SkeletonCircos />
                ) : processed.filteredHits.length === 0 ? (
                    <EmptyState 
                        icon={FilterX}
                        title="No Off-Targets Found"
                        description="Try adjusting your filters to see more results."
                        action={
                            <button 
                                onClick={handleResetFilters}
                                className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-science-400 transition-colors"
                            >
                                <RefreshCcw size={14} />
                                <span>Reset Filters</span>
                            </button>
                        }
                        className="h-full border-none bg-transparent"
                    />
                ) : activeVisualization === 'LINEAR' ? (
                     <ChromosomeIdeogram 
                        data={processed.filteredHits} 
                        onHitClick={handleHitSelect}
                        width={containerSize.width}
                        height={containerSize.height}
                     />
                 ) : (
                     <CircosPlot
                        data={processed.filteredHits}
                        currentGuide={{
                            id: 'current',
                            name: guide.targetGene || 'Guide',
                            sequence: guide.sequence,
                            pam: guide.pamSequence,
                            genomeBuild: 'hg38',
                            targetGene: guide.targetGene || 'Unknown'
                        }}
                        onHitClick={handleHitSelect}
                        width={containerSize.width}
                        height={containerSize.height}
                        onTargetLocation={onTargetLocation}
                     />
                 )}
            </div>
         </div>

         {/* Right Column: List / Alignment */}
         <div className="lg:w-2/5 flex flex-col bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden print-break-before">
             <div className="p-4 border-b border-slate-700 bg-slate-900/50">
                <h3 className="font-semibold text-slate-200 flex items-center">
                    <AlertTriangle size={16} className="mr-2 text-science-500" />
                    Off-Target Table & Alignment
                </h3>
             </div>
             <div className="flex-1 relative overflow-hidden">
                 <div className="absolute inset-0">
                    <SequenceAlignmentView 
                       guideSequence={guide.sequence}
                       hits={processed.sortedHits} 
                       selectedHitId={selectedHitId}
                       onHitSelect={handleHitSelect}
                     />
                 </div>
             </div>
         </div>
      </div>

      {/* Details Drawer */}
      {selectedHit && (
        <OffTargetDetailPanel 
          hit={selectedHit}
          guideRNA={{
              id: 'current',
              name: guide.targetGene || 'Guide',
              sequence: guide.sequence,
              pam: guide.pamSequence,
              genomeBuild: 'hg38',
              targetGene: guide.targetGene || 'Unknown'
          }}
          isOpen={detailPanelOpen}
          onClose={handleCloseDetail}
          onNavigateNext={() => handleNavigate('next')}
          onNavigatePrev={() => handleNavigate('prev')}
        />
      )}
    </div>
  );
};