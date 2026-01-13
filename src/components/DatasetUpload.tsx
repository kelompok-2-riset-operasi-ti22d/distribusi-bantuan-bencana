import { useState, useRef } from "react";
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle, X, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Location, generateId } from "@/lib/bigMSolver";
import * as XLSX from "xlsx";

interface DatasetUploadProps {
  onDataLoaded: (locations: Location[], totalStock?: number) => void;
}

interface ParsedData {
  locations: Location[];
  totalStock?: number;
}

interface ValidationError {
  type: "format" | "columns" | "empty" | "data";
  message: string;
  details?: string[];
}

const REQUIRED_COLUMNS = ["nama_lokasi", "kebutuhan_minimal", "biaya_per_paket"];
const OPTIONAL_COLUMNS = ["total_stok"];

const TEMPLATE_DATA = [
  { nama_lokasi: "Kabupaten Cianjur", kebutuhan_minimal: 500, biaya_per_paket: 45000 },
  { nama_lokasi: "Kabupaten Sumedang", kebutuhan_minimal: 350, biaya_per_paket: 55000 },
];

export function DatasetUpload({ onDataLoaded }: DatasetUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<ValidationError | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<ParsedData | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateColumns = (headers: string[]): ValidationError | null => {
    const normalizedHeaders = headers.map((h) => 
      h.toLowerCase().trim().replace(/\s+/g, "_")
    );
    
    const missingColumns = REQUIRED_COLUMNS.filter(
      (col) => !normalizedHeaders.includes(col)
    );

    if (missingColumns.length > 0) {
      return {
        type: "columns",
        message: "Struktur kolom tidak sesuai dengan template",
        details: [
          `Kolom yang diperlukan: ${REQUIRED_COLUMNS.join(", ")}`,
          `Kolom yang tidak ditemukan: ${missingColumns.join(", ")}`,
        ],
      };
    }

    return null;
  };

  const parseData = (data: Record<string, unknown>[]): ParsedData | ValidationError => {
    if (!data || data.length === 0) {
      return {
        type: "empty",
        message: "File tidak berisi data",
        details: ["File harus memiliki minimal 1 baris data selain header"],
      };
    }

    const headers = Object.keys(data[0]);
    const columnError = validateColumns(headers);
    if (columnError) return columnError;

    // Normalize header names
    const normalizeHeader = (h: string) => h.toLowerCase().trim().replace(/\s+/g, "_");
    
    const locations: Location[] = [];
    const errors: string[] = [];
    let totalStock: number | undefined;

    // Check for total_stok in first row
    const firstRow = data[0];
    const totalStokKey = Object.keys(firstRow).find(
      (k) => normalizeHeader(k) === "total_stok"
    );
    if (totalStokKey && firstRow[totalStokKey] !== undefined && firstRow[totalStokKey] !== "") {
      const stockValue = Number(firstRow[totalStokKey]);
      if (!isNaN(stockValue) && stockValue > 0) {
        totalStock = stockValue;
      }
    }

    data.forEach((row, index) => {
      const rowNum = index + 2; // +2 because of header row and 0-index
      
      const namaKey = Object.keys(row).find((k) => normalizeHeader(k) === "nama_lokasi");
      const kebutuhanKey = Object.keys(row).find((k) => normalizeHeader(k) === "kebutuhan_minimal");
      const biayaKey = Object.keys(row).find((k) => normalizeHeader(k) === "biaya_per_paket");

      const nama = namaKey ? String(row[namaKey] || "").trim() : "";
      const kebutuhan = kebutuhanKey ? Number(row[kebutuhanKey]) : NaN;
      const biaya = biayaKey ? Number(row[biayaKey]) : NaN;

      if (!nama) {
        errors.push(`Baris ${rowNum}: Nama lokasi kosong`);
        return;
      }

      if (isNaN(kebutuhan) || kebutuhan < 0) {
        errors.push(`Baris ${rowNum}: Kebutuhan minimal tidak valid (${row[kebutuhanKey!]})`);
        return;
      }

      if (isNaN(biaya) || biaya < 0) {
        errors.push(`Baris ${rowNum}: Biaya per paket tidak valid (${row[biayaKey!]})`);
        return;
      }

      locations.push({
        id: generateId(),
        name: nama,
        minNeed: kebutuhan,
        costPerPacket: biaya,
      });
    });

    if (errors.length > 0) {
      return {
        type: "data",
        message: `Ditemukan ${errors.length} kesalahan pada data`,
        details: errors.slice(0, 5).concat(
          errors.length > 5 ? [`...dan ${errors.length - 5} kesalahan lainnya`] : []
        ),
      };
    }

    if (locations.length === 0) {
      return {
        type: "empty",
        message: "Tidak ada data valid yang dapat diproses",
        details: ["Pastikan file berisi data lokasi yang lengkap"],
      };
    }

    return { locations, totalStock };
  };

  const processFile = async (file: File) => {
    setError(null);
    setSuccess(null);
    setPreviewData(null);

    // Validate file type
    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    const extension = file.name.split(".").pop()?.toLowerCase();
    
    if (!validTypes.includes(file.type) && !["csv", "xlsx", "xls"].includes(extension || "")) {
      setError({
        type: "format",
        message: "Format file tidak didukung",
        details: ["Hanya file .csv dan .xlsx yang dapat diunggah"],
      });
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet);

      const result = parseData(jsonData);

      if ("type" in result) {
        setError(result);
        return;
      }

      setFileName(file.name);
      setPreviewData(result);
      setSuccess(`Berhasil memuat ${result.locations.length} lokasi dari file`);
    } catch (err) {
      setError({
        type: "format",
        message: "Gagal membaca file",
        details: ["Pastikan file tidak rusak dan sesuai format yang didukung"],
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const downloadTemplate = (format: "csv" | "xlsx") => {
    const worksheet = XLSX.utils.json_to_sheet(TEMPLATE_DATA);
    
    // Set column widths
    worksheet["!cols"] = [
      { wch: 25 }, // nama_lokasi
      { wch: 18 }, // kebutuhan_minimal
      { wch: 18 }, // biaya_per_paket
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");

    if (format === "csv") {
      XLSX.writeFile(workbook, "template_dataset_distribusi.csv");
    } else {
      XLSX.writeFile(workbook, "template_dataset_distribusi.xlsx");
    }
  };

  const applyData = () => {
    if (previewData) {
      onDataLoaded(previewData.locations, previewData.totalStock);
      setSuccess(`Data berhasil diterapkan: ${previewData.locations.length} lokasi`);
      setPreviewData(null);
      setFileName(null);
    }
  };

  const clearPreview = () => {
    setPreviewData(null);
    setFileName(null);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="space-y-4">
      {/* Header dengan tombol download template */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-primary" />
            Upload Dataset
          </h4>
          <p className="text-sm text-muted-foreground mt-0.5">
            Import data lokasi dari file CSV atau Excel
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => downloadTemplate("csv")}
            className="text-xs"
          >
            <Download className="w-3 h-3 mr-1" />
            Template CSV
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => downloadTemplate("xlsx")}
            className="text-xs"
          >
            <Download className="w-3 h-3 mr-1" />
            Template Excel
          </Button>
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-all duration-200
          ${isDragging 
            ? "border-primary bg-primary/5" 
            : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/30"
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
        />
        
        <Upload className={`w-8 h-8 mx-auto mb-2 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
        <p className="text-sm font-medium text-foreground">
          {isDragging ? "Lepaskan file di sini" : "Klik atau seret file ke sini"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Format: CSV, XLSX (maks. 10MB)
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{error.message}</AlertTitle>
          {error.details && (
            <AlertDescription>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                {error.details.map((detail, i) => (
                  <li key={i}>{detail}</li>
                ))}
              </ul>
            </AlertDescription>
          )}
        </Alert>
      )}

      {/* Success Alert */}
      {success && !previewData && (
        <Alert className="border-green-500/50 bg-green-50 dark:bg-green-950/30">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800 dark:text-green-200">{success}</AlertTitle>
        </Alert>
      )}

      {/* Preview Data */}
      {previewData && (
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="bg-muted/50 px-4 py-3 flex items-center justify-between border-b border-border">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">Preview Data</span>
              {fileName && (
                <span className="text-xs text-muted-foreground">({fileName})</span>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={clearPreview}
              className="h-6 w-6"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="p-4 space-y-3">
            {previewData.totalStock && (
              <div className="text-sm">
                <span className="text-muted-foreground">Total Stok: </span>
                <span className="font-semibold text-foreground">
                  {previewData.totalStock.toLocaleString("id-ID")} paket
                </span>
              </div>
            )}
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2 text-muted-foreground font-medium">No</th>
                    <th className="text-left py-2 px-2 text-muted-foreground font-medium">Nama Lokasi</th>
                    <th className="text-right py-2 px-2 text-muted-foreground font-medium">Kebutuhan Min.</th>
                    <th className="text-right py-2 px-2 text-muted-foreground font-medium">Biaya/Paket</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.locations.slice(0, 5).map((loc, i) => (
                    <tr key={loc.id} className="border-b border-border/50 last:border-0">
                      <td className="py-2 px-2 text-muted-foreground">{i + 1}</td>
                      <td className="py-2 px-2 font-medium">{loc.name}</td>
                      <td className="py-2 px-2 text-right">{loc.minNeed.toLocaleString("id-ID")}</td>
                      <td className="py-2 px-2 text-right">Rp {loc.costPerPacket.toLocaleString("id-ID")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {previewData.locations.length > 5 && (
                <p className="text-xs text-muted-foreground text-center py-2">
                  ...dan {previewData.locations.length - 5} lokasi lainnya
                </p>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                onClick={applyData}
                className="flex-1 bg-gradient-hero hover:opacity-90"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Terapkan Data
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={clearPreview}
              >
                Batal
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Info format */}
      <div className="bg-muted/30 rounded-lg p-3 text-xs text-muted-foreground">
        <p className="font-medium text-foreground mb-1">Format Kolom yang Diperlukan:</p>
        <ul className="list-disc list-inside space-y-0.5">
          <li><code className="bg-muted px-1 rounded">nama_lokasi</code> - Nama desa/wilayah terdampak</li>
          <li><code className="bg-muted px-1 rounded">kebutuhan_minimal</code> - Jumlah paket yang dibutuhkan</li>
          <li><code className="bg-muted px-1 rounded">biaya_per_paket</code> - Biaya distribusi per paket (Rp)</li>
          <li><code className="bg-muted px-1 rounded">total_stok</code> (opsional) - Total stok yang tersedia</li>
        </ul>
      </div>
    </div>
  );
}
