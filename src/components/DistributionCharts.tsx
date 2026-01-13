import { Solution } from "@/lib/bigMSolver";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface DistributionChartsProps {
  solution: Solution | null;
}

const COLORS = [
  "hsl(215, 80%, 45%)",
  "hsl(32, 95%, 50%)",
  "hsl(145, 65%, 40%)",
  "hsl(280, 60%, 55%)",
  "hsl(195, 75%, 45%)",
  "hsl(350, 70%, 50%)",
  "hsl(160, 60%, 45%)",
  "hsl(45, 90%, 50%)",
];

export function DistributionCharts({ solution }: DistributionChartsProps) {
  if (!solution || solution.allocations.length === 0) return null;

  const barData = solution.allocations.map((alloc) => ({
    name: alloc.locationName.length > 12 
      ? alloc.locationName.substring(0, 12) + "..." 
      : alloc.locationName,
    fullName: alloc.locationName,
    kebutuhan: alloc.minNeed,
    alokasi: alloc.allocated,
  }));

  const pieData = solution.allocations.map((alloc) => ({
    name: alloc.locationName,
    value: alloc.cost,
  }));

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}jt`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}rb`;
    }
    return value.toString();
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3">
          <p className="font-semibold text-foreground mb-1">{data.fullName || label}</p>
          {payload.map((entry: any, idx: number) => (
            <p key={idx} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString("id-ID")} paket
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3">
          <p className="font-semibold text-foreground">{payload[0].name}</p>
          <p className="text-sm text-muted-foreground">
            Rp {payload[0].value.toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-muted-foreground">
            ({((payload[0].value / solution.totalCost) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
      {/* Bar Chart */}
      <div className="bg-card rounded-xl border border-border/50 p-6 shadow-card">
        <h3 className="font-semibold text-foreground mb-4">
          Perbandingan Kebutuhan vs Alokasi
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 20, right: 20, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="name"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: "20px" }}
                formatter={(value) => (
                  <span className="text-foreground text-sm capitalize">{value}</span>
                )}
              />
              <Bar
                dataKey="kebutuhan"
                fill="hsl(var(--muted-foreground))"
                radius={[4, 4, 0, 0]}
                name="Kebutuhan Min"
              />
              <Bar
                dataKey="alokasi"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
                name="Alokasi Optimal"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-card rounded-xl border border-border/50 p-6 shadow-card">
        <h3 className="font-semibold text-foreground mb-4">
          Proporsi Biaya Distribusi per Lokasi
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ""
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                formatter={(value) => (
                  <span className="text-foreground text-xs">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
