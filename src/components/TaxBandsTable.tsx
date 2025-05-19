import type { TaxBandResult } from '../utils/calculateTax';

interface TaxBandsTableProps {
  bands: TaxBandResult[];
}

const TaxBandsTable = ({ bands }: TaxBandsTableProps) => {
  if (!bands.length) return null;
  return (
    <table className="tax-band-table" aria-label="Tax Bands">
      <thead>
        <tr>
          <th>Band</th>
          <th>Rate</th>
          <th>Taxable Amount</th>
          <th>Tax</th>
        </tr>
      </thead>
      <tbody>
        {bands.map((band, idx) => (
          <tr key={idx}>
            <td>
              {band.min.toLocaleString()} - {band.max ? band.max.toLocaleString() : '∞'}
            </td>
            <td>{(band.rate * 100).toFixed(2)}%</td>
            <td>${band.taxable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            <td>${band.tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TaxBandsTable; 