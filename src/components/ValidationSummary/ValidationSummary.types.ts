import {
  ForwardRefExoticComponent,
  HTMLAttributes,
  ReactNode,
  RefAttributes,
} from "react";
import {
  LabelPositionType,
  RoundingType,
  ShadowType,
  StateType,
  ThemeType,
} from "@/types/types";

type NativeValidationSummaryProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "title"
>;

/**
 * Single validation issue rendered by the ValidationSummary component.
 */
export interface ValidationSummaryItem {
  /**
   * Stable item identifier used for React keys and test IDs.
   */
  id?: string;

  /**
   * Human-readable validation message.
   */
  message: ReactNode;

  /**
   * Optional form field id this issue points to.
   */
  fieldId?: string;

  /**
   * Optional href used when the issue should link to a field or route.
   */
  href?: string;
}

/**
 * Props for the ValidationSummary component.
 */
export interface ValidationSummaryProps extends NativeValidationSummaryProps {
  /**
   * Main content rendered inside the component after the generated validation list.
   */
  children?: ReactNode;

  /**
   * Validation items rendered in the summary list.
   */
  items?: Array<ValidationSummaryItem | string>;

  /**
   * Optional visible label for the component.
   */
  label?: ReactNode;

  /**
   * Summary heading rendered inside the alert.
   *
   * @default label ?? "There is a problem"
   */
  title?: ReactNode;

  /**
   * Supporting text rendered beneath the title.
   */
  description?: ReactNode;

  /**
   * Position of the label relative to the component.
   *
   * @default "top"
   */
  labelPosition?: LabelPositionType;

  /**
   * Heading element used for the summary title.
   *
   * @default "h2"
   */
  titleAs?: "h2" | "h3" | "h4" | "h5" | "h6";

  /**
   * Role applied to the validation summary root.
   *
   * @default "alert"
   */
  role?: "alert" | "status" | "region";

  /**
   * Whether the summary should be focusable for programmatic focus.
   *
   * @default true
   */
  focusable?: boolean;

  /**
   * Whether the summary should focus itself when validation items are present.
   *
   * @default false
   */
  focusOnMount?: boolean;

  /**
   * Whether nothing should render when there are no items and no children.
   *
   * @default true
   */
  hideWhenEmpty?: boolean;

  /**
   * Message rendered when there are no validation items and hideWhenEmpty is false.
   */
  emptyMessage?: ReactNode;

  /**
   * Accessible label for the validation issue list.
   *
   * @default "Validation issues"
   */
  listLabel?: string;

  /**
   * Callback fired when a validation issue is selected.
   */
  onItemClick?: (item: ValidationSummaryItem, index: number) => void;

  /**
   * Theme used for styling.
   *
   * @default configured default theme (fallback: "primary")
   */
  theme?: ThemeType;

  /**
   * Visual state for styling.
   *
   * @default "error"
   */
  state?: StateType;

  /**
   * Whether to render outlined styling.
   *
   * @default configured default outline setting (fallback: false)
   */
  outline?: boolean;

  /**
   * Whether to render glass styling.
   *
   * @default configured default glass setting (fallback: false)
   */
  glass?: boolean;

  /**
   * Rounding style for the component.
   *
   * @default configured default rounding (fallback: "medium")
   */
  rounding?: RoundingType;

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
   * Accessible loading message rendered while loading is true.
   *
   * @default "Checking validation"
   */
  loadingMessage?: ReactNode;

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
   * Additional class name for the title.
   */
  titleClassName?: string;

  /**
   * Additional class name for the description.
   */
  descriptionClassName?: string;

  /**
   * Additional class name for the list.
   */
  listClassName?: string;

  /**
   * Additional class name for each list item.
   */
  itemClassName?: string;

  /**
   * Additional class name for validation links.
   */
  linkClassName?: string;

  /**
   * Additional class name for the content area.
   */
  contentClassName?: string;

  /**
   * Additional class name for empty-state text.
   */
  emptyClassName?: string;

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
   * @default dataTestId ?? "validation-summary"
   */
  testId?: string;

  /**
   * Backward-compatible alias for test ID attributes.
   */
  "data-testid"?: string;
}

export interface ValidationSummaryBaseProps extends ValidationSummaryProps {
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;
}

export type ValidationSummaryComponent = ForwardRefExoticComponent<
  ValidationSummaryProps & RefAttributes<HTMLDivElement>
>;
