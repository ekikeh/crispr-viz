import React from 'react';
import { ExternalLink, MapPin, Anchor } from 'lucide-react';
import { OffTargetHit } from '../types';

interface LocationInfoCardProps {
  hit: OffTargetHit;
}

export const LocationInfoCard: React.FC<LocationInfoCardProps> = ({ hit }) => {
  // Generate UCSC Genome Browser Link
  // Window: +/- 50bp
  const start = Math.max(0, hit.position - 50);
  const end = hit.position + 50;
  const ucscLink = `https://genome.ucsc.edu/cgi-bin/hgTracks?db=hg38&position=${hit.chromosome}:${start}-${end}`;
  const ensemblLink = `http://www.ensembl.org/Homo_sapiens/Location/View?r=${hit.chromosome.replace('chr', '')}:${start}-${end}`;

  return (
    <div className="bg-slate-900 rounded-lg p-4 border border-slate-700 space-y-4">
      <div className="flex items-center space-x-2 text-slate-400 mb-2">
        <MapPin size={16} />
        <span className="text-xs font-bold uppercase tracking-wider">Genomic Location</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-slate-500">Chromosome</div>
          <div className="text-lg font-mono font-bold text-slate-200">{hit.chromosome}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500">Position (hg38)</div>
          <div className="text-lg font-mono font-bold text-slate-200">{hit.position.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500">Strand</div>
          <div className="text-lg font-mono font-bold text-slate-200 flex items-center">
            {hit.strand || '+'}
            <span className="ml-2 text-xs font-normal text-slate-500 opacity-50">
               ({hit.strand === '-' ? 'template' : 'coding'})
            </span>
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500">Region</div>
          <div className={`text-lg font-bold ${
            hit.regionType === 'Exon' ? 'text-red-400' : 
            hit.regionType === 'Promoter' ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {hit.regionType}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800 flex flex-col space-y-2">
        <a 
          href={ucscLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm text-science-400 transition-colors group"
        >
          <span>View in UCSC Genome Browser</span>
          <ExternalLink size={14} className="group-hover:translate-x-1 transition-transform" />
        </a>
        <a 
          href={ensemblLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm text-science-400 transition-colors group"
        >
          <span>View in Ensembl</span>
          <ExternalLink size={14} className="group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </div>
  );
};