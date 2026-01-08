import { ChromosomeData } from '../types';

// GRCh38/hg38 Chromosome sizes and approx centromere locations (bp)
export const CHROMOSOME_DATA: ChromosomeData[] = [
  { id: 'chr1', name: '1', length: 248956422, centromerePosition: 122026459 },
  { id: 'chr2', name: '2', length: 242193529, centromerePosition: 92188145 },
  { id: 'chr3', name: '3', length: 198295559, centromerePosition: 90772458 },
  { id: 'chr4', name: '4', length: 190214555, centromerePosition: 49660117 },
  { id: 'chr5', name: '5', length: 181538259, centromerePosition: 46405641 },
  { id: 'chr6', name: '6', length: 170805979, centromerePosition: 58830166 },
  { id: 'chr7', name: '7', length: 159345973, centromerePosition: 58054331 },
  { id: 'chr8', name: '8', length: 145138636, centromerePosition: 43838887 },
  { id: 'chr9', name: '9', length: 138394717, centromerePosition: 47367679 },
  { id: 'chr10', name: '10', length: 133797422, centromerePosition: 39254935 },
  { id: 'chr11', name: '11', length: 135086622, centromerePosition: 51644205 },
  { id: 'chr12', name: '12', length: 133275309, centromerePosition: 34856694 },
  { id: 'chr13', name: '13', length: 114364328, centromerePosition: 16000000 },
  { id: 'chr14', name: '14', length: 107043718, centromerePosition: 16000000 },
  { id: 'chr15', name: '15', length: 101991189, centromerePosition: 17000000 },
  { id: 'chr16', name: '16', length: 90338345, centromerePosition: 35335801 },
  { id: 'chr17', name: '17', length: 83257441, centromerePosition: 22263006 },
  { id: 'chr18', name: '18', length: 80373285, centromerePosition: 15460898 },
  { id: 'chr19', name: '19', length: 58617616, centromerePosition: 24681742 },
  { id: 'chr20', name: '20', length: 64444167, centromerePosition: 26369569 },
  { id: 'chr21', name: '21', length: 46709983, centromerePosition: 11288129 },
  { id: 'chr22', name: '22', length: 50818468, centromerePosition: 13000000 },
  { id: 'chrX', name: 'X', length: 156040895, centromerePosition: 58632012 },
  { id: 'chrY', name: 'Y', length: 57227415, centromerePosition: 10104553 },
];

export const MAX_CHROMOSOME_LENGTH = CHROMOSOME_DATA[0].length;
