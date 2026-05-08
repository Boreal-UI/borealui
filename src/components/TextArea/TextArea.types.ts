import {
  LabelPositionType,
  RoundingType,
  ShadowType,
  StateType,
  ThemeType,
} from "@/types/types";
import {
  TextareaHTMLAttributes,
  ComponentType,
  ReactNode,
  ChangeEvent,
} from "react";

/**
 * Props for the TextArea component.
 */
export interface TextAreaProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "onChange"
> {
  /**
   * Optional visible label for the textarea.
   */
  label?: string;

  /**
   * Position of the label relative to the textarea.
   */
  labelPosition?: LabelPositionType;

  /**
   * Called when the textarea value changes.
   * Receives the current string value and the original change event.
   */
  onChange?: (value: string, event: ChangeEvent<HTMLTextAreaElement>) => void;

  /**
   * Optional icon to display alongside the textarea.
   */
  icon?: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;

  /**
   * Placeholder text for the textarea.
   */
  placeholder?: string;

  /**
   * Additional custom CSS class name(s) to apply to the wrapper.
   */
  className?: string;

  /**
   * If true, renders the textarea as read-only.
   */
  readOnly?: boolean;

  /**
   * Enables or disables autocomplete.
   */
  autocomplete?: boolean;

  /**
   * Legacy accessible label prop.
   * Prefer using `aria-label`.
   */
  "aria-label"?: string;

  /**
   * Legacy accessible description text rendered internally as visually hidden content.
   * Prefer using `aria-describedby` when referencing external help text.
   */
  "aria-describedby"?: string;

  /**
   * Optional helper text shown below the textarea.
   */
  helperText?: ReactNode;

  /**
   * Optional error message shown below the textarea.
   */
  errorMessage?: ReactNode;

  /**
   * Optional id of external descriptive content.
   * This will be merged with internally generated description ids.
   */
  describedBy?: string;

  /**
   * Theme used for styling.
   */
  theme?: ThemeType;

  /**
   * Adds translucent glass styling to the textarea wrapper.
   */
  glass?: boolean;

  /**
   * State of the text area.
   */
  state?: StateType;

  /**
   * Rounding of the component.
   */
  rounding?: RoundingType;

  /**
   * Shadow of the component.
   */
  shadow?: ShadowType;

  /**
   * If true, the textarea is styled with an outline.
   */
  outline?: boolean;

  /**
   * If true, the textarea is disabled.
   */
  disabled?: boolean;

  /**
   * If false, the textarea is not resizable.
   */
  resizable?: boolean;

  /**
   * Optional height for the textarea.
   */
  height?: string | number;

  /**
   * Optional test ID for testing frameworks.
   */
  "data-testid"?: string;
}
