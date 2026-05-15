import { ReactNode } from "react";

export type ChartValueFormatter = (value: number) => ReactNode;

export type ChartDatum = {
  label: string;
  value: number;
  color?: string;
};

export type Point = {
  x: number;
  y: number;
};

export const defaultChartColors = [
  "var(--primary-color)",
  "var(--secondary-color)",
  "var(--tertiary-color)",
  "var(--quaternary-color)",
  "var(--success-color)",
  "var(--warning-color)",
  "var(--error-color)",
];

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const getFiniteValue = (value: number) =>
  Number.isFinite(value) ? value : 0;

export const normalizeData = (data: ChartDatum[] | number[] = []) =>
  data.map((item, index): ChartDatum => {
    if (typeof item === "number") {
      return {
        label: `Value ${index + 1}`,
        value: getFiniteValue(item),
      };
    }

    return {
      ...item,
      value: getFiniteValue(item.value),
    };
  });

export const getValueRange = (values: number[], includeZero = true) => {
  const finiteValues = values.map(getFiniteValue);
  const rawMin = Math.min(
    ...finiteValues,
    includeZero ? 0 : (finiteValues[0] ?? 0),
  );
  const rawMax = Math.max(
    ...finiteValues,
    includeZero ? 0 : (finiteValues[0] ?? 0),
  );

  if (rawMin === rawMax) {
    return {
      min: rawMin - 1,
      max: rawMax + 1,
    };
  }

  return {
    min: rawMin,
    max: rawMax,
  };
};

export const buildPoints = (
  data: ChartDatum[],
  width: number,
  height: number,
  padding: number,
  includeZero = false,
) => {
  const values = data.map((datum) => datum.value);
  const { min, max } = getValueRange(values, includeZero);
  const usableWidth = Math.max(width - padding * 2, 1);
  const usableHeight = Math.max(height - padding * 2, 1);
  const divisor = Math.max(data.length - 1, 1);

  return data.map((datum, index) => {
    const x = padding + (index / divisor) * usableWidth;
    const y = padding + ((max - datum.value) / (max - min)) * usableHeight;

    return { x, y };
  });
};

export const pointsToPath = (points: Point[]) =>
  points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

export const formatDefaultValue = (value: number) =>
  new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(value);

export const formatValueText = (
  value: number,
  valueFormatter: ChartValueFormatter = formatDefaultValue,
) => {
  const formatted = valueFormatter(value);

  return typeof formatted === "string" || typeof formatted === "number"
    ? String(formatted)
    : formatDefaultValue(value);
};

export const describeData = (
  data: ChartDatum[],
  valueFormatter: ChartValueFormatter = formatDefaultValue,
) =>
  data
    .map(
      (datum) =>
        `${datum.label}: ${formatValueText(datum.value, valueFormatter)}`,
    )
    .join(", ");
