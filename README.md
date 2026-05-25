# 🛡️ ScamShield AI

> Real-time AI-powered scam detection from call transcripts. Built with Next.js 14, Gemini AI, and Antigravity workflow automation.

## ✨ Features

- 🎙️ **Paste or speak** call transcripts
- 🤖 **Gemini AI** analysis for fraud patterns  
- 📊 **Scam probability score** (0–100) with animated gauge
- 🚨 **Real-time alert banners** for critical threats
- 🏷️ **Suspicious keyword highlighting** with hover context
- 🧠 **AI explanation** of why a call is suspicious
- 🔄 **Antigravity workflow pipeline** (Ingest → Analyze → Score → Alert → Store)
- 💾 **Pattern knowledge base** with 5+ scam categories
- 🌐 **Speech recognition** (Chrome/Edge)
- 📱 **Fully responsive** dark cyber UI

## 🚀 Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Gemini API (optional)

```bash
# Edit .env.local and add your key from https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_key_here
```

> **Note:** The app works without an API key using local pattern matching!

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🔄 Antigravity Workflow Pipeline

| Step | Name | Description |
|------|------|-------------|
| 1️⃣ | **Transcript Ingestion** | Parse and validate raw transcript |
| 2️⃣ | **AI Pattern Analysis** | Gemini AI scans for fraud patterns |
| 3️⃣ | **Risk Scoring** | Compute 0–100 scam probability |
| 4️⃣ | **Alert Triggering** | Dispatch real-time alerts for HIGH/CRITICAL |
| 5️⃣ | **Pattern Storage** | Persist scam patterns to knowledge base |

## 🎯 Detected Scam Types

- 🔑 **OTP Scam** — Requesting OTPs over phone
- 🏦 **Bank Fraud** — Impersonating bank officials
- 🎣 **Phishing** — Harvesting credentials via links
- 😰 **Emotional Manipulation** — Creating fear/panic
- ⏰ **Urgency Pressure** — Artificial time pressure
- ⚖️ **Threat Intimidation** — Fake legal threats
- 🎭 **Impersonation** — Posing as government/banks
- 🎰 **Prize/Lottery Scam** — Fake winnings
- 💻 **Tech Support Scam** — Remote access fraud
- 📈 **Investment Fraud** — Guaranteed returns

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS with custom cyber theme
- **AI:** Google Gemini 1.5 Flash API
- **Automation:** Antigravity Workflow Engine
- **Icons:** Lucide React
- **Speech:** Web Speech API

## 📁 Project Structure

```
src/
├── app/
│   ├── api/analyze/route.ts   # Gemini API + workflow orchestration
│   ├── layout.tsx             # Root layout + metadata
│   ├── page.tsx               # Main dashboard
│   └── globals.css            # Cyber-security theme
├── components/
│   ├── CyberBackground.tsx    # Animated canvas particle network
│   ├── TranscriptInput.tsx    # Input with speech recognition
│   ├── ScoreGauge.tsx         # Animated SVG score ring
│   ├── KeywordsDisplay.tsx    # Highlighted keywords + annotated transcript
│   ├── AIExplanation.tsx      # Gemini AI explanation panel
│   ├── AlertBanner.tsx        # Critical alert with pulse effect
│   ├── WorkflowPipeline.tsx   # Antigravity pipeline visualizer
│   └── PatternsDatabase.tsx   # Scam patterns knowledge base
├── lib/
│   └── workflow.ts            # Antigravity workflow engine
└── types/
    └── index.ts               # TypeScript types + pattern DB
```

## 🔐 Safety Tips

- **Never share OTPs** with anyone, including people claiming to be from your bank
- **Government agencies** never threaten citizens via phone
- **Report scams** to National Cyber Crime Helpline: **1930**
- Visit [cybercrime.gov.in](https://cybercrime.gov.in) to file complaints
