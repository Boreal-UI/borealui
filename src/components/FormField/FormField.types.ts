import { ReactElement, ReactNode } from "react";
import { LabelPositionType, StateType } from "@/types/types";

export interface FormFieldProps {
  children: ReactElement<Record<string, unknown>>;
  id?: string;
  label?: ReactNode;
  helperText?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  optionalText?: ReactNode;
  labelPosition?: LabelPositionType;
  state?: StateType;
  className?: string;
  labelClassName?: string;
  controlClassName?: string;
  helperTextClassName?: string;
  errorClassName?: string;
  testId?: string;
  "data-testid"?: string;
}

export interface FormFieldBaseProps extends FormFieldProps {
  classMap: Record<string, string>;
}
