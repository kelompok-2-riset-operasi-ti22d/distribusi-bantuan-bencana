import { Package, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border/50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Footer Bottom */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-border/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
                <Package className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">SPK Distribusi Bantuan</span>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-right">
              Sistem Pendukung Keputusan menggunakan Linear Programming - Metode Big M
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
