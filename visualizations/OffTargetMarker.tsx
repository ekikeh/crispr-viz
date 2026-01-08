import React, { useMemo } from 'react';
import { OffTargetHit } from '../types';
import { useUIStore } from '../stores/uiStore';
import { getRiskColor, handleKeyboardClick, generateAriaLabel } from '../utils/accessibility';

interface OffTargetMarkerProps {
  hit: OffTargetHit;
  cx: number;
  cy: number;
  onMouseEnter: (e: React.MouseEvent, hit: OffTargetHit) => void;
  onMouseLeave: (e: React.MouseEvent) => void;
  onClick: (hit: OffTargetHit) => void;
}

export const OffTargetMarker: React.FC<OffTargetMarkerProps> = ({
  hit,
  cx,
  cy,
  onMouseEnter,
  onMouseLeave,
  onClick
}) => {
  const { accessibility } = useUIStore();
  
  const color = useMemo(() => {
      // Risk based coloring instead of mismatch based for consistency with Circos in a11y mode
      return getRiskColor(hit.cfdScore, accessibility.colorBlindMode);
  }, [hit.cfdScore, accessibility.colorBlindMode]);

  const radius = useMemo(() => {
     return 3 + (hit.cfdScore * 4);
  }, [hit.cfdScore]);

  // Using simple shapes for linear view too if possible, but for now circle is standard.
  // We can add a stroke pattern or shape based on region type if desired.
  // For this iteration, we rely on the color blind safe palette.

  return (
    <circle
      cx={cx}
      cy={cy}
      r={radius}
      fill={color}
      className="transition-all duration-200 cursor-pointer hover:opacity-100 hover:stroke-white hover:stroke-2 focus:outline-none focus:stroke-white focus:stroke-2"
      fillOpacity={0.8}
      stroke="#0f172a"
      strokeWidth={0.5}
      tabIndex={0}
      role="button"
      aria-label={generateAriaLabel(hit)}
      onMouseEnter={(e) => onMouseEnter(e, hit)}
      onMouseLeave={onMouseLeave}
      onClick={(e) => {
        e.stopPropagation();
        onClick(hit);
      }}
      onKeyDown={(e) => handleKeyboardClick(e, () => onClick(hit))}
    />
  );
};