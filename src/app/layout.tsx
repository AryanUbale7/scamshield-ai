import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ScamShield AI — Real-Time Fraud Detection",
  description:
    "AI-powered scam detection tool. Analyze call transcripts for fraud patterns, scam probability scores, and real-time threat alerts.",
  keywords: "scam detection, fraud analysis, AI security, call transcript analysis, phishing detection",
  openGraph: {
    title: "ScamShield AI — Real-Time Fraud Detection",
    description: "Protect yourself from scams with AI-powered analysis of call transcripts.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}
