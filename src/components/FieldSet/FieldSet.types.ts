import {
  FieldsetHTMLAttributes,
  ReactNode,
  RefAttributes,
  ForwardRefExoticComponent,
} from "react";
import {
  LabelPositionType,
  RoundingType,
  ShadowType,
  StateType,
  ThemeType,
} from "@/types/types";

type NativeFieldSetProps = Omit<
  FieldsetHTMLAttributes<HTMLFieldSetElement>,
  "children" | "disabled"
>;

/**
 * Layout used to arrange the grouped form controls.
 */
export type FieldSetLayoutType = "stack" | "grid" | "inline";

/**
 * Spacing scale applied between grouped form controls.
 */
export type FieldSetSpacingType = "none" | "xs" | "sm" | "md" | "lg";

/**
 * Props for the FieldSet component.
 */
export interface FieldSetProps extends NativeFieldSetProps {
  /**
   * Main content rendered inside the component.
   */
  children?: ReactNode;

  /**
   * Semantic legend for the grouped controls.
   */
  legend?: ReactNode;

  /**
   * Backward-compatible alias for the component legend.
   */
  label?: ReactNode;

  /**
   * Position of the label relative to the component.
   *
   * @default "top"
   */
  labelPosition?: LabelPositionType;

  /**
   * Descriptive text rendered beneath the legend and connected with aria-describedby.
   */
  description?: ReactNode;

  /**
   * Supporting text rendered after the grouped controls.
   */
  helperText?: ReactNode;

  /**
   * Error message rendered after the grouped controls and announced to assistive technologies.
   */
  error?: ReactNode;

  /**
   * Whether the field group is required.
   *
   * @default false
   */
  required?: boolean;

  /**
   * Text or marker rendered next to the legend when required is true.
   *
   * @default "*"
   */
  requiredIndicator?: ReactNode;

  /**
   * Optional text rendered next to the legend when required is false.
   */
  optionalText?: ReactNode;

  /**
   * Whether the legend should remain available to assistive technologies only.
   *
   * @default false
   */
  hideLegend?: boolean;

  /**
   * Layout used for the grouped controls.
   *
   * @default "stack"
   */
  layout?: FieldSetLayoutType;

  /**
   * Spacing used between grouped controls.
   *
   * @default "md"
   */
  spacing?: FieldSetSpacingType;

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
   * @default "Loading"
   */
  loadingMessage?: ReactNode;

  /**
   * Optional actions rendered in the fieldset footer.
   */
  actions?: ReactNode;

  /**
   * Optional footer content rendered after helper and error text.
   */
  footer?: ReactNode;

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
   * Additional class name for the semantic legend.
   */
  legendClassName?: string;

  /**
   * Additional class name for the description text.
   */
  descriptionClassName?: string;

  /**
   * Additional class name for the grouped control body.
   */
  bodyClassName?: string;

  /**
   * Additional class name for the content area. Alias for bodyClassName.
   */
  contentClassName?: string;

  /**
   * Additional class name for helper text.
   */
  helperTextClassName?: string;

  /**
   * Additional class name for error text.
   */
  errorClassName?: string;

  /**
   * Additional class name for the actions area.
   */
  actionsClassName?: string;

  /**
   * Additional class name for the footer area.
   */
  footerClassName?: string;

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
   * @default dataTestId ?? "field-set"
   */
  testId?: string;

  /**
   * Backward-compatible alias for test ID attributes.
   */
  "data-testid"?: string;
}

export interface FieldSetBaseProps extends FieldSetProps {
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;
}

export type FieldSetComponent = ForwardRefExoticComponent<
  FieldSetProps & RefAttributes<HTMLFieldSetElement>
>;
