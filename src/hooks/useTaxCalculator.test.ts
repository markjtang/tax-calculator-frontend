import { renderHook, act } from '@testing-library/react';
import { useTaxCalculator } from './useTaxCalculator';

global.fetch = jest.fn();

jest.mock('../utils/calculateTax', () => ({
  calculateTax: jest.fn(),
}));

jest.mock('../utils/validation', () => ({
  validateSalary: jest.fn(),
  validateYear: jest.fn(),
}));

import { calculateTax } from '../utils/calculateTax';
import { validateSalary, validateYear } from '../utils/validation';

describe('useTaxCalculator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (validateSalary as jest.Mock).mockReturnValue(null);
    (validateYear as jest.Mock).mockReturnValue(null);
  });

  it('should have initial state', () => {
    const { result } = renderHook(() => useTaxCalculator());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.result).toBe(null);
  });

  it('should set loading state correctly during fetch', async () => {
    jest.useFakeTimers();
    
    (global.fetch as jest.Mock).mockImplementation(() =>
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: async () => ({})
      }), 100))
    );

    const { result } = renderHook(() => useTaxCalculator());

    expect(result.current.loading).toBe(false);

    act(() => {
      result.current.fetchAndCalculate(50000, 2022);
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      jest.advanceTimersByTime(150);
    });

    expect(result.current.loading).toBe(false);
    
    jest.useRealTimers();
  });

  it('should handle successful fetch and calculate tax', async () => {
    const mockTaxData = { tax_brackets: [{ min: 0, rate: 0.1 }] };
    const mockCalculatedResult = { total: 1000, effectiveRate: 0.1, bands: [] };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockTaxData,
    } as Response);

    (calculateTax as jest.Mock).mockReturnValue(mockCalculatedResult);

    const { result } = renderHook(() => useTaxCalculator());

    await act(async () => {
      result.current.fetchAndCalculate(10000, 2022);
    });

    expect(global.fetch).toHaveBeenCalledWith('/tax-calculator/tax-year/2022');
    expect(calculateTax).toHaveBeenCalledWith(10000, mockTaxData.tax_brackets);
    expect(result.current.result).toEqual(mockCalculatedResult);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should handle unsupported year error without retrying', async () => {
    const errorMessage = 'Unsupported year: 2023';
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ errors: [{ message: errorMessage }] }),
    });

    const { result } = renderHook(() => useTaxCalculator());
    
    await act(async () => {
      result.current.fetchAndCalculate(10000, 2023);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.result).toBeNull();
  });

  it('should validate year before making API call', async () => {
    const unsupportedYear = 2025;
    const validationErrorMessage = 'Unsupported year: ' + unsupportedYear;

    (validateYear as jest.Mock).mockReturnValue(validationErrorMessage);

    const { result } = renderHook(() => useTaxCalculator());

    await act(async () => {
      result.current.fetchAndCalculate(10000, unsupportedYear);
    });

    expect(validateYear).toHaveBeenCalledWith(unsupportedYear);
    expect(global.fetch).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(validationErrorMessage);
    expect(result.current.result).toBeNull();
  });

  it('should validate salary before making API call', async () => {
    const invalidSalary = -100;
    const validationErrorMessage = 'Salary must be a positive number.';

    (validateSalary as jest.Mock).mockReturnValue(validationErrorMessage);

    const { result } = renderHook(() => useTaxCalculator());

    await act(async () => {
      result.current.fetchAndCalculate(invalidSalary, 2022);
    });

    expect(validateSalary).toHaveBeenCalledWith(invalidSalary);
    expect(global.fetch).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(validationErrorMessage);
    expect(result.current.result).toBeNull();
  });

  it('should handle network error', async () => {
    const errorMessage = 'Network error';
    (global.fetch as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useTaxCalculator());

    await act(async () => {
      result.current.fetchAndCalculate(10000, 2022);
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.loading).toBe(false);
    expect(result.current.result).toBeNull();
  });
});