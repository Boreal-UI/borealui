import {
  LabelPositionType,
  ShadowType,
  StateType,
  ThemeType,
} from "@/types/types";
import {
  ForwardRefExoticComponent,
  InputHTMLAttributes,
  ReactNode,
  RefAttributes,
} from "react";

/**
 * Represents a single option in the MultiSelect component.
 */
export interface MultiSelectOption {
  /**
   * The stable value submitted for the option.
   */
  value: string;

  /**
   * Visible option label.
   */
  label: ReactNode;

  /**
   * Plain text used for filtering and selected-value summaries.
   */
  searchText?: string;

  /**
   * Optional supporting description rendered under the option label.
   */
  description?: ReactNode;

  /**
   * Whether this option cannot be selected.
   *
   * @default false
   */
  disabled?: boolean;
}

type NativeMultiSelectProps = Omit<
  InputHTMLAttributes<HTMLDivElement>,
  "children" | "defaultValue" | "onChange" | "role" | "size" | "value"
>;

/**
 * Props for the MultiSelect component.
 */
export interface MultiSelectProps extends NativeMultiSelectProps {
  /**
   * Options available for selection.
   */
  options: MultiSelectOption[];

  /**
   * Currently selected option values for controlled usage.
   */
  value?: string[];

  /**
   * Initially selected option values for uncontrolled usage.
   */
  defaultValue?: string[];

  /**
   * Callback fired whenever selected values change.
   */
  onChange?: (values: string[], options: MultiSelectOption[]) => void;

  /**
   * Optional visible label for the component.
   */
  label?: ReactNode;

  /**
   * Position of the label relative to the component.
   *
   * @default "top"
   */
  labelPosition?: LabelPositionType;

  /**
   * Placeholder displayed when no options are selected.
   *
   * @default "Select options"
   */
  placeholder?: string;

  /**
   * Message shown when filtering leaves no visible options.
   *
   * @default "No options found"
   */
  emptyMessage?: ReactNode;

  /**
   * Message announced while the component is loading.
   *
   * @default "Loading options"
   */
  loadingMessage?: ReactNode;

  /**
   * Whether users can filter options by typing.
   *
   * @default true
   */
  searchable?: boolean;

  /**
   * Text shown in the filter input.
   *
   * @default "Filter options"
   */
  searchPlaceholder?: string;

  /**
   * Whether to show a clear-all button when values are selected.
   *
   * @default true
   */
  clearable?: boolean;

  /**
   * Accessible label for the clear-all button.
   *
   * @default "Clear selected options"
   */
  clearAriaLabel?: string;

  /**
   * Accessible label for the popup toggle.
   */
  toggleAriaLabel?: string;

  /**
   * Maximum number of selected options allowed.
   */
  maxSelected?: number;

  /**
   * HTML name used for hidden inputs when participating in form submission.
   */
  name?: string;

  /**
   * Whether the field is required.
   *
   * @default false
   */
  required?: boolean;

  /**
   * Theme used for styling.
   *
   * @default configured default theme (fallback: "primary")
   */
  theme?: ThemeType;

  /**
   * Visual state for styling.
   */
  state?: StateType;
  /**
   * Surface treatment; glassOutline combines glass and outline.
   *
   * @default configured default variant (fallback: "solid")
   */
  variant?: import("@/types/types").VariantType;
  /**
   * Rounding style for the component.
   *
   * @default configured default rounding (fallback: "medium")
   */
  rounding?: import("@/types/types").RoundableRoundingType;

  /**
   * Shadow style for the component.
   *
   * @default configured default shadow (fallback: "light")
   */
  shadow?: ShadowType;

  /**
   * Whether the component is disabled.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the component should display a loading state.
   *
   * @default false
   */
  loading?: boolean;

  /**
   * Additional class name for the component root.
   */
  className?: string;

  /**
   * Additional class name for the outer label/component container.
   */
  containerClassName?: string;

  /**
   * Additional class name for the visible label.
   */
  labelClassName?: string;

  /**
   * Additional class name for the trigger button.
   */
  triggerClassName?: string;

  /**
   * Additional class name for the selected-value chip row.
   */
  valueListClassName?: string;

  /**
   * Additional class name for each selected-value chip.
   */
  chipClassName?: string;

  /**
   * Additional class name for the popup panel.
   */
  popoverClassName?: string;

  /**
   * Additional class name for the filter input.
   */
  searchInputClassName?: string;

  /**
   * Additional class name for the option listbox.
   */
  listboxClassName?: string;

  /**
   * Additional class name for each option row.
   */
  optionClassName?: string;

  /**
   * Optional content rendered for assistive technologies only.
   */
  srOnlyText?: ReactNode;

  /**
   * Additional class name for screen-reader-only content.
   */
  srOnlyClassName?: string;

  /**
   * Explicit accessible label for the trigger when no visible label is provided.
   */
  "aria-label"?: string;

  /**
   * References one or more elements that label the trigger.
   */
  "aria-labelledby"?: string;

  /**
   * References one or more elements that describe the trigger.
   */
  "aria-describedby"?: string;

  /**
   * Marks the field as invalid for assistive technology.
   */
  "aria-invalid"?: boolean;

  /**
   * Indicates the field is required to assistive technology.
   */
  "aria-required"?: boolean;

  /**
   * Optional test ID for testing frameworks.
   *
   * @default dataTestId ?? "multi-select"
   */
  testId?: string;

  /**
   * Backward-compatible alias for test ID attributes.
   */
  "data-testid"?: string;
  invalid?: boolean;
  helperText?: import("react").ReactNode;
  errorMessage?: import("react").ReactNode;
  size?: import("@/types/types").SizeType;
}

export interface MultiSelectBaseProps extends MultiSelectProps {
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;
}

export type MultiSelectComponent = ForwardRefExoticComponent<
  MultiSelectProps & RefAttributes<HTMLDivElement>
>;
