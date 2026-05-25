"use client";

import { WorkflowStep } from "@/types";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Loader2,
  XCircle,
  Database,
  Brain,
  TrendingUp,
  Bell,
  FileInput,
} from "lucide-react";

interface WorkflowPipelineProps {
  steps: WorkflowStep[];
  isRunning: boolean;
  processingTime?: number;
}

const STEP_ICONS = [FileInput, Brain, TrendingUp, Bell, Database];
const STEP_COLORS = ["#00d4ff", "#9d4edd", "#ffd100", "#ff7c1f", "#00ff9d"];

export default function WorkflowPipeline({
  steps,
  isRunning,
  processingTime,
}: WorkflowPipelineProps) {
  return (
    <div className="glass rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "0.15s" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-cyber-accent animate-pulse" />
          <h3 className="text-sm font-semibold text-white">
            Antigravity Workflow Pipeline
          </h3>
        </div>
        {processingTime && (
          <span className="text-xs font-mono text-cyber-muted">
            <span className="text-cyber-green">{processingTime}ms</span> total
          </span>
        )}
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step, index) => {
          const Icon = STEP_ICONS[index] || Circle;
          const color = STEP_COLORS[index] || "#00d4ff";
          const isDone = step.status === "DONE";
          const isRunningStep = step.status === "RUNNING";
          const isError = step.status === "ERROR";
          const isPending = step.status === "PENDING";

          return (
            <motion.div 
              key={step.id} 
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className="absolute left-[19px] top-10 w-px h-3 transition-all duration-500"
                  style={{
                    background: isDone
                      ? color
                      : "rgba(255,255,255,0.08)",
                  }}
                />
              )}

              <motion.div
                layout
                whileHover={{ scale: 1.01 }}
                className="flex items-start gap-3 p-3 rounded-xl transition-all duration-300 cursor-default"
                style={{
                  background: isRunningStep
                    ? `radial-gradient(circle at left, ${color}15, transparent), rgba(13, 31, 60, 0.2)`
                    : isDone
                    ? `rgba(13, 31, 60, 0.1)`
                    : "transparent",
                  border: isRunningStep
                    ? `1px solid ${color}40`
                    : isDone
                    ? `1px solid ${color}15`
                    : "1px solid rgba(255,255,255,0.02)",
                  boxShadow: isRunningStep ? `0 0 15px ${color}10` : "none",
                }}
              >
                {/* Status icon */}
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
                  style={{
                    background: isDone
                      ? `${color}18`
                      : isRunningStep
                      ? `${color}22`
                      : "rgba(255,255,255,0.04)",
                    border: `1px solid ${isDone || isRunningStep ? color + "40" : "rgba(255,255,255,0.08)"}`,
                  }}
                >
                  {isError ? (
                    <XCircle className="w-4 h-4" style={{ color: "#ff3b5c" }} />
                  ) : isDone ? (
                    <CheckCircle2 className="w-4 h-4" style={{ color }} />
                  ) : isRunningStep ? (
                    <Loader2
                      className="w-4 h-4 animate-spin"
                      style={{ color }}
                    />
                  ) : (
                    <Icon
                      className="w-4 h-4"
                      style={{ color: isPending ? "rgba(255,255,255,0.2)" : color }}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-semibold"
                      style={{
                        color: isDone
                          ? color
                          : isRunningStep
                          ? color
                          : isError
                          ? "#ff3b5c"
                          : "rgba(255,255,255,0.3)",
                      }}
                    >
                      {step.name}
                    </span>
                    {isRunningStep && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold animate-pulse" style={{ background: `${color}20`, color }}>
                        ACTIVE
                      </span>
                    )}
                    {isDone && (
                      <span className="text-[10px] text-cyber-muted font-mono">✓</span>
                    )}
                  </div>
                  <p
                    className="text-xs mt-0.5"
                    style={{
                      color: isDone || isRunningStep ? "rgba(200,216,232,0.6)" : "rgba(255,255,255,0.18)",
                    }}
                  >
                    {step.description}
                  </p>
                </div>

                {/* Step index */}
                <div
                  className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold"
                  style={{
                    background: isDone ? `${color}20` : "rgba(255,255,255,0.04)",
                    color: isDone ? color : "rgba(255,255,255,0.2)",
                  }}
                >
                  {index + 1}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Pipeline status */}
      <div className="mt-4 pt-4 border-t border-cyber-border/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isRunning
                ? "bg-cyber-accent animate-pulse"
                : steps.every((s) => s.status === "DONE")
                ? "bg-cyber-green"
                : "bg-cyber-muted"
            }`}
          />
          <span className="text-xs font-mono text-cyber-muted">
            {isRunning
              ? "Pipeline running..."
              : steps.every((s) => s.status === "DONE")
              ? "Pipeline complete"
              : "Awaiting input"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {steps.map((step, i) => (
            <div
              key={step.id}
              className="w-6 h-1 rounded-full transition-all duration-500"
              style={{
                background:
                  step.status === "DONE"
                    ? STEP_COLORS[i]
                    : step.status === "RUNNING"
                    ? `${STEP_COLORS[i]}80`
                    : "rgba(255,255,255,0.08)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
