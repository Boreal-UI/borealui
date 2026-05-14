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
   *
   * @default "top"
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
   *
   * @default "Enter text"
   */
  placeholder?: string;

  /**
   * Additional custom CSS class name(s) to apply to the wrapper.
   *
   */
  className?: string;

  /** Additional class names for the outer layout container. */
  containerClassName?: string;

  /** Additional class names for the visible label. */
  labelClassName?: string;

  /** Additional class names for the icon wrapper. */
  iconClassName?: string;

  /** Additional class names for the textarea element. */
  inputClassName?: string;

  /** Additional class names for the resize handle. */
  resizeHandleClassName?: string;

  /** Additional class names for helper text. */
  helperTextClassName?: string;

  /** Additional class names for the error message. */
  errorMessageClassName?: string;

  /** Additional class names for screen-reader-only description text. */
  srOnlyClassName?: string;

  /**
   * If true, renders the textarea as read-only.
   *
   * @default false
   */
  readOnly?: boolean;

  /**
   * Enables or disables autocomplete.
   *
   * @default false
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
   *
   * @default configured default theme (fallback: "primary")
   */
  theme?: ThemeType;

  /**
   * Adds translucent glass styling to the textarea wrapper.
   *
   * @default configured default glass setting (fallback: false)
   */
  glass?: boolean;

  /**
   * State of the text area.
   *
   */
  state?: StateType;

  /**
   * Rounding of the component.
   *
   * @default configured default rounding (fallback: "medium")
   */
  rounding?: RoundingType;

  /**
   * Shadow of the component.
   *
   * @default configured default shadow (fallback: "light")
   */
  shadow?: ShadowType;

  /**
   * If true, the textarea is styled with an outline.
   *
   * @default configured default outline setting (fallback: false)
   */
  outline?: boolean;

  /**
   * If true, the textarea is disabled.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * If false, the textarea is not resizable.
   *
   * @default true
   */
  resizable?: boolean;

  /**
   * Optional height for the textarea.
   */
  height?: string | number;


  /**
   * Optional test ID for testing frameworks.
   *
   * @default dataTestId ?? "text-area"
   */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;
}
