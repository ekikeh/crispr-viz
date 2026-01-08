import React, { useState } from 'react';
import { Download, FileText, Image as ImageIcon, FileJson, FileSpreadsheet, ChevronDown, Loader2, Copy } from 'lucide-react';
import { OffTargetHit } from '../types';
import { useExport } from '../hooks/useExport';

interface ExportMenuProps {
  hits: OffTargetHit[];
  guideInfo: { targetGene?: string, sequence?: string };
  visualizationId: string; // DOM ID of the main visualization container
}

export const ExportMenu: React.FC<ExportMenuProps> = ({ hits, guideInfo, visualizationId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isExporting, exportImage, exportData, exportReport, copyDataToClipboard } = useExport();
  const [justCopied, setJustCopied] = useState(false);

  const baseFileName = `CRISPR_Analysis_${guideInfo.targetGene || 'Unknown'}`;

  const handleExport = async (type: 'PNG' | 'SVG' | 'CSV' | 'BED' | 'JSON' | 'PDF' | 'COPY') => {
    setIsOpen(false);
    
    try {
        switch (type) {
            case 'PNG':
                await exportImage(visualizationId, baseFileName, 'png');
                break;
            case 'SVG':
                await exportImage(visualizationId, baseFileName, 'svg');
                break;
            case 'CSV':
                await exportData('CSV', hits, baseFileName);
                break;
            case 'BED':
                await exportData('BED', hits, baseFileName);
                break;
            case 'JSON':
                await exportData('JSON', hits, baseFileName, guideInfo);
                break;
            case 'PDF':
                await exportReport(guideInfo, hits, visualizationId, baseFileName);
                break;
            case 'COPY':
                await copyDataToClipboard(hits);
                setJustCopied(true);
                setTimeout(() => setJustCopied(false), 2000);
                break;
        }
    } catch (error) {
        // Error handling is logged in hook
        alert("Export failed. Please check console for details.");
    }
  };

  return (
    <div className="relative z-50">
      <div className="flex items-center space-x-2">
          {justCopied && <span className="text-xs text-emerald-400 font-medium animate-fade-out">Copied to Clipboard!</span>}
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            disabled={isExporting}
            className="flex items-center space-x-2 px-3 py-2 bg-science-600 hover:bg-science-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-science-900/20 disabled:opacity-70"
          >
            {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            <span>Export</span>
            <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50">
             <div className="p-2 space-y-1">
                <div className="px-3 py-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Data
                </div>
                <button onClick={() => handleExport('CSV')} className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-slate-800 rounded-lg text-sm text-slate-300 transition-colors text-left">
                    <FileSpreadsheet size={16} className="text-emerald-400" />
                    <span>CSV Table</span>
                </button>
                <button onClick={() => handleExport('COPY')} className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-slate-800 rounded-lg text-sm text-slate-300 transition-colors text-left">
                    <Copy size={16} className="text-slate-400" />
                    <span>Copy to Clipboard</span>
                </button>
                <button onClick={() => handleExport('BED')} className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-slate-800 rounded-lg text-sm text-slate-300 transition-colors text-left">
                    <FileText size={16} className="text-amber-400" />
                    <span>BED File</span>
                </button>
                <button onClick={() => handleExport('JSON')} className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-slate-800 rounded-lg text-sm text-slate-300 transition-colors text-left">
                    <FileJson size={16} className="text-blue-400" />
                    <span>JSON Raw Data</span>
                </button>

                <div className="my-1 border-t border-slate-800"></div>
                
                <div className="px-3 py-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Visuals & Report
                </div>
                <button onClick={() => handleExport('PNG')} className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-slate-800 rounded-lg text-sm text-slate-300 transition-colors text-left">
                    <ImageIcon size={16} className="text-purple-400" />
                    <span>Export Image (PNG)</span>
                </button>
                <button onClick={() => handleExport('SVG')} className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-slate-800 rounded-lg text-sm text-slate-300 transition-colors text-left">
                    <code className="text-xs font-bold text-pink-400 w-4 text-center">SVG</code>
                    <span>Export Vector (SVG)</span>
                </button>
                <button onClick={() => handleExport('PDF')} className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-slate-800 rounded-lg text-sm text-slate-300 transition-colors text-left">
                    <FileText size={16} className="text-red-400" />
                    <span>Generate PDF Report</span>
                </button>
             </div>
          </div>
        </>
      )}
    </div>
  );
};