import type { TaxCalculationResult } from '../utils/calculateTax';
import TaxBandsTable from './TaxBandsTable';

interface TaxResultProps {
  result: TaxCalculationResult | null;
}

const TaxResult = ({ result }: TaxResultProps) => {
  if (!result) return null;
  return (
    <div className="result">
      <h2>Results</h2>
      <p>
        <strong>Total Tax Owed:</strong> ${result.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
      <p>
        <strong>Effective Rate:</strong> {(result.effectiveRate * 100).toFixed(2)}%
      </p>
      <TaxBandsTable bands={result.bands} />
    </div>
  );
};

export default TaxResult; 