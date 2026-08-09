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

type NativeInputGroupProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "prefix" | "title"
>;

/**
 * Props for the InputGroup component.
 */
export interface InputGroupProps extends NativeInputGroupProps {
  /**
   * Main form control rendered inside the group.
   */
  children?: ReactNode;

  /**
   * Optional visible label for the grouped control.
   */
  label?: ReactNode;
  /**
   * Helper text rendered after the control and connected with aria-describedby.
   */
  helperText?: ReactNode;

  /**
   * Error message rendered after the control and announced to assistive technologies.
   */
  errorMessage?: ReactNode;

  /**
   * Whether the grouped control is required.
   *
   * @default false
   */
  required?: boolean;

  /**
   * Optional text rendered beside the label when required is false.
   *
   * @default "Optional"
   */
  optionalText?: ReactNode;

  /**
   * Content rendered before the control inside the shared input frame.
   */
  prefix?: ReactNode;

  /**
   * Content rendered after the control inside the shared input frame.
   */
  suffix?: ReactNode;

  /**
   * Addon content rendered before the shared input frame.
   */
  startAddon?: ReactNode;

  /**
   * Addon content rendered after the shared input frame.
   */
  endAddon?: ReactNode;

  /**
   * Position of the label relative to the component.
   *
   * @default "top"
   */
  labelPosition?: LabelPositionType;

  /**
   * Whether the group should stretch to the full available width.
   *
   * @default true
   */
  fullWidth?: boolean;

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
   * Whether the grouped control is disabled.
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
   * Additional class name for the description text.
   */
  descriptionClassName?: string;

  /**
   * Additional class name for the input frame.
   */
  frameClassName?: string;

  /**
   * Additional class name for the content/control area.
   */
  contentClassName?: string;

  /**
   * Additional class name for prefix content.
   */
  prefixClassName?: string;

  /**
   * Additional class name for suffix content.
   */
  suffixClassName?: string;

  /**
   * Additional class name for the start addon.
   */
  startAddonClassName?: string;

  /**
   * Additional class name for the end addon.
   */
  endAddonClassName?: string;

  /**
   * Additional class name for helper text.
   */
  helperTextClassName?: string;

  /**
   * Additional class name for error text.
   */
  errorClassName?: string;

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
   * @default dataTestId ?? "input-group"
   */
  testId?: string;

  /**
   * Backward-compatible alias for test ID attributes.
   */
  "data-testid"?: string;
  invalid?: boolean;
}

export interface InputGroupBaseProps extends InputGroupProps {
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;
}

export type InputGroupComponent = ForwardRefExoticComponent<
  InputGroupProps & RefAttributes<HTMLDivElement>
>;
