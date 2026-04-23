"use client";
import { useEffect, useRef, useState } from "react";
import { graphNodes, graphEdges } from "@/data/dummy";
import { formatCurrency, cn } from "@/lib/utils";
import { RiskBadge } from "@/components/ui/risk-badge";
import { Network, GitBranch, AlertTriangle, TrendingUp, RefreshCw, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

const RISK_COLOR: Record<string, string> = {
  critical: "#ef4444", high: "#f59e0b", medium: "#eab308", low: "#10b981"
};
const RISK_GLOW: Record<string, string> = {
  critical: "rgba(239,68,68,0.4)", high: "rgba(245,158,11,0.4)", medium: "rgba(234,179,8,0.3)", low: "rgba(16,185,129,0.3)"
};

export function TabGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<typeof graphNodes[0] | null>(null);
  const [zoom, setZoom] = useState(1);
  const animRef = useRef<number>(0);
  const nodePositions = useRef<Map<string, { x: number; y: number; vx: number; vy: number }>>(new Map());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Initialize positions
    const W = canvas.width, H = canvas.height;
    graphNodes.forEach((node, i) => {
      if (!nodePositions.current.has(node.id)) {
        const angle = (i / graphNodes.length) * Math.PI * 2;
        const r = Math.min(W, H) * 0.3;
        nodePositions.current.set(node.id, {
          x: W / 2 + Math.cos(angle) * r + (Math.random() - 0.5) * 60,
          y: H / 2 + Math.sin(angle) * r + (Math.random() - 0.5) * 60,
          vx: 0, vy: 0,
        });
      }
    });

    let frame = 0;
    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, W, H);

      // Background grid
      ctx.strokeStyle = "rgba(30,45,69,0.3)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x < W; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // Force simulation (simple)
      graphNodes.forEach(n1 => {
        const p1 = nodePositions.current.get(n1.id)!;
        graphNodes.forEach(n2 => {
          if (n1.id === n2.id) return;
          const p2 = nodePositions.current.get(n2.id)!;
          const dx = p1.x - p2.x, dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const repel = 3000 / (dist * dist);
          p1.vx += (dx / dist) * repel * 0.01;
          p1.vy += (dy / dist) * repel * 0.01;
        });
        // Center gravity
        p1.vx += (W / 2 - p1.x) * 0.001;
        p1.vy += (H / 2 - p1.y) * 0.001;
        p1.vx *= 0.85; p1.vy *= 0.85;
        p1.x = Math.max(40, Math.min(W - 40, p1.x + p1.vx));
        p1.y = Math.max(40, Math.min(H - 40, p1.y + p1.vy));
      });

      // Spring forces for edges
      graphEdges.forEach(e => {
        const p1 = nodePositions.current.get(e.source);
        const p2 = nodePositions.current.get(e.target);
        if (!p1 || !p2) return;
        const dx = p2.x - p1.x, dy = p2.y - p1.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const spring = (dist - 120) * 0.003;
        p1.vx += (dx / dist) * spring;
        p1.vy += (dy / dist) * spring;
        p2.vx -= (dx / dist) * spring;
        p2.vy -= (dy / dist) * spring;
      });

      // Draw edges
      graphEdges.forEach(e => {
        const p1 = nodePositions.current.get(e.source);
        const p2 = nodePositions.current.get(e.target);
        if (!p1 || !p2) return;
        const srcNode = graphNodes.find(n => n.id === e.source)!;
        const isCircular = graphEdges.some(rev => rev.source === e.target && rev.target === e.source);

        const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
        const c1 = RISK_COLOR[srcNode.risk];
        grad.addColorStop(0, c1 + "80");
        grad.addColorStop(1, c1 + "20");

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = isCircular ? 2.5 : 1.2;
        if (isCircular) ctx.setLineDash([6, 3]);
        else ctx.setLineDash([]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Arrow
        const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        const mx = (p1.x + p2.x) / 2, my = (p1.y + p2.y) / 2;
        ctx.save();
        ctx.translate(mx, my);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, 0); ctx.lineTo(-8, -4); ctx.lineTo(-8, 4);
        ctx.fillStyle = c1 + "80";
        ctx.fill();
        ctx.restore();
      });

      // Draw nodes
      graphNodes.forEach(node => {
        const pos = nodePositions.current.get(node.id)!;
        const r = 14 + node.connections * 1.5;
        const color = RISK_COLOR[node.risk];
        const glow = RISK_GLOW[node.risk];

        // Pulse for critical/high
        if (node.risk === "critical" || node.risk === "high") {
          const pulse = Math.sin(frame * 0.05) * 0.5 + 0.5;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, r + 8 + pulse * 6, 0, Math.PI * 2);
          ctx.fillStyle = color + "15";
          ctx.fill();
        }

        // Glow
        const radGrad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, r * 2);
        radGrad.addColorStop(0, glow);
        radGrad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r * 2, 0, Math.PI * 2);
        ctx.fillStyle = radGrad;
        ctx.fill();

        // Node circle
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
        const nodeGrad = ctx.createRadialGradient(pos.x - r * 0.3, pos.y - r * 0.3, 0, pos.x, pos.y, r);
        nodeGrad.addColorStop(0, color + "cc");
        nodeGrad.addColorStop(1, color + "44");
        ctx.fillStyle = nodeGrad;
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Label
        ctx.fillStyle = "#e2e8f0";
        ctx.font = "bold 9px 'DM Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText(node.id, pos.x, pos.y + 3);

        // Name below
        ctx.fillStyle = "#94a3b8";
        ctx.font = "8px 'DM Sans', sans-serif";
        ctx.fillText(node.label.split(" ")[0], pos.x, pos.y + r + 12);
      });

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left, my = e.clientY - rect.top;
      for (const node of graphNodes) {
        const pos = nodePositions.current.get(node.id)!;
        const r = 14 + node.connections * 1.5;
        const dx = mx - pos.x, dy = my - pos.y;
        if (dx * dx + dy * dy < r * r) {
          setSelectedNode(prev => prev?.id === node.id ? null : node);
          return;
        }
      }
      setSelectedNode(null);
    };
    canvas.addEventListener("click", handleClick);

    return () => {
      cancelAnimationFrame(animRef.current);
      canvas.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Network, label: "Total Nodes", value: "2,142", color: "text-cyan-400", bg: "bg-cyan-500/10" },
          { icon: GitBranch, label: "Total Edges", value: "8,933", color: "text-blue-400", bg: "bg-blue-500/10" },
          { icon: AlertTriangle, label: "Suspicious Nodes", value: "34", color: "text-red-400", bg: "bg-red-500/10" },
          { icon: TrendingUp, label: "Circular Flows", value: "12", color: "text-orange-400", bg: "bg-orange-500/10" },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="rounded-2xl border border-[#1e2d45] bg-[#111827] p-4 flex items-center gap-3">
            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", bg)}>
              <Icon className={cn("w-4 h-4", color)} />
            </div>
            <div>
              <p className="text-xs text-[#64748b]">{label}</p>
              <p className="text-lg font-bold text-[#e2e8f0]">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Graph Canvas */}
      <div className="rounded-2xl border border-[#1e2d45] bg-[#111827] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#1e2d45]">
          <div>
            <h3 className="text-sm font-semibold text-[#e2e8f0]">Transaction Network Graph</h3>
            <p className="text-xs text-[#64748b]">Klik node untuk detail • Garis putus = circular flow</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-3 text-[10px] text-[#64748b] mr-3">
              {Object.entries(RISK_COLOR).map(([r, c]) => (
                <div key={r} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                  <span className="capitalize">{r}</span>
                </div>
              ))}
            </div>
            <button className="p-1.5 rounded-lg bg-[#1a2235] text-[#64748b] hover:text-cyan-400 transition-all"><RefreshCw className="w-3.5 h-3.5" /></button>
            <button className="p-1.5 rounded-lg bg-[#1a2235] text-[#64748b] hover:text-cyan-400 transition-all"><Maximize2 className="w-3.5 h-3.5" /></button>
          </div>
        </div>
        <div className="relative">
          <canvas ref={canvasRef} width={900} height={480} className="w-full" style={{ display: "block" }} />
          {selectedNode && (
            <div className="absolute top-4 right-4 w-56 rounded-xl bg-[#0d1626]/95 border border-[#1e2d45] p-4 backdrop-blur-sm animate-fadeIn">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#e2e8f0]">{selectedNode.label}</span>
                <RiskBadge value={selectedNode.risk} />
              </div>
              <div className="space-y-2 text-xs">
                {[
                  ["User ID", selectedNode.id],
                  ["Total Amount", formatCurrency(selectedNode.amount)],
                  ["Koneksi", `${selectedNode.connections} edges`],
                  ["Risk", selectedNode.risk.toUpperCase()],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-[#64748b]">{k}</span>
                    <span className="text-[#e2e8f0] font-medium">{v}</span>
                  </div>
                ))}
              </div>
              <button className="mt-3 w-full py-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs hover:bg-cyan-500/20 transition-all">
                Buka Investigasi →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Circular Flows Table */}
      <div className="rounded-2xl border border-orange-500/20 bg-[#111827] overflow-hidden">
        <div className="px-5 py-3 border-b border-[#1e2d45] flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-400" />
          <h3 className="text-sm font-semibold text-[#e2e8f0]">Circular Flow Paths Terdeteksi</h3>
        </div>
        <div className="p-4 space-y-2">
          {[
            { path: "U001 → U099 → U001", amount: "Rp 898jt", time: "09:00–09:30", duration: "30 mnt", risk: "critical" },
            { path: "U045 → U009 → U034 → U045", amount: "Rp 648jt", time: "10:45–11:45", duration: "60 mnt", risk: "critical" },
            { path: "U070 → U043 → U059 → U070", amount: "Rp 943jt", time: "02:14–03:22", duration: "68 mnt", risk: "critical" },
          ].map((flow, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#0d1626] border border-orange-500/10 hover:border-orange-500/30 transition-all">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-orange-400">{flow.path}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-[#e2e8f0]">{flow.amount}</span>
                <span className="text-xs text-[#64748b]">{flow.duration}</span>
                <span className="text-[10px] font-mono text-[#475569]">{flow.time}</span>
                <RiskBadge value={flow.risk} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
