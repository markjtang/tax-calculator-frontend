import { calculateTax } from './calculateTax';
import type { TaxBracket } from './calculateTax';

describe('calculateTax', () => {
  const brackets: TaxBracket[] = [
    { min: 0, max: 50197, rate: 0.15 },
    { min: 50197, max: 100392, rate: 0.205 },
    { min: 100392, max: 155625, rate: 0.26 },
    { min: 155625, max: 221708, rate: 0.29 },
    { min: 221708, rate: 0.33 },
  ];

  it('returns zero tax for zero or negative salary', () => {
    let result = calculateTax(0, brackets);
    expect(result.total).toBe(0);
    expect(result.effectiveRate).toBe(0);
    expect(result.bands.length).toBe(0);

    result = calculateTax(-1000, brackets);
    expect(result.total).toBe(0);
    expect(result.effectiveRate).toBe(0);
    expect(result.bands.length).toBe(0);
  });

  it('should calculate tax for a salary strictly within the first band ($30,000)', () => {
    const salary = 30000;
    const expectedTotalTax = salary * 0.15;
    const result = calculateTax(salary, brackets);
    expect(result.total).toBeCloseTo(expectedTotalTax, 2);
    expect(result.effectiveRate).toBeCloseTo(0.15, 2);
    expect(result.bands.length).toBe(1);
    expect(result.bands[0]).toEqual({
      min: 0,
      max: 50197,
      rate: 0.15,
      taxable: salary,
      tax: expectedTotalTax,
    });
  });

  it('calculates tax for salary close to the first bracket boundary ($50,000)', () => {
    const salary = 50000;
    const expectedTotalTax = salary * 0.15;
    const result = calculateTax(salary, brackets);
    expect(result.total).toBeCloseTo(expectedTotalTax, 2);
    expect(result.effectiveRate).toBeCloseTo(0.15, 2);
    expect(result.bands.length).toBe(1);
    expect(result.bands[0]).toEqual({
      min: 0,
      max: 50197,
      rate: 0.15,
      taxable: salary,
      tax: expectedTotalTax,
    });
  });

  it('calculates tax for salary within the second band ($100,000)', () => {
    const salary = 100000;
    const taxFirstBand = 50197 * 0.15;
    const taxableSecondBand = salary - 50197;
    const taxSecondBand = taxableSecondBand * 0.205;
    const expectedTotalTax = taxFirstBand + taxSecondBand;
    const result = calculateTax(salary, brackets);
    expect(result.total).toBeCloseTo(expectedTotalTax, 2);
    expect(result.effectiveRate).toBeCloseTo(expectedTotalTax / salary, 3);
    expect(result.bands.length).toBe(2);
    expect(result.bands[0]).toEqual({
      min: 0,
      max: 50197,
      rate: 0.15,
      taxable: 50197,
      tax: taxFirstBand,
    });
    expect(result.bands[1]).toEqual({
      min: 50197,
      max: 100392,
      rate: 0.205,
      taxable: taxableSecondBand,
      tax: taxSecondBand,
    });
  });

  it('calculates tax for salary above the last band ($1,234,567)', () => {
    const salary = 1234567;
    const taxFirstBand = 50197 * 0.15;
    const taxSecondBand = (100392 - 50197) * 0.205;
    const taxThirdBand = (155625 - 100392) * 0.26;
    const taxFourthBand = (221708 - 155625) * 0.29;
    const taxableFifthBand = salary - 221708;
    const taxFifthBand = taxableFifthBand * 0.33;
    const expectedTotalTax = taxFirstBand + taxSecondBand + taxThirdBand + taxFourthBand + taxFifthBand;

    const result = calculateTax(salary, brackets);

    expect(result.total).toBeCloseTo(expectedTotalTax, 1);
    expect(result.effectiveRate).toBeCloseTo(expectedTotalTax / salary, 3);
    expect(result.bands.length).toBe(5);
    expect(result.bands[0]).toEqual({
      min: 0,
      max: 50197,
      rate: 0.15,
      taxable: 50197,
      tax: taxFirstBand,
    });
     expect(result.bands[1]).toEqual({
      min: 50197,
      max: 100392,
      rate: 0.205,
      taxable: 100392 - 50197,
      tax: taxSecondBand,
    });
     expect(result.bands[2]).toEqual({
      min: 100392,
      max: 155625,
      rate: 0.26,
      taxable: 155625 - 100392,
      tax: taxThirdBand,
    });
     expect(result.bands[3]).toEqual({
      min: 155625,
      max: 221708,
      rate: 0.29,
      taxable: 221708 - 155625,
      tax: taxFourthBand,
    });
     expect(result.bands[4]).toEqual({
      min: 221708,
      max: null,
      rate: 0.33,
      taxable: taxableFifthBand,
      tax: taxFifthBand,
    });
  });

  it('calculates tax for salary exactly at a bracket boundary ($50197)', () => {
    const salary = 50197;
    const expectedTotalTax = salary * 0.15;
    const result = calculateTax(salary, brackets);
    expect(result.total).toBeCloseTo(expectedTotalTax, 2);
    expect(result.effectiveRate).toBeCloseTo(0.15, 2);
    expect(result.bands.length).toBe(1);
     expect(result.bands[0]).toEqual({
      min: 0,
      max: 50197,
      rate: 0.15,
      taxable: salary,
      tax: expectedTotalTax,
    });
  });

  it('calculates tax for salary just above a bracket boundary ($50198)', () => {
    const salary = 50198;
    const taxFirstBand = 50197 * 0.15;
    const taxableSecondBand = salary - 50197;
    const taxSecondBand = taxableSecondBand * 0.205;
    const expectedTotalTax = taxFirstBand + taxSecondBand;

    const result = calculateTax(salary, brackets);

    expect(result.total).toBeCloseTo(expectedTotalTax, 2);
    expect(result.effectiveRate).toBeCloseTo(expectedTotalTax / salary, 3);
    expect(result.bands.length).toBe(2);
     expect(result.bands[0]).toEqual({
      min: 0,
      max: 50197,
      rate: 0.15,
      taxable: 50197,
      tax: taxFirstBand,
    });
     expect(result.bands[1]).toEqual({
      min: 50197,
      max: 100392,
      rate: 0.205,
      taxable: taxableSecondBand,
      tax: taxSecondBand,
    });
  });
});