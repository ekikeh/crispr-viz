import { useMemo } from 'react';
import * as d3 from 'd3';
import { ChromosomeData } from '../types';
import { CHROMOSOME_DATA } from '../data/chromosomeSizes';

export interface ArcDefinition {
  id: string;
  data: ChromosomeData;
  startAngle: number;
  endAngle: number;
  color: string;
  length: number;
}

interface UseCircosLayoutProps {
  width: number;
  height: number;
  padding?: number; // radians between chromosomes
}

const CHROMOSOME_COLORS = [
  "#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", 
  "#a65628", "#f781bf", "#999999", "#66c2a5", "#fc8d62", "#8da0cb",
  "#e78ac3", "#a6d854", "#ffd92f", "#e5c494", "#b3b3b3", "#8dd3c7",
  "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69"
];

export const useCircosLayout = ({ width, height, padding = 0.05 }: UseCircosLayoutProps) => {
  const outerRadius = Math.min(width, height) / 2 - 40;
  const innerRadius = outerRadius - 20;
  const trackRadius = innerRadius - 40; // Where hits are plotted

  const { arcs, angleScale, totalLength } = useMemo(() => {
    const totalLength = CHROMOSOME_DATA.reduce((acc, chr) => acc + chr.length, 0);
    const totalPadding = padding * CHROMOSOME_DATA.length;
    const availableAngle = 2 * Math.PI - totalPadding;
    
    // Scale mapping BP to Radians
    const angleScale = d3.scaleLinear()
      .domain([0, totalLength])
      .range([0, availableAngle]);

    let currentAngle = 0;
    const arcs: ArcDefinition[] = CHROMOSOME_DATA.map((chr, i) => {
      const angleSpan = angleScale(chr.length);
      const startAngle = currentAngle;
      const endAngle = currentAngle + angleSpan;
      
      currentAngle = endAngle + padding;

      return {
        id: chr.id,
        data: chr,
        startAngle,
        endAngle,
        color: CHROMOSOME_COLORS[i % CHROMOSOME_COLORS.length],
        length: chr.length
      };
    });

    return { arcs, angleScale, totalLength };
  }, [padding]);

  // Helper: Map genomic position to polar angle
  const getAngle = (chromosomeId: string, position: number) => {
    const arc = arcs.find(a => a.id === chromosomeId);
    if (!arc) return 0;
    // Map position (0 to length) to angle span within the arc
    const percent = position / arc.length;
    return arc.startAngle + (percent * (arc.endAngle - arc.startAngle));
  };

  // Helper: Convert Polar to Cartesian
  const polarToCartesian = (angle: number, radius: number) => {
    // Subtract PI/2 to rotate so 0 is at top (12 o'clock)
    return {
      x: radius * Math.cos(angle - Math.PI / 2),
      y: radius * Math.sin(angle - Math.PI / 2)
    };
  };

  return {
    arcs,
    outerRadius,
    innerRadius,
    trackRadius,
    getAngle,
    polarToCartesian
  };
};