"use client";

import { useEffect, useState } from "react";
import { X, AlertTriangle, Shield, ShieldAlert, Phone } from "lucide-react";
import { RiskLevel } from "@/types";

interface AlertBannerProps {
  riskLevel: RiskLevel;
  categories: string[];
  score: number;
  onDismiss: () => void;
}

export default function AlertBanner({
  riskLevel,
  categories,
  score,
  onDismiss,
}: AlertBannerProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setDismissed(false);
    setVisible(false);
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, [riskLevel, score]);

  if (dismissed || (riskLevel !== "HIGH" && riskLevel !== "CRITICAL")) {
    return null;
  }

  const isCritical = riskLevel === "CRITICAL";

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(() => {
      setDismissed(true);
      onDismiss();
    }, 300);
  };

  const categoryLabels = categories
    .map((c) =>
      c
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (l) => l.toUpperCase())
    )
    .join(", ");

  return (
    <div
      className={`relative overflow-hidden rounded-2xl transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      } ${isCritical ? "alert-critical" : ""}`}
      style={{
        background: isCritical
          ? "linear-gradient(135deg, rgba(255,59,92,0.2) 0%, rgba(255,59,92,0.05) 100%)"
          : "linear-gradient(135deg, rgba(255,124,31,0.2) 0%, rgba(255,124,31,0.05) 100%)",
        border: `1px solid ${isCritical ? "rgba(255,59,92,0.5)" : "rgba(255,124,31,0.5)"}`,
        boxShadow: isCritical
          ? "0 0 30px rgba(255,59,92,0.2), 0 0 60px rgba(255,59,92,0.05)"
          : "0 0 20px rgba(255,124,31,0.15)",
      }}
    >
      {/* Scan line effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            ${isCritical ? "rgba(255,59,92,0.03)" : "rgba(255,124,31,0.03)"} 2px,
            ${isCritical ? "rgba(255,59,92,0.03)" : "rgba(255,124,31,0.03)"} 4px
          )`,
        }}
      />

      <div className="relative p-5">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
              isCritical ? "bg-cyber-red/20" : "bg-cyber-orange/20"
            }`}
          >
            {isCritical ? (
              <ShieldAlert
                className="w-6 h-6 text-cyber-red animate-pulse"
                strokeWidth={2}
              />
            ) : (
              <AlertTriangle className="w-6 h-6 text-cyber-orange" strokeWidth={2} />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h3
                className="text-base font-black tracking-wider uppercase"
                style={{
                  color: isCritical ? "#ff3b5c" : "#ff7c1f",
                  textShadow: isCritical
                    ? "0 0 10px rgba(255,59,92,0.8)"
                    : "0 0 10px rgba(255,124,31,0.6)",
                }}
              >
                {isCritical ? "🚨 CRITICAL THREAT DETECTED" : "⚠️ HIGH RISK DETECTED"}
              </h3>
              <span
                className="px-2 py-0.5 rounded-full text-xs font-mono font-bold"
                style={{
                  background: isCritical ? "rgba(255,59,92,0.2)" : "rgba(255,124,31,0.2)",
                  color: isCritical ? "#ff3b5c" : "#ff7c1f",
                  border: `1px solid ${isCritical ? "rgba(255,59,92,0.4)" : "rgba(255,124,31,0.4)"}`,
                }}
              >
                {score}/100
              </span>
            </div>

            <p className="text-sm text-cyber-text mb-3">
              This call transcript contains multiple indicators of{" "}
              <strong style={{ color: isCritical ? "#ff3b5c" : "#ff7c1f" }}>
                {categoryLabels}
              </strong>
              . Do not share any personal information, OTPs, or financial details.
            </p>

            {/* Action buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              <a
                href="tel:1930"
                id="report-cyber-crime-btn"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105"
                style={{
                  background: isCritical ? "rgba(255,59,92,0.2)" : "rgba(255,124,31,0.2)",
                  color: isCritical ? "#ff3b5c" : "#ff7c1f",
                  border: `1px solid ${isCritical ? "rgba(255,59,92,0.5)" : "rgba(255,124,31,0.5)"}`,
                }}
              >
                <Phone className="w-3.5 h-3.5" />
                Report: 1930
              </a>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono text-cyber-muted border border-cyber-border">
                <Shield className="w-3.5 h-3.5" />
                National Cyber Crime Helpline
              </div>
            </div>
          </div>

          {/* Dismiss */}
          <button
            id="dismiss-alert-btn"
            onClick={handleDismiss}
            className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-cyber-muted hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
