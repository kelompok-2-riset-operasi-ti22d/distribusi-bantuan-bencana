import { useState, useEffect } from "react";
import { Package, Calculator as CalcIcon, ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { LocationInput } from "./LocationInput";
import { ResultsTable } from "./ResultsTable";
import { DistributionCharts } from "./DistributionCharts";
import SimplexTableau from "./SimplexTableau";
import { DatasetUpload } from "./DatasetUpload";
import { Location, Solution, solveBigM, generateId } from "@/lib/bigMSolver";
import { SimplexSolution, solveSimplexBigM } from "@/lib/simplexSolver";

interface CalculatorProps {
  onBack: () => void;
}

const defaultLocations: Location[] = [
  { id: generateId(), name: "Kec. Barus", minNeed: 500, costPerPacket: 55000 },
  { id: generateId(), name: "Kec. Pandan", minNeed: 350, costPerPacket: 45000 },
  { id: generateId(), name: "Kec. Kolang", minNeed: 200, costPerPacket: 35000 },
];

export function Calculator({ onBack }: CalculatorProps) {
  const [totalStock, setTotalStock] = useState(1000);
  const [locations, setLocations] = useState<Location[]>(defaultLocations);
  const [solution, setSolution] = useState<Solution | null>(null);
  const [simplexSolution, setSimplexSolution] = useState<SimplexSolution | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleCalculate = () => {
    const result = solveBigM(locations, totalStock);
    const simplexResult = solveSimplexBigM(locations, totalStock);
    setSolution(result);
    setSimplexSolution(simplexResult);
    setHasCalculated(true);
  };

  const handleReset = () => {
    setTotalStock(1000);
    setLocations(defaultLocations.map(loc => ({ ...loc, id: generateId() })));
    setSolution(null);
    setSimplexSolution(null);
    setHasCalculated(false);
  };

  const handleDataLoaded = (newLocations: Location[], newTotalStock?: number) => {
    setLocations(newLocations);
    if (newTotalStock) {
      setTotalStock(newTotalStock);
    }
    setSolution(null);
    setSimplexSolution(null);
    setHasCalculated(false);
  };

  // Auto-recalculate when inputs change after first calculation
  useEffect(() => {
    if (hasCalculated) {
      const result = solveBigM(locations, totalStock);
      const simplexResult = solveSimplexBigM(locations, totalStock);
      setSolution(result);
      setSimplexSolution(simplexResult);
    }
  }, [locations, totalStock, hasCalculated]);

  const totalMinNeed = locations.reduce((sum, loc) => sum + loc.minNeed, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
                <CalcIcon className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">Kalkulator Distribusi</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="border-muted-foreground/30"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Input Section */}
          <div className="bg-card rounded-xl border border-border/50 p-6 shadow-card">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Input Data Distribusi
            </h2>

            {/* Global Stock Input */}
            <div className="mb-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <Label htmlFor="stock" className="text-sm font-medium text-foreground">
                    Total Stok Bantuan Tersedia
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Jumlah paket sembako yang siap didistribusikan
                  </p>
                </div>
                <div className="w-full md:w-48">
                  <Input
                    id="stock"
                    type="number"
                    min={0}
                    value={totalStock}
                    onChange={(e) => setTotalStock(parseInt(e.target.value) || 0)}
                    className="text-lg font-semibold bg-card"
                  />
                </div>
              </div>

              {/* Quick stats */}
              <div className="mt-4 pt-4 border-t border-primary/10 flex flex-wrap gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Total Kebutuhan Min: </span>
                  <span className="font-semibold text-foreground">
                    {totalMinNeed.toLocaleString("id-ID")} paket
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Sisa/Kurang: </span>
                  <span
                    className={`font-semibold ${
                      totalStock >= totalMinNeed ? "text-success" : "text-destructive"
                    }`}
                  >
                    {totalStock >= totalMinNeed ? "+" : ""}
                    {(totalStock - totalMinNeed).toLocaleString("id-ID")} paket
                  </span>
                </div>
              </div>
            </div>

            {/* Dataset Upload */}
            <div className="mb-6 p-4 bg-muted/30 rounded-lg border border-border/50">
              <DatasetUpload onDataLoaded={handleDataLoaded} />
            </div>

            {/* Location Inputs */}
            <LocationInput locations={locations} onLocationsChange={setLocations} />

            {/* Calculate Button */}
            <div className="mt-6 pt-6 border-t border-border/50">
              <Button
                onClick={handleCalculate}
                className="w-full md:w-auto bg-gradient-hero hover:opacity-90 text-primary-foreground shadow-hero py-6 px-8 text-lg font-semibold"
              >
                <CalcIcon className="w-5 h-5 mr-2" />
                Hitung Optimasi
              </Button>
            </div>
          </div>

          {/* Results Section */}
          {solution && (
            <>
              <ResultsTable solution={solution} />
              {simplexSolution && (
                <SimplexTableau 
                  tableaus={simplexSolution.tableaus} 
                  locationNames={locations.map(l => l.name)}
                  isFeasible={simplexSolution.isFeasible}
                />
              )}
              <DistributionCharts solution={solution} />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
