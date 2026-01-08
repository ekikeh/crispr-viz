
import React from 'react';
import * as d3 from 'd3';
import { Exon } from '../types';

interface ExonRectProps {
  exon: Exon;
  xScale: d3.ScaleLinear<number, number>;
  y: number;
  height: number;
  isHovered: boolean;
  onMouseEnter: (e: React.MouseEvent, exon: Exon) => void;
  onMouseLeave: () => void;
}

export const ExonRect: React.FC<ExonRectProps> = ({
  exon,
  xScale,
  y,
  height,
  isHovered,
  onMouseEnter,
  onMouseLeave
}) => {
  const x1 = xScale(exon.start);
  const x2 = xScale(exon.end);
  const width = Math.max(1, x2 - x1); // Ensure minimal visibility

  return (
    <rect
      x={x1}
      y={y}
      width={width}
      height={height}
      rx={2}
      className={`
        transition-all duration-200 cursor-pointer
        ${isHovered ? 'fill-science-400 stroke-science-300' : 'fill-science-600 stroke-science-700'}
      `}
      strokeWidth={1}
      onMouseEnter={(e) => onMouseEnter(e, exon)}
      onMouseLeave={onMouseLeave}
    />
  );
};
