"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Globe, MapPin, ShieldAlert, Navigation } from "lucide-react";

interface Hotspot {
  city: string;
  coords: string;
  threat: string;
  intensity: "HIGH" | "CRITICAL" | "MEDIUM";
  activeHubs: number;
}

const HOTSPOTS: Hotspot[] = [
  { city: "Jamtara, JH", coords: "24.13° N, 86.80° E", threat: "Bank OTP Harvesting", intensity: "CRITICAL", activeHubs: 14 },
  { city: "Mewat, HR", coords: "27.88° N, 77.01° E", threat: "Romance/Sextortion Fraud", intensity: "CRITICAL", activeHubs: 19 },
  { city: "Noida Sec-62, UP", coords: "28.53° N, 77.39° E", threat: "Tech Support Remote Impersonation", intensity: "HIGH", activeHubs: 8 },
  { city: "Kolkata, WB", coords: "22.57° N, 88.36° E", threat: "IRS / Custom Agent Phishing", intensity: "HIGH", activeHubs: 11 },
  { city: "Bengaluru, KA", coords: "12.97° N, 77.59° E", threat: "Crypto & Part-time Job Scams", intensity: "MEDIUM", activeHubs: 5 },
];

export default function ThreatMap() {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot>(HOTSPOTS[0]);
  const [activeScanAngle, setActiveScanAngle] = useState(0);

  useEffect(() => {
    // Animate radar line
    const interval = setInterval(() => {
      setActiveScanAngle((prev) => (prev + 1) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass rounded-2xl p-6 animate-slide-up relative overflow-hidden" style={{ animationDelay: "0.45s" }}>
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 cyber-grid-bg opacity-30 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-cyber-accent/10 border border-cyber-accent/30">
            <Globe className="w-5 h-5 text-cyber-accent animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Simulated Threat Origin Map
            </h3>
            <p className="text-[10px] text-cyber-muted font-mono uppercase tracking-wider">
              Scam Center Telemetry Matrix
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Navigation className="w-3.5 h-3.5 text-cyber-green animate-bounce" />
          <span className="text-[10px] font-mono text-cyber-green font-bold">GRID SYNC</span>
        </div>
      </div>

      {/* SVG Map Grid Visualizer */}
      <div className="relative h-44 bg-cyber-bg/60 rounded-xl border border-cyber-border/40 overflow-hidden flex items-center justify-center">
        {/* Radar Sweeper */}
        <div 
          className="absolute w-[200px] h-[200px] rounded-full border border-cyber-accent/5 pointer-events-none"
          style={{
            background: "conic-gradient(from 0deg, rgba(0, 212, 255, 0.08) 0deg, transparent 90deg, transparent 360deg)",
            transform: `rotate(${activeScanAngle}deg)`,
            transformOrigin: "center",
          }}
        />
        
        {/* Simulated Map Contour Lines */}
        <svg width="100%" height="100%" className="absolute inset-0 opacity-15">
          <circle cx="50%" cy="50%" r="40" stroke="rgba(0, 212, 255, 0.2)" strokeWidth="0.5" fill="none" />
          <circle cx="50%" cy="50%" r="70" stroke="rgba(0, 212, 255, 0.15)" strokeWidth="0.5" strokeDasharray="3 3" fill="none" />
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(0, 212, 255, 0.1)" strokeWidth="0.5" />
          <line x1="50%" y1="0" x2="50%" y2="100%" stroke="rgba(0, 212, 255, 0.1)" strokeWidth="0.5" />
        </svg>

        {/* Hotspots */}
        <div className="absolute inset-0">
          {HOTSPOTS.map((spot, i) => {
            const isSelected = selectedHotspot.city === spot.city;
            const isCrit = spot.intensity === "CRITICAL";
            const color = isCrit ? "#ff3b5c" : "#ff7c1f";

            // Positions mapped around center
            const positions = [
              { top: "25%", left: "45%" }, // Jamtara
              { top: "20%", left: "25%" }, // Mewat
              { top: "35%", left: "30%" }, // Noida
              { top: "45%", left: "65%" }, // Kolkata
              { top: "70%", left: "40%" }, // Bengaluru
            ];

            const pos = positions[i] || { top: "50%", left: "50%" };

            return (
              <button
                key={spot.city}
                onClick={() => setSelectedHotspot(spot)}
                className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center group"
                style={{ top: pos.top, left: pos.left }}
              >
                {/* Blinking radar dot */}
                <span 
                  className="absolute w-8 h-8 rounded-full opacity-40 animate-ping"
                  style={{ backgroundColor: color, animationDuration: isCrit ? "1.5s" : "2.5s" }}
                />
                <span 
                  className="absolute w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.8)]"
                  style={{ 
                    backgroundColor: color, 
                    transform: isSelected ? "scale(1.4)" : "scale(1)",
                    border: isSelected ? "1.5px solid #fff" : "none" 
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Hotspot Details */}
      <div className="mt-4 p-3 rounded-xl border border-cyber-border/40 bg-cyber-surface/40 relative z-10">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-black text-white flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-cyber-accent" />
            {selectedHotspot.city}
          </span>
          <span 
            className="text-[9px] font-bold px-1.5 py-0.5 rounded font-mono"
            style={{
              backgroundColor: `${selectedHotspot.intensity === "CRITICAL" ? "#ff3b5c" : "#ff7c1f"}15`,
              color: selectedHotspot.intensity === "CRITICAL" ? "#ff3b5c" : "#ff7c1f",
              border: `1px solid ${selectedHotspot.intensity === "CRITICAL" ? "#ff3b5c" : "#ff7c1f"}30`
            }}
          >
            {selectedHotspot.intensity}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-cyber-border/20 text-[11px]">
          <div>
            <span className="text-cyber-muted block">Primary Threat</span>
            <span className="text-cyber-text font-semibold">{selectedHotspot.threat}</span>
          </div>
          <div>
            <span className="text-cyber-muted block">Active Call Hubs</span>
            <span className="text-cyber-text font-semibold flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-cyber-red animate-pulse" />
              {selectedHotspot.activeHubs} locations
            </span>
          </div>
        </div>
        <div className="text-[9px] text-cyber-muted mt-2 font-mono flex items-center justify-between">
          <span>COORDINATES: {selectedHotspot.coords}</span>
          <span className="text-cyber-accent">TAP DOTS TO SURVEY</span>
        </div>
      </div>
    </div>
  );
}
