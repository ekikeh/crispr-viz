import { OffTargetHit } from '../../types';
import { normalizeChromosome } from './columnMapper';

export const parseBed = (content: string, guideSequence?: string): OffTargetHit[] => {
  const lines = content.trim().split('\n');
  const hits: OffTargetHit[] = [];

  // BED Format: chrom, chromStart, chromEnd, name, score, strand, ...
  // BED is 0-based, standardized types use 1-based often, but we will use the start position
  
  lines.forEach((line, index) => {
    if (line.startsWith('#') || line.startsWith('track') || line.startsWith('browser') || !line.trim()) return;

    const cols = line.split(/[\t\s]+/);
    if (cols.length < 3) return;

    const chromosome = normalizeChromosome(cols[0]);
    const position = parseInt(cols[1], 10);
    // const end = parseInt(cols[2], 10);
    const name = cols[3] || `hit-${index}`;
    const scoreVal = parseFloat(cols[4]);
    const strand = cols[5] === '-' ? '-' : '+';

    // Normalize score (BED score is typically 0-1000, we want 0-1 for CFD)
    let cfdScore = 0;
    if (!isNaN(scoreVal)) {
        cfdScore = scoreVal > 1 ? scoreVal / 1000 : scoreVal; 
    }

    hits.push({
      id: `bed-${index}`,
      chromosome,
      position,
      sequence: guideSequence || 'N'.repeat(20), // Placeholder if BED doesn't have seq
      mismatches: 0, // Cannot determine from standard BED
      cfdScore, 
      geneName: name !== '.' ? name : undefined,
      regionType: 'Unknown',
      strand
    });
  });

  return hits;
};
