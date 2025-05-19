import { useState } from 'react';
import type { TaxBracket, TaxCalculationResult } from '../utils/calculateTax';
import { calculateTax } from '../utils/calculateTax';
import { validateSalary, validateYear } from '../utils/validation';

interface UseTaxCalculatorResult {
  loading: boolean;
  error: string | null;
  result: TaxCalculationResult | null;
  fetchAndCalculate: (salary: number, year: number) => void;
}

export function useTaxCalculator(): UseTaxCalculatorResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TaxCalculationResult | null>(null);

  const fetchAndCalculate = async (salary: number, year: number) => {
    setLoading(true);
    setError(null);
    setResult(null);

    const salaryError = validateSalary(salary);
    const yearError = validateYear(year);

    if (salaryError || yearError) {
      setError(salaryError || yearError);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/tax-calculator/tax-year/${year}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.errors?.[0]?.message || 'Failed to fetch tax brackets.');
      }
      const data = await res.json();
      const brackets: TaxBracket[] = data.tax_brackets;
      const calc = calculateTax(salary, brackets);
      setResult(calc);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, result, fetchAndCalculate };
} 