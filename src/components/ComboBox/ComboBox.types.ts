import { ReactNode } from "react";
import {
  LabelPositionType,
  RoundingType,
  ShadowType,
  StateType,
  ThemeType,
} from "@/types/types";

export interface ComboBoxOption {
  /**
   * Current value for the component.
   */
  value: string;
  /**
   * Visible label content for the component.
   */
  label: string;
  /**
   * Disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Descriptive content rendered by the component.
   */
  description?: ReactNode;
}

export interface ComboBoxProps {
  /**
   * Options available for selection.
   */
  options: ComboBoxOption[];
  /**
   * Current value for the component.
   */
  value?: string;
  /**
   * Current text input value.
   */
  inputValue?: string;
  /**
   * Callback fired when change occurs.
   */
  onChange?: (value: string, option: ComboBoxOption) => void;
  /**
   * Callback fired when input change occurs.
   */
  onInputChange?: (value: string) => void;
  /**
   * Visible label content for the component.
   */
  label?: ReactNode;
  /**
   * Label Position.
   * @default "top"
   */
  labelPosition?: LabelPositionType;
  /**
   * Placeholder.
   * @default "Search options"
   */
  placeholder?: string;
  /**
   * Empty Message.
   * @default "No options found"
   */
  emptyMessage?: ReactNode;
  /**
   * Loading.
   * @default false
   */
  loading?: boolean;
  /**
   * Loading Message.
   * @default "Loading options"
   */
  loadingMessage?: ReactNode;
  /**
   * Whether the component is disabled.
   */
  disabled?: boolean;
  /**
   * Required.
   * @default false
   */
  required?: boolean;
  /**
   * HTML name applied to the relevant form element.
   */
  name?: string;
  /**
   * HTML id applied to the relevant element.
   */
  id?: string;
  /**
   * Theme.
   * @default configured default theme (fallback: "primary")
   */
  theme?: ThemeType;
  /**
   * State.
   */
  state?: StateType;
  /**
   * Outline.
   * @default configured default outline setting (fallback: false)
   */
  outline?: boolean;
  /**
   * Glass.
   * @default configured default glass setting (fallback: false)
   */
  glass?: boolean;
  /**
   * Rounding.
   * @default configured default rounding (fallback: "medium")
   */
  rounding?: RoundingType;
  /**
   * Shadow.
   * @default configured default shadow (fallback: "light")
   */
  shadow?: ShadowType;
  /**
   * Additional CSS class names for the component root.
   */
  className?: string;
  /**
   * Additional CSS class names for the layout section.
   */
  layoutClassName?: string;
  /**
   * Additional CSS class names for the label section.
   */
  labelClassName?: string;
  /**
   * Additional CSS class names for the input section.
   */
  inputClassName?: string;
  /**
   * Additional CSS class names for the listbox section.
   */
  listboxClassName?: string;
  /**
   * Additional CSS class names for the option section.
   */
  optionClassName?: string;
  /**
   * Helper text displayed with the field.
   */
  helperText?: ReactNode;
  /**
   * Error message or error state displayed with the component.
   */
  error?: ReactNode;
  /**
   * Additional CSS class names for the helper text section.
   */
  helperTextClassName?: string;
  /**
   * Additional CSS class names for the error section.
   */
  errorClassName?: string;
  /**
   * ARIA Label attribute forwarded to the relevant accessible element.
   */
  "aria-label"?: string;
  /**
   * ARIA Labelledby attribute forwarded to the relevant accessible element.
   */
  "aria-labelledby"?: string;
  /**
   * ARIA Describedby attribute forwarded to the relevant accessible element.
   */
  "aria-describedby"?: string;
  /**
   * Test id used to identify the component in tests.
   */
  testId?: string;
  /**
   * Test id used to identify the component in tests.
   */
  "data-testid"?: string;
}

export interface ComboBoxBaseProps extends ComboBoxProps {
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;
}
