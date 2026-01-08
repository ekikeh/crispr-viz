import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { OffTargetHit } from '../types';

interface ManhattanPlotProps {
  data: OffTargetHit[];
  onPointClick: (hit: OffTargetHit) => void;
}

export const ManhattanPlot: React.FC<ManhattanPlotProps> = ({ data, onPointClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Resize observer
  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!dimensions.width || !dimensions.height || !svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // Group data by chromosome to create categorical x-axis spacing
    const chromosomes = Array.from(new Set(data.map(d => d.chromosome)))
      .sort((a, b) => {
        const parse = (s: string) => {
            const num = String(s).replace('chr', '');
            return isNaN(Number(num)) ? (num === 'X' ? 23 : 24) : Number(num);
        };
        return parse(String(a)) - parse(String(b));
      });

    // Create scales
    const xScale = d3.scaleBand()
      .domain(chromosomes as string[])
      .range([0, width])
      .padding(0.2);

    // Add jitter within the band based on position for a cleaner look
    const xPos = (d: OffTargetHit) => {
        const bandStart = xScale(d.chromosome) || 0;
        const bandWidth = xScale.bandwidth();
        // Normalize position within chromosome (mock max length 250mb)
        const normalizedPos = Math.min(d.position / 250000000, 1);
        return bandStart + (normalizedPos * bandWidth);
    };

    const yScale = d3.scaleLinear()
      .domain([0, 1]) // CFD Score
      .range([height, 0]);

    // Color scale based on risk
    const colorScale = d3.scaleThreshold<number, string>()
        .domain([0.2, 0.5, 0.8])
        .range(["#94a3b8", "#facc15", "#f97316", "#ef4444"]); // Slate, Yellow, Orange, Red

    // Axes
    const xAxis = d3.axisBottom(xScale).tickSize(0).tickPadding(10);
    const yAxis = d3.axisLeft(yScale).ticks(5).tickFormat(d => `${d}`);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)")
      .style("fill", "#64748b")
      .style("font-size", "10px");

    g.append("g")
      .call(yAxis)
      .call(g => g.select(".domain").remove()) // Remove axis line
      .call(g => g.selectAll(".tick line")
        .attr("x2", width)
        .attr("stroke-opacity", 0.1)
        .attr("stroke", "white")); // Grid lines

    g.selectAll(".tick text").style("fill", "#64748b");

    // Tooltip
    const tooltip = d3.select(containerRef.current)
        .append("div")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background-color", "#0f172a")
        .style("border", "1px solid #334155")
        .style("padding", "8px")
        .style("border-radius", "4px")
        .style("color", "white")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("z-index", "10");

    // Data points
    g.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xPos(d))
      .attr("cy", d => yScale(d.cfdScore))
      .attr("r", d => d.cfdScore > 0.8 ? 6 : 4) // Bigger dots for higher risk
      .attr("fill", d => colorScale(d.cfdScore))
      .attr("stroke", "#1e293b")
      .attr("stroke-width", 1)
      .style("cursor", "pointer")
      .style("opacity", 0.8)
      .on("mouseover", function(event, d) {
          d3.select(this).transition().duration(200).attr("r", 8).style("opacity", 1);
          tooltip.style("visibility", "visible")
            .html(`
                <strong>${d.geneName || 'Unknown'}</strong><br/>
                ${d.chromosome}:${d.position}<br/>
                Score: ${d.cfdScore.toFixed(3)}
            `);
      })
      .on("mousemove", function(event) {
          const [x, y] = d3.pointer(event, containerRef.current);
          tooltip
            .style("top", (y - 10) + "px")
            .style("left", (x + 10) + "px");
      })
      .on("mouseout", function() {
          d3.select(this).transition().duration(200).attr("r", (d: any) => d.cfdScore > 0.8 ? 6 : 4).style("opacity", 0.8);
          tooltip.style("visibility", "hidden");
      })
      .on("click", (event, d) => {
          onPointClick(d);
          // Highlight effect
          g.selectAll("circle").attr("stroke", "#1e293b").attr("stroke-width", 1);
          d3.select(event.currentTarget).attr("stroke", "white").attr("stroke-width", 2);
      });

  }, [data, dimensions, onPointClick]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height} />
    </div>
  );
};