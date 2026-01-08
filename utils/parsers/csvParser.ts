import { parse } from 'papaparse';
import { OffTargetHit } from '../../types';
import { detectColumns, normalizeChromosome } from './columnMapper';

interface ParseResult {
  hits: OffTargetHit[];
  errors: string[];
}

export const parseCsv = async (file: File, guideSequence?: string): Promise<ParseResult> => {
  return new Promise((resolve, reject) => {
    parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        const hits: OffTargetHit[] = [];
        const errors: string[] = [];
        const headers = results.meta.fields || [];
        
        // Use column detection if headers exist, otherwise assume standard order or fail
        const map = detectColumns(headers);

        // Required columns validation (soft validation)
        if (map.chromosome === -1 || map.position === -1) {
             // Fallback: Check if we have at least 3 columns to try index-based mapping
             // Not implemented for safety, returning error
             resolve({ hits: [], errors: ["Could not identify Chromosome or Position columns. Please check headers."] });
             return;
        }

        results.data.forEach((row: any, index: number) => {
          try {
            // Helper to get value by mapped index or header name
            const getVal = (keyIndex: number): any => {
                if (keyIndex === -1) return undefined;
                return row[headers[keyIndex]];
            };

            const chrom = normalizeChromosome(getVal(map.chromosome));
            const pos = parseInt(getVal(map.position), 10);
            const seq = getVal(map.sequence) || (guideSequence ? guideSequence : 'N'.repeat(20));
            
            // Score handling
            let score = parseFloat(getVal(map.score));
            if (isNaN(score)) score = 0;
            // Normalize score if it looks like 0-100 to 0-1
            if (score > 1) score = score / 100;

            // Mismatches
            let mm = parseInt(getVal(map.mismatches), 10);
            if (isNaN(mm)) {
                 // Calculate simple mismatch count if seq matches length
                 if (guideSequence && seq.length === guideSequence.length) {
                     mm = 0;
                     for(let i=0; i<seq.length; i++) {
                         if (seq[i].toUpperCase() !== guideSequence[i].toUpperCase()) mm++;
                     }
                 } else {
                     mm = 0;
                 }
            }

            if (isNaN(pos)) throw new Error("Invalid position");

            hits.push({
              id: `row-${index}`,
              chromosome: chrom,
              position: pos,
              sequence: seq.toUpperCase(),
              mismatches: mm,
              cfdScore: score,
              geneName: getVal(map.gene) || undefined,
              regionType: 'Unknown', // This would typically require a gene annotation DB
              strand: getVal(map.strand) === '-' ? '-' : '+'
            });

          } catch (e) {
            errors.push(`Row ${index + 1}: ${(e as Error).message}`);
          }
        });

        resolve({ hits, errors });
      },
      error: (err: any) => {
        resolve({ hits: [], errors: [err.message] });
      }
    });
  });
};