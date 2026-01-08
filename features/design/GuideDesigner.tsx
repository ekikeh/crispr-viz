import React, { useState, useEffect } from 'react';
import { Play, AlertCircle, CheckCircle, Info, Dna } from 'lucide-react';
import { useGuideRNAStore } from '../../stores/guideRNAStore';
import { useOffTargetStore } from '../../stores/offTargetStore';
import { calculateGC } from '../../utils/bio';
import { suggestOptimizations } from '../../services/geminiService';
import { GuideRNAInput } from '../../components/GuideRNAInput';

interface GuideDesignerProps {
  onAnalyze: () => void;
}

export const GuideDesigner: React.FC<GuideDesignerProps> = ({ onAnalyze }) => {
  const { sequence, isValid, pamSequence, setSequence, setPam, targetGene } = useGuideRNAStore();
  const { runMockAnalysis, isLoading } = useOffTargetStore();
  
  // Local state for AI check (doesn't need global persistence)
  const [aiAnalysis, setAiAnalysis] = useState<{score: number, issues: string[], suggestion: string} | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const handleRunAnalysis = async () => {
    await runMockAnalysis();
    onAnalyze();
  };

  const handleAiCheck = async () => {
      setLoadingAi(true);
      const result = await suggestOptimizations(sequence);
      if (result) {
          setAiAnalysis(JSON.parse(result));
      }
      setLoadingAi(false);
  }

  const gcContent = calculateGC(sequence);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <span className="bg-science-600 w-2 h-8 mr-3 rounded-full"></span>
          Guide RNA Configuration
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Target Gene Name</label>
              <input 
                type="text" 
                value={targetGene || 'TP53'}
                readOnly
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-300 focus:outline-none focus:border-science-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Guide Sequence (5' - 3')
              </label>
              
              <GuideRNAInput 
                value={sequence}
                onChange={(val) => {
                  setSequence(val);
                  setAiAnalysis(null);
                }}
                pam={pamSequence}
                onPamChange={setPam}
              />

              <div className="mt-2 flex space-x-4 text-xs pl-1">
                <span className={`${(gcContent >= 40 && gcContent <= 60) ? 'text-green-400' : 'text-amber-400'}`}>
                  GC Content: {gcContent.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-800">
            <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center">
                <AlertCircle size={16} className="mr-2 text-science-500" />
                AI Optimization Check
            </h3>
            
            {!aiAnalysis ? (
                 <div className="text-center py-4">
                     <p className="text-slate-500 text-sm mb-4">Get Gemini to analyze your sequence for efficiency and cloning issues.</p>
                     <button 
                        onClick={handleAiCheck}
                        disabled={!isValid || loadingAi}
                        className="text-xs bg-slate-800 hover:bg-slate-700 text-science-400 px-3 py-2 rounded transition-colors disabled:opacity-50"
                     >
                         {loadingAi ? 'Analyzing...' : 'Run AI Quality Check'}
                     </button>
                 </div>
            ) : (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                         <span className="text-slate-400 text-sm">Quality Score</span>
                         <span className={`text-lg font-bold ${aiAnalysis.score > 80 ? 'text-green-400' : 'text-amber-400'}`}>
                             {aiAnalysis.score}/100
                         </span>
                    </div>
                    {aiAnalysis.issues.length > 0 && (
                        <ul className="text-xs text-amber-300 list-disc list-inside">
                            {aiAnalysis.issues.map((issue, i) => <li key={i}>{issue}</li>)}
                        </ul>
                    )}
                    <p className="text-xs text-slate-400 border-t border-slate-800 pt-2 italic">
                        "{aiAnalysis.suggestion}"
                    </p>
                    <button onClick={() => setAiAnalysis(null)} className="text-xs text-slate-600 underline mt-2">Reset</button>
                </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-end pt-6 border-t border-slate-700">
          <button
            onClick={handleRunAnalysis}
            disabled={!isValid || isLoading}
            className={`
              flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold text-white transition-all
              ${!isValid || isLoading 
                ? 'bg-slate-700 cursor-not-allowed opacity-50' 
                : 'bg-science-600 hover:bg-science-500 hover:shadow-lg hover:shadow-science-900/20 active:transform active:scale-95'}
            `}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Scanning Genome...</span>
              </>
            ) : (
              <>
                <Play size={20} fill="currentColor" />
                <span>Run Off-Target Analysis</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        <div className="p-6 bg-slate-800 rounded-lg border border-slate-700">
            <CheckCircle className="text-emerald-500 mb-3" />
            <h4 className="font-semibold text-slate-200">High Specificity</h4>
            <p className="text-sm text-slate-400 mt-1">Algorithm optimized for minimal off-target effects in coding regions.</p>
        </div>
        <div className="p-6 bg-slate-800 rounded-lg border border-slate-700">
            <Dna className="text-science-500 mb-3" />
            <h4 className="font-semibold text-slate-200">Genome Wide</h4>
            <p className="text-sm text-slate-400 mt-1">Full scan of hg38 reference genome for potential mismatch sites.</p>
        </div>
        <div className="p-6 bg-slate-800 rounded-lg border border-slate-700">
            <Info className="text-amber-500 mb-3" />
            <h4 className="font-semibold text-slate-200">CFD Scoring</h4>
            <p className="text-sm text-slate-400 mt-1">Cutting Frequency Determination scoring to predict cleavage likelihood.</p>
        </div>
      </div>
    </div>
  );
};
