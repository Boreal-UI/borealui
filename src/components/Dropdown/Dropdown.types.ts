import { RoundingType, ShadowType, StateType, ThemeType } from "@/types/types";
import { ComponentType, HTMLAttributes, ReactNode } from "react";
import { IconButtonProps } from "../IconButton/IconButton.types";

/**
 * Defines a single item in the dropdown menu.
 */
export interface DropdownItem {
  /** Display text for the menu item. */
  label: string;

  /** Optional click handler (ignored if `href` is provided). */
  onClick?: () => void;

  /** Optional icon shown beside the label. */
  icon?: ReactNode;

  /** Optional href to make the item behave as a link. */
  href?: string;

  /** Whether the item is disabled. */
  disabled?: boolean;

  /**
   * Accessible label override for the item.
   * Useful when the visible label is abbreviated or ambiguous.
   */
  "aria-label"?: string;

  /**
   * Accessible description id(s) for the item.
   */
  "aria-describedby"?: string;

  /**
   * Marks the current item when relevant, such as the current page/view.
   */
  "aria-current"?:
    | boolean
    | "page"
    | "step"
    | "location"
    | "date"
    | "time"
    | "true"
    | "false";

  /**
   * Optional role override for specialized menu patterns.
   * Defaults to "menuitem" in the base implementation.
   */
  role?: "menuitem" | "menuitemcheckbox" | "menuitemradio";

  /**
   * Whether the item is checked/selected when using checkbox or radio menu items.
   */
  "aria-checked"?: boolean;

  /** Optional title/tooltip text. */
  title?: string;

  /** Optional test ID for testing frameworks. */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;

  /**
   * Optional id for the rendered menu item.
   */
  id?: string;
}

/**
 * Props for the Dropdown component.
 */
export interface DropdownProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "title"
> {
  /** Icon component used for the trigger button. */
  triggerIcon: ComponentType<{
    className?: string;
    "aria-hidden"?: boolean;
    focusable?: boolean;
  }>;

  /** Array of items to render in the dropdown menu. */
  items: DropdownItem[];

  /**
   * Menu alignment relative to the trigger
   * ('left' | 'right').
   *
   * @default "right"
   */
  align?: "left" | "right";

  /**
   * Custom class name for the dropdown wrapper.
   *
   * @default ""
   */
  className?: string;

  /**
   * Custom class name for the dropdown menu.
   *
   * @default ""
   */
  menuClassName?: string;

  /**
   * Rounding of the toggle button
   * ('none' | 'small' | 'medium' | 'large' | 'full').
   *
   * @default configured default rounding (fallback: "medium")
   */
  toggleRounding?: RoundingType;

  /**
   * Rounding of the dropdown menu
   * ('none' | 'small' | 'medium' | 'large' | 'full').
   *
   * @default configured default rounding (fallback: "medium")
   */
  menuRounding?: RoundingType;

  /**
   * Shadow style for the toggle button
   * ('none' | 'light' | 'medium' | 'strong' | 'intense').
   *
   * @default configured default shadow (fallback: "light")
   */
  toggleShadow?: ShadowType;

  /**
   * Shadow style for the dropdown menu
   * ('none' | 'light' | 'medium' | 'strong' | 'intense').
   *
   * @default configured default shadow (fallback: "light")
   */
  menuShadow?: ShadowType;

  /**
   * Whether to use the outline style on the toggle button.
   *
   * @default false
   */
  toggleOutline?: boolean;

  /**
   * Accessible label for the trigger button.
   * Prefer this when the trigger is icon-only.
   *
   * @default "Dropdown menu"
   */
  "aria-label"?: string;

  /**
   * Accessible labelledby target for the trigger button.
   */
  "aria-labelledby"?: string;

  /**
   * Accessible description id(s) for the trigger button.
   */
  "aria-describedby"?: string;

  /**
   * Accessible label for the menu itself.
   * Falls back to `aria-label` in many implementations.
   */
  menuAriaLabel?: string;

  /**
   * Accessible labelledby target for the menu.
   * Prefer this over `menuAriaLabel` when visible text labels the menu.
   */
  menuAriaLabelledby?: string;

  /**
   * Accessible description id(s) for the menu.
   */
  menuAriaDescribedby?: string;

  /**
   * Optional id for the menu element.
   * Useful when composing with external controls/tests.
   */
  menuId?: string;

  /**
   * Optional id for the trigger element.
   */
  triggerId?: string;

  /**
   * Whether keyboard focus should move to the first item when the menu opens.
   * Default behavior in your base already does this logically.
   *
   * @default true
   */
  focusFirstItemOnOpen?: boolean;

  /**
   * Whether the menu should close after selecting an item.
   * Default is usually true for action menus.
   *
   * @default true
   */
  closeOnSelect?: boolean;

  /**
   * Theme for styling
   * ('primary' | 'secondary' | 'tertiary' | 'quaternary' | 'clear').
   *
   * @default configured default theme (fallback: "primary")
   */
  theme?: ThemeType;

  /**
   * Adds glass styling to the trigger IconButton and dropdown menu.
   *
   * @default configured default glass setting (fallback: false)
   */
  glass?: boolean;

  /**
   * State of the dropdown
   * ('success' | 'error' | 'warning' | 'disabled' | '').
   *
   * @default ""
   */
  state?: StateType;

  /** Optional title/tooltip text for the trigger. */
  title?: string;


  /**
   * Optional test ID for testing frameworks.
   *
   * @default dataTestId ?? "dropdown"
   */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;

  /**
   * Extra props applied to the trigger IconButton.
   * Keeps accessibility flexible without bloating the main API.
   */
  triggerProps?: Omit<
    IconButtonProps,
    | "icon"
    | "aria-label"
    | "aria-labelledby"
    | "aria-describedby"
    | "aria-haspopup"
    | "aria-expanded"
    | "aria-controls"
    | "onClick"
    | "theme"
    | "state"
    | "rounding"
    | "shadow"
    | "outline"
  >;

  /**
   * Extra props applied to the menu container.
   */
  menuProps?: Omit<React.HTMLProps<HTMLDivElement>, "role" | "id" | "children">;
}

export type IconButtonLikeRef = HTMLButtonElement | HTMLAnchorElement;

export type IconButtonComponent = React.ForwardRefExoticComponent<
  IconButtonProps & React.RefAttributes<IconButtonLikeRef>
>;

export interface BaseDropdownProps extends DropdownProps {
  IconButton: IconButtonComponent;
  classMap: Record<string, string>;
}
