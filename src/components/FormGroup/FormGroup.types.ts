import type {
  AriaRole,
  HTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactElement,
  ReactNode,
} from "react";
import { SizeType } from "@/types/types";

/**
 * Props that will be merged into the rendered form control child.
 * Useful for accessibility overrides and extra control metadata.
 */
export interface FormGroupControlProps extends Omit<
  InputHTMLAttributes<HTMLElement>,
  "size" | "children" | "id" | "required"
> {
  /** Optional explicit id override for the child control. */
  id?: string;

  /** Accessible label override for the child control. */
  "aria-label"?: string;

  /** Accessible labelledby override for the child control. */
  "aria-labelledby"?: string;

  /** Accessible describedby override for the child control. */
  "aria-describedby"?: string;

  /** Accessible errormessage id override for the child control. */
  "aria-errormessage"?: string;

  /** Marks the child control as invalid. */
  "aria-invalid"?: boolean;

  /** Marks the child control as required. */
  "aria-required"?: boolean;

  /** Whether the child control should receive required. */
  required?: boolean;
}

/**
 * Props for the FormGroup component.
 */
export interface FormGroupProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  /** Label for the input field. */
  label?: string;

  /** Optional helper text displayed below the input. */
  description?: string;

  /** Optional error message shown below the input. */
  error?: string;

  /** The form element or component (input, textarea, etc.). */
  children: ReactElement | ReactElement[];

  /** Unique ID for the input and label association. */
  id?: string;

  /**
   * Whether the field is required (adds asterisk).
   *
   * @default false
   */
  required?: boolean;

  /**
   * Additional class names for styling.
   *
   * @default ""
   */
  className?: string;

  /** Additional class names for the label element. */
  labelClassName?: string;

  /** Additional class names for the required marker. */
  requiredClassName?: string;

  /** Additional class names for each input wrapper. */
  inputWrapperClassName?: string;

  /** Additional class names for each input field wrapper. */
  inputFieldClassName?: string;

  /** Additional class names for the optional controller wrapper. */
  controllerClassName?: string;

  /** Additional class names for the helper description. */
  descriptionClassName?: string;

  /** Additional class names for the error message. */
  errorMessageClassName?: string;

  /**
   * Layout style for label and input.
   * "vertical" (default) or "horizontal"
   *
   * @default "vertical"
   */
  layout?: "vertical" | "horizontal";

  /**
   * If true, visually hides the label but keeps it accessible.
   *
   * @default false
   */
  hideLabel?: boolean;

  /**
   * Spacing size between each input in the form group.
   * ('xs' | 'small' | 'medium' | 'large' | 'xl')
   *
   * @default "xs"
   */
  spacing?: SizeType;

  /** Optional controller element (e.g., button, icon) beside input. */
  controller?: ReactNode;


  /**
   * Optional test ID for testing frameworks.
   *
   * @default dataTestId ?? "form-group"
   */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;

  /**
   * Optional role for the wrapper. Defaults to "group".
   *
   * @default "group"
   */
  role?: AriaRole;

  /** Optional aria-label for the wrapper group. */
  "aria-label"?: string;

  /** Optional override for the wrapper aria-labelledby. */
  "aria-labelledby"?: string;

  /** Optional override for the wrapper aria-describedby. */
  "aria-describedby"?: string;

  /** Optional props applied to the rendered label element. */
  labelProps?: Omit<LabelHTMLAttributes<HTMLLabelElement>, "htmlFor" | "id">;

  /** Optional props applied to the description element. */
  descriptionProps?: HTMLAttributes<HTMLParagraphElement>;

  /** Optional props applied to the error element. */
  errorProps?: HTMLAttributes<HTMLParagraphElement>;

  /** Optional props merged into each child control. */
  controlProps?: FormGroupControlProps;
}

export interface BaseFormGroupProps extends FormGroupProps {
  classMap: Record<string, string>;
}
