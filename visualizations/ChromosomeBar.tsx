import React from 'react';
import * as d3 from 'd3';
import { ChromosomeData } from '../types';

interface ChromosomeBarProps {
  data: ChromosomeData;
  xScale: d3.ScaleLinear<number, number>;
  y: number;
  height: number;
  width: number;
}

export const ChromosomeBar: React.FC<ChromosomeBarProps> = ({
  data,
  xScale,
  y,
  height,
  width
}) => {
  return (
    <g transform={`translate(0, ${y})`} className="chromosome-bar group">
      {/* Chromosome Body */}
      <rect
        height={height}
        width={width}
        rx={6}
        ry={6}
        className="fill-slate-800 stroke-slate-700 transition-colors duration-200 group-hover:stroke-slate-500"
        strokeWidth={1}
      />

      {/* Centromere (Pinch point) */}
      {data.centromerePosition && (
        <circle
          cx={xScale(data.centromerePosition)}
          cy={height / 2}
          r={Math.max(2, height / 2 - 2)}
          className="fill-slate-900 stroke-slate-700 opacity-50 pointer-events-none"
          strokeWidth={1}
        />
      )}

      {/* Label */}
      <text
        x={-10}
        y={height / 2}
        dy=".35em"
        textAnchor="end"
        className="fill-slate-400 text-xs font-bold font-mono group-hover:fill-science-400 transition-colors"
      >
        {data.name}
      </text>
    </g>
  );
};