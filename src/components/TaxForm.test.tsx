import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import TaxForm from './TaxForm';

describe('TaxForm', () => {
  it('renders form fields and button', () => {
    render(<TaxForm onSubmit={jest.fn()} loading={false} />);
    expect(screen.getByLabelText(/Annual Income/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Tax Year/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Calculate/i })).toBeInTheDocument();
  });

  it('calls onSubmit with valid input', () => {
    const onSubmit = jest.fn();
    render(<TaxForm onSubmit={onSubmit} loading={false} />);
    fireEvent.change(screen.getByLabelText(/Annual Income/i), { target: { value: '50000' } });
    fireEvent.change(screen.getByLabelText(/Tax Year/i), { target: { value: '2022' } });
    fireEvent.click(screen.getByRole('button'));
    expect(onSubmit).toHaveBeenCalledWith(50000, 2022);
  });
}); 