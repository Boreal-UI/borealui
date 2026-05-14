import {
  BorderType,
  RoundingType,
  ShadowType,
  SizeType,
  StateType,
  ThemeType,
} from "@/types";

export const themeOptions: ThemeType[] = [
  "primary",
  "secondary",
  "tertiary",
  "quaternary",
  "clear",
];

export const stateOptions: StateType[] = [
  "success",
  "error",
  "warning",
  "info",
];
export const sizeOptions: SizeType[] = ["xs", "small", "medium", "large", "xl"];
export const roundingOptions: RoundingType[] = [
  "none",
  "small",
  "medium",
  "large",
];
export const shadowOptions: ShadowType[] = [
  "none",
  "light",
  "medium",
  "strong",
  "intense",
];

export const borderOptions: BorderType[] = [
  "none",
  "xs",
  "small",
  "medium",
  "large",
  "xl",
] as const;
