# Optimalisasi Distribusi Bantuan Sembako ke Daerah Bencana
**Sistem Pendukung Keputusan berbasis Linear Programming (Metode Big M)**

## Deskripsi
Aplikasi web ini merupakan **Sistem Pendukung Keputusan (SPK)** untuk mengoptimalkan distribusi bantuan sembako ke daerah bencana. Sistem dibangun menggunakan **React + Vite + TypeScript** dan menerapkan pendekatan **Riset Operasi**, khususnya **Linear Programming dengan Metode Big M**, untuk menentukan alokasi bantuan yang optimal dengan biaya minimum.

Aplikasi ini mendukung multi-lokasi bencana, visualisasi hasil secara real-time, serta penjelasan langkah iterasi metode Big M melalui tabel simplex.

🔗 **Demo Aplikasi:**  
https://distribusi-bantuan-bencana.vercel.app/

---

## Team Members

| Nama | NPM | Role | GitHub |
|-----|-----|------|--------|
| Muhammad Faiz | 220511139 | Frontend & Algorithm Integration | https://github.com/muhammadfaiz19 |
| Revan Fazry Huda | 220511179 | Algorithm & Logic Implementation | https://github.com/RevanFazryHuda |
| Moh Syafiq Ade Luwindra | 220511095 | UI/UX & Visualization | https://github.com/adeluindra |

---

## Tech Stack
- React
- Vite
- TypeScript
- CSS
- Linear Programming (Big M Method)

---

## Installation

### Prerequisites
- Node.js (v18+)
- npm / yarn

### Setup
```bash
npm install
```

---

## Usage

### Development
```bash
npm run dev
```

Akses melalui:
```
http://localhost:5173
```

### Build Production
```bash
npm run build
```

---

## Features
- Input data distribusi bantuan
- Validasi kelayakan (feasible / infeasible)
- Metode Big M & Simplex
- Tabel iterasi simplex
- Visualisasi grafik distribusi dan biaya
- Upload dataset (CSV / Excel)
- Responsive UI

---

## Model Matematis

### Fungsi Tujuan
Min Z = Σ(cᵢ × xᵢ) + M × Σ(Aᵢ)

Keterangan:
- cᵢ = biaya distribusi per paket
- xᵢ = jumlah paket dialokasikan
- Aᵢ = variabel artifisial
- M = bilangan penalti besar

### Kendala
- xᵢ ≥ kebutuhan minimum
- Σxᵢ ≤ stok tersedia
- xᵢ ≥ 0, Aᵢ ≥ 0

---

## Dataset
Dataset mencakup:
- Nama lokasi bencana
- Kebutuhan minimum bantuan
- Biaya distribusi per paket
- Total stok bantuan (opsional)

Dataset dapat diinput manual atau diunggah melalui file CSV / Excel.

---

## Results
Sistem menghasilkan:
- Status solusi (Feasible / Tidak Feasible)
- Alokasi optimal per lokasi
- Total biaya distribusi
- Visualisasi perbandingan kebutuhan vs alokasi

---

## License
Project ini dibuat untuk **keperluan akademik** mata kuliah **Riset Operasi**.

---

## Acknowledgement
Terima kasih kepada dosen pengampu dan referensi Riset Operasi yang menjadi dasar pengembangan sistem ini.
