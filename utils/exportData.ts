import { OffTargetHit } from '../types';

export const downloadFile = (content: string, mimeType: string, fileName: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export const exportToCSV = (hits: OffTargetHit[], fileName: string) => {
    const headers = ['ID', 'Chromosome', 'Position', 'Strand', 'Sequence', 'Mismatches', 'CFD_Score', 'Gene_Name', 'Region_Type'];
    const rows = hits.map(h => [
        h.id,
        h.chromosome,
        h.position,
        h.strand || '+',
        h.sequence,
        h.mismatches,
        h.cfdScore.toFixed(4),
        h.geneName || 'N/A',
        h.regionType
    ].join(','));
    
    const csvContent = [headers.join(','), ...rows].join('\n');
    downloadFile(csvContent, 'text/csv;charset=utf-8;', `${fileName}.csv`);
};

export const exportToBED = (hits: OffTargetHit[], fileName: string) => {
    // BED Format: chrom start end name score strand
    // Standard BED score is 0-1000
    const bedContent = hits.map(h => [
        h.chromosome,
        Math.max(0, h.position - 10), // Approx start
        h.position + 10 + 3, // Approx end (20nt + PAM)
        `${h.geneName || h.id}_${h.mismatches}MM`,
        Math.round(h.cfdScore * 1000), 
        h.strand || '+'
    ].join('\t')).join('\n');
    
    // Add track header
    const content = `track name="${fileName}" description="CRISPR Off-Targets" useScore=1\n${bedContent}`;
    downloadFile(content, 'text/plain;charset=utf-8;', `${fileName}.bed`);
};

export const exportToJSON = (hits: OffTargetHit[], metadata: any, fileName: string) => {
    const content = JSON.stringify({ metadata, hits }, null, 2);
    downloadFile(content, 'application/json', `${fileName}.json`);
};
