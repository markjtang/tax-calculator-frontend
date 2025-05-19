import TaxForm from './components/TaxForm';
import TaxResult from './components/TaxResult';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';
import { useTaxCalculator } from './hooks/useTaxCalculator';

function App() {
  const { loading, error, result, fetchAndCalculate } = useTaxCalculator();

  return (
    <main>
      <h1>Canada Tax Calculator</h1>
      <TaxForm onSubmit={fetchAndCalculate} loading={loading} />
      {loading && <Loader />}
      <ErrorMessage message={error ?? ''} />
      <TaxResult result={result} />
    </main>
  );
}

export default App; 