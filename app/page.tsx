import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { DemoSection } from "@/components/demo-section";
import { ProblemSection } from "@/components/problem-section";
import { SolutionSection } from "@/components/solution-section";
import { PrivacySection } from "@/components/privacy-section";
import { MarketSection } from "@/components/market-section";
import { ArchitectureSection } from "@/components/architecture-section";
import { RoadmapSection } from "@/components/roadmap-section";
import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-paper">
      <Header />
      <HeroSection />
      <DemoSection />
      <ProblemSection />
      <SolutionSection />
      <PrivacySection />
      <MarketSection />
      <ArchitectureSection />
      <RoadmapSection />
      <CTASection />
      <Footer />
    </main>
  );
}
