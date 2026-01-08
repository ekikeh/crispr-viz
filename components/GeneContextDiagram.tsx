import React from 'react';
import { OffTargetHit } from '../types';

interface GeneContextDiagramProps {
  hit: OffTargetHit;
  className?: string;
}

export const GeneContextDiagram: React.FC<GeneContextDiagramProps> = ({ hit, className = '' }) => {
  const isExon = hit.regionType?.toLowerCase().includes('exon');
  const isIntron = hit.regionType?.toLowerCase().includes('intron');
  const isPromoter = hit.regionType?.toLowerCase().includes('promoter');
  const isIntergenic = hit.regionType?.toLowerCase().includes('intergenic');

  // SVG Configuration
  const width = 400;
  const height = 80;
  const color = {
    exon: '#3b82f6', // blue-500
    intron: '#475569', // slate-600
    promoter: '#f59e0b', // amber-500
    cut: '#ef4444' // red-500
  };

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <div className="mb-2 flex justify-between text-xs text-slate-400 uppercase tracking-wider font-semibold">
        <span>Promoter</span>
        <span>Gene Body (5' → 3')</span>
        <span>Term</span>
      </div>
      
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto bg-slate-900/50 rounded-lg border border-slate-700">
        <defs>
          <pattern id="striped" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="2" height="4" transform="translate(0,0)" fill="#ffffff10"></rect>
          </pattern>
        </defs>

        {/* Backbone Line */}
        <line x1="20" y1={height/2} x2={width-20} y2={height/2} stroke={color.intron} strokeWidth="2" />

        {/* Promoter Region */}
        <path 
          d={`M 20 ${height/2} L 50 ${height/2 - 10} L 50 ${height/2} Z`} 
          fill={isPromoter ? color.promoter : color.intron} 
          opacity={isPromoter ? 1 : 0.5}
        />
        <rect 
          x="20" y={height/2 - 15} width="40" height="30" 
          fill="transparent" 
          className={isPromoter ? "stroke-amber-500/50 animate-pulse" : ""}
        />

        {/* Exons (Schematic: 3 Exons) */}
        {/* Exon 1 */}
        <rect 
          x="70" y={height/2 - 10} width="60" height="20" rx="2"
          fill={color.exon} 
          opacity={isExon ? 1 : 0.6}
          stroke={isExon ? 'white' : 'none'}
          strokeWidth={isExon ? 1 : 0}
        />
        
        {/* Intron 1 */}
        <line x1="130" y1={height/2} x2="190" y2={height/2} stroke={color.intron} strokeWidth="2" strokeDasharray="4 2" />

        {/* Exon 2 (Target Context typically) */}
        <rect 
          x="190" y={height/2 - 10} width="90" height="20" rx="2"
          fill={color.exon}
          opacity={isExon ? 1 : 0.6}
          stroke={isExon ? 'white' : 'none'}
          strokeWidth={isExon ? 1 : 0}
        />

        {/* Intron 2 */}
        <line x1="280" y1={height/2} x2="320" y2={height/2} stroke={color.intron} strokeWidth="2" strokeDasharray="4 2" />

        {/* Exon 3 */}
        <rect 
          x="320" y={height/2 - 10} width="50" height="20" rx="2"
          fill={color.exon}
          opacity={isExon ? 1 : 0.6}
          stroke={isExon ? 'white' : 'none'}
          strokeWidth={isExon ? 1 : 0}
        />

        {/* Cut Site Indicator - Position depends on Region Type */}
        <g 
          className="transition-all duration-500 ease-out"
          transform={`translate(${
            isPromoter ? 40 : 
            isExon ? 235 : 
            isIntron ? 160 : 
            isIntergenic ? 380 : 235
          }, 0)`}
        >
          {/* Arrow */}
          <path 
            d={`M 0 ${height/2 - 25} L 0 ${height/2 - 5}`} 
            stroke={color.cut} 
            strokeWidth="2" 
            markerEnd="url(#arrowhead)"
          />
          <path d="M -4,15 L 0,25 L 4,15" transform={`translate(0, ${height/2 - 25})`} fill={color.cut} />

          {/* Label */}
          <rect x="-35" y="5" width="70" height="20" rx="4" fill={color.cut} />
          <text x="0" y="19" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">CUT SITE</text>
        </g>

        {/* Legend Overlay for active region */}
        <text x={width - 10} y={height - 10} textAnchor="end" fill="white" fontSize="10" opacity="0.5">
          {hit.regionType?.toUpperCase() || 'UNKNOWN REGION'}
        </text>

      </svg>
      
      <div className="mt-2 text-xs text-slate-500 text-center italic">
        * Schematic representation. Not to scale.
      </div>
    </div>
  );
};