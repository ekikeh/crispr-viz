
export const ESSENTIAL_GENES = new Set([
  'GAPDH', 'ACTB', 'RPS18', 'RPL13A', 'HPRT1', // Housekeeping
  'POLR2A', 'TBP', 'UBC', // Core cellular function
]);

export const CANCER_GENES = new Set([
  'TP53', 'BRCA1', 'BRCA2', 'EGFR', 'KRAS', 'MYC', 
  'PTEN', 'PIK3CA', 'BRAF', 'APC', 'RB1', 'VHL',
  'CDKN2A', 'FLT3', 'IDH1', 'JAK2', 'KIT', 'MET',
  'NOTCH1', 'NPM1', 'NRAS', 'SMAD4', 'SMARCA4', 'STK11', 'WT1'
]);

export const isEssentialGene = (geneName: string): boolean => {
  return ESSENTIAL_GENES.has(geneName.toUpperCase());
};

export const isCancerGene = (geneName: string): boolean => {
  return CANCER_GENES.has(geneName.toUpperCase());
};

export const getGeneRiskLevel = (geneName: string): 'HIGH' | 'MEDIUM' | 'LOW' => {
  const upper = geneName.toUpperCase();
  if (isCancerGene(upper) || isEssentialGene(upper)) return 'HIGH';
  return 'LOW'; // Default, logic can be expanded
};
