import React, { useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Share2, Eye, Flag, Copy } from 'lucide-react';
import { OffTargetHit, GuideRNA } from '../types';
import { DetailedSequenceView } from './DetailedSequenceView';
import { GeneContextDiagram } from './GeneContextDiagram';
import { LocationInfoCard } from './LocationInfoCard';
import { RiskAssessmentCard } from './RiskAssessmentCard';
import { handleKeyboardClick } from '../utils/accessibility';

interface OffTargetDetailPanelProps {
  hit: OffTargetHit;
  guideRNA: GuideRNA | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigatePrev: () => void;
  onNavigateNext: () => void;
}

export const OffTargetDetailPanel: React.FC<OffTargetDetailPanelProps> = ({
  hit,
  guideRNA,
  isOpen,
  onClose,
  onNavigatePrev,
  onNavigateNext
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Prevent body scroll and handle focus trap
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Focus the close button or first focusable element
      setTimeout(() => closeButtonRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 z-50 flex justify-end"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity opacity-100"
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        ref={panelRef}
        className="relative w-full max-w-2xl bg-slate-900 h-full border-l border-slate-700 shadow-2xl flex flex-col transform transition-transform duration-300 translate-x-0"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800 bg-slate-900 z-10">
          <div className="flex items-center space-x-4">
             <button 
                ref={closeButtonRef}
                onClick={onClose} 
                className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white focus:ring-2 focus:ring-science-500"
                aria-label="Close details"
             >
                <X size={20} />
             </button>
             <div>
                <h2 id="detail-title" className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2 flex-wrap">
                   {hit.geneName || 'Intergenic Region'}
                   {hit.geneName && hit.geneName !== 'Unknown' && (
                     <span className="text-xs bg-science-900 text-science-400 px-2 py-0.5 rounded border border-science-800">
                        Target Gene
                     </span>
                   )}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-mono">
                   {hit.id} • {hit.chromosome}:{hit.position.toLocaleString()}
                </p>
             </div>
          </div>

          <div className="flex items-center space-x-2">
             <button onClick={onNavigatePrev} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 border border-slate-700 transition-colors" aria-label="Previous Hit">
                <ChevronLeft size={20} />
             </button>
             <button onClick={onNavigateNext} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 border border-slate-700 transition-colors" aria-label="Next Hit">
                <ChevronRight size={20} />
             </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-6 sm:space-y-8">
          
          {/* Section: Hero Sequence */}
          <section>
             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center">
               <Eye size={16} className="mr-2" /> Sequence Alignment
             </h3>
             <DetailedSequenceView 
                guideSequence={guideRNA?.sequence || hit.sequence} 
                hit={hit}
             />
          </section>

          {/* Section: Risk & Context */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <RiskAssessmentCard hit={hit} />
             <LocationInfoCard hit={hit} />
          </div>

          {/* Section: Gene Diagram */}
          {hit.geneName && (
             <section className="bg-slate-800/50 rounded-xl p-6 border border-slate-800">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center">
                   <Flag size={16} className="mr-2" /> Genomic Context
                </h3>
                <GeneContextDiagram hit={hit} />
                <p className="mt-4 text-sm text-slate-400 leading-relaxed">
                   The cut site is located within <strong>{hit.regionType}</strong> of the <strong>{hit.geneName}</strong> gene. 
                   {hit.regionType === 'Exon' 
                      ? ' Cuts in exons can lead to frameshift mutations, potentially disrupting protein function.' 
                      : ' Non-coding regions generally tolerate indels better, but splice sites or regulatory elements could be affected.'}
                </p>
             </section>
          )}

          {/* Placeholder for future data */}
          {!hit.geneName && (
              <div className="p-8 border border-dashed border-slate-700 rounded-xl text-center text-slate-500">
                 <p>This off-target lies in an intergenic region with no known annotated genes nearby.</p>
              </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4">
           <button className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors text-sm">
              <Share2 size={16} />
              <span>Share Analysis</span>
           </button>
           
           <div className="flex w-full sm:w-auto space-x-3">
              <button className="flex-1 sm:flex-none px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium transition-colors flex items-center justify-center border border-slate-700">
                 <Copy size={16} className="mr-2" /> Copy Details
              </button>
              <a 
                 href={`https://genome.ucsc.edu/cgi-bin/hgTracks?db=hg38&position=${hit.chromosome}:${hit.position}`} 
                 target="_blank"
                 rel="noopener noreferrer"
                 className="flex-1 sm:flex-none px-4 py-2 bg-science-600 hover:bg-science-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-science-900/20 text-center"
              >
                 Open Genome Browser
              </a>
           </div>
        </div>

      </div>
    </div>
  );
};