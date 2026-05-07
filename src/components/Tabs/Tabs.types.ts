import React from "react";
import {
  RoundingType,
  ShadowType,
  SizeType,
  StateType,
  ThemeType,
} from "@/types/types";

/**
 * Represents a single tab with a label, optional icon, and content.
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

  /** Custom class names to apply to the tabs container. */
  className?: string;

  /** Uncontrolled initial index. */
  defaultIndex?: number;

  /** Accessible name for the tablist. */
  "aria-label"?: string;

  /** Accessible labelledby id for the tablist. Preferred over aria-label when provided. */
  "aria-labelledby"?: string;

  /** Accessible description id for the tablist. */
  "aria-describedby"?: string;

  /** Optional id for the tablist element itself. */
  tabListId?: string;

  /** Callback when the active tab changes. */
  onChange?: (index: number) => void;

  /**
   * Theme for styling the tabs.
   * "primary" | "secondary" | "tertiary" | "quaternary" | "clear"
   */
  theme?: ThemeType;

  /**
   * Adds translucent glass styling to the tab controls.
   */
  glass?: boolean;

  /**
   * State of the tabs.
   * "success" | "error" | "warning" | "disabled" | ""
   */
  state?: StateType;

  /**
   * Rounding of the tabs.
   * "none" | "small" | "medium" | "large" | "full"
   */
  rounding?: RoundingType;

  /**
   * Shadow style of the tabs.
   * "none" | "light" | "medium" | "strong" | "intense"
   */
  shadow?: ShadowType;

  /**
   * Size of the tabs.
   * "xs" | "small" | "medium" | "large" | "xl"
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
