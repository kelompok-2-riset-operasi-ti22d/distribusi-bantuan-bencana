import { useState } from "react";
import { Hero } from "@/components/Hero";
import { AboutMethod } from "@/components/AboutMethod";
import { Calculator } from "@/components/Calculator";
import { Footer } from "@/components/Footer";
import CaseStudyReferences from "@/components/CaseStudyReferences";

const Index = () => {
  const [showCalculator, setShowCalculator] = useState(false);

  if (showCalculator) {
    return <Calculator onBack={() => setShowCalculator(false)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
              <svg
                className="w-4 h-4 text-primary-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <span className="font-semibold text-foreground">SPK Distribusi</span>
          </div>
          <button
            onClick={() => setShowCalculator(true)}
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Mulai Perhitungan →
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Hero onNavigateToCalculator={() => setShowCalculator(true)} />
        <AboutMethod />
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <CaseStudyReferences />
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
