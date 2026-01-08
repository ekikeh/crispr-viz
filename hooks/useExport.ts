import { useState, useCallback } from 'react';
import { exportElementAsImage } from '../utils/exportImage';
import { exportToCSV, exportToBED, exportToJSON } from '../utils/exportData';
import { generatePDFReport } from '../utils/exportPDF';
import { OffTargetHit, GuideRNA } from '../types';

export const useExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const exportImage = useCallback(async (elementId: string, fileName: string, format: 'png' | 'svg' = 'png') => {
    setIsExporting(true);
    setError(null);
    try {
      // Add a small delay to ensure any UI overlays like menus are fully closed if they cover the element
      await new Promise(resolve => setTimeout(resolve, 100));
      await exportElementAsImage(elementId, fileName, format);
    } catch (err) {
      setError(err as Error);
      console.error('Export image failed:', err);
      throw err;
    } finally {
      setIsExporting(false);
    }
  }, []);

  const exportData = useCallback(async (type: 'CSV' | 'BED' | 'JSON', hits: OffTargetHit[], fileName: string, metadata?: any) => {
    setIsExporting(true);
    setError(null);
    try {
        switch (type) {
            case 'CSV':
                exportToCSV(hits, fileName);
                break;
            case 'BED':
                exportToBED(hits, fileName);
                break;
            case 'JSON':
                exportToJSON(hits, metadata, fileName);
                break;
        }
    } catch (err) {
        setError(err as Error);
        console.error('Export data failed:', err);
        throw err;
    } finally {
        setIsExporting(false);
    }
  }, []);

  const exportReport = useCallback(async (guide: GuideRNA | { targetGene?: string, sequence?: string }, hits: OffTargetHit[], chartId: string, fileName: string) => {
      setIsExporting(true);
      setError(null);
      try {
          await new Promise(resolve => setTimeout(resolve, 100)); // Delay for UI clear
          await generatePDFReport(guide, hits, chartId, fileName);
      } catch (err) {
          setError(err as Error);
          console.error('Export report failed:', err);
          throw err;
      } finally {
          setIsExporting(false);
      }
  }, []);

  const copyToClipboard = useCallback(async (text: string) => {
      try {
          await navigator.clipboard.writeText(text);
          return true;
      } catch (err) {
          console.error('Failed to copy to clipboard', err);
          return false;
      }
  }, []);

  const copyDataToClipboard = useCallback(async (hits: OffTargetHit[]) => {
      try {
          // Format as TSV for Excel pasting
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
          ].join('\t'));
          
          const content = [headers.join('\t'), ...rows].join('\n');
          await navigator.clipboard.writeText(content);
          return true;
      } catch (err) {
          console.error('Failed to copy data', err);
          return false;
      }
  }, []);

  return {
      isExporting,
      error,
      exportImage,
      exportData,
      exportReport,
      copyToClipboard,
      copyDataToClipboard
  };
};