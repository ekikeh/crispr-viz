
import { GeneAnnotation, GeneContextResult } from '../types';
import { GENE_ANNOTATIONS } from '../data/geneAnnotations';

/**
 * Determines the genomic context (Exon, Intron, Promoter, etc.) for a given position
 * within a list of known genes.
 */
export const determineGeneContext = (
  chromosome: string,
  position: number,
  customGenes?: GeneAnnotation[]
): GeneContextResult => {
  const genes = customGenes || GENE_ANNOTATIONS;
  
  // 1. Find genes overlapping or near the position
  // Expand search window slightly for Promoters (2kb upstream)
  const relevantGene = genes.find(g => 
    g.chromosome === chromosome &&
    (
       // Check if inside gene body
       (position >= g.start && position <= g.end) || 
       // Check promoter region (approx 2kb upstream based on strand)
       (g.strand === '+' && position >= g.start - 2000 && position < g.start) ||
       (g.strand === '-' && position > g.end && position <= g.end + 2000)
    )
  );

  if (!relevantGene) {
    return { context: 'Intergenic' };
  }

  // 2. Determine precise context within the gene
  
  // Check Promoter
  if (relevantGene.strand === '+') {
      if (position >= relevantGene.start - 2000 && position < relevantGene.start) {
          return { context: 'Promoter', gene: relevantGene };
      }
  } else {
      if (position > relevantGene.end && position <= relevantGene.end + 2000) {
          return { context: 'Promoter', gene: relevantGene };
      }
  }

  // Check Exons
  const exon = relevantGene.exons.find(e => position >= e.start && position <= e.end);
  if (exon) {
      // Basic check for UTR vs Coding could go here if CDS data was available
      // For now, if it's in an exon, we label as Exon
      return { 
          context: 'Exon', 
          gene: relevantGene, 
          exonNumber: exon.exonNumber 
      };
  }

  // If inside gene limits but not in promoter or exon, it's Intron
  if (position >= relevantGene.start && position <= relevantGene.end) {
      return { context: 'Intron', gene: relevantGene };
  }

  // Fallback (should be covered by Promoter logic, but safe return)
  return { context: 'Intergenic', distanceToGene: 0 };
};

/**
 * Returns a color code based on the context risk level
 */
export const getContextColor = (context: string): string => {
    switch (context.toUpperCase()) {
        case 'EXON': return '#ef4444'; // Red
        case 'PROMOTER': return '#f59e0b'; // Amber
        case 'INTRON': return '#3b82f6'; // Blue
        case 'UTR': return '#8b5cf6'; // Purple
        case 'INTERGENIC': return '#10b981'; // Green
        default: return '#64748b'; // Slate
    }
};
