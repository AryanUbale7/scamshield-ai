"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, Trash2, Shield, Calendar, ChevronRight } from "lucide-react";
import { RiskLevel } from "@/types";

interface HistoryItem {
  id: string;
  timestamp: string;
  transcript: string;
  score: number;
  riskLevel: RiskLevel;
}

interface ScanHistoryProps {
  onSelect: (transcript: string) => void;
  // Trigger history reload when a new scan occurs
  refreshTrigger: number;
}

const RISK_COLORS: Record<RiskLevel, string> = {
  SAFE: "#00ff9d",
  LOW: "#00d4ff",
  MEDIUM: "#ffd100",
  HIGH: "#ff7c1f",
  CRITICAL: "#ff3b5c",
};

export default function ScanHistory({ onSelect, refreshTrigger }: ScanHistoryProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    loadHistory();
  }, [refreshTrigger]);

  const loadHistory = () => {
    try {
      const stored = localStorage.getItem("scamshield_history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load scan history:", e);
    }
  };

  const handleClear = () => {
    try {
      localStorage.removeItem("scamshield_history");
      setHistory([]);
    } catch (e) {
      console.error("Failed to clear history:", e);
    }
  };

  if (history.length === 0) {
    return (
      <div className="glass rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "0.4s" }}>
        <div className="flex items-center gap-3 mb-4">
          <History className="w-5 h-5 text-cyber-muted" />
          <h3 className="text-sm font-semibold text-white">Scan Session History</h3>
        </div>
        <p className="text-xs text-cyber-muted italic text-center py-6">
          No scans run in this session yet. Run a scan above to save it to history.
        </p>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "0.4s" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <History className="w-5 h-5 text-cyber-accent" />
          <div>
            <h3 className="text-sm font-semibold text-white">Scan Session History</h3>
            <p className="text-[10px] text-cyber-muted font-mono">
              {history.length} analysis reports stored
            </p>
          </div>
        </div>
        <button
          onClick={handleClear}
          className="p-2 rounded-lg text-cyber-muted hover:text-cyber-red hover:bg-cyber-red/10 transition-all duration-200"
          title="Clear scan history"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* History List */}
      <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {history.map((item) => {
            const color = RISK_COLORS[item.riskLevel] || "#00d4ff";
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                whileHover={{ scale: 1.01 }}
                onClick={() => onSelect(item.transcript)}
                className="flex items-center justify-between gap-3 p-3 rounded-xl bg-cyber-card/15 border border-cyber-border/40 hover:border-cyber-accent/30 cursor-pointer transition-all duration-200 group"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded font-mono"
                      style={{
                        backgroundColor: `${color}15`,
                        color: color,
                        border: `1px solid ${color}30`,
                      }}
                    >
                      {item.riskLevel}
                    </span>
                    <span className="text-[9px] text-cyber-muted flex items-center gap-1 font-mono">
                      <Calendar className="w-2.5 h-2.5" />
                      {item.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-cyber-text/80 truncate font-mono">
                    {item.transcript}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="text-right">
                    <span
                      className="text-xs font-bold font-mono"
                      style={{ color }}
                    >
                      {item.score}%
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-cyber-muted group-hover:text-cyber-accent transition-colors duration-200" />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
