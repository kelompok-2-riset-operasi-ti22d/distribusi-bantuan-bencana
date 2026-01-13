import { BookOpen, Target, AlertTriangle, CheckCircle2 } from "lucide-react";

export function AboutMethod() {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              <BookOpen className="w-4 h-4" />
              <span>Tentang Metode</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Linear Programming & Metode Big M
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Pendekatan matematis untuk mengoptimalkan distribusi bantuan dengan
              mempertimbangkan keterbatasan stok dan kebutuhan minimum setiap lokasi.
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Problem Card */}
            <div className="bg-card rounded-xl p-6 shadow-card border border-border/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                </div>
                <h3 className="font-semibold text-lg text-foreground">Permasalahan</h3>
              </div>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 flex-shrink-0" />
                  Keterbatasan stok bantuan yang tersedia
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 flex-shrink-0" />
                  Banyak lokasi dengan kebutuhan berbeda-beda
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 flex-shrink-0" />
                  Biaya distribusi yang tidak seragam
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 flex-shrink-0" />
                  Risiko distribusi tidak memenuhi kebutuhan minimum
                </li>
              </ul>
            </div>

            {/* Solution Card */}
            <div className="bg-card rounded-xl p-6 shadow-card border border-border/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-success" />
                </div>
                <h3 className="font-semibold text-lg text-foreground">Solusi Big M</h3>
              </div>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  Meminimalkan total biaya distribusi
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  Menambahkan variabel artifisial dengan penalti M
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  Menentukan feasibility berdasarkan nilai artifisial
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  Menghasilkan alokasi optimal tiap lokasi
                </li>
              </ul>
            </div>
          </div>

          {/* Mathematical Model */}
          <div className="mt-8 bg-card rounded-xl p-6 shadow-card border border-border/50">
            <h3 className="font-semibold text-lg text-foreground mb-4">Model Matematis</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-primary mb-2">Fungsi Tujuan</h4>
                <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm">
                  Min Z = Σ(cᵢ × xᵢ) + M × Σ(Aᵢ)
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  cᵢ = biaya per paket, xᵢ = alokasi, Aᵢ = variabel artifisial
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-primary mb-2">Kendala</h4>
                <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm space-y-1">
                  <div>xᵢ ≥ kebutuhanᵢ (minimum)</div>
                  <div>Σxᵢ ≤ stok_tersedia</div>
                  <div>xᵢ ≥ 0, Aᵢ ≥ 0</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
