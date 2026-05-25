"use client";

import { Database, TrendingUp, AlertTriangle } from "lucide-react";
import { ScamPattern } from "@/types";
import { SCAM_PATTERNS_DB } from "@/types";
import { motion } from "framer-motion";

interface PatternsDatabaseProps {
  detectedPatterns?: ScamPattern[];
}

const CATEGORY_COLORS: Record<string, string> = {
  OTP_SCAM: "#ff3b5c",
  BANK_FRAUD: "#ff7c1f",
  PHISHING: "#9d4edd",
  EMOTIONAL_MANIPULATION: "#ffd100",
  URGENCY_PRESSURE: "#ff7c1f",
  THREAT_INTIMIDATION: "#ff3b5c",
  IMPERSONATION: "#9d4edd",
  PRIZE_LOTTERY: "#00d4ff",
  TECH_SUPPORT: "#00ff9d",
  INVESTMENT_FRAUD: "#ff3b5c",
  ROMANCE_SCAM: "#ff7c1f",
  UNKNOWN: "#4a6890",
};

function formatNumber(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return n.toString();
}

export default function PatternsDatabase({
  detectedPatterns = [],
}: PatternsDatabaseProps) {
  const allPatterns = SCAM_PATTERNS_DB;
  const detectedIds = new Set(detectedPatterns.map((p) => p.id));

  return (
    <div className="glass rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "0.3s" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-cyber-green/10 border border-cyber-green/30">
            <Database className="w-5 h-5 text-cyber-green" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Scam Patterns Database
            </h3>
            <p className="text-xs text-cyber-muted">
              {allPatterns.length} known patterns tracked
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyber-green/10 border border-cyber-green/30">
          <TrendingUp className="w-3 h-3 text-cyber-green" />
          <span className="text-xs font-mono text-cyber-green">LIVE</span>
        </div>
      </div>

      {/* Active detections */}
      {detectedPatterns.length > 0 && (
        <div className="mb-4 p-3 rounded-xl bg-cyber-red/08 border border-cyber-red/20">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-cyber-red" />
            <span className="text-xs font-semibold text-cyber-red uppercase tracking-wider">
              {detectedPatterns.length} Pattern{detectedPatterns.length > 1 ? "s" : ""} Matched in Current Analysis
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {detectedPatterns.map((p) => (
              <span
                key={p.id}
                className="px-2 py-0.5 rounded-full text-xs font-mono font-semibold"
                style={{
                  background: `${CATEGORY_COLORS[p.category] || "#4a6890"}20`,
                  color: CATEGORY_COLORS[p.category] || "#4a6890",
                  border: `1px solid ${CATEGORY_COLORS[p.category] || "#4a6890"}40`,
                }}
              >
                {p.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Pattern list */}
      <div className="space-y-2.5">
        {allPatterns.map((pattern) => {
          const color = CATEGORY_COLORS[pattern.category] || "#4a6890";
          const isActive = detectedIds.has(pattern.id);

          return (
            <motion.div
              key={pattern.id}
              layout
              whileHover={{ scale: 1.01, x: 2 }}
              className="flex items-center gap-3 p-3 rounded-xl transition-all duration-300 cursor-default"
              style={{
                background: isActive ? `${color}10` : "rgba(255,255,255,0.02)",
                border: `1px solid ${isActive ? color + "30" : "rgba(255,255,255,0.06)"}`,
              }}
            >
              {/* Color dot */}
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{
                  background: color,
                  boxShadow: isActive ? `0 0 8px ${color}` : "none",
                }}
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-semibold truncate"
                    style={{ color: isActive ? color : "rgba(200,216,232,0.7)" }}
                  >
                    {pattern.name}
                  </span>
                  {isActive && (
                    <motion.span
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold flex-shrink-0"
                      style={{ background: `${color}20`, color }}
                    >
                      DETECTED
                    </motion.span>
                  )}
                </div>
                <p className="text-[11px] text-cyber-muted truncate mt-0.5">
                  {pattern.description}
                </p>
              </div>

              {/* Occurrence count */}
              <div className="text-right flex-shrink-0">
                <div
                  className="text-sm font-bold font-mono"
                  style={{ color: isActive ? color : "rgba(200,216,232,0.4)" }}
                >
                  {formatNumber(pattern.occurrences)}
                </div>
                <div className="text-[10px] text-cyber-muted">cases</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer stats */}
      <div className="mt-4 pt-4 border-t border-cyber-border/30 grid grid-cols-3 gap-3">
        {[
          { label: "Patterns", value: allPatterns.length.toString(), color: "#00ff9d" },
          {
            label: "Total Cases",
            value: formatNumber(
              allPatterns.reduce((s, p) => s + p.occurrences, 0)
            ),
            color: "#00d4ff",
          },
          {
            label: "Categories",
            value: new Set(allPatterns.map((p) => p.category)).size.toString(),
            color: "#9d4edd",
          },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div
              className="text-lg font-bold font-mono"
              style={{ color: stat.color }}
            >
              {stat.value}
            </div>
            <div className="text-[10px] text-cyber-muted uppercase tracking-wider">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
