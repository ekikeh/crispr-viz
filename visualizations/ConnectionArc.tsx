import React from 'react';
import * as d3 from 'd3';

interface ConnectionArcProps {
  sourceAngle: number;
  sourceRadius: number;
  targetAngle: number;
  targetRadius: number;
  color: string;
  opacity?: number;
}

export const ConnectionArc: React.FC<ConnectionArcProps> = ({
  sourceAngle,
  sourceRadius,
  targetAngle,
  targetRadius,
  color,
  opacity = 0.3
}) => {
  // Use d3.linkRadial to create a smooth curve between two points in polar coordinates
  // We use 'any' for the accessors to avoid TSX generic parsing issues (<LinkData, ...> can be read as JSX)
  const linkGenerator = d3.linkRadial()
    .angle((d: any) => d.angle)
    .radius((d: any) => d.radius);

  const d = linkGenerator({
    source: { angle: sourceAngle, radius: sourceRadius },
    target: { angle: targetAngle, radius: targetRadius }
  } as any);

  return (
    <path
      d={d || undefined}
      fill="none"
      stroke={color}
      strokeWidth={1}
      strokeOpacity={opacity}
      className="pointer-events-none transition-all duration-500"
    />
  );
};