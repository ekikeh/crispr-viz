export const calculateGC = (seq: string): number => {
  if (!seq) return 0;
  const gc = (seq.match(/[GC]/gi) || []).length;
  return (gc / seq.length) * 100;
};

export const reverseComplement = (seq: string): string => {
  const map: Record<string, string> = { A: 'T', T: 'A', C: 'G', G: 'C', N: 'N', a: 't', t: 'a', c: 'g', g: 'c' };
  return seq.split('').reverse().map(base => map[base] || base).join('');
};

export const formatSequence = (seq: string) => {
  return seq.toUpperCase().replace(/[^ATCGN]/g, '');
};