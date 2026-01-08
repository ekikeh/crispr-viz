import React, { useMemo } from 'react';
import { OffTargetHit } from '../types';
import { useUIStore } from '../stores/uiStore';
import { getRiskColor, handleKeyboardClick, generateAriaLabel } from '../utils/accessibility';

interface CircosHitMarkerProps {
  hit: OffTargetHit;
  angle: number; // in radians
  radius: number; // distance from center
  isSelected: boolean;
  onClick: (hit: OffTargetHit) => void;
  onHover: (e: React.MouseEvent, hit: OffTargetHit) => void;
  onMouseLeave?: (e: React.MouseEvent) => void;
}

export const CircosHitMarker: React.FC<CircosHitMarkerProps> = ({
  hit,
  angle,
  radius,
  isSelected,
  onClick,
  onHover,
  onMouseLeave
}) => {
  const { accessibility } = useUIStore();

  // Convert polar to cartesian
  const x = radius * Math.cos(angle - Math.PI / 2);
  const y = radius * Math.sin(angle - Math.PI / 2);

  const color = useMemo(() => {
      return getRiskColor(hit.cfdScore, accessibility.colorBlindMode);
  }, [hit.cfdScore, accessibility.colorBlindMode]);

  const size = isSelected ? 8 : (3 + hit.cfdScore * 5);
  const transform = `translate(${x}, ${y})`;

  const renderShape = () => {
    const s = size;
    // Shapes help distinguish regions without relying on color
    if (hit.regionType === 'Exon') {
      // Diamond
      return <rect x={-s/2} y={-s/2} width={s} height={s} transform="rotate(45)" />;
    } else if (hit.regionType === 'Intron') {
      // Square
      return <rect x={-s/2} y={-s/2} width={s} height={s} />;
    } else if (hit.regionType === 'Promoter') {
      // Triangle
      const h = s * 0.866;
      return <path d={`M0,${-h} L${s},${h} L${-s},${h} Z`} transform={`scale(0.7)`} />;
    }
    // Default Circle for Intergenic
    return <circle r={s/2} />;
  };

  return (
    <g 
      transform={transform} 
      onClick={(e) => { e.stopPropagation(); onClick(hit); }}
      onKeyDown={(e) => handleKeyboardClick(e, () => onClick(hit))}
      onMouseEnter={(e) => onHover(e, hit)}
      onMouseLeave={onMouseLeave}
      className="cursor-pointer group focus:outline-none"
      tabIndex={0}
      role="button"
      aria-label={generateAriaLabel(hit)}
    >
      {isSelected && (
        <circle r={size * 1.5} className="fill-none stroke-white animate-ping" strokeWidth={1} />
      )}
      <g 
        fill={color} 
        className={`transition-all duration-300 ${isSelected ? 'stroke-white stroke-2' : 'stroke-slate-900 stroke-[0.5]'}`}
      >
        {renderShape()}
      </g>
    </g>
  );
};