import { calculateFine } from './fine-calculator';

describe('calculateFine', () => {
  const dueDate = new Date('2026-01-10T00:00:00.000Z');

  it('returns zero for an on-time return', () => {
    expect(calculateFine(dueDate, new Date('2026-01-10T23:59:00.000Z'), 5)).toBe(0);
  });

  it('calculates a fine for a late return', () => {
    expect(calculateFine(dueDate, new Date('2026-01-12T00:00:00.000Z'), 5)).toBe(10);
  });
});
