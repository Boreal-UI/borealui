import {
  LabelPositionType,
  ShadowType,
  StateType,
  ThemeType,
} from "@/types/types";
import {
  ForwardRefExoticComponent,
  HTMLAttributes,
  ReactNode,
  RefAttributes,
} from "react";

type NativeSegmentedControlProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "title"
>;

/**
 * A selectable option rendered inside SegmentedControl.
 */
export interface SegmentedControlOption {
  /**
   * Stable value emitted when the option is selected.
   */
  value: string;

  /**
   * Visible option label.
   */
  label: ReactNode;

  /**
   * Optional leading visual rendered before the option label.
   */
  icon?: ReactNode;

  /**
   * Whether this option is disabled.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Additional class name for this option.
   */
  className?: string;

  /**
   * Accessible label used when the visible label is not text.
   */
  "aria-label"?: string;
}

/**
 * Props for the SegmentedControl component.
 */
export interface SegmentedControlProps extends NativeSegmentedControlProps {
  /**
   * Main content rendered inside the component.
   */
  children?: ReactNode;

  /**
   * Options rendered as selectable segments.
   */
  options?: SegmentedControlOption[];

  /**
   * Controlled selected value.
   */
  value?: string;

  /**
   * Initial selected value for uncontrolled usage.
   */
  defaultValue?: string;

  /**
   * Callback fired when a segment is selected.
   */
  onValueChange?: (value: string, option: SegmentedControlOption) => void;

  /**
   * Name submitted by the hidden form input.
   */
  name?: string;

  /**
   * Whether the hidden form input should be required.
   *
   * @default false
   */
  required?: boolean;

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
   * Layout direction for the segment list.
   *
   * @default "horizontal"
   */
  orientation?: "horizontal" | "vertical";

  /**
   * Whether arrow-key navigation wraps from last to first option.
   *
   * @default true
   */
  loopNavigation?: boolean;

  /**
   * Whether the control should stretch to the full available width.
   *
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Whether options should share available width evenly.
   *
   * @default false
   */
  equalWidth?: boolean;

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
   * Additional class name for the content area.
   */
  contentClassName?: string;

  /**
   * Additional class name applied to every option.
   */
  optionClassName?: string;

  /**
   * Additional class name for selected options.
   */
  selectedOptionClassName?: string;

  /**
   * Additional class name for option icons.
   */
  optionIconClassName?: string;

  /**
   * Additional class name for option labels.
   */
  optionLabelClassName?: string;

  /**
   * Optional content rendered for assistive technologies only.
   */
  srOnlyText?: ReactNode;

  /**
   * Additional class name for screen-reader-only content.
   */
  srOnlyClassName?: string;

  /**
   * Optional test ID for testing frameworks.
   *
   * @default dataTestId ?? "segmented-control"
   */
  testId?: string;

  /**
   * Backward-compatible alias for test ID attributes.
   */
  "data-testid"?: string;
}

export interface SegmentedControlBaseProps extends SegmentedControlProps {
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;
}

export type SegmentedControlComponent = ForwardRefExoticComponent<
  SegmentedControlProps & RefAttributes<HTMLDivElement>
>;
