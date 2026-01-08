import React from 'react';
import { GuideDesigner } from '../features/design/GuideDesigner';
import { FileUploader } from '../components/FileUploader';

interface DesignPageProps {
  onAnalyze: () => void;
}

export const DesignPage: React.FC<DesignPageProps> = ({ onAnalyze }) => {
  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      <div className="text-center space-y-4 pt-8">
         <h2 className="text-3xl font-bold text-slate-100">Design CRISPR Experiments</h2>
         <p className="text-slate-400 max-w-2xl mx-auto">
            Input your guide RNA sequence to scan for potential off-targets across the genome, 
            or upload existing prediction results from Cas-OFFinder.
         </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-start">
         <div className="space-y-6">
             <div className="flex items-center space-x-4 mb-6">
                <div className="h-px bg-slate-700 flex-1"></div>
                <span className="text-slate-500 text-sm font-semibold uppercase tracking-widest">Option 1: New Design</span>
                <div className="h-px bg-slate-700 flex-1"></div>
             </div>
             <GuideDesigner onAnalyze={onAnalyze} />
         </div>

         <div className="space-y-6">
             <div className="flex items-center space-x-4 mb-6">
                <div className="h-px bg-slate-700 flex-1"></div>
                <span className="text-slate-500 text-sm font-semibold uppercase tracking-widest">Option 2: Import Data</span>
                <div className="h-px bg-slate-700 flex-1"></div>
             </div>
             <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700">
                <FileUploader />
             </div>
         </div>
      </div>
    </div>
  );
};