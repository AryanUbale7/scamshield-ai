"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Send,
  Trash2,
  FileText,
  ChevronDown,
  AlertTriangle,
} from "lucide-react";

const SAMPLE_TRANSCRIPTS = [
  {
    label: "🚨 OTP Scam",
    text: `Hello, I'm calling from SBI Bank. Your account has been blocked due to suspicious activity. To unblock it immediately, you need to share the OTP that you just received on your phone. This is urgent and your account will be permanently closed within 24 hours if you don't comply. Please tell me the OTP right now.`,
  },
  {
    label: "⚠️ Legal Threat",
    text: `This is Officer Sharma from the CBI Cybercrime Division. We have filed an FIR against your Aadhaar number for money laundering. A warrant has been issued for your arrest. To avoid going to jail, you must pay a settlement fee of ₹50,000 immediately. Don't tell anyone about this call or you will be arrested. Call back on this number within 1 hour.`,
  },
  {
    label: "✅ Legitimate Call",
    text: `Hello, this is Priya from Amazon customer service. I'm calling regarding your recent order #AMZ-2024-789456. The delivery was attempted but couldn't be completed. You can reschedule delivery by logging into your account at amazon.in or by calling our customer care number 1800-xxx-xxxx. Have a good day.`,
  },
  {
    label: "🎰 Lottery Scam",
    text: `Congratulations! You have been selected as the lucky winner of our KBC lottery. You have won 25 lakh rupees. To claim your prize, you need to pay a processing fee of ₹5,000 first. This offer expires today. Act now and don't miss this chance. Send the money to this account and we will transfer your winnings immediately.`,
  },
];

interface TranscriptInputProps {
  onAnalyze: (transcript: string) => void;
  isAnalyzing: boolean;
  initialTranscript?: string;
}

export default function TranscriptInput({
  onAnalyze,
  isAnalyzing,
  initialTranscript = "",
}: TranscriptInputProps) {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [showSamples, setShowSamples] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [interimText, setInterimText] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCharCount(transcript.length);
  }, [transcript]);

  useEffect(() => {
    if (initialTranscript) {
      setTranscript(initialTranscript);
    }
  }, [initialTranscript]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowSamples(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Speech recognition not supported in your browser. Please use Chrome.");
      return;
    }

    const SpeechRecognitionAPI =
      (window as typeof window & { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition ||
      (window as typeof window & { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) return;

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalText = "";
      let interimText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript + " ";
        } else {
          interimText += result[0].transcript;
        }
      }

      if (finalText) {
        setTranscript((prev) => prev + finalText);
      }
      setInterimText(interimText);
    };

    recognition.onerror = () => {
      setIsListening(false);
      setInterimText("");
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimText("");
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
    setInterimText("");
  };

  const handleSubmit = () => {
    const text = transcript.trim();
    if (text.length < 10) return;
    onAnalyze(text);
  };

  const handleClear = () => {
    setTranscript("");
    setInterimText("");
    if (isListening) stopListening();
  };

  const loadSample = (text: string) => {
    setTranscript(text);
    setShowSamples(false);
    textareaRef.current?.focus();
  };

  const wordCount = transcript.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="glass rounded-2xl overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-cyber-border/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyber-accent/10 flex items-center justify-center border border-cyber-accent/30">
            <FileText className="w-4 h-4 text-cyber-accent" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">
              Call Transcript Analysis
            </h2>
            <p className="text-xs text-cyber-muted">
              Paste or speak your transcript below
            </p>
          </div>
        </div>

        {/* Sample Transcripts Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            id="sample-transcripts-btn"
            onClick={() => setShowSamples(!showSamples)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-cyber-accent border border-cyber-accent/30 rounded-lg hover:bg-cyber-accent/10 transition-all duration-200"
          >
            Samples
            <ChevronDown
              className={`w-3 h-3 transition-transform ${showSamples ? "rotate-180" : ""}`}
            />
          </button>

          {showSamples && (
            <div className="absolute right-0 top-10 w-64 glass-dark rounded-xl border border-cyber-border z-50 overflow-hidden animate-slide-up shadow-2xl">
              {SAMPLE_TRANSCRIPTS.map((sample, i) => (
                <button
                  key={i}
                  onClick={() => loadSample(sample.text)}
                  className="w-full text-left px-4 py-3 text-xs text-cyber-text hover:bg-cyber-accent/10 hover:text-white transition-colors border-b border-cyber-border/30 last:border-0 font-mono"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          id="transcript-textarea"
          ref={textareaRef}
          value={
            isListening ? transcript + interimText : transcript
          }
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Paste a call transcript here, or click the microphone to speak...&#10;&#10;Example: 'Hello, I'm calling from your bank. Your account has been blocked...'"
          className="w-full bg-transparent px-6 py-5 text-sm text-cyber-text placeholder-cyber-muted/50 resize-none focus:outline-none font-mono leading-relaxed"
          style={{ minHeight: "200px", maxHeight: "340px" }}
          disabled={isAnalyzing}
        />

        {/* Live recording indicator */}
        <AnimatePresence>
          {isListening && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute top-3 right-3 flex items-center gap-3 bg-cyber-red/10 border border-cyber-red/40 rounded-full px-4 py-1.5 shadow-[0_0_15px_rgba(255,59,92,0.2)] backdrop-blur-md"
            >
              <div className="flex items-end gap-[2px] h-[16px] w-[20px] justify-center">
                <div className="audio-bar w-[3px] bg-cyber-red rounded-full" />
                <div className="audio-bar w-[3px] bg-cyber-red rounded-full" />
                <div className="audio-bar w-[3px] bg-cyber-red rounded-full" />
                <div className="audio-bar w-[3px] bg-cyber-red rounded-full" />
                <div className="audio-bar w-[3px] bg-cyber-red rounded-full" />
              </div>
              <span className="text-[10px] text-cyber-red font-mono font-bold tracking-widest uppercase">
                REC
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-4 px-6 py-2 border-t border-cyber-border/30 bg-cyber-bg/30">
        <span className="text-xs text-cyber-muted font-mono">
          <span className="text-cyber-accent">{wordCount}</span> words
        </span>
        <span className="text-xs text-cyber-muted font-mono">
          <span className="text-cyber-accent">{charCount}</span> chars
        </span>
        {charCount > 0 && charCount < 10 && (
          <span className="text-xs text-cyber-orange flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Too short to analyze
          </span>
        )}
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-cyber-border/50 bg-cyber-surface/50">
        <div className="flex items-center gap-3">
          {/* Mic button */}
          <button
            id="mic-btn"
            onClick={isListening ? stopListening : startListening}
            disabled={isAnalyzing}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
              isListening
                ? "bg-cyber-red/20 border border-cyber-red/60 text-cyber-red glow-red hover:bg-cyber-red/30"
                : "bg-cyber-muted/10 border border-cyber-border text-cyber-text hover:border-cyber-accent/50 hover:text-cyber-accent"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4" />
                Stop
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                Speak
              </>
            )}
          </button>

          {/* Clear */}
          <button
            id="clear-btn"
            onClick={handleClear}
            disabled={!transcript && !isListening}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-cyber-muted hover:text-cyber-red hover:bg-cyber-red/10 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Analyze button */}
        <button
          id="analyze-btn"
          onClick={handleSubmit}
          disabled={transcript.trim().length < 10 || isAnalyzing}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
            transcript.trim().length >= 10 && !isAnalyzing
              ? "bg-gradient-to-r from-cyber-accent to-cyan-400 text-cyber-bg hover:from-cyan-400 hover:to-cyber-accent glow-accent scale-100 hover:scale-105 shadow-lg"
              : "bg-cyber-muted/20 text-cyber-muted cursor-not-allowed"
          }`}
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-cyber-bg/30 border-t-cyber-bg rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Analyze Threat
            </>
          )}
        </button>
      </div>
    </div>
  );
}
