import type React from "react";
import type { Metadata } from "next";

import "./globals.css";
import { Suspense } from "react";

import { Inter, JetBrains_Mono, Source_Serif_4 } from "next/font/google";

// Initialize fonts
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Subly - Subscribe Now, Pay Never",
  description:
    "A privacy-first PayFi protocol for subscription apps. Turn DeFi yield into cash and pay for subscriptions automatically.",
  generator: "v0.app",
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
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        <Suspense>{children}</Suspense>
      </body>
    </html>
  );
}
