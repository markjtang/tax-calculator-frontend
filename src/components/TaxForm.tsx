import { useState } from 'react';
import ErrorMessage from './ErrorMessage';
import { validateSalary, validateYear } from '../utils/validation';

interface TaxFormProps {
  onSubmit: (salary: number, year: number) => void;
  loading: boolean;
}

const years = [2019, 2020, 2021, 2022];

const TaxForm = ({ onSubmit, loading }: TaxFormProps) => {
  const [salary, setSalary] = useState('');
  const [year, setYear] = useState('2022');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const salaryNum = Number(salary);
    const yearNum = Number(year);
    const salaryError = validateSalary(salaryNum);
    const yearError = validateYear(yearNum);
    if (salaryError) {
      setError(salaryError);
      return;
    }
    if (yearError) {
      setError(yearError);
      return;
    }
    setError(null);
    onSubmit(salaryNum, yearNum);
  };

  return (
    <form className="tax-form" onSubmit={handleSubmit} aria-label="Tax Calculator Form">
      <label htmlFor="salary">Annual Income</label>
      <input
        id="salary"
        type="number"
        min="0"
        value={salary}
        onChange={e => setSalary(e.target.value)}
        disabled={loading}
        required
        autoFocus
      />
      <label htmlFor="year">Tax Year</label>
      <select
        id="year"
        value={year}
        onChange={e => setYear(e.target.value)}
        disabled={loading}
      >
        {years.map(y => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
      <button type="submit" disabled={loading}>
        {loading ? 'Calculating...' : 'Calculate'}
      </button>
      <ErrorMessage message={error ?? ''} />
    </form>
  );
};

export default TaxForm; 