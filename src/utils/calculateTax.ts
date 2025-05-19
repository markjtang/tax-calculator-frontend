export interface TaxBracket {
  min: number;
  max?: number;
  rate: number;
}

export interface TaxBandResult {
  min: number;
  max: number | null;
  rate: number;
  taxable: number;
  tax: number;
}

export interface TaxCalculationResult {
  total: number;
  bands: TaxBandResult[];
  effectiveRate: number;
}


export function calculateTax(salary: number, brackets: TaxBracket[]): TaxCalculationResult {
  let total = 0;
  const bands: TaxBandResult[] = [];
  let remaining = salary;

  for (const bracket of brackets) {
    const min = bracket.min;
    const max = bracket.max ?? Infinity;
    const rate = bracket.rate;

    if (salary > min) {
      const taxable = Math.min(remaining, max - min);
      const tax = taxable * rate;
      bands.push({ min, max: isFinite(max) ? max : null, rate, taxable, tax });
      total += tax;
      remaining -= taxable;
      if (remaining <= 0) break;
    }
  }

  const effectiveRate = salary > 0 ? total / salary : 0;
  return { total, bands, effectiveRate };
} 