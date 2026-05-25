"use client";

import { useEffect, useState } from "react";
import { RiskLevel } from "@/types";

interface ScoreGaugeProps {
  score: number;
  riskLevel: RiskLevel;
  isAnimating?: boolean;
}

const RISK_CONFIG: Record<
  RiskLevel,
  { color: string; glow: string; label: string; bg: string; ring: string }
> = {
  SAFE: {
    color: "#00ff9d",
    glow: "0 0 20px rgba(0,255,157,0.6)",
    label: "SAFE",
    bg: "rgba(0,255,157,0.08)",
    ring: "#00ff9d",
  },
  LOW: {
    color: "#00d4ff",
    glow: "0 0 20px rgba(0,212,255,0.6)",
    label: "LOW RISK",
    bg: "rgba(0,212,255,0.08)",
    ring: "#00d4ff",
  },
  MEDIUM: {
    color: "#ffd100",
    glow: "0 0 20px rgba(255,209,0,0.6)",
    label: "MEDIUM RISK",
    bg: "rgba(255,209,0,0.08)",
    ring: "#ffd100",
  },
  HIGH: {
    color: "#ff7c1f",
    glow: "0 0 25px rgba(255,124,31,0.7)",
    label: "HIGH RISK",
    bg: "rgba(255,124,31,0.1)",
    ring: "#ff7c1f",
  },
  CRITICAL: {
    color: "#ff3b5c",
    glow: "0 0 30px rgba(255,59,92,0.8)",
    label: "CRITICAL",
    bg: "rgba(255,59,92,0.12)",
    ring: "#ff3b5c",
  },
};

export default function ScoreGauge({
  score,
  riskLevel,
  isAnimating = false,
}: ScoreGaugeProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const config = RISK_CONFIG[riskLevel];

  // Animated score count-up
  useEffect(() => {
    if (isAnimating) {
      setDisplayScore(0);
      return;
    }
    let start = 0;
    const end = score;
    const duration = 1500;
    const step = (end / duration) * 16;
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setDisplayScore(end);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [score, isAnimating]);

  // SVG ring progress
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  return (
    <div
      className="glass rounded-2xl p-6 flex flex-col items-center gap-4 animate-slide-up relative overflow-hidden group"
      style={{ 
        animationDelay: "0.1s", 
        background: `radial-gradient(circle at top right, ${config.color}15, transparent 50%), rgba(13, 31, 60, 0.3)`,
        border: `1px solid ${config.color}25`,
        boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.4), 0 0 20px ${config.color}08`,
      }}
    >
      {/* Title */}
      <div className="text-xs font-semibold text-cyber-muted uppercase tracking-widest">
        Scam Probability Score
      </div>

      {/* SVG Gauge */}
      <div className="relative" style={{ width: 180, height: 180 }}>
        <svg
          width="180"
          height="180"
          viewBox="0 0 180 180"
          className="transform -rotate-90"
        >
          {/* Background ring */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="12"
          />
          {/* Colored progress ring */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke={config.color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: "stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)",
              filter: `drop-shadow(0 0 8px ${config.color}88)`,
            }}
          />
          {/* Tick marks */}
          {[0, 20, 40, 60, 80, 100].map((tick) => {
            const angle = (tick / 100) * 360 - 90;
            const rad = (angle * Math.PI) / 180;
            const x1 = 90 + 82 * Math.cos(rad);
            const y1 = 90 + 82 * Math.sin(rad);
            const x2 = 90 + 90 * Math.cos(rad);
            const y2 = 90 + 90 * Math.sin(rad);
            return (
              <line
                key={tick}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1"
              />
            );
          })}
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            className="text-5xl font-black font-mono tabular-nums"
            style={{ color: config.color, textShadow: config.glow }}
          >
            {displayScore}
          </div>
          <div className="text-xs text-cyber-muted font-mono mt-1">/ 100</div>
          <div
            className="mt-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest"
            style={{
              color: config.color,
              background: config.bg,
              border: `1px solid ${config.color}40`,
              boxShadow: `0 0 10px ${config.color}20`,
            }}
          >
            {config.label}
          </div>
        </div>
      </div>

      {/* Risk gradient bar */}
      <div className="w-full space-y-1">
        <div className="flex justify-between text-xs font-mono text-cyber-muted">
          <span>0</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100</span>
        </div>
        <div className="relative h-2 rounded-full overflow-hidden bg-white/5">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, #00ff9d 0%, #00d4ff 25%, #ffd100 50%, #ff7c1f 75%, #ff3b5c 100%)",
            }}
          />
          {/* Pointer */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white shadow-lg transition-all duration-1000"
            style={{
              left: `calc(${displayScore}% - 6px)`,
              background: config.color,
              boxShadow: config.glow,
            }}
          />
        </div>
        <div className="flex justify-between text-xs font-mono text-cyber-muted/60">
          <span>SAFE</span>
          <span>LOW</span>
          <span>MED</span>
          <span>HIGH</span>
          <span>CRIT</span>
        </div>
      </div>
    </div>
  );
}
