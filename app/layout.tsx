import type React from "react";
import type { Metadata } from "next";

import "./globals.css";
import { Suspense } from "react";

import { Fraunces, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { GeistSans } from "geist/font/sans";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Subly — Use Now, Pay Never",
  description:
    "A privacy-first PayFi protocol for AI agents on Solana. Try a live Subly402 devnet payment, faucet test USDC, and see how x402-style Buyer and Seller integrations work without API keys.",
  generator: "subly.fi",
  metadataBase: new URL("https://subly.fi"),
  icons: {
    icon: "/subly-purple.png",
    shortcut: "/subly-purple.png",
    apple: "/subly-purple.png",
  },
  openGraph: {
    title: "Subly — Use Now, Pay Never",
    description:
      "Privacy-first PayFi for AI agents. Try a live Subly402 devnet payment and see x402-style integrations without API keys.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@subly_fi",
    creator: "@subly_fi",
    title: "Subly — Use Now, Pay Never",
    description:
      "Privacy-first PayFi for AI agents. Live Subly402 devnet payment demo, faucet, and x402-style integration snippets.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} ${GeistSans.variable}`}
    >
      <body className="font-sans antialiased bg-paper text-ink selection:bg-ink selection:text-paper">
        <Suspense>{children}</Suspense>
      </body>
    </html>
  );
}
