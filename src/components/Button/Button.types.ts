import {
  RoundingType,
  ShadowType,
  SizeType,
  StateType,
  ThemeType,
} from "@/types/types";
import React, {
  AnchorHTMLAttributes,
  AriaAttributes,
  ButtonHTMLAttributes,
} from "react";

/**
 * Props for the reusable Button component.
 */
export interface ButtonProps extends Pick<
  AriaAttributes,
  | "aria-label"
  | "aria-labelledby"
  | "aria-describedby"
  | "aria-controls"
  | "aria-expanded"
  | "aria-pressed"
  | "aria-current"
  | "aria-haspopup"
  | "aria-live"
  | "aria-atomic"
  | "aria-busy"
  | "aria-disabled"
> {
  /**
   * Optional target for link rendering.
   * Example: "_blank", "_self", "_parent", "_top"
   */
  _target?: React.HTMLAttributeAnchorTarget;

  /**
   * Optional element or component override.
   * Example: "a", "button", Link
   */
  as?: React.ElementType;

  /**
   * Optional icon component to render inside the button.
   */
  icon?: React.ComponentType<{
    className?: string;
    "aria-hidden"?: boolean;
    focusable?: boolean;
  }>;

  /**
   * Position of the icon relative to the button label.
   */
  iconPosition?: "left" | "right";

  /**
   * Applies a translucent frosted-glass treatment using the active theme palette.
   */
  glass?: boolean;

  /**
   * Theme style of the button
   * ('primary' | 'secondary' | 'tertiary' | 'quaternary' | 'clear').
   */
  theme?: ThemeType;

  /**
   * State of the button
   * ('success' | 'error' | 'warning' | 'disabled' | '').
   */
  state?: StateType;

  /**
   * Click event handler for the button.
   */
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;

  /**
   * Child content to display inside the button.
   */
  children?: React.ReactNode;

  /**
   * Additional class name(s) for custom styling.
   */
  className?: string;

  /**
   * Whether the button should be disabled.
   */
  disabled?: boolean;

  /**
   * Accessible label for screen readers.
   * Required for icon-only buttons.
   */
  "aria-label"?: string;

  /**
   * References the element(s) that label this button.
   * Useful when the visible label lives outside the button.
   */
  "aria-labelledby"?: string;

  /**
   * References the element(s) that describe this button.
   * Useful for extra instructions or status messaging.
   */
  "aria-describedby"?: string;

  /**
   * Identifies the element controlled by this button,
   * such as a menu, dialog, accordion panel, or disclosure region.
   */
  "aria-controls"?: string;

  /**
   * Indicates whether the controlled element is expanded or collapsed.
   * Commonly used for disclosure buttons.
   */
  "aria-expanded"?: boolean;

  /**
   * Indicates the pressed state for toggle buttons.
   */
  "aria-pressed"?: boolean | "mixed";

  /**
   * Indicates that this button represents the current item within a set.
   * Most useful when rendering as a link-like control.
   */
  "aria-current"?: boolean | "page" | "step" | "location" | "date" | "time";

  /**
   * Indicates that activating the button opens a popup such as a menu,
   * dialog, listbox, tree, or grid.
   */
  "aria-haspopup"?: boolean | "menu" | "listbox" | "tree" | "grid" | "dialog";

  /**
   * Indicates whether the element is busy.
   * Usually derived automatically from `loading`.
   */
  "aria-busy"?: boolean;

  /**
   * Indicates whether the control is perceivable as disabled to assistive tech.
   * Usually derived automatically when rendered as a disabled link.
   */
  "aria-disabled"?: boolean;

  /**
   * Optional live-region politeness for loading or dynamic content updates.
   */
  "aria-live"?: "off" | "polite" | "assertive";

  /**
   * Whether assistive technologies should treat live updates as atomic.
   */
  "aria-atomic"?: boolean;

  /**
   * If provided, button will render as a link pointing to this href.
   */
  href?: string;

  /**
   * If true, opens the link in a new tab (used with `href`).
   */
  isExternal?: boolean;

  /**
   * Whether to use outline styling.
   */
  outline?: boolean;

  /**
   * Rounding style for the button
   * ('none' | 'small' | 'medium' | 'large' | 'full').
   */
  rounding?: RoundingType;

  /**
   * Shadow style for the button
   * ('none' | 'light' | 'medium' | 'strong' | 'intense').
   */
  shadow?: ShadowType;

  /**
   * Size of the button
   * ('xs' | 'small' | 'medium' | 'large' | 'xl').
   */
  size?: SizeType;

  /**
   * Whether to show a loading indicator instead of the children.
   */
  loading?: boolean;

  /**
   * Optional accessible text announced while loading.
   * Defaults to "Loading" in the component if not provided.
   */
  loadingLabel?: string;

  /**
   * Whether the button should take up the full width of its container.
   */
  fullWidth?: boolean;

  /**
   * Button type for native `<button>` elements
   * ('button' | 'reset' | 'submit').
   */
  type?: "button" | "reset" | "submit";

  /**
   * Optional test ID for testing frameworks.
   */
  "data-testid"?: string;
}

type AnchorExtras = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  | "href"
  | "children"
  | "className"
  | "onClick"
  | "target"
  | "rel"
  | keyof ButtonProps
>;

type ButtonExtras = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "className" | "onClick" | keyof ButtonProps
>;

export type ButtonBaseProps =
  | (ButtonProps & {
      classMap: Record<string, string>;
      LinkComponent?: React.ElementType;
      href: string;
    } & AnchorExtras)
  | (ButtonProps & {
      classMap: Record<string, string>;
      LinkComponent?: React.ElementType;
      href?: undefined;
    } & ButtonExtras);
