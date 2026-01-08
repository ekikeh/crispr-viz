
// Domain Enums
export enum NucleotideBase {
  A = 'A',
  T = 'T',
  C = 'C',
  G = 'G',
  N = 'N'
}

export enum Strand {
  POSITIVE = '+',
  NEGATIVE = '-'
}

// Validation Types
export type DNASequence = string;
export type Chromosome = string;

// Mismatch detail structure
export interface MismatchDetail {
  position: number;
  base: string;
  referenceBase?: string;
}

export interface GuideRNA {
  id: string;
  name: string;
  sequence: string; // 20nt
  pam: string; // NGG
  genomeBuild: 'hg38' | 'mm10';
  targetGene: string;
  
  // New fields
  pamSequence?: string;
}

export interface OffTargetHit {
  id: string;
  chromosome: string;
  position: number;
  sequence: string;
  mismatches: number; // Legacy count (kept for backward compatibility)
  cfdScore: number; // Cutting Frequency Determination score (0-1)
  geneName?: string;
  locusTag?: string;
  regionType: 'Exon' | 'Intron' | 'Intergenic' | 'Promoter' | 'Unknown';

  // New fields
  strand?: Strand | '+' | '-';
  mismatchCount?: number; // Explicit count field
  score?: number; // 0-100 risk score
  geneContext?: string; // e.g., Exon, Intron
  mismatchDetails?: MismatchDetail[]; // Array of mismatch positions and bases
}

export interface AnalysisResult {
  guideId: string;
  timestamp: number;
  hits: OffTargetHit[];
  status: 'pending' | 'completed' | 'failed';
}

export interface GeminiInsight {
  guideId: string;
  targetGene: string;
  safetySummary: string;
  offTargetRisks: {
    geneName: string;
    riskAssessment: string;
  }[];
}

// New Interfaces

export interface SequencingResult {
  rawData: string;
  parsedHits: OffTargetHit[];
  metadata: {
    sampleId?: string;
    date?: string;
    experimenter?: string;
    [key: string]: any;
  };
}

export interface ChromosomeData {
  id: string;
  name: string;
  length: number;
  centromerePosition?: number;
}

export interface Exon {
  start: number;
  end: number;
  exonNumber: number;
  id?: string;
}

export interface GeneAnnotation {
  geneId: string;
  geneName: string;
  chromosome: string;
  start: number;
  end: number;
  exons: Exon[];
  strand: Strand | '+' | '-';
  description?: string;
}

export interface AlignmentView {
  referenceSequence: string;
  offTargetSequence: string;
  mismatches: {
    position: number;
    reference: string;
    actual: string;
  }[];
}

export interface GeneContextResult {
  context: 'Exon' | 'Intron' | 'UTR' | 'Promoter' | 'Intergenic';
  gene?: GeneAnnotation;
  exonNumber?: number;
  distanceToGene?: number; // if intergenic
}

// Type Guards and Validation Utilities

export const isValidDNA = (seq: string): seq is DNASequence => {
  return /^[ATCGN]+$/i.test(seq);
};

export const isGuideRNA = (obj: any): obj is GuideRNA => {
  return (
    obj &&
    typeof obj.id === 'string' &&
    typeof obj.sequence === 'string' &&
    obj.sequence.length === 20
  );
};

export const isOffTargetHit = (obj: any): obj is OffTargetHit => {
  return obj && typeof obj.chromosome === 'string' && typeof obj.position === 'number';
};
