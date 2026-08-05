import { ShadowType, StateType, ThemeType } from "@/types/types";
import { ReactNode } from "react";

export type DrawerPlacement = "left" | "right" | "top" | "bottom";

export interface DrawerProps {
  /**
   * Open.
   * @default false
   */
  open?: boolean;
  /**
   * Callback fired when close occurs.
   */
  onClose: () => void;
  /**
   * Content rendered inside the component.
   */
  children?: ReactNode;
  /**
   * Title content rendered by the component.
   */
  title?: ReactNode;
  /**
   * Custom header content rendered by the component.
   */
  header?: ReactNode;
  /**
   * Custom footer content rendered by the component.
   */
  footer?: ReactNode;
  /**
   * Placement.
   * @default "right"
   */
  placement?: DrawerPlacement;
  /**
   * Close On Overlay Click.
   * @default true
   */
  closeOnOverlayClick?: boolean;
  /**
   * Close On Escape.
   * @default true
   */
  closeOnEscape?: boolean;
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
   * Surface treatment; glassOutline combines glass and outline.
   *
   * @default configured default variant (fallback: "solid")
   */
  variant?: import("@/types/types").VariantType;
  /**
   * Rounding.
   * @default configured default rounding (fallback: "medium")
   */
  rounding?: import("@/types/types").RoundableRoundingType;
  /**
   * Shadow.
   * @default configured default shadow (fallback: "light")
   */
  shadow?: ShadowType;
  /**
   * Additional CSS class names for the component root.
   */
  className?: string;
  /**
   * Additional CSS class names for the overlay section.
   */
  overlayClassName?: string;
  /**
   * Additional CSS class names for the panel section.
   */
  panelClassName?: string;
  /**
   * Additional CSS class names for the header section.
   */
  headerClassName?: string;
  /**
   * Additional CSS class names for the title section.
   */
  titleClassName?: string;
  /**
   * Additional CSS class names for the body section.
   */
  bodyClassName?: string;
  /**
   * Additional CSS class names for the footer section.
   */
  footerClassName?: string;
  /**
   * Additional CSS class names for the close button section.
   */
  closeButtonClassName?: string;
  /**
   * Close Button Aria Label.
   * @default "Close drawer"
   */
  closeButtonAriaLabel?: string;
  /**
   * ARIA Label attribute forwarded to the relevant accessible element.
   */
  "aria-label"?: string;
  /**
   * ARIA Labelledby attribute forwarded to the relevant accessible element.
   */
  "aria-labelledby"?: string;
  /**
   * ARIA Describedby attribute forwarded to the relevant accessible element.
   */
  "aria-describedby"?: string;
  /**
   * Test id used to identify the component in tests.
   */
  testId?: string;
  /**
   * Test id used to identify the component in tests.
   */
  "data-testid"?: string;
}

export interface DrawerBaseProps extends DrawerProps {
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;
}
