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
  title: "Subly: Use Now, Pay Never",
  description:
    "A privacy-first PayFi protocol for AI agents on Solana. Try the live Subly-x402 devnet payment demo, request test USDC, and see x402-style Buyer and Seller integrations without API keys.",
  generator: "sublyfi.com",
  metadataBase: new URL("https://www.sublyfi.com"),
  icons: {
    icon: "/subly-purple.png",
    shortcut: "/subly-purple.png",
    apple: "/subly-purple.png",
  },
  openGraph: {
    title: "Subly: Use Now, Pay Never",
    description:
      "Privacy-first PayFi for AI agents. Try a live Subly-x402 devnet payment and see x402-style integrations without API keys.",
    type: "website",
    url: "https://www.sublyfi.com",
    siteName: "Subly",
    images: [
      {
        url: "https://www.sublyfi.com/og-image.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Subly: Use Now, Pay Never",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@subly_fi",
    creator: "@subly_fi",
    title: "Subly: Use Now, Pay Never",
    description:
      "Privacy-first PayFi for AI agents. Live Subly-x402 devnet demo, faucet, and integration snippets.",
    images: ["https://www.sublyfi.com/og-image.png"],
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
