import React from 'react';
import { LayoutGrid, CircleDot } from 'lucide-react';

interface ViewToggleProps {
  viewMode: 'LINEAR' | 'CIRCOS';
  onChange: (mode: 'LINEAR' | 'CIRCOS') => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, onChange }) => {
  return (
    <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-700">
      <button 
        onClick={() => onChange('LINEAR')}
        className={`px-3 py-1.5 rounded flex items-center space-x-2 text-xs font-medium transition-colors ${viewMode === 'LINEAR' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
      >
        <LayoutGrid size={14} />
        <span>Linear Ideogram</span>
      </button>
      <button 
        onClick={() => onChange('CIRCOS')}
        className={`px-3 py-1.5 rounded flex items-center space-x-2 text-xs font-medium transition-colors ${viewMode === 'CIRCOS' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
      >
        <CircleDot size={14} />
        <span>Circos Plot</span>
      </button>
    </div>
  );
};