import React from 'react';
import * as d3 from 'd3';
import { ArcDefinition } from '../hooks/useCircosLayout';

interface CircosChromosomeArcProps {
  arcDef: ArcDefinition;
  innerRadius: number;
  outerRadius: number;
  onHover?: (id: string | null) => void;
  isDimmed?: boolean;
}

export const CircosChromosomeArc: React.FC<CircosChromosomeArcProps> = ({
  arcDef,
  innerRadius,
  outerRadius,
  onHover,
  isDimmed
}) => {
  const arcGenerator = d3.arc<any>()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .startAngle(arcDef.startAngle)
    .endAngle(arcDef.endAngle)
    .cornerRadius(4);

  // Calculate label position (centroid)
  const [labelX, labelY] = arcGenerator.centroid(arcDef as any);
  // Push label out slightly
  const midAngle = (arcDef.startAngle + arcDef.endAngle) / 2;
  const textRadius = outerRadius + 20;
  const textX = textRadius * Math.cos(midAngle - Math.PI / 2);
  const textY = textRadius * Math.sin(midAngle - Math.PI / 2);

  return (
    <g 
      className={`transition-opacity duration-300 ${isDimmed ? 'opacity-20' : 'opacity-100'}`}
      onMouseEnter={() => onHover && onHover(arcDef.id)}
      onMouseLeave={() => onHover && onHover(null)}
    >
      <path
        d={arcGenerator(arcDef as any) || undefined}
        fill={arcDef.color}
        stroke="#1e293b"
        strokeWidth={1}
        className="cursor-pointer hover:brightness-110 transition-all"
      />
      <text
        x={textX}
        y={textY}
        dy="0.35em"
        textAnchor="middle"
        className="text-[10px] font-bold fill-slate-400 select-none pointer-events-none"
        transform={`rotate(${(midAngle * 180 / Math.PI) - 180 < 0 ? 0 : 0}, ${textX}, ${textY})`} // Optional rotation
      >
        {arcDef.data.name}
      </text>
    </g>
  );
};