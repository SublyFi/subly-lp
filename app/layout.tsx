import type React from "react";
import type { Metadata } from "next";

import "./globals.css";
import { Suspense } from "react";

import {
  Fraunces,
  Instrument_Serif,
  JetBrains_Mono,
} from "next/font/google";
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
  title: "Subly — Subscribe Now, Pay Never",
  description:
    "A privacy-first PayFi protocol on Solana. Deposit once. Earn yield inside a TEE vault. Let the yield silently settle your subscriptions.",
  generator: "subly.fi",
  icons: {
    icon: "/subly-purple.png",
    shortcut: "/subly-purple.png",
    apple: "/subly-purple.png",
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
