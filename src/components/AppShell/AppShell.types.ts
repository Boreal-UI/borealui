import { ShadowType, StateType, ThemeType } from "@/types/types";
import {
  ForwardRefExoticComponent,
  HTMLAttributes,
  ReactNode,
  RefAttributes,
} from "react";

type NativeAppShellProps = Omit<HTMLAttributes<HTMLDivElement>, "children">;

/**
 * Props for the AppShell component.
 */
export interface AppShellProps extends NativeAppShellProps {
  /**
   * Header region rendered at the top of the shell.
   */
  header?: ReactNode;

  /**
   * Legacy alias for header content retained for scaffold compatibility.
   */
  label?: ReactNode;

  /**
   * Navigation/sidebar region rendered before the main content.
   */
  sidebar?: ReactNode;

  /**
   * Complementary aside region rendered after the main content.
   */
  aside?: ReactNode;

  /**
   * Footer region rendered below the main content.
   */
  footer?: ReactNode;

  /**
   * Main page content.
   */
  children?: ReactNode;

  /**
   * Whether the sidebar column should be present but collapsed.
   *
   * @default false
   */
  sidebarCollapsed?: boolean;

  /**
   * Width of the sidebar column.
   *
   * @default "16rem"
   */
  sidebarWidth?: string;

  /**
   * Width of the aside column.
   *
   * @default "18rem"
   */
  asideWidth?: string;

  /**
   * Whether the header should stick to the top of the viewport.
   *
   * @default false
   */
  stickyHeader?: boolean;

  /**
   * Theme used for styling.
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
   */
  rounding?: import("@/types/types").RoundableRoundingType;

  /**
   * Shadow style for the component.
   */
  shadow?: ShadowType;

  /**
   * Whether the shell is visually disabled.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the shell should display a loading state.
   *
   * @default false
   */
  loading?: boolean;

  /**
   * Additional class name for the root shell.
   */
  className?: string;

  /**
   * Additional class name for the main content region.
   */
  mainClassName?: string;

  /**
   * Additional class name for the main content area.
   */
  contentClassName?: string;

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
   */
  testId?: string;

  /**
   * Backward-compatible alias for test ID attributes.
   */
  "data-testid"?: string;
}

export interface AppShellBaseProps extends AppShellProps {
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;
}

export type AppShellComponent = ForwardRefExoticComponent<
  AppShellProps & RefAttributes<HTMLDivElement>
>;
