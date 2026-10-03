import React, { useRef, useEffect, useState } from 'react';
import { RotateCcw, Compass, RefreshCw, Crosshair } from 'lucide-react';
import { soundFx } from '../../utils/audio';

interface CrystalNode {
  id: string;
  name: string;
  label: string;
  amount: number;
  percentageDaily: number;
  primaryVendor: string;
  color: string;
  x3d: number;
  y3d: number;
  z3d: number;
  baseRadius: number;
}

export const ExpenditureCrystal3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Active selected node state
  const [activeNode, setActiveNode] = useState<CrystalNode>({
    id: 'dining',
    name: 'DINING',
    label: 'DINING $88.50',
    amount: 88.50,
    percentageDaily: 48,
    primaryVendor: 'Kura Sushi / $64.20',
    color: '#00f0ff',
    x3d: 0,
    y3d: -1,
    z3d: 0,
    baseRadius: 110
  });

  const [isAutoOrbit, setIsAutoOrbit] = useState(true);
  const [wireframeMode, setWireframeMode] = useState<'polygon' | 'solid'>('polygon');

  // 3D rotation angles
  const rotXRef = useRef(0.35);
  const rotYRef = useRef(0.2);
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  const nodes: CrystalNode[] = [
    {
      id: 'dining',
      name: 'DINING',
      label: 'DINING $88.50',
      amount: 88.50,
      percentageDaily: 48,
      primaryVendor: 'Kura Sushi / $64.20',
      color: '#00f0ff',
      x3d: 0,
      y3d: -1,
      z3d: 0.1,
      baseRadius: 110
    },
    {
      id: 'cloud',
      name: 'CLOUD C',
      label: 'CLOUD C',
      amount: 45.00,
      percentageDaily: 24,
      primaryVendor: 'AWS Infra / $45.00',
      color: '#00f0ff',
      x3d: 0.866,
      y3d: -0.5,
      z3d: -0.2,
      baseRadius: 95
    },
    {
      id: 'transit',
      name: 'TRANSIT',
      label: 'TRANSIT',
      amount: 31.00,
      percentageDaily: 17,
      primaryVendor: 'Tokyo Metro / $31.00',
      color: '#ff3366',
      x3d: 0.866,
      y3d: 0.5,
      z3d: 0.3,
      baseRadius: 85
    },
    {
      id: 'software',
      name: 'SOFTWARE',
      label: 'SOFTWARE $20.00',
      amount: 20.00,
      percentageDaily: 11,
      primaryVendor: 'GitHub CI / $20.00',
      color: '#00ff9d',
      x3d: 0,
      y3d: 1,
      z3d: -0.1,
      baseRadius: 75
    },
    {
      id: 'res',
      name: 'RES $0.00',
      label: "'RES $0.00",
      amount: 0.00,
      percentageDaily: 0,
      primaryVendor: 'None',
      color: '#475569',
      x3d: -0.866,
      y3d: 0.5,
      z3d: -0.3,
      baseRadius: 65
    },
    {
      id: 'nty',
      name: 'NTY $0.00',
      label: 'NTY $0.00',
      amount: 0.00,
      percentageDaily: 0,
      primaryVendor: 'None',
      color: '#475569',
      x3d: -0.866,
      y3d: -0.5,
      z3d: 0.2,
      baseRadius: 65
    }
  ];

  // 3D Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Auto rotation
      if (isAutoOrbit && !isDraggingRef.current) {
        rotYRef.current += 0.004;
      }

      const rx = rotXRef.current;
      const ry = rotYRef.current;

      // Project 3D coordinate to 2D
      const project = (x: number, y: number, z: number, r: number) => {
        // Rotate around Y
        const cosY = Math.cos(ry);
        const sinY = Math.sin(ry);
        const x1 = x * cosY + z * sinY;
        const z1 = -x * sinY + z * cosY;

        // Rotate around X
        const cosX = Math.cos(rx);
        const sinX = Math.sin(rx);
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;

        // Perspective projection
        const fov = 340;
        const scale = fov / (fov + z2 * r);
        const px = cx + x1 * r * scale;
        const py = cy + y2 * r * scale;

        return { x: px, y: py, scale, z: z2 };
      };

      // Draw background hexagonal radar rings
      const ringLevels = [40, 80, 120];
      ringLevels.forEach((radius, idx) => {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3 - Math.PI / 2;
          const nx = Math.cos(angle);
          const ny = Math.sin(angle);
          const p = project(nx, ny, 0, radius);
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.closePath();
        ctx.strokeStyle = idx === 2 ? 'rgba(30, 41, 59, 0.8)' : 'rgba(21, 31, 48, 0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Draw axis spokes connecting to center
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3 - Math.PI / 2;
        const nx = Math.cos(angle);
        const ny = Math.sin(angle);
        const pOuter = project(nx, ny, 0, 125);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(pOuter.x, pOuter.y);
        ctx.strokeStyle = 'rgba(27, 38, 59, 0.6)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw connecting lines between nodes (Crystal Wireframe Face)
      const projectedNodes = nodes.map(node => {
        const p = project(node.x3d, node.y3d, node.z3d, node.baseRadius);
        return { ...node, px: p.x, py: p.y, pScale: p.scale };
      });

      // Polygon perimeter
      ctx.beginPath();
      projectedNodes.forEach((pn, i) => {
        if (i === 0) ctx.moveTo(pn.px, pn.py);
        else ctx.lineTo(pn.px, pn.py);
      });
      ctx.closePath();
      
      // Semi-transparent gradient fill for 3D crystal volume
      const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 120);
      grad.addColorStop(0, 'rgba(255, 51, 102, 0.15)');
      grad.addColorStop(0.6, 'rgba(0, 240, 255, 0.08)');
      grad.addColorStop(1, 'rgba(0, 255, 157, 0.02)');
      ctx.fillStyle = grad;
      ctx.fill();

      // Colored edge segments
      for (let i = 0; i < projectedNodes.length; i++) {
        const next = (i + 1) % projectedNodes.length;
        const p1 = projectedNodes[i];
        const p2 = projectedNodes[next];

        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        
        const lineGrad = ctx.createLinearGradient(p1.px, p1.py, p2.px, p2.py);
        lineGrad.addColorStop(0, p1.color);
        lineGrad.addColorStop(1, p2.color);
        
        ctx.strokeStyle = lineGrad;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Connect each node to center
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(p1.px, p1.py);
        ctx.strokeStyle = p1.color + '44';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Glowing Center Core (Hot Pink glowing sphere)
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 24);
      coreGrad.addColorStop(0, '#ffffff');
      coreGrad.addColorStop(0.3, '#ff3366');
      coreGrad.addColorStop(0.7, 'rgba(255, 51, 102, 0.4)');
      coreGrad.addColorStop(1, 'rgba(255, 51, 102, 0)');

      ctx.beginPath();
      ctx.arc(cx, cy, 22, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ff3366';
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw Node Vertices and Labels
      projectedNodes.forEach(pn => {
        const isSelected = pn.id === activeNode.id;

        // Glowing outer halo
        ctx.beginPath();
        ctx.arc(pn.px, pn.py, isSelected ? 8 : 5, 0, Math.PI * 2);
        ctx.fillStyle = pn.color;
        ctx.shadowColor = pn.color;
        ctx.shadowBlur = isSelected ? 16 : 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // White core dot
        ctx.beginPath();
        ctx.arc(pn.px, pn.py, isSelected ? 4 : 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Label Text
        ctx.font = 'bold 10px "JetBrains Mono", monospace';
        ctx.fillStyle = pn.color;
        ctx.textAlign = pn.px > cx ? 'left' : (Math.abs(pn.px - cx) < 20 ? 'center' : 'right');
        
        const offsetY = pn.py < cy ? -12 : 18;
        const offsetX = pn.px > cx ? 10 : (Math.abs(pn.px - cx) < 20 ? 0 : -10);

        ctx.fillText(pn.label, pn.px + offsetX, pn.py + offsetY);
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [isAutoOrbit, activeNode]);

  // Handle Drag to Rotate
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;

    rotYRef.current += dx * 0.01;
    rotXRef.current += dy * 0.01;

    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleResetOrbit = () => {
    soundFx.playClick();
    rotXRef.current = 0.35;
    rotYRef.current = 0.2;
    setIsAutoOrbit(true);
  };

  const handleCycleNode = () => {
    soundFx.playClick();
    const curIdx = nodes.findIndex(n => n.id === activeNode.id);
    const nextIdx = (curIdx + 1) % nodes.length;
    setActiveNode(nodes[nextIdx]);
  };

  return (
    <div className="bg-[#0c121e] border border-[#1b253b] rounded-md p-3.5 shadow-card-glow mb-5 font-mono relative overflow-hidden">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-[#162136]">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-[#ff3366] rounded-xs" />
          <span className="text-xs font-bold text-white tracking-wider">
            EXPENDITURE_GEOMETRY // 3D CRYSTAL
          </span>
        </div>

        <div className="flex items-center gap-2 text-[10px]">
          <span 
            onClick={() => {
              soundFx.playClick();
              setWireframeMode(wireframeMode === 'polygon' ? 'solid' : 'polygon');
            }}
            className="bg-[#121c2e] hover:bg-[#18263e] text-[#94a3b8] px-2 py-0.5 rounded border border-[#22334e] cursor-pointer"
          >
            POLYGON_WIREFRAME
          </span>
          <span 
            onClick={() => {
              soundFx.playClick();
              setIsAutoOrbit(!isAutoOrbit);
            }}
            className={`px-2 py-0.5 rounded border cursor-pointer ${
              isAutoOrbit 
                ? 'bg-[#15273d] text-[#00f0ff] border-[#00f0ff]/40 shadow-glow-cyan-sm' 
                : 'bg-[#121c2e] text-[#64748b] border-[#22334e]'
            }`}
          >
            CAMERA: {isAutoOrbit ? 'ORBIT_ACTIVE' : 'ORBIT_FREE'}
          </span>
        </div>
      </div>

      {/* 3D Canvas Wireframe Viewport */}
      <div 
        className="relative h-[290px] w-full flex items-center justify-center cursor-grab active:cursor-grabbing bg-radial-at-c from-[#0f172a]/40 to-transparent"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <canvas 
          ref={canvasRef}
          width={520}
          height={290}
          className="w-full h-full max-w-[520px] max-h-[290px]"
        />

        {/* Floating Active Node Card (Bottom Left) */}
        <div className="absolute bottom-2.5 left-2.5 bg-[#0a0f1a]/95 border border-[#1e2e47] rounded p-2.5 shadow-2xl backdrop-blur-md max-w-[210px] pointer-events-auto">
          <div className="flex items-center gap-1.5 text-[10px] text-[#00f0ff] font-bold tracking-wider mb-1">
            <Crosshair className="w-3 h-3" />
            <span>ACTIVE NODE: {activeNode.name}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-white font-jetbrains">
              ${activeNode.amount.toFixed(2)}
            </span>
            <span className="text-[10px] text-[#ff3366] font-semibold">
              {activeNode.percentageDaily}% of Daily
            </span>
          </div>
          <div className="text-[9px] text-[#64748b] mt-0.5 truncate">
            Primary vendor: {activeNode.primaryVendor}
          </div>
        </div>

        {/* Orbit Controls (Bottom Right) */}
        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5">
          <button 
            onClick={handleResetOrbit}
            title="Reset Camera Orientation"
            className="w-7 h-7 rounded-full bg-[#10192a] hover:bg-[#182742] border border-[#22334e] hover:border-[#00f0ff] text-[#94a3b8] hover:text-white flex items-center justify-center transition-colors shadow-md"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={handleCycleNode}
            title="Focus Next Cluster Node"
            className="w-7 h-7 rounded-full bg-[#10192a] hover:bg-[#182742] border border-[#22334e] hover:border-[#00ff9d] text-[#94a3b8] hover:text-white flex items-center justify-center transition-colors shadow-md"
          >
            <Compass className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => {
              soundFx.playClick();
              setIsAutoOrbit(!isAutoOrbit);
            }}
            title="Toggle Auto Spin"
            className={`w-7 h-7 rounded-full border flex items-center justify-center transition-colors shadow-md ${
              isAutoOrbit 
                ? 'bg-[#132338] border-[#00f0ff] text-[#00f0ff]' 
                : 'bg-[#10192a] border-[#22334e] text-[#94a3b8]'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAutoOrbit ? 'animate-spin-slow' : ''}`} />
          </button>
        </div>
      </div>

      {/* Bottom Telemetry Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2.5 border-t border-[#162136] text-[10px]">
        <div>
          <span className="text-[#64748b] block">PRIMARY ANCHOR</span>
          <span className="text-[#00f0ff] font-semibold">HEX_NODE_01</span>
        </div>
        <div>
          <span className="text-[#64748b] block">CRYSTAL DENSITY</span>
          <span className="text-white font-semibold">4 CLUSTERS</span>
        </div>
        <div>
          <span className="text-[#64748b] block">ENTROPY STABILITY</span>
          <span className="text-[#00ff9d] font-semibold">99.98% OK</span>
        </div>
        <div>
          <span className="text-[#64748b] block">DELTA OSCILLATION</span>
          <span className="text-[#ff3366] font-semibold">± $2.14/H</span>
        </div>
      </div>

    </div>
  );
};
