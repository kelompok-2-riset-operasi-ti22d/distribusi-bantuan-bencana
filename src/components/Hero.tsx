import { Package, MapPin, Calculator, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";

interface HeroProps {
  onNavigateToCalculator: () => void;
}

export function Hero({ onNavigateToCalculator }: HeroProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-hero opacity-[0.03]" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
            <Package className="w-4 h-4" />
            <span>Sistem Pendukung Keputusan</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight animate-fade-in">
            Optimalisasi Distribusi{" "}
            <span className="text-gradient-hero">Bantuan Sembako</span>{" "}
            ke Daerah Bencana
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in">
            Sistem berbasis <strong>Linear Programming</strong> dengan{" "}
            <strong>Metode Big M</strong> untuk menghasilkan keputusan distribusi
            bantuan yang optimal, terukur, dan efisien dalam kondisi darurat.
          </p>

          {/* CTA Button */}
          <Button
            onClick={onNavigateToCalculator}
            size="lg"
            className="bg-gradient-hero hover:opacity-90 text-primary-foreground shadow-hero px-8 py-6 text-lg font-semibold transition-all duration-300 hover:scale-105 animate-fade-in"
          >
            <Calculator className="w-5 h-5 mr-2" />
            Mulai Perhitungan
          </Button>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {[
              {
                icon: MapPin,
                title: "Multi-Lokasi",
                desc: "Kelola distribusi ke banyak lokasi bencana secara dinamis",
              },
              {
                icon: Calculator,
                title: "Metode Big M",
                desc: "Solusi optimal berbasis Linear Programming dengan penalti artifisial",
              },
              {
                icon: TrendingUp,
                title: "Visualisasi Real-time",
                desc: "Grafik interaktif menampilkan hasil distribusi dan biaya",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-card rounded-xl p-6 shadow-card border border-border/50 hover:shadow-lg transition-shadow duration-300 animate-fade-in"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
