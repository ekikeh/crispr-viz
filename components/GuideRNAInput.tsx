import React, { useRef, useState } from 'react';
import { Copy, Trash2, ClipboardPaste, Check, AlertCircle } from 'lucide-react';
import { NucleotideBox } from './NucleotideBox';
import { sanitizeDNA } from '../utils/validation';

interface GuideRNAInputProps {
  value: string;
  onChange: (value: string) => void;
  pam?: string;
  onPamChange?: (pam: string) => void;
}

const EXAMPLE_GUIDES = [
  { name: 'TP53 Exon 2', seq: 'CCATTGTTCAATATCGTCCG' },
  { name: 'VEGFA Site 3', seq: 'GGTGAGTGAGTGTGTGCGTG' },
  { name: 'EMX1 Target', seq: 'GTCACCTCCAATGACTAGGG' },
];

export const GuideRNAInput: React.FC<GuideRNAInputProps> = ({ 
  value, 
  onChange,
  pam = 'NGG',
  onPamChange 
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [copied, setCopied] = useState(false);

  // Focus the hidden input when clicking anywhere in the container
  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    // Allow user to type, validation happens via sanitize
    const sanitized = sanitizeDNA(rawValue).slice(0, 20);
    onChange(sanitized);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const sanitized = sanitizeDNA(pastedData).slice(0, 20);
    onChange(sanitized);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    inputRef.current?.focus();
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadExample = (seq: string) => {
    onChange(seq);
  };

  const isComplete = value.length === 20;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-3 rounded-t-lg border border-slate-700 border-b-0">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Load Example:</span>
          <div className="flex space-x-1">
            {EXAMPLE_GUIDES.map((ex) => (
              <button
                key={ex.name}
                onClick={() => loadExample(ex.seq)}
                className="text-xs px-2 py-1 bg-slate-800 hover:bg-slate-700 text-science-400 rounded border border-slate-700 transition-colors"
              >
                {ex.name}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-2">
           <button 
             onClick={handleCopy}
             className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
             title="Copy Sequence"
           >
             {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
           </button>
           <button 
             onClick={handleClear}
             className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition-colors"
             title="Clear Input"
           >
             <Trash2 size={16} />
           </button>
        </div>
      </div>

      {/* Main Input Area */}
      <div 
        className={`
          relative bg-slate-950 p-6 rounded-b-lg border-2 transition-all duration-200 cursor-text group
          ${isFocused ? 'border-science-500 shadow-[0_0_20px_rgba(14,165,233,0.1)]' : 'border-slate-700 hover:border-slate-600'}
        `}
        onClick={handleContainerClick}
      >
        {/* Hidden Input for handling events */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onPaste={handlePaste}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="absolute opacity-0 w-full h-full inset-0 cursor-text -z-10"
          autoComplete="off"
          aria-label="Guide RNA Sequence Input"
        />

        {/* Nucleotide Grid */}
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
          {Array.from({ length: 20 }).map((_, index) => {
            const char = value[index];
            const isActive = isFocused && index === value.length;
            return (
              <NucleotideBox 
                key={index} 
                index={index} 
                base={char} 
                isActive={isActive} 
              />
            );
          })}
          
          {/* Placeholder/Cursor for empty state */}
          {value.length === 0 && !isFocused && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-slate-600 flex items-center">
                <ClipboardPaste className="mr-2" size={20} />
                Paste or type 20nt sequence
              </span>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-800 text-sm">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${isComplete ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isComplete ? <Check size={16} className="mr-1.5" /> : <AlertCircle size={16} className="mr-1.5" />}
              <span className="font-mono font-medium">{value.length}/20 bases</span>
            </div>
            
            {/* PAM Selector */}
            <div className="flex items-center space-x-2 pl-4 border-l border-slate-800">
              <label htmlFor="pam-select" className="text-slate-500 text-xs uppercase tracking-wider font-semibold">PAM:</label>
              {onPamChange ? (
                <select 
                  id="pam-select"
                  value={pam}
                  onChange={(e) => onPamChange(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-slate-900 border border-slate-700 text-science-400 rounded px-2 py-1 focus:outline-none focus:border-science-500 text-xs font-mono"
                >
                  <option value="NGG">NGG (SpCas9)</option>
                  <option value="NAG">NAG (SpCas9 alt)</option>
                  <option value="TTTN">TTTN (Cpf1/Cas12a)</option>
                  <option value="NNGRRT">NNGRRT (SaCas9)</option>
                </select>
              ) : (
                 <span className="font-mono text-science-400 bg-slate-800 px-2 py-1 rounded text-xs">{pam}</span>
              )}
            </div>
          </div>

          <div className="text-slate-500 text-xs hidden sm:block">
            {isFocused ? 'Typing...' : 'Click box to edit'}
          </div>
        </div>
      </div>
    </div>
  );
};