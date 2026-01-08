import { create } from 'zustand';
import { GuideRNA, AnalysisResult, OffTargetHit } from './types';
import { MOCK_HITS } from './data/mockData';

interface AppState {
  currentGuide: GuideRNA | null;
  analysisResults: AnalysisResult | null;
  isAnalyzing: boolean;
  
  // Actions
  setGuide: (guide: GuideRNA) => void;
  runAnalysis: () => Promise<void>;
  updateGuideSequence: (seq: string) => void;
  importResults: (hits: OffTargetHit[]) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentGuide: {
    id: 'guide-001',
    name: 'TP53-Exon2',
    sequence: 'CCATTGTTCAATATCGTCCG', // Mock TP53 guide
    pam: 'NGG',
    genomeBuild: 'hg38',
    targetGene: 'TP53'
  },
  analysisResults: null,
  isAnalyzing: false,

  setGuide: (guide) => set({ currentGuide: guide }),
  
  updateGuideSequence: (seq) => set((state) => ({
    currentGuide: state.currentGuide ? { ...state.currentGuide, sequence: seq } : null
  })),

  runAnalysis: async () => {
    set({ isAnalyzing: true });
    
    // Simulate API latency for calculation
    await new Promise(resolve => setTimeout(resolve, 1500));

    const guide = get().currentGuide;
    if (!guide) return;

    // In a real app, this would call a backend (Cas-OFFinder, etc.)
    // Here we load mock data but randomize scores slightly to simulate live calculation
    const hits: OffTargetHit[] = MOCK_HITS.map(hit => ({
      ...hit,
      cfdScore: Math.max(0, Math.min(1, hit.cfdScore + (Math.random() * 0.1 - 0.05)))
    }));

    set({
      isAnalyzing: false,
      analysisResults: {
        guideId: guide.id,
        timestamp: Date.now(),
        hits: hits,
        status: 'completed'
      }
    });
  },

  importResults: (hits: OffTargetHit[]) => {
      const guide = get().currentGuide;
      set({
          analysisResults: {
              guideId: guide?.id || 'imported-guide',
              timestamp: Date.now(),
              hits: hits,
              status: 'completed'
          }
      });
  }
}));
