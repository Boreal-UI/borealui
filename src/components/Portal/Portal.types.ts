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

type NativePortalProps = Omit<HTMLAttributes<HTMLDivElement>, "children">;

/**
 * Props for the Portal component.
 */
export interface PortalProps extends NativePortalProps {
  /**
   * Content rendered into the target container.
   */
  children?: ReactNode;

  /**
   * Legacy visible label retained for scaffold compatibility.
   */
  label?: ReactNode;

  /**
   * Legacy label position retained for scaffold compatibility.
   */
  labelPosition?: LabelPositionType;

  /**
   * Element, selector, or null target for the portal.
   *
   * @default document.body
   */
  container?: Element | DocumentFragment | string | null;

  /**
   * Whether the portal should render in place instead of using createPortal.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Theme used for styling.
   */
  theme?: ThemeType;

  /**
   * Visual state for styling.
   */
  state?: StateType;

  /**
   * Whether to render outlined styling.
   */
  outline?: boolean;

  /**
   * Whether to render glass styling.
   */
  glass?: boolean;

  /**
   * Rounding style for the component.
   */
  rounding?: RoundingType;

  /**
   * Shadow style for the component.
   */
  shadow?: ShadowType;

  /**
   * Whether the component should display a loading state.
   */
  loading?: boolean;

  /**
   * Whether children should render before the target is available.
   *
   * @default false
   */
  renderInlineUntilMounted?: boolean;

  /**
   * Optional class name for the portal wrapper.
   */
  className?: string;

  /**
   * Legacy class name for the outer container.
   */
  containerClassName?: string;

  /**
   * Legacy class name for the visible label.
   */
  labelClassName?: string;

  /**
   * Legacy class name for the content area.
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
   *
   * @default dataTestId ?? "portal"
   */
  testId?: string;

  /**
   * Backward-compatible alias for test ID attributes.
   */
  "data-testid"?: string;
}

export interface PortalBaseProps extends PortalProps {
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;
}

export type PortalComponent = ForwardRefExoticComponent<
  PortalProps & RefAttributes<HTMLDivElement>
>;
