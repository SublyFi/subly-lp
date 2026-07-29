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
    "Your yield pays your AI agent's API bills. Deposit USDC once — the Subly vault earns yield on Kamino and your agent pays for x402 APIs from that yield, never from principal. Connect via the MCP server, OpenClaw skill, or CLI.",
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
      "Your yield pays your AI agent's API bills. Deposit USDC once; x402 API calls settle from Kamino vault yield, never from principal.",
    type: "website",
    url: "https://www.sublyfi.com",
    siteName: "Subly",
    images: [
      {
        url: "https://www.sublyfi.com/og-image.png?v=2",
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
      "Your yield pays your AI agent's API bills. Deposit USDC once; x402 API calls settle from Kamino vault yield, never from principal.",
    images: ["https://www.sublyfi.com/og-image.png?v=2"],
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
