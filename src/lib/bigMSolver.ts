// Big M Method Linear Programming Solver for Disaster Relief Distribution

export interface Location {
  id: string;
  name: string;
  minNeed: number; // kebutuhan minimum
  costPerPacket: number; // biaya per paket
}

export interface Solution {
  allocations: {
    locationId: string;
    locationName: string;
    minNeed: number;
    allocated: number;
    cost: number;
    costPerPacket: number;
  }[];
  totalAllocated: number;
  totalCost: number;
  isFeasible: boolean;
  artificialVariables: number[];
  message: string;
}

const BIG_M = 1e9; // Large penalty value

export function solveBigM(locations: Location[], totalStock: number): Solution {
  if (locations.length === 0) {
    return {
      allocations: [],
      totalAllocated: 0,
      totalCost: 0,
      isFeasible: false,
      artificialVariables: [],
      message: "Tidak ada lokasi yang dimasukkan",
    };
  }

  // Calculate total minimum need
  const totalMinNeed = locations.reduce((sum, loc) => sum + loc.minNeed, 0);

  // Check if solution is feasible based on stock constraint
  const isFeasible = totalStock >= totalMinNeed;

  // Artificial variables - represent unfulfilled needs
  const artificialVariables: number[] = new Array(locations.length).fill(0);

  // Create allocation map for easy updates
  const allocationMap = new Map<string, number>();
  locations.forEach(loc => allocationMap.set(loc.id, 0));

  if (isFeasible) {
    // FEASIBLE CASE: Stock >= Total Minimum Need
    // Step 1: Allocate minimum need to each location
    locations.forEach(loc => {
      allocationMap.set(loc.id, loc.minNeed);
    });

    // Step 2: Calculate remaining stock after meeting all minimum needs
    let remainingStock = totalStock - totalMinNeed;

    // Step 3: Distribute remaining stock to CHEAPEST locations first (minimize cost)
    if (remainingStock > 0) {
      // Sort locations by cost per packet (ascending - cheapest first)
      const sortedLocations = [...locations].sort(
        (a, b) => a.costPerPacket - b.costPerPacket
      );

      // Allocate all remaining stock to cheapest locations
      for (const loc of sortedLocations) {
        if (remainingStock <= 0) break;
        
        // Add remaining stock to this location (cheapest gets priority)
        const currentAllocation = allocationMap.get(loc.id) || 0;
        allocationMap.set(loc.id, currentAllocation + remainingStock);
        remainingStock = 0; // All remaining stock goes to cheapest location
      }
    }
  } else {
    // INFEASIBLE CASE: Stock < Total Minimum Need
    // Distribute proportionally based on minimum need
    let distributedStock = 0;
    
    // First pass: distribute proportionally (floor values)
    locations.forEach((loc, index) => {
      const proportion = loc.minNeed / totalMinNeed;
      const allocated = Math.floor(totalStock * proportion);
      allocationMap.set(loc.id, allocated);
      distributedStock += allocated;
      
      // Calculate artificial variable (unfulfilled need)
      artificialVariables[index] = Math.max(0, loc.minNeed - allocated);
    });

    // Second pass: distribute remaining units due to floor rounding
    let remainingFromRounding = totalStock - distributedStock;
    if (remainingFromRounding > 0) {
      // Sort by highest unfulfilled need first
      const sortedByNeed = locations
        .map((loc, index) => ({ loc, index, unfulfilled: artificialVariables[index] }))
        .sort((a, b) => b.unfulfilled - a.unfulfilled);

      for (const item of sortedByNeed) {
        if (remainingFromRounding <= 0) break;
        
        const currentAllocation = allocationMap.get(item.loc.id) || 0;
        allocationMap.set(item.loc.id, currentAllocation + 1);
        artificialVariables[item.index] = Math.max(0, artificialVariables[item.index] - 1);
        remainingFromRounding--;
      }
    }
  }

  // Build final allocations array
  const allocations = locations.map((loc, index) => {
    const allocated = allocationMap.get(loc.id) || 0;
    return {
      locationId: loc.id,
      locationName: loc.name,
      minNeed: loc.minNeed,
      allocated,
      cost: allocated * loc.costPerPacket,
      costPerPacket: loc.costPerPacket,
    };
  });

  const totalAllocated = allocations.reduce((sum, a) => sum + a.allocated, 0);
  const totalCost = allocations.reduce((sum, a) => sum + a.cost, 0);

  // Calculate penalty cost for infeasible solution
  const penaltyCost = artificialVariables.reduce((sum, a) => sum + a * BIG_M, 0);

  // Build detailed message
  let message: string;
  if (isFeasible) {
    const remainingDistributed = totalStock - totalMinNeed;
    if (remainingDistributed > 0) {
      // Find cheapest location that received extra
      const cheapestLoc = [...locations].sort((a, b) => a.costPerPacket - b.costPerPacket)[0];
      message = `Solusi optimal ditemukan. Semua kebutuhan minimum terpenuhi. Sisa stok ${remainingDistributed.toLocaleString('id-ID')} paket dialokasikan ke lokasi termurah (${cheapestLoc.name}) untuk meminimalkan biaya. Total biaya: Rp ${totalCost.toLocaleString('id-ID')}`;
    } else {
      message = `Solusi optimal ditemukan. Semua stok terdistribusi tepat sesuai kebutuhan minimum. Total biaya: Rp ${totalCost.toLocaleString('id-ID')}`;
    }
  } else {
    message = `Solusi tidak feasible. Stok tersedia (${totalStock.toLocaleString('id-ID')} paket) kurang dari total kebutuhan minimum (${totalMinNeed.toLocaleString('id-ID')} paket). Distribusi dilakukan secara proporsional. Variabel artifisial menunjukkan kekurangan di setiap lokasi.`;
  }

  return {
    allocations,
    totalAllocated,
    totalCost: isFeasible ? totalCost : totalCost + penaltyCost,
    isFeasible,
    artificialVariables,
    message,
  };
}

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

