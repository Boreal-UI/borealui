import { ReactElement, ReactNode } from "react";
import { LabelPositionType, StateType } from "@/types/types";

export interface FormFieldProps {
  /**
   * Content rendered inside the component.
   */
  children: ReactElement<Record<string, unknown>>;
  /**
   * HTML id applied to the relevant element.
   */
  id?: string;
  /**
   * Visible label content for the component.
   */
  label?: ReactNode;
  /**
   * Helper text displayed with the field.
   */
  helperText?: ReactNode;
  /**
   * Error message or error state displayed with the component.
   */
  error?: ReactNode;
  /**
   * Required.
   * @default false
   */
  required?: boolean;
  /**
   * Optional Text.
   * @default "Optional"
   */
  optionalText?: ReactNode;
  /**
   * Label Position.
   * @default "top"
   */
  labelPosition?: LabelPositionType;
  /**
   * State.
   */
  state?: StateType;
  /**
   * Additional CSS class names for the component root.
   */
  className?: string;
  /**
   * Additional CSS class names for the label section.
   */
  labelClassName?: string;
  /**
   * Additional CSS class names for the control section.
   */
  controlClassName?: string;
  /**
   * Additional CSS class names for the helper text section.
   */
  helperTextClassName?: string;
  /**
   * Additional CSS class names for the error section.
   */
  errorClassName?: string;
  /**
   * Test id used to identify the component in tests.
   */
  testId?: string;
  /**
   * Test id used to identify the component in tests.
   */
  "data-testid"?: string;
}

export interface FormFieldBaseProps extends FormFieldProps {
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;
}
