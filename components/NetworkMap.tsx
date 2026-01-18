import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search } from 'lucide-react';
import NetworkModal from './NetworkModal';

const NetworkMap: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<{ id: string; name: string; status: string; type: string } | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Koordinat relatif (ViewBox 600x350)
  const locations = [
    { id: 'mjk', name: 'MOJOKERTO (HQ)', x: 400, y: 250, type: 'hq', status: 'ONLINE' },
    { id: 'gdg', name: 'GEDEG', x: 350, y: 150, type: 'node', status: 'ACTIVE' },
    { id: 'gkp', name: 'GEMPOL KEREP', x: 180, y: 120, type: 'node', status: 'ACTIVE' },
    { id: 'ngd', name: 'NGUDI KIDUL', x: 450, y: 300, type: 'node', status: 'MAINTENANCE' },
  ];

  const connections = [
    { from: 'mjk', to: 'gdg' },
    { from: 'gdg', to: 'gkp' },
    { from: 'mjk', to: 'ngd' },
  ];

  const handleNodeClick = (loc: typeof locations[0]) => {
    setSelectedNode(loc);
  };

  return (
    <>
      <div className="relative w-full aspect-[16/9] md:aspect-[2/1] bg-neutral-950 rounded-xl overflow-hidden border border-neutral-800 group select-none">
        
        {/* 1. Grid Background (Radar aesthetic) */}
        <div className="absolute inset-0 z-0 opacity-20"
            style={{
              backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)] opacity-80" />

        {/* 2. Top Bar UI */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-10 pointer-events-none">
          <div className="flex items-center gap-2 px-2 py-1 bg-neutral-900/90 border border-neutral-800 rounded backdrop-blur-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
              <span className="text-[10px] font-mono text-neutral-400 tracking-wider">LIVE TOPOLOGY MAP</span>
          </div>
          <div className="flex flex-col items-end">
              <span className="text-[10px] font-mono text-neutral-600">LAT: -7.4726 | LONG: 112.4381</span>
              <span className="text-[10px] font-mono text-neutral-600">ZOOM: 100%</span>
          </div>
        </div>

        {/* 3. SVG Map Layer */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 350">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#333" />
            </marker>
          </defs>

          {/* Abstract River Brantas */}
          <path d="M-50,200 C150,250 300,100 450,200 S700,180 800,250"
                fill="none" stroke="#1a1a1a" strokeWidth="30" strokeLinecap="round" className="pointer-events-none" />

          {/* Connections Lines */}
          {connections.map((conn, i) => {
            const start = locations.find(l => l.id === conn.from);
            const end = locations.find(l => l.id === conn.to);
            if (!start || !end) return null;
            return (
              <g key={i} className="pointer-events-none">
                <motion.line
                  x1={start.x} y1={start.y}
                  x2={end.x} y2={end.y}
                  stroke="#333"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.5 + i * 0.3 }}
                />
                {/* Moving data packet animation */}
                <circle r="2" fill="#fff">
                  <animateMotion 
                    dur={`${2 + i}s`} 
                    repeatCount="indefinite"
                    path={`M${start.x},${start.y} L${end.x},${end.y}`}
                    keyPoints="0;1"
                    keyTimes="0;1"
                    calcMode="linear"
                  />
                </circle>
              </g>
            );
          })}

          {/* Nodes */}
          {locations.map((loc, i) => (
            <g 
              key={loc.id} 
              className="cursor-pointer group/node"
              onClick={() => handleNodeClick(loc)}
              onMouseEnter={() => setHoveredNode(loc.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              
              {/* Hit Box for easier clicking */}
              <circle cx={loc.x} cy={loc.y} r="35" fill="transparent" />

              {/* Pulse Ring (Only visible on hover or active) */}
              <circle cx={loc.x} cy={loc.y} r="8" fill="none" stroke={loc.type === 'hq' ? '#fff' : '#666'} strokeWidth="1" opacity="0.5">
                  <animate attributeName="r" from="8" to="28" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
              </circle>

              {/* Core Node */}
              <circle 
                cx={loc.x} 
                cy={loc.y} 
                r={loc.type === 'hq' ? 6 : 4} 
                fill={loc.type === 'hq' ? '#fff' : '#888'} 
                filter="url(#glow)" 
                className="group-hover/node:fill-green-400 transition-colors duration-300"
              />

              {/* Label Lines */}
              <motion.line 
                initial={{ x2: loc.x, y2: loc.y, opacity: 0 }}
                animate={{ x2: loc.x + 15, y2: loc.y - 15, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
                x1={loc.x} y1={loc.y} stroke="#333" strokeWidth="1" 
                className="group-hover/node:stroke-green-500 transition-colors" 
              />
              <motion.line 
                initial={{ x2: loc.x + 15, opacity: 0 }}
                animate={{ x2: loc.x + 100, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                x1={loc.x + 15} y1={loc.y - 15} y2={loc.y - 15} stroke="#333" strokeWidth="1" 
                className="group-hover/node:stroke-green-500 transition-colors" 
              />
              
              {/* Text Label (SVG Text for precise positioning) */}
              <foreignObject x={loc.x + 20} y={loc.y - 45} width="140" height="50" className="pointer-events-none">
                <div className="flex flex-col items-start">
                  <span className={`text-[10px] font-bold ${loc.type === 'hq' ? 'text-white' : 'text-neutral-400'} group-hover/node:text-green-400 bg-neutral-950/80 px-1 transition-colors border-l-2 ${hoveredNode === loc.id ? 'border-green-500' : 'border-transparent'}`}>
                    {loc.name}
                  </span>
                  <span className="text-[8px] font-mono text-neutral-600 bg-neutral-950/80 px-1 mt-0.5 tracking-tighter">STATUS: {loc.status}</span>
                  
                  {/* Hover Tooltip */}
                  <AnimatePresence>
                    {hoveredNode === loc.id && (
                       <motion.div 
                         initial={{ opacity: 0, x: -10 }}
                         animate={{ opacity: 1, x: 0 }}
                         exit={{ opacity: 0 }}
                         className="flex items-center gap-1 mt-1 text-[8px] text-green-500 font-mono bg-green-950/30 px-1 py-0.5 rounded border border-green-900"
                       >
                         <Search size={8} /> CLICK TO DIAGNOSE
                       </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </foreignObject>
            </g>
          ))}
        </svg>
        
        {/* Interactive Legend / Control (Bottom Left) */}
        <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-1 pointer-events-none">
          <div className="flex items-center gap-2 text-[10px] text-neutral-500">
              <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_5px_rgba(255,255,255,0.5)]"></span> HUB (HQ)
          </div>
          <div className="flex items-center gap-2 text-[10px] text-neutral-500">
              <span className="w-2 h-2 rounded-full bg-neutral-600"></span> CLIENT NODE
          </div>
        </div>
      </div>

      <NetworkModal 
        isOpen={!!selectedNode} 
        nodeData={selectedNode} 
        onClose={() => setSelectedNode(null)} 
      />
    </>
  );
};

export default NetworkMap;