import { OffTargetHit } from '../types';

export const SAMPLE_OFF_TARGETS: OffTargetHit[] = [
    { id: 'sim-1', chromosome: 'chr1', position: 12054300, sequence: 'GTCACCTCCAATGACTAGGG', mismatches: 0, cfdScore: 1.0, geneName: 'EMX1', regionType: 'Exon', strand: '+' },
    { id: 'sim-2', chromosome: 'chr5', position: 45229100, sequence: 'GTCACCTCCAATGACTAGGA', mismatches: 1, cfdScore: 0.85, geneName: 'Unknown', regionType: 'Intergenic', strand: '-' },
    { id: 'sim-3', chromosome: 'chr8', position: 89102200, sequence: 'GTCACCTTCAATGACTAGGG', mismatches: 1, cfdScore: 0.62, geneName: 'GATA4', regionType: 'Intron', strand: '+' },
    { id: 'sim-4', chromosome: 'chrX', position: 15300100, sequence: 'GTCACCTCCAATGACTAAGG', mismatches: 2, cfdScore: 0.23, geneName: 'F8', regionType: 'Promoter', strand: '+' },
    { id: 'sim-5', chromosome: 'chr12', position: 6610020, sequence: 'GTCAGCTCCAATGACTAGGG', mismatches: 1, cfdScore: 0.55, geneName: 'KRAS', regionType: 'Exon', strand: '-' },
    { id: 'sim-6', chromosome: 'chr2', position: 11200300, sequence: 'GTCACCTCCAATCACTAGGG', mismatches: 1, cfdScore: 0.45, regionType: 'Intron', strand: '+' },
    { id: 'sim-7', chromosome: 'chr15', position: 22334400, sequence: 'GTCACCTCCAATGACTATGG', mismatches: 1, cfdScore: 0.41, geneName: 'Unknown', regionType: 'Intergenic', strand: '-' },
    { id: 'sim-8', chromosome: 'chr7', position: 99887700, sequence: 'GTCACCTCCAATGACTAGTT', mismatches: 2, cfdScore: 0.12, geneName: 'CFTR', regionType: 'Exon', strand: '+' },
    { id: 'sim-9', chromosome: 'chr11', position: 33221100, sequence: 'GTCACCTCCAATGACTAGCG', mismatches: 2, cfdScore: 0.08, geneName: 'HBB', regionType: 'Promoter', strand: '-' },
    { id: 'sim-10', chromosome: 'chr1', position: 12054350, sequence: 'GTCACCTCCAATGACTAGGG', mismatches: 0, cfdScore: 0.99, geneName: 'EMX1-isoform', regionType: 'Exon', strand: '+' },
];
