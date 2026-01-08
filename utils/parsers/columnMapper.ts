export interface ColumnMapping {
  chromosome: number;
  position: number;
  sequence: number;
  score: number;
  mismatches: number;
  gene: number;
  strand: number;
}

const COMMON_HEADERS = {
  chromosome: ['chr', 'chrom', 'chromosome', 'contig', 'seqname'],
  position: ['pos', 'position', 'start', 'location', 'coordinate'],
  sequence: ['seq', 'sequence', 'dna', 'off-target_sequence', 'site'],
  score: ['score', 'cfd', 'cfd_score', 'risk', 'specificity'],
  mismatches: ['mm', 'mismatches', 'mismatch_count', 'mutations'],
  gene: ['gene', 'symbol', 'locus', 'target', 'annotation'],
  strand: ['strand', 'dir', 'direction', 'sense']
};

export const detectColumns = (headers: string[]): ColumnMapping => {
  const normalize = (h: string) => h.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  const mapping: ColumnMapping = {
    chromosome: -1,
    position: -1,
    sequence: -1,
    score: -1,
    mismatches: -1,
    gene: -1,
    strand: -1
  };

  headers.forEach((header, index) => {
    const h = normalize(header);
    
    // Check against common variants
    for (const [key, variants] of Object.entries(COMMON_HEADERS)) {
      if ((mapping as any)[key] === -1 && variants.some(v => h.includes(v))) {
        (mapping as any)[key] = index;
      }
    }
  });

  return mapping;
};

export const normalizeChromosome = (chr: string | number): string => {
  const str = String(chr).toLowerCase();
  if (str.startsWith('chr')) return str;
  if (str === 'x' || str === 'y' || str === 'm') return `chr${str.toUpperCase()}`;
  return `chr${str}`;
};
