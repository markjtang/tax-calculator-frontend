import { validateSalary, validateYear } from './validation';

describe('validateSalary', () => {
  it('rejects non-numbers', () => {
    expect(validateSalary('abc')).toBe('Salary must be a number.');
  });
  it('rejects negative numbers', () => {
    expect(validateSalary(-1)).toBe('Salary must be zero or greater.');
  });
  it('accepts valid salary', () => {
    expect(validateSalary(1000)).toBeNull();
  });
});

describe('validateYear', () => {
  it('rejects invalid years', () => {
    expect(validateYear(2018)).toBe('Year must be 2019, 2020, 2021, or 2022.');
  });
  it('accepts valid year', () => {
    expect(validateYear(2022)).toBeNull();
  });
}); 