import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { validateGuideLength } from '../utils/validation';

interface GuideRNAState {
  sequence: string;
  isValid: boolean;
  pamSequence: string;
  targetGene: string | null;
  
  setSequence: (seq: string) => void;
  setPam: (pam: string) => void;
  setTargetGene: (gene: string) => void;
  reset: () => void;
}

export const useGuideRNAStore = create<GuideRNAState>()(
  persist(
    (set) => ({
      sequence: '',
      isValid: false,
      pamSequence: 'NGG',
      targetGene: null,

      setSequence: (seq) => set({ 
        sequence: seq, 
        isValid: validateGuideLength(seq) 
      }),
      setPam: (pam) => set({ pamSequence: pam }),
      setTargetGene: (gene) => set({ targetGene: gene }),
      reset: () => set({ sequence: '', isValid: false, pamSequence: 'NGG', targetGene: null })
    }),
    {
      name: 'guide-rna-storage',
    }
  )
);
