import { SimplexTableau as TableauType } from "@/lib/simplexSolver";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, ArrowRight, Target, AlertTriangle } from "lucide-react";

interface SimplexTableauProps {
  tableaus: TableauType[];
  locationNames: string[];
  isFeasible: boolean;
}

const SimplexTableau = ({ tableaus, locationNames, isFeasible }: SimplexTableauProps) => {
  if (tableaus.length === 0) return null;

  const n = locationNames.length;
  
  // Generate column headers
  const getColumnHeaders = (tableau: TableauType) => {
    const headers: string[] = [];
    for (let i = 0; i < n; i++) headers.push(`x₍${i + 1}₎`);
    for (let i = 0; i < n; i++) headers.push(`s₍${i + 1}₎`);
    for (let i = 0; i < n; i++) headers.push(`A₍${i + 1}₎`);
    headers.push('s_stok');
    headers.push('RHS');
    return headers;
  };

  const formatNumber = (num: number): string => {
    if (Math.abs(num) > 100000) {
      return num > 0 ? 'M' : '-M';
    }
    if (Math.abs(num) < 0.0001) return '0';
    return num.toFixed(2);
  };

  const getRowLabel = (index: number, numConstraints: number, basicVars: string[]) => {
    if (index < numConstraints) {
      return basicVars[index] || `R${index + 1}`;
    }
    return 'Z';
  };

  return (
    <Card className="border-primary/20 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Target className="h-5 w-5 text-primary" />
          Langkah-Langkah Iterasi Metode Big M (Tabel Simplex)
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Berikut adalah proses perhitungan bertahap menggunakan metode simplex dengan penalti Big M untuk menemukan solusi optimal.
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Legend */}
        <div className="mb-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-semibold mb-3">Keterangan Variabel:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50">x₁, x₂, ...</Badge>
              <span>Variabel keputusan (jumlah paket)</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50">s₁, s₂, ...</Badge>
              <span>Variabel surplus</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-red-50">A₁, A₂, ...</Badge>
              <span>Variabel artifisial (penalti M)</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-amber-50">s_stok</Badge>
              <span>Variabel slack stok</span>
            </div>
          </div>
          <div className="mt-3 text-sm text-muted-foreground">
            <strong>Lokasi:</strong> {locationNames.map((name, i) => `x₍${i + 1}₎ = ${name}`).join(', ')}
          </div>
        </div>

        <Accordion type="multiple" defaultValue={["0", String(tableaus.length - 1)]} className="space-y-4">
          {tableaus.map((tableau, idx) => {
            const headers = getColumnHeaders(tableau);
            const numConstraints = tableau.tableau.length - 1;
            
            return (
              <AccordionItem key={idx} value={String(idx)} className="border rounded-lg overflow-hidden">
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/30">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge 
                      variant={tableau.isOptimal ? "default" : "secondary"}
                      className={tableau.isOptimal ? "bg-green-600" : ""}
                    >
                      {tableau.iteration === 0 ? "Tabel Awal" : `Iterasi ${tableau.iteration}`}
                    </Badge>
                    {tableau.isOptimal && (
                      <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Solusi Optimal
                      </Badge>
                    )}
                    {tableau.enteringVariable && (
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <span className="text-blue-600 font-medium">{tableau.enteringVariable}</span>
                        <ArrowRight className="h-3 w-3" />
                        masuk,
                        <span className="text-red-600 font-medium">{tableau.leavingVariable}</span>
                        keluar
                      </span>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <p className="text-sm text-muted-foreground mb-4 p-3 bg-muted/30 rounded">
                    {tableau.description}
                  </p>
                  
                  <div className="overflow-x-auto">
                    <Table className="text-sm">
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-bold w-20">Basis</TableHead>
                          {headers.map((header, i) => (
                            <TableHead 
                              key={i} 
                              className={`text-center min-w-[60px] ${
                                i === tableau.pivotColumn ? 'bg-blue-100 text-blue-800 font-bold' : ''
                              } ${
                                header.startsWith('A') ? 'text-red-600' : ''
                              }`}
                            >
                              {header}
                            </TableHead>
                          ))}
                          {tableau.ratios && <TableHead className="text-center min-w-[60px]">Rasio</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tableau.tableau.map((row, rowIdx) => {
                          const isObjRow = rowIdx === tableau.tableau.length - 1;
                          const isPivotRow = rowIdx === tableau.pivotRow;
                          
                          return (
                            <TableRow 
                              key={rowIdx}
                              className={`${
                                isObjRow ? 'bg-primary/5 font-semibold' : ''
                              } ${
                                isPivotRow ? 'bg-amber-50' : ''
                              }`}
                            >
                              <TableCell className="font-medium">
                                {getRowLabel(rowIdx, numConstraints, tableau.basicVariables)}
                              </TableCell>
                              {row.map((cell, cellIdx) => {
                                const isPivotCell = rowIdx === tableau.pivotRow && cellIdx === tableau.pivotColumn;
                                return (
                                  <TableCell 
                                    key={cellIdx}
                                    className={`text-center ${
                                      isPivotCell ? 'bg-amber-300 font-bold text-amber-900 ring-2 ring-amber-500' : ''
                                    } ${
                                      cellIdx === tableau.pivotColumn && !isPivotCell ? 'bg-blue-50' : ''
                                    }`}
                                  >
                                    {formatNumber(cell)}
                                  </TableCell>
                                );
                              })}
                              {tableau.ratios && !isObjRow && (
                                <TableCell className="text-center font-medium text-purple-700">
                                  {tableau.ratios[rowIdx]}
                                </TableCell>
                              )}
                              {tableau.ratios && isObjRow && (
                                <TableCell className="text-center">-</TableCell>
                              )}
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>

                  {tableau.pivotElement && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm">
                      <strong>Operasi Pivot:</strong> Elemen pivot = <span className="font-mono bg-amber-200 px-1 rounded">{tableau.pivotElement.toFixed(2)}</span>
                      <br />
                      1. Bagi baris pivot dengan elemen pivot
                      <br />
                      2. Eliminasi kolom pivot dari baris lain menggunakan operasi baris elementer
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        {/* Final Result Summary */}
        <div className={`mt-6 p-4 rounded-lg border-2 ${
          isFeasible 
            ? 'bg-green-50 border-green-300' 
            : 'bg-red-50 border-red-300'
        }`}>
          <div className="flex items-start gap-3">
            {isFeasible ? (
              <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
            ) : (
              <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5" />
            )}
            <div>
              <h4 className={`font-semibold ${isFeasible ? 'text-green-800' : 'text-red-800'}`}>
                {isFeasible ? 'Solusi Feasible & Optimal' : 'Solusi Tidak Feasible'}
              </h4>
              <p className={`text-sm ${isFeasible ? 'text-green-700' : 'text-red-700'}`}>
                {isFeasible 
                  ? 'Semua variabel artifisial bernilai 0. Solusi memenuhi semua kendala sistem.'
                  : 'Terdapat variabel artifisial > 0. Stok yang tersedia tidak mencukupi kebutuhan minimum semua lokasi.'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimplexTableau;
