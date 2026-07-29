import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { ProblemSection } from "@/components/problem-section";
import { SolutionSection } from "@/components/solution-section";
import { ConnectSection } from "@/components/connect-section";
import { MarketSection } from "@/components/market-section";
import { WaitlistCTA } from "@/components/waitlist-cta";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-paper">
      <Header />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <ConnectSection />
      <MarketSection />
      <WaitlistCTA />
      <Footer />
    </main>
  );
}
