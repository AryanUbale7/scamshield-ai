"use client";

import { Brain, Lightbulb, ShieldCheck, AlertOctagon, Download } from "lucide-react";
import { RiskLevel } from "@/types";

interface AIExplanationProps {
  explanation: string;
  riskLevel: RiskLevel;
  categories: string[];
  transcript?: string;
}

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  OTP_SCAM: "Requesting OTP codes to compromise accounts",
  BANK_FRAUD: "Impersonating bank officials to steal financial info",
  PHISHING: "Harvesting credentials via deceptive links/calls",
  EMOTIONAL_MANIPULATION: "Exploiting emotions to bypass rational judgment",
  URGENCY_PRESSURE: "Artificial time pressure to prevent clear thinking",
  THREAT_INTIMIDATION: "Using fear and legal threats to coerce victims",
  IMPERSONATION: "Pretending to be from trusted institutions",
  PRIZE_LOTTERY: "Fake prizes to extract processing fees",
  TECH_SUPPORT: "Unauthorized remote access under pretense of help",
  INVESTMENT_FRAUD: "Guaranteed returns to lure investment fraud",
  ROMANCE_SCAM: "Emotional bonds to extract money/information",
  UNKNOWN: "Unclassified suspicious activity",
};

export default function AIExplanation({
  explanation,
  riskLevel,
  categories,
  transcript = "",
}: AIExplanationProps) {
  const isSafe = riskLevel === "SAFE" || riskLevel === "LOW";

  const handleDownloadReport = () => {
    const reportText = `============================================================
SCAMSHIELD AI - THREAT ASSESSMENT REPORT
============================================================
Generated: ${new Date().toLocaleString()}
Risk Level: ${riskLevel}
Detected Tactics: ${categories.join(", ") || "None"}

------------------------------------------------------------
ORIGINAL TRANSCRIPT:
------------------------------------------------------------
${transcript || "Not provided"}

------------------------------------------------------------
AI ANALYSIS EXPLANATION:
------------------------------------------------------------
${explanation}

------------------------------------------------------------
SAFETY PROTOCOLS & RECOMMENDATIONS:
------------------------------------------------------------
- NEVER share OTP codes, bank credentials, or credit card info.
- Bank executives and law enforcement will NEVER threaten arrest or demand immediate settlements over the phone.
- If suspicious, hang up immediately and report to local authorities.
- Toll-free Cybercrime helpline: 1930. Website: cybercrime.gov.in.
============================================================`;

    const blob = new Blob([reportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ScamShield_Report_${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="glass rounded-2xl p-6 animate-slide-up"
      style={{ animationDelay: "0.25s" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{
            background: isSafe ? "rgba(0,255,157,0.12)" : "rgba(157,78,221,0.12)",
            border: `1px solid ${isSafe ? "rgba(0,255,157,0.3)" : "rgba(157,78,221,0.3)"}`,
          }}
        >
          <Brain
            className="w-5 h-5"
            style={{ color: isSafe ? "#00ff9d" : "#9d4edd" }}
          />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">
            AI Analysis Explanation
          </h3>
          <p className="text-xs text-cyber-muted">Powered by Gemini AI</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {isSafe ? (
            <ShieldCheck className="w-5 h-5 text-cyber-green" />
          ) : (
            <AlertOctagon className="w-5 h-5 text-cyber-purple animate-pulse" />
          )}
          <button
            onClick={handleDownloadReport}
            className="p-1.5 rounded-lg border border-cyber-border/40 text-cyber-muted hover:text-cyber-accent hover:border-cyber-accent/30 transition-all duration-200"
            title="Download Assessment Report"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Explanation text */}
      <div
        className="p-4 rounded-xl mb-4 text-sm text-cyber-text leading-relaxed"
        style={{
          background: isSafe
            ? "rgba(0,255,157,0.04)"
            : "rgba(157,78,221,0.06)",
          border: `1px solid ${isSafe ? "rgba(0,255,157,0.15)" : "rgba(157,78,221,0.2)"}`,
        }}
      >
        <div className="flex items-start gap-2">
          <Lightbulb
            className="w-4 h-4 mt-0.5 flex-shrink-0"
            style={{ color: isSafe ? "#00ff9d" : "#9d4edd" }}
          />
          <p>{explanation}</p>
        </div>
      </div>

      {/* Detected Tactics */}
      {categories.length > 0 && !isSafe && (
        <div>
          <p className="text-xs text-cyber-muted uppercase tracking-widest mb-3 font-semibold">
            Detected Manipulation Tactics
          </p>
          <div className="space-y-2">
            {categories.map((cat) => (
              <div
                key={cat}
                className="flex items-center gap-3 p-2.5 rounded-lg"
                style={{
                  background: "rgba(157,78,221,0.06)",
                  border: "1px solid rgba(157,78,221,0.15)",
                }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-cyber-purple flex-shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-cyber-purple font-mono">
                    {cat.replace(/_/g, " ")}
                  </span>
                  <p className="text-xs text-cyber-muted mt-0.5">
                    {CATEGORY_DESCRIPTIONS[cat] || "Suspicious pattern detected"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Safe result */}
      {isSafe && (
        <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(0,255,157,0.06)", border: "1px solid rgba(0,255,157,0.15)" }}>
          <ShieldCheck className="w-5 h-5 text-cyber-green flex-shrink-0" />
          <p className="text-xs text-cyber-green">
            This transcript appears legitimate. No significant fraud patterns were detected.
          </p>
        </div>
      )}

      {/* Safety tip */}
      <div className="mt-4 pt-4 border-t border-cyber-border/30">
        <p className="text-xs text-cyber-muted">
          💡 <strong className="text-cyber-text">Remember:</strong> Never share OTPs, passwords, or financial
          details over phone. Banks and government agencies never ask for these.
        </p>
      </div>
    </div>
  );
}
