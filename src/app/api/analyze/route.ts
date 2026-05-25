// ============================================================
// ScamShield AI — Gemini API Analysis Route
// POST /api/analyze
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  ingestTranscript,
  computeRiskScore,
  shouldTriggerAlert,
  storeScamPatterns,
  parseGeminiResponse,
  generateSessionId,
} from "@/lib/workflow";

const GEMINI_PROMPT = `You are an expert fraud detection AI specializing in analyzing call transcripts for scam patterns.

Analyze the following call transcript and return a JSON object with this exact structure:

{
  "categories": ["SCAM_CATEGORY_1", "SCAM_CATEGORY_2"],
  "keywords": [
    {
      "word": "exact phrase from transcript",
      "category": "SCAM_CATEGORY",
      "severity": "HIGH|MEDIUM|LOW",
      "context": "brief context of why this is suspicious"
    }
  ],
  "explanation": "A detailed 2-4 sentence explanation of why this call is or isn't suspicious, describing specific manipulation tactics detected.",
  "baseScore": 0
}

Valid categories (use only these):
- OTP_SCAM: Asking for OTP, verification codes, pins
- BANK_FRAUD: Bank account issues, card blocking, KYC updates
- PHISHING: Requesting sensitive information via links or calls
- EMOTIONAL_MANIPULATION: Creating fear, sympathy, or panic
- URGENCY_PRESSURE: Artificial time pressure, "act now" tactics
- THREAT_INTIMIDATION: Legal threats, police, arrest warrants
- IMPERSONATION: Pretending to be from bank, government, RBI, tech support
- PRIZE_LOTTERY: Fake prizes, lottery winnings
- TECH_SUPPORT: Fake tech support, remote access requests
- INVESTMENT_FRAUD: Fake investment opportunities
- ROMANCE_SCAM: Romantic manipulation for money

Rules:
- Return ONLY the JSON object wrapped in \`\`\`json ... \`\`\` markers
- Be thorough: identify ALL suspicious phrases
- baseScore should be 0 (it's computed server-side)
- If the call is NOT suspicious, return empty arrays and say so in explanation
- Extract the EXACT suspicious phrases, not paraphrases

Transcript to analyze:`;

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    const { transcript } = body;

    if (!transcript || typeof transcript !== "string") {
      return NextResponse.json(
        { error: "Transcript is required" },
        { status: 400 }
      );
    }

    if (transcript.trim().length < 10) {
      return NextResponse.json(
        { error: "Transcript too short to analyze" },
        { status: 400 }
      );
    }

    const sessionId = generateSessionId();

    // ── STEP 1: Transcript Ingestion ──────────────────────────
    const ingested = ingestTranscript(transcript);

    // ── STEP 2: AI Analysis via Gemini ───────────────────────
    const apiKey = process.env.GEMINI_API_KEY;

    let aiResult = {
      categories: [] as string[],
      keywords: [] as {
        word: string;
        category: string;
        severity: string;
        context?: string;
      }[],
      explanation: "",
      baseScore: 0,
    };

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1500,
          },
        });

        const result = await model.generateContent(
          `${GEMINI_PROMPT}\n\n"${ingested.transcript}"`
        );
        const responseText = result.response.text();
        aiResult = parseGeminiResponse(responseText);
      } catch (aiError) {
        console.error("Gemini API error:", aiError);
        // Fall through to local analysis
      }
    }

    // If no API key or AI failed, run local pattern matching
    if (aiResult.categories.length === 0) {
      aiResult = runLocalAnalysis(ingested.transcript);
    }

    // ── STEP 3: Risk Scoring ──────────────────────────────────
    const { score, riskLevel } = computeRiskScore(
      ingested.transcript,
      aiResult.categories as never[],
      aiResult.keywords as never[]
    );

    // ── STEP 4: Alert Triggering ──────────────────────────────
    const alertTriggered = shouldTriggerAlert(riskLevel);

    // ── STEP 5: Pattern Storage ───────────────────────────────
    const patterns = storeScamPatterns(
      aiResult.categories as never[],
      aiResult.keywords as never[],
      sessionId
    );

    const processingTime = Date.now() - startTime;

    const analysisResult = {
      id: sessionId,
      timestamp: new Date().toISOString(),
      transcript: ingested.transcript,
      scamProbability: score,
      riskLevel,
      categories: aiResult.categories,
      suspiciousKeywords: aiResult.keywords,
      aiExplanation:
        aiResult.explanation ||
        "Analysis complete. No AI explanation available.",
      alertTriggered,
      patterns,
      processingTime,
      wordCount: ingested.wordCount,
      workflowSteps: [
        { id: "ingest", name: "Transcript Ingestion", status: "DONE" },
        { id: "analyze", name: "AI Pattern Analysis", status: "DONE" },
        { id: "score", name: "Risk Scoring", status: "DONE" },
        { id: "alert", name: "Alert Triggering", status: "DONE" },
        { id: "store", name: "Pattern Storage", status: "DONE" },
      ],
    };

    return NextResponse.json(analysisResult);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}

// ============================================================
// Local Pattern Matching Fallback (no API key needed)
// ============================================================
function runLocalAnalysis(transcript: string) {
  const lower = transcript.toLowerCase();

  const patterns = [
    {
      category: "OTP_SCAM",
      severity: "HIGH" as const,
      keywords: [
        "otp",
        "one time password",
        "verification code",
        "share the code",
        "tell me the otp",
        "send otp",
        "enter the code",
      ],
    },
    {
      category: "BANK_FRAUD",
      severity: "HIGH" as const,
      keywords: [
        "account blocked",
        "account suspended",
        "card blocked",
        "kyc update",
        "kyc verification",
        "bank executive",
        "rbi",
        "npci",
        "freeze",
        "debit card",
        "credit card expired",
      ],
    },
    {
      category: "THREAT_INTIMIDATION",
      severity: "HIGH" as const,
      keywords: [
        "arrest",
        "police",
        "fir",
        "legal action",
        "warrant",
        "court",
        "cybercrime",
        "jail",
        "criminal case",
        "narcotics",
      ],
    },
    {
      category: "URGENCY_PRESSURE",
      severity: "MEDIUM" as const,
      keywords: [
        "immediately",
        "right now",
        "last chance",
        "expires",
        "act now",
        "don't delay",
        "within 24 hours",
        "urgent",
        "hurry",
        "fast",
      ],
    },
    {
      category: "PHISHING",
      severity: "HIGH" as const,
      keywords: [
        "click the link",
        "verify now",
        "update your",
        "enter your details",
        "provide your",
        "share your",
        "confirm your password",
        "account verification",
      ],
    },
    {
      category: "EMOTIONAL_MANIPULATION",
      severity: "MEDIUM" as const,
      keywords: [
        "your family",
        "don't tell anyone",
        "keep this confidential",
        "between us",
        "don't panic",
        "stay calm",
        "i am here to help",
      ],
    },
    {
      category: "IMPERSONATION",
      severity: "HIGH" as const,
      keywords: [
        "i am calling from",
        "i am from the bank",
        "government officer",
        "police officer",
        "cbi officer",
        "income tax",
        "microsoft",
        "apple support",
        "amazon support",
      ],
    },
    {
      category: "PRIZE_LOTTERY",
      severity: "MEDIUM" as const,
      keywords: [
        "you have won",
        "lottery",
        "prize",
        "congratulations",
        "selected",
        "lucky winner",
        "claim your",
        "free gift",
      ],
    },
    {
      category: "INVESTMENT_FRAUD",
      severity: "HIGH" as const,
      keywords: [
        "guaranteed returns",
        "double your money",
        "invest now",
        "risk-free",
        "cryptocurrency",
        "bitcoin investment",
        "high returns",
        "trading profit",
      ],
    },
  ];

  const detectedCategories = new Set<string>();
  const detectedKeywords: {
    word: string;
    category: string;
    severity: string;
    context: string;
  }[] = [];

  for (const pattern of patterns) {
    for (const keyword of pattern.keywords) {
      if (lower.includes(keyword)) {
        detectedCategories.add(pattern.category);
        detectedKeywords.push({
          word: keyword,
          category: pattern.category,
          severity: pattern.severity,
          context: `Matched known ${pattern.category.replace(/_/g, " ").toLowerCase()} pattern`,
        });
      }
    }
  }

  const categories = Array.from(detectedCategories);

  let explanation = "";
  if (categories.length === 0) {
    explanation =
      "No significant scam patterns were detected in this transcript. The conversation appears to be legitimate, though you should always stay cautious.";
  } else {
    const categoryNames = categories
      .map((c) => c.replace(/_/g, " ").toLowerCase())
      .join(", ");
    explanation = `This transcript shows strong indicators of fraud, including ${categoryNames}. The caller is using classic manipulation tactics to pressure the target into compliance. ${
      categories.includes("OTP_SCAM")
        ? "Never share OTP codes with anyone, including people claiming to be from your bank. "
        : ""
    }${
      categories.includes("THREAT_INTIMIDATION")
        ? "Government agencies never threaten citizens via phone calls. "
        : ""
    }Immediately end such calls and report to the National Cyber Crime Helpline at 1930.`;
  }

  return { categories, keywords: detectedKeywords, explanation, baseScore: 0 };
}
