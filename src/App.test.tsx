import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import App from './App';
import { useTaxCalculator } from './hooks/useTaxCalculator';
import type { TaxCalculationResult } from './utils/calculateTax';

jest.mock('./hooks/useTaxCalculator');
const mockedUseTaxCalculator = useTaxCalculator as jest.Mock;

describe('App Integration', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays error message on API failure', async () => {
    const errorMessage = 'Failed to fetch tax data';
    mockedUseTaxCalculator.mockImplementation(() => {
      const [loading, setLoading] = React.useState(false);
      const [error, setError] = React.useState<string | null>(null);
      const [result, setResult] = React.useState<TaxCalculationResult | null>(null);

      const fetchAndCalculate = jest.fn(async () => {
        setLoading(true);
        setError(null);
        setResult(null);
        await new Promise(resolve => setTimeout(resolve, 100));
        setError(errorMessage);
        setLoading(false);
      });

      return { loading, error, result, fetchAndCalculate };
    });

    render(<App />);

    expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText(/Annual Income/i), { target: { value: '60000' } });
      fireEvent.change(screen.getByLabelText(/Tax Year/i), { target: { value: '2022' } });
      fireEvent.click(screen.getByRole('button', { name: /Calculate/i }));
    });

    const errorElement = await screen.findByText(errorMessage, undefined, { timeout: 3000 });
    expect(errorElement).toBeInTheDocument();
    expect(screen.queryByRole('table', { name: /Tax Bands/i })).not.toBeInTheDocument();
  });

  it('successfully renders tax results on successful API call', async () => {
    const mockTaxData: TaxCalculationResult = {
      effectiveRate: 0.12,
      bands: [
        { rate: 0.1, taxable: 50000, tax: 5000, min: 0, max: 50000 },
        { rate: 0.2, taxable: 20000, tax: 4000, min: 50001, max: 100000 },
      ],
      total: 9000
    };

    mockedUseTaxCalculator.mockImplementation(() => {
      const [loading, setLoading] = React.useState(false);
      const [error, setError] = React.useState<string | null>(null);
      const [result, setResult] = React.useState<TaxCalculationResult | null>(null);

      const fetchAndCalculate = jest.fn(async () => {
        setLoading(true);
        setError(null);
        setResult(null);
        await new Promise(resolve => setTimeout(resolve, 100));
        setResult(mockTaxData);
        setLoading(false);
      });

      return { loading, error, result, fetchAndCalculate };
    });

    render(<App />);

    expect(screen.queryByText('Total Tax Owed:', { exact: false })).not.toBeInTheDocument();
    expect(screen.queryByText('Failed to fetch tax data')).not.toBeInTheDocument();

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText(/Annual Income/i), { target: { value: '70000' } });
      fireEvent.change(screen.getByLabelText(/Tax Year/i), { target: { value: '2022' } });
      fireEvent.click(screen.getByRole('button', { name: /Calculate/i }));
    });

    const totalTaxText = await screen.findByText(
      (content: string) => {
        if (content === null) return false;
        const normalizedContent = content.replace(/\s/g, '');
        return normalizedContent.includes('TotalTaxOwed:');
      },
      undefined,
      { timeout: 3000 }
    );
    expect(totalTaxText).toBeInTheDocument();

    const firstBandCell = await screen.findByRole('cell', {
      name: (content: string) => {
        if (content === null) return false;
        const normalizedContent = content.replace(/\s/g, '');
        return normalizedContent.includes('0-50,000');
      }
    }, { timeout: 3000 });
    expect(firstBandCell).toBeInTheDocument();

    const secondBandCell = await screen.findByRole('cell', {
      name: (content: string) => {
        if (content === null) return false;
        const normalizedContent = content.replace(/\s/g, '');
        return normalizedContent.includes('50,001-100,000');
      }
    }, { timeout: 3000 });
    expect(secondBandCell).toBeInTheDocument();

    expect(screen.queryByText('Failed to fetch tax data')).not.toBeInTheDocument();
  });
});