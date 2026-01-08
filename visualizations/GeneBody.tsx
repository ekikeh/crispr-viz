
import React from 'react';
import * as d3 from 'd3';
import { GeneAnnotation } from '../types';
import { ExonRect } from './ExonRect';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface GeneBodyProps {
  gene: GeneAnnotation;
  xScale: d3.ScaleLinear<number, number>;
  y: number; // Vertical center of the gene track
  height: number; // Height of exons
  onExonHover: (e: React.MouseEvent, content: React.ReactNode) => void;
  onExonLeave: () => void;
}

export const GeneBody: React.FC<GeneBodyProps> = ({
  gene,
  xScale,
  y,
  height,
  onExonHover,
  onExonLeave
}) => {
  const startX = xScale(gene.start);
  const endX = xScale(gene.end);
  const geneWidth = endX - startX;
  const direction = gene.strand === '+' ? '>' : '<';
  
  // Generate intron arrow positions
  const arrowSpacing = 100; // pixels
  const arrowCount = Math.floor(geneWidth / arrowSpacing);
  const arrows = Array.from({ length: arrowCount }).map((_, i) => ({
      id: i,
      x: startX + (i + 1) * arrowSpacing
  }));

  const handleExonEnter = (e: React.MouseEvent, exon: any) => {
      onExonHover(e, (
          <div>
              <div className="font-bold text-science-400">Exon {exon.exonNumber}</div>
              <div className="text-xs text-slate-300">
                  {gene.chromosome}:{exon.start.toLocaleString()}-{exon.end.toLocaleString()}
              </div>
          </div>
      ));
  };

  return (
    <g className="gene-body">
      {/* Gene Name Label (Above) */}
      <text
        x={startX}
        y={y - height / 2 - 8}
        className="fill-slate-300 text-xs font-bold font-mono"
        dominantBaseline="auto"
      >
        {gene.geneName} ({gene.strand})
      </text>

      {/* Intron Line */}
      <line
        x1={startX}
        y1={y}
        x2={endX}
        y2={y}
        className="stroke-slate-600"
        strokeWidth={2}
      />

      {/* Direction Arrows on Intron Line */}
      {arrows.map(arrow => (
         <text
            key={arrow.id}
            x={arrow.x}
            y={y}
            dy="0.3em"
            textAnchor="middle"
            className="fill-slate-500 text-[10px] select-none font-bold"
         >
             {direction}
         </text>
      ))}

      {/* Exons */}
      {gene.exons.map((exon, i) => (
        <ExonRect
          key={i}
          exon={exon}
          xScale={xScale}
          y={y - height / 2}
          height={height}
          isHovered={false}
          onMouseEnter={handleExonEnter}
          onMouseLeave={onExonLeave}
        />
      ))}
    </g>
  );
};
