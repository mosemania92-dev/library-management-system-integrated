export function calculateFine(
  dueDate: Date,
  returnDate: Date,
  ratePerDay: number,
): number {
  if (!(dueDate instanceof Date) || Number.isNaN(dueDate.getTime())) {
    throw new TypeError('dueDate must be a valid Date');
  }
  if (!(returnDate instanceof Date) || Number.isNaN(returnDate.getTime())) {
    throw new TypeError('returnDate must be a valid Date');
  }
  if (!Number.isFinite(ratePerDay) || ratePerDay < 0) {
    throw new RangeError('ratePerDay must be a non-negative finite number');
  }

  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const startOfUtcDay = (date: Date): number =>
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());

  const lateDays = Math.round(
    (startOfUtcDay(returnDate) - startOfUtcDay(dueDate)) / millisecondsPerDay,
  );
  return Math.max(0, lateDays) * ratePerDay;
}
