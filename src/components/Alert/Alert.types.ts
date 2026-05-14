import { ReactNode } from "react";
import { RoundingType, ShadowType, StateType, ThemeType } from "@/types/types";

export type AlertVariant = "solid" | "soft";

export interface AlertProps {
  /**
   * Content rendered inside the component.
   */
  children?: ReactNode;
  /**
   * Title content rendered by the component.
   */
  title?: ReactNode;
  /**
   * Icon rendered by the component.
   */
  icon?: ReactNode;
  /**
   * Action content rendered by the component.
   */
  actions?: ReactNode;
  /**
   * Theme.
   * @default configured default theme (fallback: "primary")
   */
  theme?: ThemeType;
  /**
   * Visual state applied to the component.
   */
  state?: StateType;
  /**
   * Variant.
   * @default "solid"
   */
  variant?: AlertVariant;
  /**
   * Glass.
   * @default configured default glass setting (fallback: false)
   */
  glass?: boolean;
  /**
   * Outline.
   * @default false
   */
  outline?: boolean;
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
   * Dismissible.
   * @default false
   */
  dismissible?: boolean;
  /**
   * Callback fired when dismiss occurs.
   */
  onDismiss?: () => void;
  /**
   * Role.
   * @default state === "error" ? "alert" : "status"
   */
  role?: "status" | "alert" | "note";
  /**
   * Additional CSS class names for the component root.
   */
  className?: string;
  /**
   * Additional CSS class names for the icon section.
   */
  iconClassName?: string;
  /**
   * Additional CSS class names for the content section.
   */
  contentClassName?: string;
  /**
   * Additional CSS class names for the title section.
   */
  titleClassName?: string;
  /**
   * Additional CSS class names for the message section.
   */
  messageClassName?: string;
  /**
   * Additional CSS class names for the actions section.
   */
  actionsClassName?: string;
  /**
   * Additional CSS class names for the dismiss button section.
   */
  dismissButtonClassName?: string;
  /**
   * Dismiss Label.
   * @default "Dismiss alert"
   */
  dismissLabel?: string;
  /**
   * Test id used to identify the component in tests.
   */
  testId?: string;
  /**
   * Test id used to identify the component in tests.
   */
  "data-testid"?: string;
}

export interface AlertBaseProps extends AlertProps {
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;
}
