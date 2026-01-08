import React, { useState, useMemo } from 'react';
import { useCircosLayout } from '../hooks/useCircosLayout';
import { OffTargetHit, GuideRNA } from '../types';
import { CircosChromosomeArc } from './CircosChromosomeArc';
import { CircosHitMarker } from './CircosHitMarker';
import { ConnectionArc } from './ConnectionArc';
import { Tooltip } from '../components/Tooltip';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface CircosPlotProps {
  data: OffTargetHit[];
  currentGuide: GuideRNA | null;
  onHitClick: (hit: OffTargetHit) => void;
  width?: number;
  height?: number;
  onTargetLocation?: { chromosome: string; position: number };
}

export const CircosPlot: React.FC<CircosPlotProps> = ({
  data,
  currentGuide,
  onHitClick,
  width = 800,
  height = 800,
  onTargetLocation
}) => {
  const [hoveredHit, setHoveredHit] = useState<OffTargetHit | null>(null);
  const [selectedHitId, setSelectedHitId] = useState<string | null>(null);
  const [hoveredChromosome, setHoveredChromosome] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [tooltipData, setTooltipData] = useState({ visible: false, x: 0, y: 0, content: null as React.ReactNode });

  const { arcs, innerRadius, outerRadius, trackRadius, getAngle } = useCircosLayout({ width, height });

  // Calculate coordinates for all hits
  const mappedHits = useMemo(() => {
    return data.map(hit => {
      const angle = getAngle(hit.chromosome, hit.position);
      // Map CFD score to radial position within a track band
      // High risk (1.0) closer to center? Or further out?
      // Let's create a scatter track 40px wide.
      // CFD 1.0 = Outer edge of track. CFD 0.0 = Inner edge.
      const trackWidth = 50;
      const r = (trackRadius - trackWidth) + (hit.cfdScore * trackWidth);
      return { ...hit, angle, radius: r };
    });
  }, [data, getAngle, trackRadius]);

  // Determine On-Target Coordinates for connecting lines
  const onTargetCoords = useMemo(() => {
    if (!onTargetLocation) return null;
    const angle = getAngle(onTargetLocation.chromosome, onTargetLocation.position);
    return { angle, radius: trackRadius - 60 }; // Start slightly inside
  }, [onTargetLocation, getAngle, trackRadius]);

  const handleHitHover = (e: React.MouseEvent, hit: OffTargetHit) => {
    const rect = (e.target as Element).getBoundingClientRect();
    setHoveredHit(hit);
    setTooltipData({
      visible: true,
      x: rect.left,
      y: rect.top,
      content: (
        <div>
           <div className="font-bold text-science-400 mb-1">{hit.geneName || 'Intergenic Hit'}</div>
           <div className="text-xs text-slate-300">
             <div>{hit.chromosome}:{hit.position.toLocaleString()}</div>
             <div>CFD: {hit.cfdScore.toFixed(2)} | Mismatches: {hit.mismatches}</div>
             <div className="mt-1 italic text-slate-500">{hit.regionType}</div>
           </div>
        </div>
      )
    });
  };

  const handleHitLeave = () => {
    setHoveredHit(null);
    setTooltipData(prev => ({ ...prev, visible: false }));
  };

  const handleHitClick = (hit: OffTargetHit) => {
    setSelectedHitId(hit.id);
    onHitClick(hit);
  };

  const cx = width / 2;
  const cy = height / 2;

  // Filter lines to avoid clutter: only show lines for selected hit or high risk hits
  const linesToRender = useMemo(() => {
     if (!onTargetCoords) return [];
     
     // If a hit is selected, only show that line
     if (selectedHitId) {
       const target = mappedHits.find(h => h.id === selectedHitId);
       return target ? [target] : [];
     }
     
     // Otherwise show lines for high risk hits (> 0.8)
     return mappedHits.filter(h => h.cfdScore > 0.8 && h.mismatches > 0);
  }, [mappedHits, selectedHitId, onTargetCoords]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-900 rounded-xl border border-slate-700">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
        <button onClick={() => setZoom(z => Math.min(z * 1.2, 3))} className="p-2 bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-700 shadow">
          <ZoomIn size={18} />
        </button>
        <button onClick={() => setZoom(z => Math.max(z / 1.2, 0.5))} className="p-2 bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-700 shadow">
          <ZoomOut size={18} />
        </button>
        <button onClick={() => { setZoom(1); setSelectedHitId(null); }} className="p-2 bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-700 shadow">
          <RotateCcw size={18} />
        </button>
      </div>

      <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
          <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
              <div className="w-2 h-2 bg-science-500 rounded-full"></div> <span>Intergenic (Circle)</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
              <div className="w-2 h-2 bg-science-500 transform rotate-45"></div> <span>Exon (Diamond)</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-500">
              <div className="w-2 h-2 bg-science-500"></div> <span>Intron (Square)</span>
          </div>
      </div>

      <svg 
        width="100%" 
        height="100%" 
        viewBox={`0 0 ${width} ${height}`}
        className="cursor-move"
      >
        <g transform={`translate(${cx}, ${cy}) scale(${zoom})`}>
          
          {/* Layer 1: Connection Arcs */}
          {onTargetCoords && linesToRender.map(hit => (
            <ConnectionArc
              key={`link-${hit.id}`}
              sourceAngle={onTargetCoords.angle}
              sourceRadius={onTargetCoords.radius}
              targetAngle={hit.angle}
              targetRadius={hit.radius - 10}
              color={hit.mismatches === 0 ? '#10b981' : '#ef4444'} // Green for self, Red for risk
              opacity={selectedHitId === hit.id ? 0.8 : 0.2}
            />
          ))}

          {/* Layer 2: Chromosome Arcs */}
          {arcs.map(arc => (
            <CircosChromosomeArc
              key={arc.id}
              arcDef={arc}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              onHover={setHoveredChromosome}
              isDimmed={!!hoveredChromosome && hoveredChromosome !== arc.id}
            />
          ))}

          {/* Layer 3: Hits */}
          {mappedHits.map(hit => {
              const isDimmed = hoveredChromosome && hoveredChromosome !== hit.chromosome;
              const isSelected = selectedHitId === hit.id;
              
              if (isDimmed && !isSelected) return null;

              return (
                <CircosHitMarker
                  key={hit.id}
                  hit={hit}
                  angle={hit.angle}
                  radius={hit.radius}
                  isSelected={isSelected}
                  onClick={handleHitClick}
                  onHover={handleHitHover}
                  onMouseLeave={handleHitLeave}
                />
              );
          })}
          
          {/* Center Info Label */}
          {currentGuide && (
             <g className="pointer-events-none">
                 <text y={-10} textAnchor="middle" className="fill-slate-500 text-[10px] uppercase tracking-widest">Target Gene</text>
                 <text y={15} textAnchor="middle" className="fill-science-400 font-bold text-xl">{currentGuide.targetGene}</text>
             </g>
          )}

        </g>
      </svg>
      <Tooltip {...tooltipData} />
    </div>
  );
};