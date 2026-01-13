import { CheckCircle2, XCircle, Package, TrendingDown, AlertTriangle } from "lucide-react";
import { Solution } from "@/lib/bigMSolver";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface ResultsTableProps {
  solution: Solution | null;
}

export function ResultsTable({ solution }: ResultsTableProps) {
  if (!solution) return null;

  const formatCurrency = (value: number) => {
    return `Rp ${value.toLocaleString("id-ID")}`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Status Banner */}
      <div
        className={`rounded-xl p-4 flex items-start gap-3 ${
          solution.isFeasible
            ? "bg-success/10 border border-success/20"
            : "bg-destructive/10 border border-destructive/20"
        }`}
      >
        {solution.isFeasible ? (
          <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 mt-0.5" />
        ) : (
          <XCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
        )}
        <div>
          <h4
            className={`font-semibold ${
              solution.isFeasible ? "text-success" : "text-destructive"
            }`}
          >
            {solution.isFeasible ? "Solusi Feasible" : "Solusi Tidak Feasible"}
          </h4>
          <p className="text-sm text-muted-foreground mt-1">{solution.message}</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl p-4 border border-border/50 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Distribusi</p>
              <p className="text-xl font-bold text-foreground">
                {solution.totalAllocated.toLocaleString("id-ID")} paket
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-4 border border-border/50 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Biaya</p>
              <p className="text-xl font-bold text-foreground">
                {solution.isFeasible 
                  ? formatCurrency(solution.totalCost)
                  : "N/A (Tidak Feasible)"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-4 border border-border/50 shadow-card">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                solution.isFeasible ? "bg-success/10" : "bg-warning/10"
              }`}
            >
              <AlertTriangle
                className={`w-5 h-5 ${
                  solution.isFeasible ? "text-success" : "text-warning"
                }`}
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Variabel Artifisial</p>
              <p className="text-xl font-bold text-foreground">
                {solution.artificialVariables.reduce((a, b) => a + b, 0) > 0
                  ? `${solution.artificialVariables.filter((v) => v > 0).length} aktif`
                  : "Semua = 0"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Allocation Table */}
      <div className="bg-card rounded-xl border border-border/50 overflow-hidden shadow-card">
        <div className="px-4 py-3 bg-muted/30 border-b border-border/50">
          <h3 className="font-semibold text-foreground">Tabel Rekomendasi Distribusi</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold">No</TableHead>
              <TableHead className="font-semibold">Lokasi</TableHead>
              <TableHead className="text-right font-semibold">Kebutuhan Min</TableHead>
              <TableHead className="text-right font-semibold">Alokasi Optimal</TableHead>
              <TableHead className="text-right font-semibold">Biaya/Paket</TableHead>
              <TableHead className="text-right font-semibold">Total Biaya</TableHead>
              <TableHead className="text-right font-semibold">Artifisial (Aᵢ)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {solution.allocations.map((alloc, idx) => (
              <TableRow key={alloc.locationId}>
                <TableCell className="font-medium">{idx + 1}</TableCell>
                <TableCell className="font-medium">{alloc.locationName}</TableCell>
                <TableCell className="text-right">
                  {alloc.minNeed.toLocaleString("id-ID")}
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={
                      alloc.allocated < alloc.minNeed
                        ? "text-destructive font-semibold"
                        : "text-success font-semibold"
                    }
                  >
                    {alloc.allocated.toLocaleString("id-ID")}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(alloc.costPerPacket)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(alloc.cost)}
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={
                      solution.artificialVariables[idx] > 0
                        ? "text-destructive font-semibold"
                        : "text-success"
                    }
                  >
                    {solution.artificialVariables[idx].toLocaleString("id-ID")}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
