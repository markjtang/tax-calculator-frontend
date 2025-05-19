export function validateSalary(salary: unknown): string | null {
  if (typeof salary !== 'number' || isNaN(salary)) {
    return 'Salary must be a number.';
  }
  if (salary < 0) {
    return 'Salary must be zero or greater.';
  }
  return null;
}

export function validateYear(year: unknown): string | null {
  const validYears = [2019, 2020, 2021, 2022];
  if (typeof year !== 'number' && typeof year !== 'string') {
    return 'Year must be a number or string.';
  }
  const yearNum = Number(year);
  if (!validYears.includes(yearNum)) {
    return 'Year must be 2019, 2020, 2021, or 2022.';
  }
  return null;
} 