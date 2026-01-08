import { create } from 'zustand';
import { OffTargetHit } from '../types';
import { MOCK_HITS } from '../data/mockData';

interface ParseStats {
  total: number;
  parsed: number;
  errors: number;
}

interface OffTargetState {
  hits: OffTargetHit[];
  isLoading: boolean;
  error: string | null;
  uploadedFileName: string | null;
  parseStats: ParseStats | null;

  setHits: (hits: OffTargetHit[]) => void;
  addHits: (hits: OffTargetHit[]) => void;
  clearHits: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  runMockAnalysis: () => Promise<void>;
}

export const useOffTargetStore = create<OffTargetState>((set) => ({
  hits: [],
  isLoading: false,
  error: null,
  uploadedFileName: null,
  parseStats: null,

  setHits: (hits) => set({ hits, error: null }),
  addHits: (newHits) => set((state) => ({ hits: [...state.hits, ...newHits] })),
  clearHits: () => set({ hits: [], parseStats: null, uploadedFileName: null, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  runMockAnalysis: async () => {
    set({ isLoading: true, error: null });
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate slight variations in mock data for realism
    const hits = MOCK_HITS.map(h => ({
       ...h,
       cfdScore: Math.max(0, Math.min(1, h.cfdScore + (Math.random() * 0.1 - 0.05)))
    }));
    
    set({ hits, isLoading: false });
  }
}));
