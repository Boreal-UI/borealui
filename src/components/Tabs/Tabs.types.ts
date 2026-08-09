import {
  RoundingType,
  ShadowType,
  SizeType,
  StateType,
  ThemeType,
} from "@/types/types";
import React from "react";

/**
 * Represents a single tab with a label, optional icon, and content.
 * @default "Tabs"
 */
export interface Tab {
  /** The label of the tab. */
  label: string;
  /** An optional icon for the tab. */
  icon?: React.ComponentType;
  /** Whether the tab is disabled. */
  disabled?: boolean;
  /** Optional accessible label when the visible label is not sufficient. */
  "aria-label"?: string;
  /** Optional description id for additional tab context. */
  "aria-describedby"?: string;
  /** Optional stable id override for the individual tab. */
  id?: string;
  /** Optional stable id override for the related panel. */
  panelId?: string;
}

/**
 * Props for the Tabs component.
 */
export interface TabsProps {
  /** Array of tabs to display. */
  tabs: Tab[];

  /** Controlled active tab index. */
  value?: number;

  /**
   * Custom class names to apply to the tabs container.
   *
   */
  className?: string;

  /**
   * Uncontrolled initial index.
   *
   * @default 0
   */
  defaultValue?: number;

  /**
   * Accessible name for the tablist.
   *
   * @default "Tabs"
   */
  "aria-label"?: string;

  /** Accessible labelledby id for the tablist. Preferred over aria-label when provided. */
  "aria-labelledby"?: string;

  /** Accessible description id for the tablist. */
  "aria-describedby"?: string;

  /** Optional id for the tablist element itself. */
  tabListId?: string;

  /** Callback when the active tab changes. */
  onValueChange?: (index: number) => void;

  /**
   * Theme for styling the tabs.
   * "primary" | "secondary" | "tertiary" | "quaternary" | "clear"
   *
   * @default configured default theme (fallback: "primary")
   */
  theme?: ThemeType;
  /**
   * Surface treatment; glassOutline combines glass and outline.
   *
   * @default configured default variant (fallback: "solid")
   */
  variant?: import("@/types/types").VariantType;
  /**
   * State of the tabs.
   * "success" | "error" | "warning" | "info" | "disabled" | ""
   *
   */
  state?: StateType;

  /**
   * Rounding of the tabs.
   * "none" | "small" | "medium" | "large" | "full"
   *
   * @default configured default rounding (fallback: "medium")
   */
  rounding?: RoundingType;

  /**
   * Shadow style of the tabs.
   * "none" | "light" | "medium" | "strong" | "intense"
   *
   * @default configured default shadow (fallback: "light")
   */
  shadow?: ShadowType;

  /**
   * Size of the tabs.
   * "xs" | "small" | "medium" | "large" | "xl"
   *
   * @default configured default size (fallback: "medium")
   */
  size?: SizeType;

  /**
   * Optional stable base used to create ids:
   * `${idBase}-tab-${i}` and `${idBase}-panel-${i}`
   */
  idBase?: string;

  /** Optional aria-live setting if tab changes should be announced by a related region. */
  "aria-live"?: "off" | "polite" | "assertive";

  /** Test ID for testing purposes. */

  /**
   * Optional test ID for testing frameworks.
   *
   * @default dataTestId ?? "tabs"
   */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;
}

export type BaseTabsProps = TabsProps & {
  /** Orientation of the tabs. */
  orientation?: "horizontal" | "vertical";

  /** Activation mode of the tabs. */
  activationMode?: "auto" | "manual";

  /** Class names for the tab container. */
  classMap: Record<string, string>;
};
