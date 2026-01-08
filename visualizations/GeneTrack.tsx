
import React, { useMemo, useState } from 'react';
import * as d3 from 'd3';
import { GeneAnnotation, OffTargetHit } from '../types';
import { GeneBody } from './GeneBody';
import { Tooltip } from '../components/Tooltip';

interface GeneTrackProps {
  chromosome: string;
  regionStart: number;
  regionEnd: number;
  genes: GeneAnnotation[];
  offTargetHits?: OffTargetHit[]; // Optional hits to show as cut sites
  width: number;
  height?: number;
}

export const GeneTrack: React.FC<GeneTrackProps> = ({
  chromosome,
  regionStart,
  regionEnd,
  genes,
  offTargetHits = [],
  width,
  height = 100
}) => {
  const [tooltipData, setTooltipData] = useState<{
      visible: boolean;
      x: number;
      y: number;
      content: React.ReactNode;
  }>({ visible: false, x: 0, y: 0, content: null });

  // Filter genes visible in window
  const visibleGenes = useMemo(() => {
    return genes.filter(g => 
        g.chromosome === chromosome && 
        g.end >= regionStart && 
        g.start <= regionEnd
    );
  }, [genes, chromosome, regionStart, regionEnd]);

  // Scale
  const xScale = useMemo(() => {
      return d3.scaleLinear()
        .domain([regionStart, regionEnd])
        .range([0, width]);
  }, [regionStart, regionEnd, width]);

  // Resolve overlaps - Simple y-stacking
  const stackedGenes = useMemo(() => {
      const rows: GeneAnnotation[][] = [];
      
      visibleGenes.forEach(gene => {
          let placed = false;
          // Try to fit in existing row
          for (let row of rows) {
              const lastGene = row[row.length - 1];
              // Check overlap with padding (assume mapped pixels)
              // We need to check overlap in data space or pixel space.
              // Data space is safer. Add 5% buffer.
              const buffer = (regionEnd - regionStart) * 0.05;
              if (gene.start > lastGene.end + buffer) {
                  row.push(gene);
                  placed = true;
                  break;
              }
          }
          if (!placed) {
              rows.push([gene]);
          }
      });
      return rows;
  }, [visibleGenes, regionStart, regionEnd]);

  // Tooltip handlers
  const handleHover = (e: React.MouseEvent, content: React.ReactNode) => {
      const rect = (e.target as Element).getBoundingClientRect();
      setTooltipData({
          visible: true,
          x: rect.left,
          y: rect.top,
          content
      });
  };

  const handleLeave = () => {
      setTooltipData(prev => ({ ...prev, visible: false }));
  };

  if (visibleGenes.length === 0) {
      return (
          <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs italic border-t border-slate-800 bg-slate-900/50" style={{ height }}>
              No annotated genes in this region ({chromosome}:{regionStart.toLocaleString()}-{regionEnd.toLocaleString()})
          </div>
      );
  }

  const rowHeight = 40;
  const trackHeight = Math.max(height, stackedGenes.length * rowHeight + 20);

  return (
    <div className="relative w-full overflow-hidden bg-slate-900/50 border-t border-slate-800">
        <svg width={width} height={trackHeight} className="block">
            {/* Render Rows */}
            {stackedGenes.map((row, rowIndex) => (
                <g key={rowIndex} transform={`translate(0, ${rowIndex * rowHeight + 30})`}>
                    {row.map(gene => (
                        <GeneBody 
                            key={gene.geneId}
                            gene={gene}
                            xScale={xScale}
                            y={0}
                            height={12}
                            onExonHover={handleHover}
                            onExonLeave={handleLeave}
                        />
                    ))}
                </g>
            ))}

            {/* Render Cut Sites (Off-Targets) */}
            {offTargetHits.map(hit => {
                if (hit.position < regionStart || hit.position > regionEnd) return null;
                const x = xScale(hit.position);
                return (
                    <g key={hit.id} transform={`translate(${x}, 0)`}>
                        <line 
                            y1={0} 
                            y2={trackHeight} 
                            stroke="#ef4444" 
                            strokeWidth={1} 
                            strokeDasharray="4 2" 
                            opacity={0.7}
                        />
                        <polygon 
                            points="-4,0 4,0 0,6" 
                            fill="#ef4444"
                        />
                    </g>
                );
            })}
        </svg>

        <div className="absolute top-1 left-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            Gene Track ({chromosome})
        </div>

        <Tooltip {...tooltipData} />
    </div>
  );
};
