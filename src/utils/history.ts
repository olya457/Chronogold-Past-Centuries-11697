export function yearLabel(year: number) {
  return `${Math.abs(year)} ${year < 0 ? 'BCE' : 'CE'}`;
}
export function yearDistance(a: number, b: number) {
  return Math.abs(a - b) - (a * b < 0 ? 1 : 0);
}
export function validYear(value: string) {
  return (
    /^-?\d+$/.test(value) &&
    Number(value) !== 0 &&
    Math.abs(Number(value)) <= 100000
  );
}
export function overall(scores?: number[]) {
  return scores?.length === 9
    ? Math.round(scores.reduce((a, b) => a + b, 0) / 9)
    : null;
}
export const uid = () =>
  `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export function centuriesCovered(start: number, end: number) {
  const century = (year: number) =>
    Math.ceil(Math.abs(year) / 100) * Math.sign(year);
  return Math.abs(century(end) - century(start)) + (start * end < 0 ? 0 : 1);
}
