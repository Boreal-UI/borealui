import {
  PositionType,
  RoundingType,
  ShadowType,
  SizeType,
  StateType,
  ThemeType,
} from "@/types/types";
import type { AriaAttributes, ElementType, HTMLAttributes } from "react";

/**
 * Props for the ChipBase component (low-level, unstyled chip implementation).
 * Extends ChipProps with additional class and icon customization.
 */
export interface ChipBaseProps extends ChipProps {
  /**
   * A mapping of BEM-style class names for the component parts.
   * Example: { root: "chip_root", icon: "chip_icon", ... }
   */
  classMap: Record<string, string>;

  /**
   * The icon button component to use for the close/remove action.
   * Accepts a React component type (e.g., your custom IconButton).
   */
  IconButtonComponent: ElementType;

  /**
   * Optional custom icon component for the close/remove button.
   * Accepts a React component type.
   */
  closeIcon?: ElementType;
}

/**
 * Props for the Chip component.
 */
export interface ChipProps
  extends
    Omit<HTMLAttributes<HTMLDivElement>, "children" | "role">,
    Pick<
      AriaAttributes,
      | "aria-label"
      | "aria-labelledby"
      | "aria-describedby"
      | "aria-live"
      | "aria-atomic"
      | "aria-relevant"
      | "aria-hidden"
    > {
  /** Optional unique ID for the chip. */
  id?: string;

  /** Message text to display inside the chip. */
  message: string;

  /** Whether the chip is currently visible. */
  visible: boolean;

  /** Optional icon component to show on the left side. */
  icon?: ElementType;

  /**
   * Whether the leading icon is decorative.
   * When true, it will be hidden from assistive technology.
   * Defaults to true.
   *
   * @default true
   */
  iconDecorative?: boolean;

  /**
   * Accessible label for the leading icon when it is not decorative.
   */
  iconAriaLabel?: string;

  /**
   * Size of the chip
   * ('xs' | 'small' | 'medium' | 'large' | 'xl').
   *
   * @default configured default size (fallback: "medium")
   */
  size?: SizeType;

  /**
   * Whether to use a portal for rendering the chip.
   *
   * @default true
   */
  usePortal?: boolean;

  /** Callback when the chip is closed manually or automatically. */
  onClose?: () => void;

  /**
   * Theme color for the chip
   * ('primary' | 'secondary' | 'tertiary' | 'quaternary' | 'clear').
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
   * Rounding style for the chip
   * ('none' | 'small' | 'medium' | 'large' | 'full').
   *
   * @default configured default rounding (fallback: "medium")
   */
  rounding?: RoundingType;

  /**
   * Shadow style for the chip
   * ('none' | 'light' | 'medium' | 'strong' | 'intense').
   *
   * @default configured default shadow (fallback: "light")
   */
  shadow?: ShadowType;

  /**
   * State of the chip
   * ('success' | 'error' | 'warning' | 'info' | 'disabled' | '').
   *
   */
  state?: StateType;

  /**
   * Position of the chip on the screen
   * ('topLeft' | 'topCenter' | 'topRight' | 'bottomLeft' | 'bottomCenter' | 'bottomRight').
   *
   * @default "topCenter"
   */
  placement?: PositionType;

  /**
   * Additional class name for custom styling.
   *
   */
  className?: string;

  /** Index for stacking multiple chips, useful for z-index logic. */
  stackIndex?: number;

  /**
   * Whether the chip should close automatically after a delay.
   *
   * @default true
   */
  autoClose?: boolean;

  /**
   * Time in milliseconds before auto-closing (default: 3000).
   *
   * @default 3000
   */
  duration?: number;

  /**
   * ARIA role for the chip container.
   * Defaults to "alert".
   *
   * @default "alert"
   */
  role?: "alert" | "status" | "log" | "none" | "presentation";

  /**
   * Custom accessible label for the close button.
   * Defaults to "Close notification".
   *
   * @default "Close notification"
   */
  closeButtonAriaLabel?: string;

  /**
   * Optional ID for the message element.
   * If omitted, a stable fallback based on testId/id is used.
   */
  messageId?: string;

  /**
   * Optional test ID for testing frameworks.
   *
   * @default dataTestId ?? "chip"
   */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;
}
