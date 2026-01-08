
import { GeneAnnotation } from '../types';

// Mock data based on hg38 coordinates for demonstration
// In a real app, this would come from an API (Ensembl/UCSC)

export const GENE_ANNOTATIONS: GeneAnnotation[] = [
  {
    geneId: 'ENSG00000141510',
    geneName: 'TP53',
    chromosome: 'chr17',
    start: 7668402,
    end: 7687550,
    strand: '-',
    description: 'Tumor suppressor p53',
    exons: [
      { exonNumber: 1, start: 7687377, end: 7687550 }, // 5' UTR/Exon 1 (reverse strand order logic for biological numbering, but physical coords here)
      { exonNumber: 2, start: 7676521, end: 7676622 },
      { exonNumber: 3, start: 7676382, end: 7676403 },
      { exonNumber: 4, start: 7675994, end: 7676272 },
      { exonNumber: 5, start: 7675053, end: 7675236 },
      { exonNumber: 6, start: 7674859, end: 7674971 },
      { exonNumber: 7, start: 7674180, end: 7674290 },
      { exonNumber: 8, start: 7673700, end: 7673837 },
      { exonNumber: 9, start: 7673535, end: 7673608 },
      { exonNumber: 10, start: 7670609, end: 7670715 },
      { exonNumber: 11, start: 7668402, end: 7669690 },
    ].sort((a, b) => a.start - b.start) // Ensure physical order
  },
  {
    geneId: 'ENSG00000133703',
    geneName: 'KRAS',
    chromosome: 'chr12',
    start: 25205246,
    end: 25250929,
    strand: '-',
    description: 'K-Ras proto-oncogene',
    exons: [
        { exonNumber: 1, start: 25245274, end: 25245395 },
        { exonNumber: 2, start: 25227299, end: 25227357 },
        { exonNumber: 3, start: 25225628, end: 25225757 },
        { exonNumber: 4, start: 25219904, end: 25220059 },
        { exonNumber: 5, start: 25205246, end: 25205400 }
    ].sort((a, b) => a.start - b.start)
  },
  {
    geneId: 'ENSG00000012048',
    geneName: 'BRCA1',
    chromosome: 'chr17',
    start: 43044295,
    end: 43125483,
    strand: '-',
    description: 'Breast cancer type 1 susceptibility protein',
    exons: [
        { exonNumber: 1, start: 43124017, end: 43124115 },
        { exonNumber: 2, start: 43106455, end: 43106533 },
        { exonNumber: 3, start: 43099774, end: 43099827 },
        { exonNumber: 4, start: 43097244, end: 43097285 },
        { exonNumber: 5, start: 43095846, end: 43095934 },
        { exonNumber: 10, start: 43063874, end: 43063951 }, // partial list for brevity
        { exonNumber: 24, start: 43044295, end: 43045802 }
    ].sort((a, b) => a.start - b.start)
  },
  {
    geneId: 'ENSG00000139618',
    geneName: 'BRCA2',
    chromosome: 'chr13',
    start: 32315474,
    end: 32400266,
    strand: '+',
    description: 'Breast cancer type 2 susceptibility protein',
    exons: [
        { exonNumber: 1, start: 32315474, end: 32315668 },
        { exonNumber: 2, start: 32325076, end: 32325184 },
        { exonNumber: 11, start: 32336264, end: 32341196 }, // The big exon
        { exonNumber: 27, start: 32398246, end: 32399672 }
    ].sort((a, b) => a.start - b.start)
  },
  {
    geneId: 'ENSG00000136997',
    geneName: 'MYC',
    chromosome: 'chr8',
    start: 127735434,
    end: 127742951,
    strand: '+',
    description: 'Myc proto-oncogene protein',
    exons: [
        { exonNumber: 1, start: 127735434, end: 127736069 },
        { exonNumber: 2, start: 127737560, end: 127738367 },
        { exonNumber: 3, start: 127740922, end: 127742951 }
    ].sort((a, b) => a.start - b.start)
  },
  {
    geneId: 'ENSG00000100644',
    geneName: 'HIF1A',
    chromosome: 'chr14',
    start: 61695514,
    end: 61748259,
    strand: '+',
    description: 'Hypoxia-inducible factor 1-alpha',
    exons: [
        { exonNumber: 1, start: 61695514, end: 61695843 },
        { exonNumber: 15, start: 61747864, end: 61748259 }
    ].sort((a, b) => a.start - b.start)
  }
];

export const getGeneByLocus = (chromosome: string, position: number): GeneAnnotation | undefined => {
    return GENE_ANNOTATIONS.find(gene => 
        gene.chromosome === chromosome && 
        position >= gene.start - 2000 && // Include promoter search space
        position <= gene.end + 500
    );
};
