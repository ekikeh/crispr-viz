import React, { useState, useMemo } from 'react';
import * as d3 from 'd3';
import { useD3 } from '../hooks/useD3';
import { OffTargetHit } from '../types';
import { CHROMOSOME_DATA, MAX_CHROMOSOME_LENGTH } from '../data/chromosomeSizes';
import { Tooltip } from '../components/Tooltip';
import { ChromosomeBar } from './ChromosomeBar';
import { OffTargetMarker } from './OffTargetMarker';

interface ChromosomeIdeogramProps {
  data: OffTargetHit[];
  onHitClick: (hit: OffTargetHit) => void;
  width?: number;
  height?: number;
}

export const ChromosomeIdeogram: React.FC<ChromosomeIdeogramProps> = ({ 
  data, 
  onHitClick,
  width = 800,
  height = 600
}) => {
  const [tooltipData, setTooltipData] = useState<{
    visible: boolean;
    x: number;
    y: number;
    content: React.ReactNode;
  }>({ visible: false, x: 0, y: 0, content: null });

  // Margins
  const margin = { top: 40, right: 30, bottom: 50, left: 60 };
  const innerWidth = Math.max(0, width - margin.left - margin.right);
  const innerHeight = Math.max(0, height - margin.top - margin.bottom);

  // Scales
  const xScale = useMemo(() => 
    d3.scaleLinear()
      .domain([0, MAX_CHROMOSOME_LENGTH])
      .range([0, innerWidth]),
    [innerWidth]
  );

  const yScale = useMemo(() => 
    d3.scaleBand()
      .domain(CHROMOSOME_DATA.map(d => d.id))
      .range([0, innerHeight])
      .padding(0.4),
    [innerHeight]
  );

  // Axis rendering using D3 hook with correct generic for <g> element
  const axisRef = useD3<SVGGElement>((svg) => {
    svg.selectAll("*").remove();
    
    const axis = d3.axisBottom(xScale)
      .tickValues([0, 50e6, 100e6, 150e6, 200e6, 250e6])
      .tickFormat(d => `${Number(d)/1e6}Mb`)
      .tickSizeOuter(0);

    svg.call(axis)
      .call(g => g.select(".domain").attr("stroke", "#475569"))
      .call(g => g.selectAll(".tick line").attr("stroke", "#475569"))
      .call(g => g.selectAll("text").attr("fill", "#94a3b8"));
  }, [xScale]);

  // Group hits by chromosome for rendering efficiency
  const hitsByChromosome = useMemo(() => {
    const map = new Map<string, OffTargetHit[]>();
    CHROMOSOME_DATA.forEach(c => map.set(c.id, []));
    data.forEach(hit => {
      const arr = map.get(hit.chromosome);
      if (arr) arr.push(hit);
    });
    return map;
  }, [data]);

  // Tooltip Handlers
  const handleMouseEnter = (event: React.MouseEvent, hit: OffTargetHit) => {
    // Calculate relative position to the container or use page coordinates
    // Using simple page coordinates for simplicity
    const rect = (event.target as Element).getBoundingClientRect();
    
    setTooltipData({
      visible: true,
      x: rect.left,
      y: rect.top, // Position slightly above
      content: (
        <div>
            <div className="font-bold text-science-400 mb-1">{hit.geneName || 'Intergenic Hit'}</div>
            <div className="space-y-1 text-slate-300">
                <div>Locus: {hit.chromosome}:{hit.position.toLocaleString()}</div>
                <div>Mismatches: <span className="text-white font-mono">{hit.mismatches}</span></div>
                <div>CFD Score: <span className={`${hit.cfdScore > 0.8 ? 'text-red-400' : 'text-emerald-400'}`}>{hit.cfdScore.toFixed(3)}</span></div>
                {hit.strand && <div>Strand: {hit.strand}</div>}
            </div>
        </div>
      )
    });
  };

  const handleMouseLeave = () => {
    setTooltipData(prev => ({ ...prev, visible: false }));
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        width={width}
        height={height}
        className="overflow-visible"
        style={{ maxWidth: '100%', maxHeight: '100%' }}
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          {CHROMOSOME_DATA.map((chr) => {
            const y = yScale(chr.id) || 0;
            const barHeight = yScale.bandwidth();
            const chrHits = hitsByChromosome.get(chr.id) || [];

            return (
              <g key={chr.id}>
                {/* 1. Chromosome Bar Component */}
                <ChromosomeBar 
                  data={chr}
                  xScale={xScale}
                  y={y}
                  height={barHeight}
                  width={xScale(chr.length)}
                />

                {/* 2. Off-Target Markers */}
                <g transform={`translate(0, ${y + barHeight / 2})`}>
                  {chrHits.map((hit) => (
                    <OffTargetMarker
                      key={hit.id}
                      hit={hit}
                      cx={xScale(hit.position)}
                      cy={0}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      onClick={onHitClick}
                    />
                  ))}
                </g>
              </g>
            );
          })}

          {/* X Axis */}
          <g 
            ref={axisRef} 
            transform={`translate(0, ${innerHeight + 10})`} 
          />
        </g>
      </svg>

      <Tooltip {...tooltipData} />
      
      {/* Legend */}
      <div className="absolute top-0 right-0 bg-slate-900/90 border border-slate-700 p-3 rounded-lg text-xs space-y-2 pointer-events-none shadow-xl z-10">
          <div className="font-semibold text-slate-300 mb-1">Mismatches</div>
          <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span>0 (Perfect Match)</span>
          </div>
          <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-orange-500"></span>
              <span>1 Mismatch</span>
          </div>
          <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
              <span>2 Mismatches</span>
          </div>
          <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <span>3+ Mismatches</span>
          </div>
          <div className="border-t border-slate-700 my-2 pt-2">
              <div className="font-semibold text-slate-300 mb-1">Risk Score</div>
              <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-slate-400 border border-slate-600"></span>
                  <span>Low Risk</span>
              </div>
              <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 rounded-full bg-slate-400 border border-slate-600"></span>
                  <span>High Risk</span>
              </div>
          </div>
      </div>
    </div>
  );
};