// Simplex Method with Big M - Step by Step Solver

export interface SimplexTableau {
  iteration: number;
  tableau: number[][];
  basicVariables: string[];
  nonBasicVariables: string[];
  pivotRow?: number;
  pivotColumn?: number;
  pivotElement?: number;
  enteringVariable?: string;
  leavingVariable?: string;
  ratios?: (number | string)[];
  isOptimal: boolean;
  zValue: number;
  description: string;
}

export interface SimplexSolution {
  tableaus: SimplexTableau[];
  finalSolution: { [key: string]: number };
  optimalValue: number;
  isFeasible: boolean;
  message: string;
}

export interface LocationInput {
  id: string;
  name: string;
  minNeed: number;
  costPerPacket: number;
}

const BIG_M = 1000000;

export function solveSimplexBigM(locations: LocationInput[], totalStock: number): SimplexSolution {
  const n = locations.length;
  
  if (n === 0) {
    return {
      tableaus: [],
      finalSolution: {},
      optimalValue: 0,
      isFeasible: false,
      message: "Tidak ada lokasi yang dimasukkan"
    };
  }

  // Variables: x1, x2, ..., xn (decision), s1, s2, ..., sn (surplus), A1, A2, ..., An (artificial), s_stock (slack)
  // Constraints:
  // xi - si + Ai = minNeed_i (for each location) - minimum requirement
  // x1 + x2 + ... + xn + s_stock = totalStock (stock constraint)
  
  const tableaus: SimplexTableau[] = [];
  
  // Number of variables
  // Decision variables: n
  // Surplus variables for >= constraints: n
  // Artificial variables: n
  // Slack variable for stock constraint: 1
  
  const numDecision = n;
  const numSurplus = n;
  const numArtificial = n;
  const numSlack = 1;
  const totalVars = numDecision + numSurplus + numArtificial + numSlack;
  const numConstraints = n + 1; // n location constraints + 1 stock constraint
  
  // Variable names
  const varNames: string[] = [];
  for (let i = 0; i < n; i++) varNames.push(`x${i + 1}`);
  for (let i = 0; i < n; i++) varNames.push(`s${i + 1}`);
  for (let i = 0; i < n; i++) varNames.push(`A${i + 1}`);
  varNames.push('s_stok');
  
  // Initialize tableau
  // Rows: constraints + objective row
  // Columns: variables + RHS
  let tableau: number[][] = [];
  
  // Build constraint rows for location requirements (xi - si + Ai = minNeed_i)
  for (let i = 0; i < n; i++) {
    const row = new Array(totalVars + 1).fill(0);
    row[i] = 1; // xi coefficient
    row[numDecision + i] = -1; // -si (surplus)
    row[numDecision + numSurplus + i] = 1; // Ai (artificial)
    row[totalVars] = locations[i].minNeed; // RHS
    tableau.push(row);
  }
  
  // Stock constraint: x1 + x2 + ... + xn + s_stock = totalStock
  const stockRow = new Array(totalVars + 1).fill(0);
  for (let i = 0; i < n; i++) {
    stockRow[i] = 1; // xi coefficients
  }
  stockRow[totalVars - 1] = 1; // s_stock
  stockRow[totalVars] = totalStock; // RHS
  tableau.push(stockRow);
  
  // Objective row: Min Z = c1*x1 + c2*x2 + ... + M*A1 + M*A2 + ...
  // In standard form for maximization: Max -Z = -c1*x1 - c2*x2 - ... - M*A1 - M*A2 - ...
  // We'll work with minimization directly
  const objRow = new Array(totalVars + 1).fill(0);
  for (let i = 0; i < n; i++) {
    objRow[i] = locations[i].costPerPacket; // cost coefficients
  }
  for (let i = 0; i < n; i++) {
    objRow[numDecision + numSurplus + i] = BIG_M; // M penalty for artificial variables
  }
  tableau.push(objRow);
  
  // Basic variables initially are artificial variables and slack for stock
  let basicVars = [...Array(n).keys()].map(i => `A${i + 1}`);
  basicVars.push('s_stok');
  
  // Eliminate artificial variables from objective row (make their coefficients 0 in basic rows)
  // For each artificial variable in basis, subtract M * (that row) from objective row
  for (let i = 0; i < n; i++) {
    const artIdx = numDecision + numSurplus + i;
    for (let j = 0; j <= totalVars; j++) {
      tableau[numConstraints][j] -= BIG_M * tableau[i][j];
    }
  }
  
  // Record initial tableau
  tableaus.push(createTableauSnapshot(
    0, 
    tableau, 
    varNames, 
    basicVars, 
    "Tabel awal: Variabel artifisial (A₁, A₂, ...) ditambahkan dengan penalti M pada fungsi tujuan"
  ));
  
  // Simplex iterations
  let iteration = 0;
  const maxIterations = 50;
  
  while (iteration < maxIterations) {
    iteration++;
    
    // Find entering variable (most negative in objective row for minimization)
    // Actually for minimization in this setup, we look for most negative reduced cost
    const objRowIdx = numConstraints;
    let minVal = 0;
    let pivotCol = -1;
    
    for (let j = 0; j < totalVars; j++) {
      if (tableau[objRowIdx][j] < minVal) {
        minVal = tableau[objRowIdx][j];
        pivotCol = j;
      }
    }
    
    // If no negative value, optimal solution found
    if (pivotCol === -1) {
      const snapshot = createTableauSnapshot(
        iteration,
        tableau,
        varNames,
        basicVars,
        "Solusi optimal tercapai: Tidak ada koefisien negatif pada baris Z"
      );
      snapshot.isOptimal = true;
      tableaus.push(snapshot);
      break;
    }
    
    // Find leaving variable (minimum ratio test)
    let minRatio = Infinity;
    let pivotRow = -1;
    const ratios: (number | string)[] = [];
    
    for (let i = 0; i < numConstraints; i++) {
      if (tableau[i][pivotCol] > 0) {
        const ratio = tableau[i][totalVars] / tableau[i][pivotCol];
        ratios.push(Math.round(ratio * 100) / 100);
        if (ratio < minRatio && ratio >= 0) {
          minRatio = ratio;
          pivotRow = i;
        }
      } else {
        ratios.push('-');
      }
    }
    
    if (pivotRow === -1) {
      tableaus.push(createTableauSnapshot(
        iteration,
        tableau,
        varNames,
        basicVars,
        "Solusi tidak terbatas (unbounded)"
      ));
      break;
    }
    
    const enteringVar = varNames[pivotCol];
    const leavingVar = basicVars[pivotRow];
    const pivotElement = tableau[pivotRow][pivotCol];
    
    // Record before pivot
    const beforePivot = createTableauSnapshot(
      iteration,
      tableau,
      varNames,
      basicVars,
      `Iterasi ${iteration}: ${enteringVar} masuk basis, ${leavingVar} keluar basis. Elemen pivot = ${pivotElement.toFixed(2)}`
    );
    beforePivot.pivotRow = pivotRow;
    beforePivot.pivotColumn = pivotCol;
    beforePivot.pivotElement = pivotElement;
    beforePivot.enteringVariable = enteringVar;
    beforePivot.leavingVariable = leavingVar;
    beforePivot.ratios = ratios;
    tableaus.push(beforePivot);
    
    // Perform pivot operation
    // Normalize pivot row
    for (let j = 0; j <= totalVars; j++) {
      tableau[pivotRow][j] /= pivotElement;
    }
    
    // Eliminate pivot column from other rows
    for (let i = 0; i <= numConstraints; i++) {
      if (i !== pivotRow) {
        const factor = tableau[i][pivotCol];
        for (let j = 0; j <= totalVars; j++) {
          tableau[i][j] -= factor * tableau[pivotRow][j];
        }
      }
    }
    
    // Update basic variables
    basicVars[pivotRow] = enteringVar;
  }
  
  // Extract solution
  const solution: { [key: string]: number } = {};
  for (let i = 0; i < totalVars; i++) {
    solution[varNames[i]] = 0;
  }
  
  for (let i = 0; i < numConstraints; i++) {
    const varName = basicVars[i];
    solution[varName] = Math.max(0, tableau[i][totalVars]);
  }
  
  // Check feasibility (artificial variables should be 0)
  let isFeasible = true;
  for (let i = 0; i < n; i++) {
    if (solution[`A${i + 1}`] > 0.0001) {
      isFeasible = false;
      break;
    }
  }
  
  // Calculate optimal value
  let optimalValue = 0;
  for (let i = 0; i < n; i++) {
    optimalValue += (solution[`x${i + 1}`] || 0) * locations[i].costPerPacket;
  }
  
  const message = isFeasible
    ? `Solusi optimal feasible ditemukan dengan total biaya minimum Rp ${optimalValue.toLocaleString('id-ID')}`
    : `Solusi tidak feasible: Stok tidak mencukupi kebutuhan minimum. Variabel artifisial > 0.`;
  
  return {
    tableaus,
    finalSolution: solution,
    optimalValue,
    isFeasible,
    message
  };
}

function createTableauSnapshot(
  iteration: number,
  tableau: number[][],
  varNames: string[],
  basicVars: string[],
  description: string
): SimplexTableau {
  return {
    iteration,
    tableau: tableau.map(row => [...row]),
    basicVariables: [...basicVars],
    nonBasicVariables: varNames.filter(v => !basicVars.includes(v)),
    isOptimal: false,
    zValue: tableau[tableau.length - 1][tableau[0].length - 1],
    description
  };
}
