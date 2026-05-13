import type { AriaRole, ReactNode } from "react";
import {
  LabelPositionType,
  RoundingType,
  ShadowType,
  StateType,
  ThemeType,
} from "@/types/types";

/**
 * Represents a single option in the Select component.
   * @default false
   */
export interface Option {
  /** The value to be used for the option. */
  value: string;

  /** The display label for the option. */
  label: string;

  /** Whether this specific option is disabled. */
  disabled?: boolean;
}

/**
 * Props for the Select component.
 */
export interface SelectProps {
  /**
   * Theme for styling.
   * "primary" | "secondary" | "tertiary" | "quaternary" | "clear"
   *
   * @default configured default theme (fallback: "primary")
   */
  theme?: ThemeType;

  /**
   * Adds translucent glass styling to the select wrapper.
   *
   * @default configured default glass setting (fallback: false)
   */
  glass?: boolean;

  /**
   * State variant for styling.
   * "success" | "error" | "warning" | "disabled" | ""
   *
   * @default ""
   */
  state?: StateType;

  /**
   * If true, the select element is styled as outlined.
   *
   * @default configured default outline setting (fallback: false)
   */
  outline?: boolean;

  /**
   * An array of options that will be rendered as dropdown choices.
   */
  options: Option[];

  /**
   * The current selected value.
   */
  value: string;

  /**
   * Callback fired when the selected option changes.
   * Receives the new value as an argument.
   */
  onChange: (value: string) => void;

  /**
   * If provided, the select element will render options asynchronously.
   * Should return a Promise resolving to Option[] based on search query.
   */
  asyncOptions?: (query: string) => Promise<Option[]>;

  /**
   * Optional polling interval for updating options in milliseconds.
   *
   * @default 0
   */
  pollInterval?: number;

  /**
   * Placeholder text to display when no option is selected.
   *
   * @default "Select an option"
   */
  placeholder?: string;

  /**
   * Rounding style of the select element.
   * "none" | "small" | "medium" | "large" | "full"
   *
   * @default configured default rounding (fallback: "medium")
   */
  rounding?: RoundingType;

  /**
   * Shadow style of the select element.
   * "none" | "light" | "medium" | "strong" | "intense"
   *
   * @default configured default shadow (fallback: "light")
   */
  shadow?: ShadowType;

  /** Whether the select element is required. */
  required?: boolean;

  /**
   * Whether the select element is disabled.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Name for the select element.
   */
  name?: string;

  /**
   * Optional visible label describing what the select is for.
   */
  label?: ReactNode;

  /**
   * Position of the label relative to the select.
   *
   * @default "top"
   */
  labelPosition?: LabelPositionType;

  /**
   * Optional id for the underlying select element.
   */
  id?: string;

  /**
   * Optional form association.
   */
  form?: string;

  /**
   * Optional autocomplete behavior for compatible use cases.
   */
  autoComplete?: string;

  /**
   * Optional aria-label for screen readers.
   * Useful when no visible label is provided.
   */
  "aria-label"?: string;

  /**
   * Optional aria-labelledby id reference.
   * Prefer this when an external label element exists.
   */
  "aria-labelledby"?: string;

  /**
   * Optional description text for the select element.
   */
  "aria-description"?: string;

  /**
   * Optional aria-describedby id reference for helper/error text.
   */
  "aria-describedby"?: string;

  /**
   * Marks the field as invalid for assistive technology.
   * If omitted, component logic may still infer invalid from state === "error".
   */
  "aria-invalid"?: boolean;

  /**
   * Indicates the field is required to assistive technology.
   */
  "aria-required"?: boolean;

  /**
   * Indicates the select is busy, useful while async options are loading.
   */
  "aria-busy"?: boolean;

  /**
   * Optional aria-live setting for async status messaging.
   *
   * @default "polite"
   */
  "aria-live"?: "off" | "polite" | "assertive";

  /**
   * Optional role override.
   * Usually not needed for a native select, but included for flexibility.
   */
  role?: AriaRole;

  /**
   * Optional tab index for keyboard navigation control.
   */
  tabIndex?: number;

  /**
   * Additional class name(s) for custom styling.
   *
   * @default ""
   */
  className?: string;

  /** Additional class names for the outer layout container. */
  layoutClassName?: string;

  /** Additional class names for the visible label. */
  labelClassName?: string;

  /** Additional class names for the native select element. */
  selectClassName?: string;

  /** Additional class names for the dropdown icon wrapper. */
  iconClassName?: string;

  /** Additional class names for async loading text. */
  loadingClassName?: string;

  /** Additional class names for screen-reader-only description text. */
  srOnlyClassName?: string;

  /**
   * Optional test ID for testing frameworks.
   *
   * @default dataTestId ?? "select"
   */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;
}

export interface BaseSelectProps extends SelectProps {
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;
}

export interface ThemeSelectProps {
  /**
   * Theme variant applied to the component.
   */
  theme?: ThemeType;
  /**
   * Whether to apply the glass visual treatment.
   */
  glass?: boolean;
  /**
   * Shadow style applied to the component.
   */
  shadow?: ShadowType;
  /**
   * Corner rounding applied to the component.
   */
  rounding?: RoundingType;
  /**
   * Visual state applied to the component.
   */
  state?: StateType;
  /** Optional test ID for testing frameworks. */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;

  /**
   * Optional accessible label for the theme select trigger/input.
   */
  "aria-label"?: string;

  /**
   * Optional description for screen readers.
   */
  "aria-description"?: string;

  /**
   * Optional labelled-by reference.
   */
  "aria-labelledby"?: string;

  /**
   * Optional described-by reference.
   */
  "aria-describedby"?: string;

  /**
   * Marks the control invalid for assistive technology.
   */
  "aria-invalid"?: boolean;

  /**
   * Marks the control required for assistive technology.
   */
  "aria-required"?: boolean;

  /**
   * Whether the component is disabled.
   */
  disabled?: boolean;
  /**
   * Visible label content for the component.
   */
  label?: ReactNode;
  /**
   * Label Position prop for ThemeSelect.
   */
  labelPosition?: LabelPositionType;
  /**
   * HTML name applied to the relevant form element.
   */
  name?: string;
  /**
   * HTML id applied to the relevant element.
   */
  id?: string;
}
