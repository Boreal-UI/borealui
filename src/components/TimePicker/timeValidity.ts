// HTML time values are a periodic domain, in milliseconds since midnight.
export function parseTime(value: string | undefined): number | undefined {
  const match = /^(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?$/.exec(value ?? "");
  if (!match) return undefined;
  const [, hours, minutes, seconds = "0", fraction = ""] = match;
  if (+hours > 23 || +minutes > 59 || +seconds > 59) return undefined;
  return ((+hours * 60 + +minutes) * 60 + +seconds) * 1000 + +fraction.padEnd(3, "0");
}

export function isInvalidTime(
  value: string,
  min: string | undefined,
  max: string | undefined,
  step: number | string | undefined,
  defaultValue: string | undefined,
  required: boolean,
): boolean {
  const time = parseTime(value);
  // Malformed time values are sanitized to empty by native inputs.
  if (time === undefined) return required;
  const lower = parseTime(min);
  const upper = parseTime(max);
  const outside = lower !== undefined && upper !== undefined && lower > upper
    ? time < lower && time > upper
    : (lower !== undefined && time < lower) || (upper !== undefined && time > upper);
  const numericStep = Number(step);
  const interval = (Number.isFinite(numericStep) && numericStep > 0 ? numericStep : 60) * 1000;
  const base = lower ?? parseTime(defaultValue) ?? 0;
  const remainder = Math.abs((time - base) % interval);
  const mismatch = step !== "any" && Math.min(remainder, interval - remainder) > 0.000001;
  return outside || mismatch;
}
