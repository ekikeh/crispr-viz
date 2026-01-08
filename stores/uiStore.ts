import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppTab = 'DESIGN' | 'ANALYSIS';
export type VisualizationMode = 'LINEAR' | 'CIRCOS';
export type SortOption = 'SCORE_DESC' | 'SCORE_ASC' | 'MISMATCH_ASC' | 'POSITION';

interface FilterState {
  chromosomes: string[];
  maxMismatches: number;
  geneContext: string[]; // 'Exon' | 'Intron' etc
  minScore: number;
  region: string; // 'ALL' etc
}

interface AccessibilityState {
    colorBlindMode: boolean;
    highContrast: boolean;
}

interface UIState {
  activeTab: AppTab;
  activeVisualization: VisualizationMode;
  selectedHitId: string | null;
  hoveredHitId: string | null;
  filters: FilterState;
  sortBy: SortOption;
  detailPanelOpen: boolean;
  accessibility: AccessibilityState;

  setActiveTab: (tab: AppTab) => void;
  setVisualization: (viz: VisualizationMode) => void;
  selectHit: (id: string | null) => void;
  hoverHit: (id: string | null) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  setSortBy: (sort: SortOption) => void;
  toggleDetailPanel: (isOpen: boolean) => void;
  setAccessibility: (settings: Partial<AccessibilityState>) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      activeTab: 'DESIGN',
      activeVisualization: 'LINEAR',
      selectedHitId: null,
      hoveredHitId: null,
      filters: {
        chromosomes: [],
        maxMismatches: 6,
        geneContext: [],
        minScore: 0,
        region: 'ALL'
      },
      sortBy: 'SCORE_DESC',
      detailPanelOpen: false,
      accessibility: {
          colorBlindMode: false,
          highContrast: false
      },

      setActiveTab: (tab) => set({ activeTab: tab }),
      setVisualization: (viz) => set({ activeVisualization: viz }),
      selectHit: (id) => set({ selectedHitId: id, detailPanelOpen: !!id }),
      hoverHit: (id) => set({ hoveredHitId: id }),
      setFilters: (newFilters) => set((state) => ({ 
        filters: { ...state.filters, ...newFilters } 
      })),
      setSortBy: (sort) => set({ sortBy: sort }),
      toggleDetailPanel: (isOpen) => set({ detailPanelOpen: isOpen }),
      setAccessibility: (settings) => set((state) => ({
          accessibility: { ...state.accessibility, ...settings }
      }))
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({ 
        activeTab: state.activeTab,
        filters: state.filters,
        activeVisualization: state.activeVisualization,
        accessibility: state.accessibility
      }),
    }
  )
);
