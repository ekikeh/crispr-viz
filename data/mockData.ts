import { OffTargetHit } from '../types';

// Generate some semi-realistic looking off-target data scattered across chromosomes
const CHROMOSOMES = Array.from({ length: 22 }, (_, i) => `chr${i + 1}`).concat(['chrX', 'chrY']);

export const MOCK_HITS: OffTargetHit[] = [
  // High risk on target (self)
  { id: 'ot-001', chromosome: 'chr17', position: 7673700, sequence: 'CCATTGTTCAATATCGTCCG', mismatches: 0, cfdScore: 1.0, geneName: 'TP53', regionType: 'Exon' },
  
  // High risk off-targets
  { id: 'ot-002', chromosome: 'chr4', position: 15324500, sequence: 'CCATTGTTCAATATCGTCCT', mismatches: 1, cfdScore: 0.85, geneName: 'Unknown', regionType: 'Intron' },
  { id: 'ot-003', chromosome: 'chr9', position: 34521000, sequence: 'CCATTGTTCAATATCGTCCA', mismatches: 1, cfdScore: 0.72, geneName: 'CDKN2A', regionType: 'Promoter' },
  
  // Medium risk
  { id: 'ot-004', chromosome: 'chr12', position: 56100200, sequence: 'CCATTGTTCAATATCGTCGG', mismatches: 2, cfdScore: 0.45, geneName: 'KRAS', regionType: 'Intergenic' },
  { id: 'ot-005', chromosome: 'chr1', position: 11200300, sequence: 'CCATTGTTCAATATCGTCCC', mismatches: 2, cfdScore: 0.38, regionType: 'Intron' },
  
  // Create a cloud of low risk hits
  ...Array.from({ length: 150 }).map((_, i) => {
    const chrom = CHROMOSOMES[Math.floor(Math.random() * CHROMOSOMES.length)];
    const pos = Math.floor(Math.random() * 150000000);
    const mm = Math.floor(Math.random() * 3) + 2; // 2 to 4 mismatches
    return {
      id: `ot-rand-${i}`,
      chromosome: chrom,
      position: pos,
      sequence: 'CCATTGTTCAATATCGTCCG', // Simplified, just placeholder
      mismatches: mm,
      cfdScore: Math.random() * 0.2, // Low scores
      geneName: Math.random() > 0.8 ? `Gene-${i}` : undefined,
      regionType: ['Intron', 'Exon', 'Intergenic', 'Promoter'][Math.floor(Math.random() * 4)] as any
    };
  })
];