import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { parseCsv } from '../utils/parsers/csvParser';
import { parseBed } from '../utils/parsers/bedParser';
import { useGuideRNAStore } from '../stores/guideRNAStore';
import { useOffTargetStore } from '../stores/offTargetStore';
import { OffTargetHit } from '../types';
import { SAMPLE_OFF_TARGETS } from '../data/mockOffTargets';
import { ProgressBar } from './ui/ProgressBar';
import { ErrorBanner } from './ui/ErrorBanner';
import { useToast } from '../hooks/useToast';

export const FileUploader: React.FC = () => {
  const { sequence } = useGuideRNAStore();
  const { setHits } = useOffTargetStore();
  const toast = useToast();
  
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [parsedCount, setParsedCount] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
    return interval;
  };

  const processFile = async (file: File) => {
    setLoading(true);
    setError(null);
    setParsedCount(null);
    
    // Check file type extension
    const validExtensions = ['.csv', '.tsv', '.txt', '.bed'];
    if (!validExtensions.some(ext => file.name.toLowerCase().endsWith(ext))) {
        setError("Invalid file type. Please upload a .csv, .tsv, .txt, or .bed file.");
        setLoading(false);
        toast.error("Invalid file type");
        return;
    }

    const progressInterval = simulateProgress();

    try {
      let hits: OffTargetHit[] = [];

      // Add a small artificial delay to show progress bar interaction
      await new Promise(resolve => setTimeout(resolve, 500));

      if (file.name.endsWith('.csv') || file.name.endsWith('.tsv') || file.name.endsWith('.txt')) {
        const result = await parseCsv(file, sequence);
        if (result.errors.length > 0) {
            if (result.hits.length === 0) {
                // Fatal error
                throw new Error(result.errors[0]);
            } else {
                // Partial success
                toast.info(`Imported with warnings: ${result.errors.length} rows skipped.`);
            }
        }
        hits = result.hits;
      } else if (file.name.endsWith('.bed')) {
        const text = await file.text();
        hits = parseBed(text, sequence);
      }

      clearInterval(progressInterval);
      setProgress(100);

      if (hits.length === 0) {
        throw new Error("No valid data rows found in file.");
      }

      setParsedCount(hits.length);
      toast.success(`Successfully parsed ${hits.length} off-target sites`);
      
      // Update store after animation finishes
      setTimeout(() => {
          setHits(hits);
          setLoading(false);
      }, 500);

    } catch (err) {
      clearInterval(progressInterval);
      setProgress(0);
      const errMsg = (err as Error).message;
      setError(errMsg);
      toast.error("File parsing failed");
      setLoading(false);
    }
  };

  const loadSampleData = () => {
      setLoading(true);
      const progressInterval = simulateProgress();
      
      setTimeout(() => {
        clearInterval(progressInterval);
        setProgress(100);
        
        setHits(SAMPLE_OFF_TARGETS);
        setParsedCount(SAMPLE_OFF_TARGETS.length);
        toast.success("Loaded sample dataset");
        setLoading(false);
      }, 1000);
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
        <div 
            className={`
                relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 text-center
                ${isDragging ? 'border-science-400 bg-science-900/20' : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'}
                ${loading ? 'cursor-wait' : ''}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept=".csv,.tsv,.txt,.bed"
                onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
                disabled={loading}
            />

            <div className="flex flex-col items-center justify-center space-y-4 min-h-[180px]">
                {loading ? (
                    <div className="w-full max-w-xs space-y-4">
                        <UploadCloud size={48} className="text-science-500 mx-auto animate-bounce" />
                        <div className="space-y-2">
                           <p className="text-science-400 font-medium">Parsing sequencing data...</p>
                           <ProgressBar progress={progress} />
                        </div>
                    </div>
                ) : parsedCount !== null ? (
                     <div className="text-emerald-400 animate-in fade-in zoom-in duration-300">
                        <CheckCircle size={48} className="mx-auto mb-2" />
                        <p className="font-medium text-lg">Import Complete</p>
                        <p className="text-slate-400 text-sm">{parsedCount} targets ready for analysis</p>
                    </div>
                ) : (
                    <>
                        <div className={`p-4 rounded-full transition-colors duration-300 ${isDragging ? 'bg-science-500/20 text-science-400' : 'bg-slate-700 text-slate-400'}`}>
                            <FileText size={32} />
                        </div>
                        <div>
                            <p className="text-lg font-medium text-slate-200">
                                Drag and drop your results file
                            </p>
                            <p className="text-sm text-slate-500 mt-1">
                                Supports CSV, TSV, or BED files from Cas-OFFinder/CRISPOR
                            </p>
                        </div>
                        <div className="flex gap-3 pt-2">
                             <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="px-4 py-2 bg-science-600 hover:bg-science-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-science-900/20"
                            >
                                Browse Files
                            </button>
                            <button
                                onClick={loadSampleData}
                                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm font-medium transition-colors border border-slate-600"
                            >
                                Load Sample
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
        
        {error && (
             <ErrorBanner 
                message={error} 
                onDismiss={() => setError(null)} 
                className="mt-4"
             />
        )}
        
        <div className="mt-4 text-xs text-slate-500 text-center flex items-center justify-center gap-1">
             <AlertTriangle size={12} />
             <p>Required columns: Chromosome, Position, Sequence</p>
        </div>
    </div>
  );
};