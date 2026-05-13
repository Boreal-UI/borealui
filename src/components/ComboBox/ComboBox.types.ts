import { ReactNode } from "react";
import {
  LabelPositionType,
  RoundingType,
  ShadowType,
  StateType,
  ThemeType,
} from "@/types/types";

export interface ComboBoxOption {
  value: string;
  label: string;
  disabled?: boolean;
  description?: ReactNode;
}

export interface ComboBoxProps {
  options: ComboBoxOption[];
  value?: string;
  inputValue?: string;
  onChange?: (value: string, option: ComboBoxOption) => void;
  onInputChange?: (value: string) => void;
  label?: ReactNode;
  labelPosition?: LabelPositionType;
  placeholder?: string;
  emptyMessage?: ReactNode;
  loading?: boolean;
  loadingMessage?: ReactNode;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  theme?: ThemeType;
  state?: StateType;
  outline?: boolean;
  glass?: boolean;
  rounding?: RoundingType;
  shadow?: ShadowType;
  className?: string;
  layoutClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  listboxClassName?: string;
  optionClassName?: string;
  helperText?: ReactNode;
  error?: ReactNode;
  helperTextClassName?: string;
  errorClassName?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  testId?: string;
  "data-testid"?: string;
}

export interface ComboBoxBaseProps extends ComboBoxProps {
  classMap: Record<string, string>;
}
