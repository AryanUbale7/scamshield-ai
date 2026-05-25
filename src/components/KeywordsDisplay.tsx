"use client";

import { SuspiciousKeyword, ScamCategory } from "@/types";
import { AlertCircle, Tag } from "lucide-react";

interface KeywordsDisplayProps {
  keywords: SuspiciousKeyword[];
  transcript: string;
}

const CATEGORY_COLORS: Record<ScamCategory, { bg: string; text: string; border: string; label: string }> = {
  OTP_SCAM: { bg: "rgba(255,59,92,0.15)", text: "#ff3b5c", border: "rgba(255,59,92,0.4)", label: "OTP" },
  BANK_FRAUD: { bg: "rgba(255,124,31,0.15)", text: "#ff7c1f", border: "rgba(255,124,31,0.4)", label: "Bank" },
  PHISHING: { bg: "rgba(157,78,221,0.15)", text: "#9d4edd", border: "rgba(157,78,221,0.4)", label: "Phish" },
  EMOTIONAL_MANIPULATION: { bg: "rgba(255,209,0,0.15)", text: "#ffd100", border: "rgba(255,209,0,0.4)", label: "Manip" },
  URGENCY_PRESSURE: { bg: "rgba(255,124,31,0.12)", text: "#ff7c1f", border: "rgba(255,124,31,0.35)", label: "Urgent" },
  THREAT_INTIMIDATION: { bg: "rgba(255,59,92,0.18)", text: "#ff3b5c", border: "rgba(255,59,92,0.5)", label: "Threat" },
  IMPERSONATION: { bg: "rgba(157,78,221,0.12)", text: "#9d4edd", border: "rgba(157,78,221,0.35)", label: "Impersonate" },
  PRIZE_LOTTERY: { bg: "rgba(0,212,255,0.12)", text: "#00d4ff", border: "rgba(0,212,255,0.35)", label: "Lottery" },
  TECH_SUPPORT: { bg: "rgba(0,255,157,0.12)", text: "#00ff9d", border: "rgba(0,255,157,0.35)", label: "TechScam" },
  INVESTMENT_FRAUD: { bg: "rgba(255,59,92,0.12)", text: "#ff3b5c", border: "rgba(255,59,92,0.35)", label: "InvFraud" },
  ROMANCE_SCAM: { bg: "rgba(255,124,31,0.12)", text: "#ff7c1f", border: "rgba(255,124,31,0.35)", label: "Romance" },
  UNKNOWN: { bg: "rgba(74,104,144,0.15)", text: "#4a6890", border: "rgba(74,104,144,0.4)", label: "Unknown" },
};

const SEVERITY_ICON: Record<string, { color: string; label: string }> = {
  HIGH: { color: "#ff3b5c", label: "HIGH" },
  MEDIUM: { color: "#ffd100", label: "MED" },
  LOW: { color: "#00d4ff", label: "LOW" },
};

function highlightTranscript(transcript: string, keywords: SuspiciousKeyword[]): React.ReactNode[] {
  if (!keywords.length) return [<span key="0">{transcript}</span>];

  const sortedKeywords = [...keywords].sort((a, b) => b.word.length - a.word.length);
  const regex = new RegExp(
    `(${sortedKeywords.map((k) => k.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "gi"
  );

  const parts = transcript.split(regex);
  return parts.map((part, i) => {
    const match = sortedKeywords.find(
      (k) => k.word.toLowerCase() === part.toLowerCase()
    );
    if (match) {
      const cfg = CATEGORY_COLORS[match.category] || CATEGORY_COLORS.UNKNOWN;
      return (
        <mark
          key={i}
          className="rounded px-0.5 font-semibold cursor-default transition-all"
          style={{
            background: cfg.bg,
            color: cfg.text,
            border: `1px solid ${cfg.border}`,
            boxShadow: `0 0 6px ${cfg.border}`,
          }}
          title={`${match.category}: ${match.context || ""}`}
        >
          {part}
        </mark>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function KeywordsDisplay({
  keywords,
  transcript,
}: KeywordsDisplayProps) {
  if (keywords.length === 0) {
    return (
      <div className="glass rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <div className="flex items-center gap-3 mb-4">
          <Tag className="w-5 h-5 text-cyber-green" />
          <h3 className="text-sm font-semibold text-white">Suspicious Keywords</h3>
        </div>
        <div className="flex items-center gap-2 text-cyber-green text-sm font-mono">
          <div className="w-2 h-2 rounded-full bg-cyber-green" />
          No suspicious keywords detected
        </div>
      </div>
    );
  }

  const highCount = keywords.filter((k) => k.severity === "HIGH").length;
  const medCount = keywords.filter((k) => k.severity === "MEDIUM").length;
  const lowCount = keywords.filter((k) => k.severity === "LOW").length;

  return (
    <div className="space-y-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
      {/* Keywords Panel */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-cyber-orange" />
            <h3 className="text-sm font-semibold text-white">
              Suspicious Keywords{" "}
              <span className="text-cyber-orange ml-1">({keywords.length})</span>
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            {highCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-cyber-red/20 text-cyber-red border border-cyber-red/30">
                {highCount} HIGH
              </span>
            )}
            {medCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-cyber-yellow/20 text-cyber-yellow border border-cyber-yellow/30">
                {medCount} MED
              </span>
            )}
            {lowCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-cyber-accent/20 text-cyber-accent border border-cyber-accent/30">
                {lowCount} LOW
              </span>
            )}
          </div>
        </div>

        {/* Keyword badges */}
        <div className="flex flex-wrap gap-2">
          {keywords.map((kw, i) => {
            const catCfg = CATEGORY_COLORS[kw.category] || CATEGORY_COLORS.UNKNOWN;
            const sevCfg = SEVERITY_ICON[kw.severity] || SEVERITY_ICON.LOW;
            return (
              <div
                key={i}
                className="keyword-badge group relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-semibold cursor-default"
                style={{
                  background: catCfg.bg,
                  color: catCfg.text,
                  border: `1px solid ${catCfg.border}`,
                }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: sevCfg.color }}
                />
                &ldquo;{kw.word}&rdquo;
                <span
                  className="text-[10px] px-1 py-0.5 rounded font-bold ml-1"
                  style={{
                    background: `${sevCfg.color}22`,
                    color: sevCfg.color,
                  }}
                >
                  {sevCfg.label}
                </span>

                {/* Tooltip */}
                {kw.context && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex bg-cyber-card border border-cyber-border rounded-lg px-3 py-2 text-xs text-cyber-text whitespace-nowrap z-50 shadow-xl">
                    {kw.context}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-cyber-border" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Highlighted Transcript */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-2 rounded-full bg-cyber-accent animate-pulse" />
          <h3 className="text-sm font-semibold text-white">
            Annotated Transcript
          </h3>
          <span className="text-xs text-cyber-muted">
            (hover keywords for context)
          </span>
        </div>
        <p className="text-sm text-cyber-text leading-relaxed font-mono">
          {highlightTranscript(transcript, keywords)}
        </p>
      </div>
    </div>
  );
}
