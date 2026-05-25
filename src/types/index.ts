// ============================================================
// ScamShield AI — Core Types & Workflow Definitions
// Antigravity Workflow Automation Engine
// ============================================================

export type RiskLevel = "SAFE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type ScamCategory =
  | "OTP_SCAM"
  | "BANK_FRAUD"
  | "PHISHING"
  | "EMOTIONAL_MANIPULATION"
  | "URGENCY_PRESSURE"
  | "THREAT_INTIMIDATION"
  | "IMPERSONATION"
  | "PRIZE_LOTTERY"
  | "TECH_SUPPORT"
  | "INVESTMENT_FRAUD"
  | "ROMANCE_SCAM"
  | "UNKNOWN";

export interface SuspiciousKeyword {
  word: string;
  category: ScamCategory;
  severity: "LOW" | "MEDIUM" | "HIGH";
  context?: string;
}

export interface ScamPattern {
  id: string;
  name: string;
  category: ScamCategory;
  keywords: string[];
  description: string;
  detectedAt: string;
  occurrences: number;
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  transcript: string;
  scamProbability: number; // 0–100
  riskLevel: RiskLevel;
  categories: ScamCategory[];
  suspiciousKeywords: SuspiciousKeyword[];
  aiExplanation: string;
  alertTriggered: boolean;
  patterns: ScamPattern[];
  processingTime: number; // ms
  workflowSteps: WorkflowStep[];
}

// ============================================================
// Antigravity Workflow Automation Types
// ============================================================

export type WorkflowStepStatus = "PENDING" | "RUNNING" | "DONE" | "ERROR";

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  status: WorkflowStepStatus;
  startedAt?: number;
  completedAt?: number;
  output?: unknown;
  error?: string;
}

export interface WorkflowState {
  steps: WorkflowStep[];
  currentStep: number;
  isRunning: boolean;
  isComplete: boolean;
  hasError: boolean;
}

// ============================================================
// Workflow Step Definitions (Antigravity Pipeline)
// ============================================================

export const WORKFLOW_STEPS: Omit<WorkflowStep, "status">[] = [
  {
    id: "ingest",
    name: "Transcript Ingestion",
    description: "Parsing and validating call transcript data",
  },
  {
    id: "analyze",
    name: "AI Pattern Analysis",
    description: "Scanning for fraud patterns using Gemini AI",
  },
  {
    id: "score",
    name: "Risk Scoring",
    description: "Computing scam probability score (0–100)",
  },
  {
    id: "alert",
    name: "Alert Triggering",
    description: "Evaluating threat level and dispatching alerts",
  },
  {
    id: "store",
    name: "Pattern Storage",
    description: "Persisting scam patterns to knowledge base",
  },
];

// ============================================================
// Scam Pattern Knowledge Base (Stored Patterns)
// ============================================================

export const SCAM_PATTERNS_DB: ScamPattern[] = [
  {
    id: "p001",
    name: "OTP Harvest Attack",
    category: "OTP_SCAM",
    keywords: ["OTP", "one time password", "verification code", "share the code", "tell me the code"],
    description: "Attacker tricks victim into sharing OTP received on their device",
    detectedAt: "2026-01-15",
    occurrences: 2847,
  },
  {
    id: "p002",
    name: "Bank Impersonation Fraud",
    category: "BANK_FRAUD",
    keywords: ["your account is blocked", "bank executive", "RBI", "NPCI", "suspend", "freeze account"],
    description: "Caller impersonates bank officials to extract account details",
    detectedAt: "2026-02-08",
    occurrences: 1523,
  },
  {
    id: "p003",
    name: "Phishing Link Delivery",
    category: "PHISHING",
    keywords: ["click the link", "verify now", "urgent", "update your KYC", "account verification"],
    description: "Delivering malicious links disguised as official communications",
    detectedAt: "2026-01-20",
    occurrences: 3201,
  },
  {
    id: "p004",
    name: "Urgency Pressure Tactic",
    category: "URGENCY_PRESSURE",
    keywords: ["immediately", "right now", "last chance", "expires in", "act now", "don't delay"],
    description: "Creating artificial urgency to prevent victims from thinking clearly",
    detectedAt: "2026-03-01",
    occurrences: 4102,
  },
  {
    id: "p005",
    name: "Legal Threat Intimidation",
    category: "THREAT_INTIMIDATION",
    keywords: ["arrest", "police", "FIR", "legal action", "warrant", "court", "cybercrime", "jail"],
    description: "Using fake legal threats to coerce victims into compliance",
    detectedAt: "2026-02-14",
    occurrences: 987,
  },
];
