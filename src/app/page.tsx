"use client";

import { useState, useRef, useEffect } from "react";
import { Shield, Zap, Activity, Settings, Github, ExternalLink, ChevronRight, Check, Database, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import CyberBackground from "@/components/CyberBackground";
import TranscriptInput from "@/components/TranscriptInput";
import ScoreGauge from "@/components/ScoreGauge";
import KeywordsDisplay from "@/components/KeywordsDisplay";
import AIExplanation from "@/components/AIExplanation";
import WorkflowPipeline from "@/components/WorkflowPipeline";
import AlertBanner from "@/components/AlertBanner";
import PatternsDatabase from "@/components/PatternsDatabase";
import LiveThreatFeed from "@/components/LiveThreatFeed";
import ScanHistory from "@/components/ScanHistory";
import ThreatMap from "@/components/ThreatMap";
import { AnalysisResult, WorkflowStep, WORKFLOW_STEPS } from "@/types";

const STATS = [
  { label: "Scams Detected", value: "12,847", color: "#ff3b5c", icon: AlertCircle },
  { label: "Patterns Tracked", value: "5+", color: "#00d4ff", icon: Database },
  { label: "Accuracy Rate", value: "94.7%", color: "#00ff9d", icon: Check },
  { label: "Avg Response", value: "<2s", color: "#9d4edd", icon: Zap },
];

function createPendingSteps(): WorkflowStep[] {
  return WORKFLOW_STEPS.map((s) => ({ ...s, status: "PENDING" as const }));
}

export default function Home() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>(createPendingSteps());
  const [isWorkflowRunning, setIsWorkflowRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadedTranscript, setLoadedTranscript] = useState("");
  const [refreshHistoryTrigger, setRefreshHistoryTrigger] = useState(0);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Animate workflow steps sequentially during analysis
  useEffect(() => {
    if (!isAnalyzing) return;

    setIsWorkflowRunning(true);
    const steps = createPendingSteps();
    setWorkflowSteps(steps);

    const delays = [0, 400, 800, 1200, 1600];
    const timers: ReturnType<typeof setTimeout>[] = [];

    delays.forEach((delay, index) => {
      const t1 = setTimeout(() => {
        setWorkflowSteps((prev) =>
          prev.map((s, i) =>
            i === index ? { ...s, status: "RUNNING" } : s
          )
        );
      }, delay);
      timers.push(t1);
    });

    return () => timers.forEach(clearTimeout);
  }, [isAnalyzing]);

  const handleAnalyze = async (transcript: string) => {
    setIsAnalyzing(true);
    setResult(null);
    setError(null);
    setAlertDismissed(false);
    setWorkflowSteps(createPendingSteps());

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Analysis failed");
      }

      const data: AnalysisResult = await res.json();

      // Save to local history
      try {
        const stored = localStorage.getItem("scamshield_history");
        const historyList = stored ? JSON.parse(stored) : [];
        const newItem = {
          id: Math.random().toString(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          transcript,
          score: data.scamProbability,
          riskLevel: data.riskLevel,
        };
        localStorage.setItem("scamshield_history", JSON.stringify([newItem, ...historyList].slice(0, 10)));
        setRefreshHistoryTrigger((prev) => prev + 1);
      } catch (e) {
        console.error("Failed to save scan history:", e);
      }

      // Mark all steps done
      setWorkflowSteps(
        WORKFLOW_STEPS.map((s) => ({ ...s, status: "DONE" as const }))
      );
      setIsWorkflowRunning(false);
      setResult(data);

      // Scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      setWorkflowSteps((prev) =>
        prev.map((s) =>
          s.status === "RUNNING" ? { ...s, status: "ERROR" } : s
        )
      );
      setIsWorkflowRunning(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-bg relative overflow-hidden">
      <CyberBackground />

      {/* Main content */}
      <div className="relative z-10">
        {/* ── NAVBAR ─────────────────────────────────────── */}
        <nav className="sticky top-0 z-50 border-b border-cyber-border/40 glass-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyber-accent to-cyan-400 opacity-20 animate-pulse" />
                <div className="relative w-9 h-9 rounded-xl bg-cyber-accent/10 border border-cyber-accent/40 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-cyber-accent" />
                </div>
              </div>
              <div>
                <span className="text-white font-black text-lg tracking-tight">
                  Scam<span className="text-cyber-accent text-glow-accent">Shield</span>
                </span>
                <span className="ml-1.5 text-xs font-semibold text-cyber-purple bg-cyber-purple/10 border border-cyber-purple/30 px-1.5 py-0.5 rounded-full">
                  AI
                </span>
              </div>
            </div>

            {/* Nav links */}
            <div className="hidden md:flex items-center gap-1 bg-cyber-card/45 border border-cyber-border/40 rounded-full p-1 backdrop-blur-md">
              {[
                { label: "Dashboard", href: "#" },
                { label: "Patterns DB", href: "#patterns" },
                { label: "About", href: "#about" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-xs font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full text-cyber-text/80 hover:text-cyber-accent hover:bg-cyber-accent/10 transition-all duration-300"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyber-green/10 border border-cyber-green/30">
                <div className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse" />
                <span className="text-xs font-mono text-cyber-green">AI ONLINE</span>
              </div>
              <button
                id="settings-btn"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-cyber-muted hover:text-white hover:bg-white/5 transition-all border border-cyber-border/40"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </nav>

        {/* ── HERO SECTION ───────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-12"
          >
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyber-accent/10 border border-cyber-accent/30 mb-6 shadow-[0_0_15px_rgba(0,212,255,0.2)] backdrop-blur-md"
            >
              <Zap className="w-4 h-4 text-cyber-accent animate-pulse" />
              <span className="text-xs font-semibold text-cyber-accent tracking-widest uppercase">
                Powered by Gemini AI + Antigravity Workflow
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tight"
            >
              Detect Scams
              <span
                className="block mt-2"
                style={{
                  background: "linear-gradient(135deg, #00d4ff 0%, #9d4edd 50%, #00ff9d 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Before They Strike
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-cyber-text/80 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed font-medium"
            >
              AI-powered real-time analysis of call transcripts. Detect OTP scams,
              bank fraud, phishing attempts, and manipulation tactics with instant
              probability scoring.
            </motion.p>

            {/* Stats bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto"
            >
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + (i * 0.1), duration: 0.4 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="glass rounded-2xl p-4 text-center cursor-default relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="mb-2 flex justify-center">
                    <stat.icon 
                      className="w-6 h-6 filter drop-shadow-md" 
                      style={{ 
                        color: stat.color,
                        filter: `drop-shadow(0 0 6px ${stat.color}88)`
                      }} 
                    />
                  </div>
                  <div
                    className="text-2xl sm:text-3xl font-black font-mono tracking-tight mb-1"
                    style={{ color: stat.color, textShadow: `0 0 20px ${stat.color}40` }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs font-medium text-cyber-muted uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── MAIN GRID ─────────────────────────────── */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left column: Input + Results */}
            <div className="lg:col-span-2 space-y-6">
              {/* Transcript Input */}
              <TranscriptInput
                onAnalyze={handleAnalyze}
                isAnalyzing={isAnalyzing}
                initialTranscript={loadedTranscript}
              />

              {/* Error */}
              {error && (
                <div className="glass rounded-2xl p-4 border border-cyber-red/40 bg-cyber-red/05 animate-slide-up">
                  <p className="text-sm text-cyber-red flex items-center gap-2">
                    <span>⚠</span> {error}
                  </p>
                </div>
              )}

              {/* Results section */}
              {result && (
                <div ref={resultsRef} className="space-y-6">
                  {/* Alert Banner */}
                  {result.alertTriggered && !alertDismissed && (
                    <AlertBanner
                      riskLevel={result.riskLevel}
                      categories={result.categories}
                      score={result.scamProbability}
                      onDismiss={() => setAlertDismissed(true)}
                    />
                  )}

                  {/* Score + Quick Stats */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <ScoreGauge
                      score={result.scamProbability}
                      riskLevel={result.riskLevel}
                    />

                    {/* Quick stats card */}
                    <div className="glass rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "0.12s" }}>
                      <h3 className="text-xs font-semibold text-cyber-muted uppercase tracking-widest mb-4">
                        Analysis Summary
                      </h3>
                      <div className="space-y-3">
                        {[
                          {
                            label: "Risk Level",
                            value: result.riskLevel,
                            color: result.riskLevel === "CRITICAL" ? "#ff3b5c"
                              : result.riskLevel === "HIGH" ? "#ff7c1f"
                              : result.riskLevel === "MEDIUM" ? "#ffd100"
                              : result.riskLevel === "LOW" ? "#00d4ff"
                              : "#00ff9d",
                          },
                          {
                            label: "Scam Probability",
                            value: `${result.scamProbability}%`,
                            color: result.scamProbability >= 60 ? "#ff3b5c" : result.scamProbability >= 40 ? "#ffd100" : "#00ff9d",
                          },
                          {
                            label: "Keywords Found",
                            value: result.suspiciousKeywords.length.toString(),
                            color: result.suspiciousKeywords.length > 5 ? "#ff7c1f" : "#00d4ff",
                          },
                          {
                            label: "Categories Detected",
                            value: result.categories.length.toString(),
                            color: "#9d4edd",
                          },
                          {
                            label: "Processing Time",
                            value: `${result.processingTime}ms`,
                            color: "#00ff9d",
                          },
                          {
                            label: "Alert Triggered",
                            value: result.alertTriggered ? "YES" : "NO",
                            color: result.alertTriggered ? "#ff3b5c" : "#00ff9d",
                          },
                        ].map((item) => (
                          <div key={item.label} className="flex items-center justify-between">
                            <span className="text-xs text-cyber-muted">{item.label}</span>
                            <span
                              className="text-xs font-bold font-mono"
                              style={{ color: item.color }}
                            >
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Categories */}
                      {result.categories.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-cyber-border/30">
                          <p className="text-xs text-cyber-muted mb-2">Detected Categories</p>
                          <div className="flex flex-wrap gap-1.5">
                            {result.categories.map((cat) => (
                              <span
                                key={cat}
                                className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyber-purple/15 text-cyber-purple border border-cyber-purple/25"
                              >
                                {cat.replace(/_/g, " ")}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Keywords */}
                  <KeywordsDisplay
                    keywords={result.suspiciousKeywords}
                    transcript={result.transcript}
                  />

                  {/* AI Explanation */}
                  <AIExplanation
                    explanation={result.aiExplanation}
                    riskLevel={result.riskLevel}
                    categories={result.categories}
                    transcript={result.transcript}
                  />
                </div>
              )}

              {/* Empty state when no result yet */}
              {!result && !isAnalyzing && !error && (
                <div className="glass rounded-2xl p-10 text-center animate-fade-in">
                  <div className="w-16 h-16 rounded-2xl bg-cyber-accent/08 border border-cyber-accent/20 flex items-center justify-center mx-auto mb-4">
                    <Activity className="w-8 h-8 text-cyber-accent/60" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">
                    Ready to Analyze
                  </h3>
                  <p className="text-sm text-cyber-muted max-w-md mx-auto">
                    Paste a call transcript above or use the sample transcripts to see
                    ScamShield AI in action. Results will appear here.
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-4 text-xs text-cyber-muted">
                    <ChevronRight className="w-3.5 h-3.5 text-cyber-accent" />
                    Click &ldquo;Samples&rdquo; to try a demo transcript
                  </div>
                </div>
              )}

              {/* Loading state */}
              {isAnalyzing && !result && (
                <div className="glass rounded-2xl p-10 text-center animate-fade-in">
                  <div className="relative w-16 h-16 mx-auto mb-4">
                    <div className="absolute inset-0 rounded-full border-2 border-cyber-accent/20" />
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyber-accent animate-spin" />
                    <Shield className="absolute inset-0 m-auto w-7 h-7 text-cyber-accent" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">
                    AI Analysis in Progress
                  </h3>
                  <p className="text-sm text-cyber-muted">
                    Running Antigravity workflow pipeline...
                  </p>
                </div>
              )}
            </div>

            {/* Right column: Sidebar */}
            <div className="space-y-6">
              {/* Workflow Pipeline */}
              <WorkflowPipeline
                steps={workflowSteps}
                isRunning={isWorkflowRunning}
                processingTime={result?.processingTime}
              />

              {/* Live Threat Intelligence */}
              <LiveThreatFeed />

              {/* Threat Origin Map */}
              <ThreatMap />

              {/* Scan History */}
              <ScanHistory 
                onSelect={(text) => setLoadedTranscript(text)} 
                refreshTrigger={refreshHistoryTrigger} 
              />

              {/* Patterns Database */}
              <div id="patterns">
                <PatternsDatabase
                  detectedPatterns={result?.patterns || []}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────────── */}
        <footer
          id="about"
          className="mt-12 border-t border-cyber-border/30 glass-dark"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="grid sm:grid-cols-3 gap-8 mb-8">
              {/* Brand */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-cyber-accent" />
                  <span className="font-black text-white">
                    Scam<span className="text-cyber-accent">Shield</span> AI
                  </span>
                </div>
                <p className="text-xs text-cyber-muted leading-relaxed">
                  Protecting citizens from phone scams using cutting-edge AI
                  and real-time pattern detection.
                </p>
              </div>

              {/* Links */}
              <div>
                <h4 className="text-xs font-semibold text-white uppercase tracking-widest mb-3">
                  Resources
                </h4>
                <div className="space-y-2">
                  {[
                    { label: "National Cyber Crime: 1930", href: "tel:1930" },
                    { label: "cybercrime.gov.in", href: "https://cybercrime.gov.in" },
                    { label: "RBI Awareness Portal", href: "https://rbi.org.in" },
                  ].map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="flex items-center gap-1.5 text-xs text-cyber-muted hover:text-cyber-accent transition-colors"
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Tech stack */}
              <div>
                <h4 className="text-xs font-semibold text-white uppercase tracking-widest mb-3">
                  Powered By
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Next.js 14",
                    "Gemini AI",
                    "Antigravity",
                    "Tailwind CSS",
                    "TypeScript",
                  ].map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 rounded-lg text-[10px] font-mono font-semibold bg-cyber-accent/08 text-cyber-accent border border-cyber-accent/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-cyber-border/20 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-cyber-muted">
                © 2026 ScamShield AI · Built with Antigravity Workflow Automation
              </p>
              <div className="flex items-center gap-2 text-xs text-cyber-muted">
                <Github className="w-3.5 h-3.5" />
                <span>Open Source · MIT License</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
