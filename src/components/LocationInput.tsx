import { Plus, Trash2, MapPin, HelpCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Location, generateId } from "@/lib/bigMSolver";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface LocationInputProps {
  locations: Location[];
  onLocationsChange: (locations: Location[]) => void;
}

export function LocationInput({ locations, onLocationsChange }: LocationInputProps) {
  const addLocation = () => {
    const newLocation: Location = {
      id: generateId(),
      name: `Lokasi ${locations.length + 1}`,
      minNeed: 100,
      costPerPacket: 50000,
    };
    onLocationsChange([...locations, newLocation]);
  };

  const removeLocation = (id: string) => {
    if (locations.length > 1) {
      onLocationsChange(locations.filter((loc) => loc.id !== id));
    }
  };

  const updateLocation = (id: string, field: keyof Location, value: string | number) => {
    onLocationsChange(
      locations.map((loc) =>
        loc.id === id ? { ...loc, [field]: value } : loc
      )
    );
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Data Lokasi Bencana
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Masukkan data lokasi yang membutuhkan bantuan sembako
            </p>
          </div>
          <Button
            type="button"
            onClick={addLocation}
            variant="outline"
            size="sm"
            className="border-primary/30 text-primary hover:bg-primary/5"
          >
            <Plus className="w-4 h-4 mr-1" />
            Tambah Lokasi
          </Button>
        </div>

        {/* Penjelasan singkat */}
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm">
          <p className="text-blue-800 dark:text-blue-200">
            <strong>Petunjuk:</strong> Setiap lokasi bencana memiliki kebutuhan minimal paket sembako 
            dan biaya distribusi yang berbeda-beda tergantung jarak, akses, dan kondisi lapangan.
          </p>
        </div>

        <div className="space-y-3">
          {locations.map((location, index) => (
            <div
              key={location.id}
              className="bg-muted/30 rounded-lg p-4 border border-border/50 animate-fade-in"
            >
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary flex-shrink-0">
                  {index + 1}
                </div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Nama Lokasi */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1">
                      <Label htmlFor={`name-${location.id}`} className="text-xs text-muted-foreground">
                        Nama Lokasi
                      </Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-3 h-3 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Nama desa, kecamatan, atau wilayah yang terdampak bencana dan membutuhkan bantuan.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input
                      id={`name-${location.id}`}
                      value={location.name}
                      onChange={(e) => updateLocation(location.id, "name", e.target.value)}
                      placeholder="Contoh: Desa Sukamaju"
                      className="bg-card"
                    />
                  </div>
                  
                  {/* Kebutuhan Minimal */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1">
                      <Label htmlFor={`need-${location.id}`} className="text-xs text-muted-foreground">
                        Kebutuhan Minimal
                      </Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-3 h-3 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p><strong>Jumlah paket sembako minimal</strong> yang harus diterima lokasi ini. Contoh: Jika ada 100 KK (Kepala Keluarga), maka minimal 100 paket.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="relative">
                      <Input
                        id={`need-${location.id}`}
                        type="number"
                        min={0}
                        value={location.minNeed}
                        onChange={(e) => updateLocation(location.id, "minNeed", parseInt(e.target.value) || 0)}
                        placeholder="100"
                        className="bg-card pr-14"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                        paket
                      </span>
                    </div>
                  </div>
                  
                  {/* Biaya Distribusi */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1">
                      <Label htmlFor={`cost-${location.id}`} className="text-xs text-muted-foreground">
                        Biaya Distribusi/Paket
                      </Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-3 h-3 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p><strong>Biaya untuk mengirim 1 paket sembako</strong> ke lokasi ini. Termasuk biaya transportasi, tenaga kerja, dan logistik. Lokasi yang sulit dijangkau biasanya lebih mahal.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                        Rp
                      </span>
                      <Input
                        id={`cost-${location.id}`}
                        type="number"
                        min={0}
                        value={location.costPerPacket}
                        onChange={(e) => updateLocation(location.id, "costPerPacket", parseInt(e.target.value) || 0)}
                        placeholder="50000"
                        className="bg-card pl-9"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeLocation(location.id)}
                  disabled={locations.length <= 1}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
