import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOffTargetStore } from '../stores/offTargetStore';
import { useUIStore } from '../stores/uiStore';
import { AnalysisDashboard } from '../components/AnalysisDashboard';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ArrowLeft, Microscope } from 'lucide-react';

interface AnalysisPageProps {
  onBack: () => void;
}

export const AnalysisPage: React.FC<AnalysisPageProps> = ({ onBack }) => {
  const { hits, isLoading } = useOffTargetStore();
  const { hitId } = useParams();
  const { selectHit, toggleDetailPanel } = useUIStore();
  const navigate = useNavigate();

  // Sync URL param with store state
  useEffect(() => {
    if (hitId) {
      const exists = hits.some(h => h.id === hitId);
      if (exists) {
        selectHit(hitId);
        toggleDetailPanel(true);
      } else {
        navigate('/analysis', { replace: true });
      }
    } else {
      selectHit(null);
      toggleDetailPanel(false);
    }
  }, [hitId, hits, selectHit, toggleDetailPanel, navigate]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-slate-400 font-medium animate-pulse">Initializing Visualization Engine...</p>
      </div>
    );
  }

  if (hits.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <EmptyState 
            icon={Microscope}
            title="No Analysis Data"
            description="You haven't run an analysis or uploaded any data yet. Start by designing a guide RNA or uploading predictions."
            action={
                <button 
                  onClick={onBack}
                  className="flex items-center px-6 py-3 bg-science-600 hover:bg-science-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-science-900/20"
                >
                  <ArrowLeft size={18} className="mr-2" />
                  Return to Design
                </button>
            }
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
       <div className="flex-1 overflow-auto custom-scrollbar">
           <AnalysisDashboard />
       </div>
    </div>
  );
};