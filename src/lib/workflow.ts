// ============================================================
// ScamShield AI — Antigravity Workflow Engine
// Orchestrates: Ingest → Analyze → Score → Alert → Store
// ============================================================

import {
  AnalysisResult,
  ScamCategory,
  ScamPattern,
  SuspiciousKeyword,
  RiskLevel,
  SCAM_PATTERNS_DB,
  WorkflowStep,
  WORKFLOW_STEPS,
} from "@/types";

// ============================================================
// STEP 1: Transcript Ingestion
// ============================================================
export function ingestTranscript(rawTranscript: string): {
  transcript: string;
  wordCount: number;
  charCount: number;
  sentences: string[];
} {
  const transcript = rawTranscript.trim();
  const wordCount = transcript.split(/\s+/).filter(Boolean).length;
  const charCount = transcript.length;
  const sentences = transcript
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  return { transcript, wordCount, charCount, sentences };
}

// ============================================================
// STEP 3: Risk Scoring (Local Pattern Matching)
// ============================================================
export function computeRiskScore(
  transcript: string,
  categories: ScamCategory[],
  keywords: SuspiciousKeyword[]
): { score: number; riskLevel: RiskLevel } {
  let score = 0;

  // Base score from keyword count
  const highSeverityCount = keywords.filter((k) => k.severity === "HIGH").length;
  const medSeverityCount = keywords.filter((k) => k.severity === "MEDIUM").length;
  const lowSeverityCount = keywords.filter((k) => k.severity === "LOW").length;

  score += highSeverityCount * 15;
  score += medSeverityCount * 8;
  score += lowSeverityCount * 3;

  // Boost from dangerous category combinations
  if (categories.includes("OTP_SCAM")) score += 25;
  if (categories.includes("BANK_FRAUD")) score += 20;
  if (categories.includes("THREAT_INTIMIDATION")) score += 20;
  if (categories.includes("PHISHING")) score += 15;
  if (categories.includes("URGENCY_PRESSURE")) score += 10;
  if (categories.includes("EMOTIONAL_MANIPULATION")) score += 10;
  if (categories.includes("IMPERSONATION")) score += 15;

  // Multiple categories = higher risk
  if (categories.length >= 3) score += 15;
  if (categories.length >= 4) score += 10;

  // Clamp to 0–100
  score = Math.min(100, Math.max(0, score));

  // Determine risk level
  let riskLevel: RiskLevel;
  if (score >= 80) riskLevel = "CRITICAL";
  else if (score >= 60) riskLevel = "HIGH";
  else if (score >= 40) riskLevel = "MEDIUM";
  else if (score >= 20) riskLevel = "LOW";
  else riskLevel = "SAFE";

  return { score, riskLevel };
}

// ============================================================
// STEP 4: Alert Triggering
// ============================================================
export function shouldTriggerAlert(riskLevel: RiskLevel): boolean {
  return riskLevel === "HIGH" || riskLevel === "CRITICAL";
}

// ============================================================
// STEP 5: Pattern Storage (In-Memory + LocalStorage)
// ============================================================
export function storeScamPatterns(
  categories: ScamCategory[],
  keywords: SuspiciousKeyword[],
  sessionId: string
): ScamPattern[] {
  const storedPatterns: ScamPattern[] = [...SCAM_PATTERNS_DB];

  // Find matching patterns from DB
  const matchedPatterns = SCAM_PATTERNS_DB.filter((pattern) =>
    categories.includes(pattern.category)
  ).map((p) => ({
    ...p,
    occurrences: p.occurrences + 1,
    detectedAt: new Date().toISOString().split("T")[0],
  }));

  // Add session-specific new pattern if novel keywords found
  if (keywords.length > 0 && categories.length > 0) {
    const sessionPattern: ScamPattern = {
      id: `session-${sessionId}`,
      name: `Session Analysis #${sessionId.slice(0, 6)}`,
      category: categories[0],
      keywords: keywords.map((k) => k.word),
      description: `Detected in real-time analysis session`,
      detectedAt: new Date().toISOString().split("T")[0],
      occurrences: 1,
    };
    matchedPatterns.push(sessionPattern);
  }

  // Persist to localStorage (browser-side)
  if (typeof window !== "undefined") {
    try {
      const existing = JSON.parse(
        localStorage.getItem("scamshield_patterns") || "[]"
      );
      const updated = [...existing, ...matchedPatterns].slice(-100); // keep last 100
      localStorage.setItem("scamshield_patterns", JSON.stringify(updated));
    } catch {
      // ignore storage errors
    }
  }

  return matchedPatterns;
}

// ============================================================
// Workflow Step Runner
// ============================================================
export function createInitialWorkflowState(): WorkflowStep[] {
  return WORKFLOW_STEPS.map((s) => ({
    ...s,
    status: "PENDING" as const,
  }));
}

export function updateWorkflowStep(
  steps: WorkflowStep[],
  stepId: string,
  updates: Partial<WorkflowStep>
): WorkflowStep[] {
  return steps.map((step) =>
    step.id === stepId ? { ...step, ...updates } : step
  );
}

// ============================================================
// Parse Gemini API Response into Structured Data
// ============================================================
export function parseGeminiResponse(responseText: string): {
  categories: ScamCategory[];
  keywords: SuspiciousKeyword[];
  explanation: string;
  baseScore: number;
} {
  try {
    // Extract JSON block from Gemini response
    const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
    const jsonStr = jsonMatch ? jsonMatch[1] : responseText;
    const parsed = JSON.parse(jsonStr);

    return {
      categories: parsed.categories || [],
      keywords: parsed.keywords || [],
      explanation: parsed.explanation || "Analysis complete.",
      baseScore: parsed.baseScore || 0,
    };
  } catch {
    // Fallback: extract keywords manually if JSON parse fails
    return {
      categories: ["UNKNOWN"],
      keywords: [],
      explanation: responseText.slice(0, 500),
      baseScore: 0,
    };
  }
}

// ============================================================
// Generate unique session ID
// ============================================================
export function generateSessionId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
