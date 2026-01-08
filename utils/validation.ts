import { DNASequence } from '../types';

export const VALID_NUCLEOTIDES = new Set(['A', 'T', 'C', 'G', 'N']);

export const isValidNucleotide = (char: string): boolean => {
  return VALID_NUCLEOTIDES.has(char.toUpperCase());
};

export const sanitizeDNA = (input: string): string => {
  if (!input) return '';
  return input
    .toUpperCase()
    .split('')
    .filter(char => isValidNucleotide(char))
    .join('');
};

export const validateGuideLength = (seq: string): boolean => {
  return seq.length === 20;
};