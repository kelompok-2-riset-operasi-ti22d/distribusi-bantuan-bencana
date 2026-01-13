import { ExternalLink, Newspaper, AlertTriangle, TruckIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const references = [
  {
    title: "Distribusi bantuan belum merata ke lokasi terdampak bencana",
    source: "ANTARA Foto",
    url: "https://www.antarafoto.com/view/2685946/pendistribusian-bantuan-belum-merata-di-tapteng",
    description: "Bantuan yang disalurkan belum sampai secara merata ke daerah terdampak bencana akibat hambatan akses & medan yang sulit.",
    icon: AlertTriangle,
    color: "text-orange-500",
  },
  {
    title: "Distribusi pangan ke desa terendam banjir tetap dijalankan meski terhambat",
    source: "ANTARA News",
    url: "https://www.antaranews.com/berita/5302402/distribusi-pangan-bapanas-id-food-tembus-desa-terendam-di-langkat",
    description: "Upaya mempercepat distribusi ke desa-desa yang masih terendam banjir menunjukkan tantangan distribusi di lokasi sulit.",
    icon: TruckIcon,
    color: "text-blue-500",
  },
  {
    title: "BNPB upayakan distribusi logistik ke wilayah terdampak bencana Aceh",
    source: "ANTARA News Manado",
    url: "https://manado.antaranews.com/amp/berita/301545/bnpb-upayakan-distribusi-logistik-ke-wilayah-terdampak-bencana-aceh",
    description: "BNPB mengupayakan distribusi logistik meskipun akses darat terputus, termasuk penggunaan moda udara.",
    icon: Newspaper,
    color: "text-green-500",
  },
  {
    title: "Pemerintah kebut distribusi 1.638 ton bantuan logistik ke Sumatera",
    source: "ANTARA News",
    url: "https://m.antaranews.com/amp/berita/5297296/pemerintah-kebut-distribusi-1638-ton-bantuan-logistik-ke-sumatera",
    description: "Pemerintah mempercepat distribusi logistik dengan memaksimalkan moda distribusi (darat, laut, udara) agar bantuan cepat sampai.",
    icon: TruckIcon,
    color: "text-primary",
  },
];

export default function CaseStudyReferences() {
  return (
    <Card className="border-primary/20 bg-card/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-primary" />
          Referensi Studi Kasus: Masalah Distribusi Bantuan Bencana
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Sistem ini dikembangkan berdasarkan permasalahan nyata distribusi bantuan bencana di Indonesia. 
          Berikut adalah berita-berita yang menjadi dasar pengembangan sistem optimasi ini:
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {references.map((ref, index) => (
          <a
            key={index}
            href={ref.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border/50 hover:border-primary/30 group"
          >
            <div className="flex items-start gap-3">
              <ref.icon className={`w-5 h-5 ${ref.color} mt-0.5 flex-shrink-0`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-medium text-foreground group-hover:text-primary transition-colors text-sm">
                    {ref.title}
                  </h4>
                  <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary" />
                </div>
                <p className="text-xs text-primary/70 mt-0.5">{ref.source}</p>
                <p className="text-xs text-muted-foreground mt-1">{ref.description}</p>
              </div>
            </div>
          </a>
        ))}

        <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <h4 className="font-semibold text-foreground text-sm mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-primary" />
            Relevansi dengan Sistem
          </h4>
          <p className="text-sm text-muted-foreground">
            Permasalahan utama yang diangkat adalah <strong>ketidakmerataan distribusi</strong>, 
            <strong> keterbatasan anggaran</strong>, dan <strong>biaya distribusi yang berbeda-beda</strong> di setiap lokasi. 
            Sistem ini menggunakan <strong>Linear Programming dengan Metode Big M</strong> untuk mengoptimalkan 
            alokasi bantuan agar semua lokasi mendapat bantuan minimal yang dibutuhkan dengan biaya total seminimal mungkin.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
