"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, AlertTriangle, ShieldCheck, MapPin } from "lucide-react";

interface ThreatItem {
  id: string;
  type: string;
  location: string;
  time: string;
  risk: "HIGH" | "CRITICAL" | "MEDIUM";
  score: number;
}

const THREAT_TYPES = [
  "CBI Impersonation FIR Threat",
  "Aadhaar Suspension Money Laundering",
  "SBI Blocked Account OTP Scavenge",
  "KBC 25 Lakh Lottery Claim Fraud",
  "Electricity Bill Due Disconnection Scam",
  "Amazon Gift Card Part-time Job Offer",
  "FedEx Customs Parcel Drugs Scam",
];

const LOCATIONS = [
  "New Delhi, DL",
  "Mumbai, MH",
  "Bengaluru, KA",
  "Hyderabad, TG",
  "Chennai, TN",
  "Kolkata, WB",
  "Pune, MH",
  "Ahmedabad, GJ",
];

export default function LiveThreatFeed() {
  const [threats, setThreats] = useState<ThreatItem[]>([]);

  // Generate initial threats
  useEffect(() => {
    const initial: ThreatItem[] = Array.from({ length: 4 }).map((_, i) => ({
      id: Math.random().toString(),
      type: THREAT_TYPES[Math.floor(Math.random() * THREAT_TYPES.length)],
      location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
      time: `${i * 2 + 1}m ago`,
      risk: Math.random() > 0.6 ? "CRITICAL" : Math.random() > 0.3 ? "HIGH" : "MEDIUM",
      score: Math.floor(Math.random() * 40) + 55,
    }));
    setThreats(initial);

    // Simulate new threats incoming
    const interval = setInterval(() => {
      const newThreat: ThreatItem = {
        id: Math.random().toString(),
        type: THREAT_TYPES[Math.floor(Math.random() * THREAT_TYPES.length)],
        location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
        time: "Just now",
        risk: Math.random() > 0.5 ? "CRITICAL" : Math.random() > 0.25 ? "HIGH" : "MEDIUM",
        score: Math.floor(Math.random() * 45) + 55,
      };

      setThreats((prev) => {
        // Keep last 4 items
        const updated = [
          newThreat,
          ...prev.map((t) => (t.time === "Just now" ? { ...t, time: "1m ago" } : t)),
        ];
        return updated.slice(0, 4);
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass rounded-2xl p-6 animate-slide-up relative overflow-hidden" style={{ animationDelay: "0.35s" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-red opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyber-red"></span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-1.5">
              Live Threat Intelligence
            </h3>
            <p className="text-[10px] text-cyber-muted uppercase tracking-wider font-mono">
              National Detection Matrix
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyber-red/10 border border-cyber-red/30">
          <Radio className="w-3.5 h-3.5 text-cyber-red animate-pulse" />
          <span className="text-[10px] font-mono font-bold text-cyber-red uppercase tracking-widest">
            MONITORING
          </span>
        </div>
      </div>

      {/* Threat List */}
      <div className="space-y-3 min-h-[280px]">
        <AnimatePresence initial={false}>
          {threats.map((threat) => {
            const isCrit = threat.risk === "CRITICAL";
            const color = isCrit ? "#ff3b5c" : threat.risk === "HIGH" ? "#ff7c1f" : "#ffd100";

            return (
              <motion.div
                key={threat.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="p-3 rounded-xl border relative overflow-hidden group cursor-default transition-all duration-300 hover:bg-cyber-card/20"
                style={{
                  background: "rgba(13, 31, 60, 0.15)",
                  borderColor: `${color}15`,
                }}
              >
                {/* Visual hazard line accent */}
                <div 
                  className="absolute left-0 top-0 bottom-0 w-[3px]"
                  style={{ backgroundColor: color }}
                />

                <div className="flex items-start justify-between gap-3 pl-1.5">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span 
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded font-mono"
                        style={{
                          backgroundColor: `${color}15`,
                          color: color,
                          border: `1px solid ${color}30`
                        }}
                      >
                        {threat.risk}
                      </span>
                      <span className="text-[10px] text-cyber-muted font-mono flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-cyber-muted" />
                        {threat.location}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-cyber-text truncate">
                      {threat.type}
                    </h4>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span 
                      className="text-xs font-black font-mono"
                      style={{ color }}
                    >
                      {threat.score}%
                    </span>
                    <div className="text-[9px] text-cyber-muted font-mono">{threat.time}</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
