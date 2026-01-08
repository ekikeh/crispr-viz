import React from 'react';
import { LayoutDashboard, Microscope } from 'lucide-react';
import { AppTab } from '../stores/uiStore';

interface TabNavigationProps {
  currentView: AppTab;
  onChange: (view: AppTab) => void;
  analysisEnabled: boolean;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ currentView, onChange, analysisEnabled }) => {
  return (
    <div className="flex space-x-1 bg-slate-900/50 p-1 rounded-lg border border-slate-800 self-center mx-6">
      <button
        onClick={() => onChange('DESIGN')}
        className={`
          flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
          ${currentView === 'DESIGN' 
            ? 'bg-slate-800 text-white shadow-sm border border-slate-700' 
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }
        `}
      >
        <LayoutDashboard size={16} />
        <span>Design & Input</span>
      </button>
      
      <button
        onClick={() => analysisEnabled && onChange('ANALYSIS')}
        disabled={!analysisEnabled}
        className={`
          flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
          ${currentView === 'ANALYSIS' 
            ? 'bg-science-900/20 text-science-400 shadow-sm border border-science-900/50' 
            : 'text-slate-400'
          }
          ${!analysisEnabled ? 'opacity-50 cursor-not-allowed' : 'hover:text-science-300 hover:bg-science-900/10'}
        `}
      >
        <Microscope size={16} />
        <span>Analysis Visualization</span>
      </button>
    </div>
  );
};
