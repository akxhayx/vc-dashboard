import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './ValuationBubble.css';

const ValuationBubble = ({ startups }) => {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const [selectedBubble, setSelectedBubble] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Sector colors
  const sectorColors = {
    'SaaS / B2B': '#4A9EFF',
    'EV & Mobility': '#00D68F',
    'DeepTech / Aerospace': '#F7B731',
    'Other': '#6B7280'
  };

  // Filter valid data - exclude DeepTech or null ARR
  const validStartups = startups.filter(s => s.arr > 0 && s.sector !== 'DeepTech / Aerospace');

  // Get unique sectors in data
  const sectorsInData = [...new Set(validStartups.map(s => s.sector))];
  const sectorCounts = {};
  sectorsInData.forEach(sector => {
    sectorCounts[sector] = validStartups.filter(s => s.sector === sector).length;
  });

  const getSectorColor = (sector) => sectorColors[sector] || sectorColors['Other'];

  // Handle responsive resizing
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight || 500
        });
      }
    };

    handleResize();

    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // Main D3 effect
  useEffect(() => {
    if (dimensions.width === 0 || !svgRef.current) return;

    const { width, height } = dimensions;

    // Prepare data
    const nodes = validStartups.map(s => ({
      id: s.Startup,
      startup: s.Startup,
      arr: s.arr,
      valuation: s.impliedValuation || 0,
      moic: s.moic || 0,
      sector: s.sector,
      x: Math.random() * width,
      y: Math.random() * height,
      vx: 0,
      vy: 0
    }));

    // Calculate bubble radius scale (ARR-based sizing)
    const arrExtent = d3.extent(nodes, d => d.arr);
    const radiusScale = d3.scaleSqrt()
      .domain(arrExtent)
      .range([25, 100]);

    // Create SVG
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg.attr('width', width).attr('height', height);

    // Add background
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'transparent');

    // Create groups for bubbles
    const bubbleGroup = svg.append('g');

    // Force simulation
    const simulation = d3.forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength(-150))
      .force('collide', d3.forceCollide().radius(d => radiusScale(d.arr) + 2))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .alpha(0.3);

    // Create circles
    const circles = bubbleGroup
      .selectAll('circle')
      .data(nodes, d => d.id)
      .join('circle')
      .attr('r', d => radiusScale(d.arr))
      .attr('fill', d => getSectorColor(d.sector))
      .attr('fill-opacity', 0.85)
      .attr('stroke', d => getSectorColor(d.sector))
      .attr('stroke-width', 1.5)
      .attr('stroke-opacity', 1)
      .style('cursor', 'pointer')
      .on('mouseenter', function (event, d) {
        setTooltip({
          x: event.pageX,
          y: event.pageY,
          company: d.startup,
          arr: d.arr,
          valuation: d.valuation,
          moic: d.moic,
          sector: d.sector
        });
      })
      .on('mousemove', function (event) {
        setTooltip(prev => prev ? { ...prev, x: event.pageX, y: event.pageY } : null);
      })
      .on('mouseleave', function () {
        setTooltip(null);
      })
      .on('click', function (event, d) {
        event.stopPropagation();
        setSelectedBubble(selectedBubble === d.id ? null : d.id);
      });

    // Add selection ring for clicked bubble
    circles.attr('filter', d =>
      selectedBubble === d.id
        ? 'drop-shadow(0 0 8px rgba(255,255,255,0.4))'
        : 'none'
    ).attr('stroke', d =>
      selectedBubble === d.id
        ? 'white'
        : getSectorColor(d.sector)
    ).attr('stroke-width', d =>
      selectedBubble === d.id
        ? 3
        : 1.5
    );

    // Add labels inside bubbles
    const labels = bubbleGroup
      .selectAll('text')
      .data(nodes, d => d.id)
      .join('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', 'white')
      .attr('font-weight', 'bold')
      .attr('font-size', '10px')
      .attr('pointer-events', 'none')
      .text(d => d.startup)
      .style('display', d => radiusScale(d.arr) < 20 ? 'none' : 'block')
      .attr('x', d => d.x)
      .attr('y', d => d.y);

    // Tick function
    const tick = () => {
      circles.attr('cx', d => d.x).attr('cy', d => d.y);
      labels.attr('x', d => d.x).attr('y', d => d.y);
    };

    simulation.on('tick', tick);

    // Click background to deselect
    svg.on('click', () => setSelectedBubble(null));

    return () => {
      simulation.stop();
    };
  }, [dimensions, validStartups, selectedBubble]);

  const formatCurrency = (value) => {
    if (value >= 1e7) return `₹${(value / 1e7).toFixed(1)}Cr`;
    if (value >= 1e6) return `₹${(value / 1e6).toFixed(1)}M`;
    return `₹${value.toFixed(0)}`;
  };

  return (
    <div className="valuation-bubble-container">
      <div className="chart-header">
        <h3>Bubble Universe</h3>
        <p className="chart-subtitle">Company valuation scaled by ARR • Force-directed layout</p>
      </div>

      <div className="bubble-wrapper" ref={containerRef} style={{ height: '500px' }}>
        <svg ref={svgRef}></svg>

        {/* Legend */}
        <div className="bubble-legend">
          {sectorsInData.map(sector => (
            <div key={sector} className="legend-item">
              <span
                className="legend-dot"
                style={{ backgroundColor: getSectorColor(sector) }}
              ></span>
              <span className="legend-text">
                {sector} <strong>({sectorCounts[sector]})</strong>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="bubble-tooltip"
          style={{ left: `${tooltip.x + 10}px`, top: `${tooltip.y + 10}px` }}
        >
          <div className="tooltip-company">{tooltip.company}</div>
          <div className="tooltip-row">
            <span>ARR:</span>
            <span className="tooltip-value">{formatCurrency(tooltip.arr)}</span>
          </div>
          <div className="tooltip-row">
            <span>Valuation:</span>
            <span className="tooltip-value">{formatCurrency(tooltip.valuation)}</span>
          </div>
          <div className="tooltip-row">
            <span>MOIC:</span>
            <span className="tooltip-value">{tooltip.moic.toFixed(2)}x</span>
          </div>
          <div className="tooltip-sector" style={{ color: getSectorColor(tooltip.sector) }}>
            {tooltip.sector}
          </div>
        </div>
      )}
    </div>
  );
};

export default ValuationBubble;
