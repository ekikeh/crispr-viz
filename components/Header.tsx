import React from 'react';
import { Dna, HelpCircle, Eye, EyeOff } from 'lucide-react';
import { useUIStore } from '../stores/uiStore';

interface HeaderProps {
  currentView: string;
}

export const Header: React.FC<HeaderProps> = ({ currentView }) => {
  const { accessibility, setAccessibility } = useUIStore();

  const toggleColorBlind = () => {
    setAccessibility({ colorBlindMode: !accessibility.colorBlindMode });
  };

  return (
    <header className="bg-slate-950 border-b border-slate-800 h-16 px-4 sm:px-6 flex items-center justify-between shadow-md z-10" role="banner">
      <div className="flex items-center space-x-3">
        <div className="bg-science-900/30 p-2 rounded-lg border border-science-800/50" aria-hidden="true">
           <Dna className="text-science-500 w-6 h-6" />
        </div>
        <div>
           <h1 className="text-lg font-bold text-slate-100 tracking-tight leading-none">
             CRISPR <span className="text-science-500">Off-Target Visualizer</span>
           </h1>
           <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider hidden sm:block">Safety Check for Gene Editing</p>
        </div>
      </div>

      <div className="flex items-center space-x-4 no-print">
        <button
          onClick={toggleColorBlind}
          className={`flex items-center space-x-1 text-xs px-2 py-1 rounded border transition-colors ${accessibility.colorBlindMode ? 'bg-science-900 border-science-500 text-science-400' : 'border-transparent text-slate-500 hover:bg-slate-800'}`}
          title="Toggle Color Blind Mode"
          aria-pressed={accessibility.colorBlindMode}
        >
          {accessibility.colorBlindMode ? <Eye size={16} /> : <EyeOff size={16} />}
          <span className="hidden sm:inline">CVD Mode</span>
        </button>

        <a 
          href="https://github.com/google/gemini-api" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center space-x-1 text-slate-400 hover:text-white transition-colors text-sm"
          aria-label="Documentation"
        >
          <HelpCircle size={16} />
          <span className="hidden sm:inline">Docs</span>
        </a>
      </div>
    </header>
  );
};