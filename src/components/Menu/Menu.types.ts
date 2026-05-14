import { RoundingType, ShadowType, StateType, ThemeType } from "@/types/types";
import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
} from "react";

/**
 * Supported ways to open the Menu.
 */
export type MenuActivation = "contextmenu" | "click" | "both" | "manual";

/**
 * Viewport coordinates used to position the menu panel.
 */
export type MenuPosition = {
  /** Horizontal viewport coordinate in pixels. */
  x: number;

  /** Vertical viewport coordinate in pixels. */
  y: number;
};

/**
 * Defines a single item, separator, label, or submenu trigger in the Menu.
 */
export interface MenuItem {
  /**
   * Item render type.
   *
   * @default "item"
   */
  type?: "item" | "separator" | "label";

  /** Visible item content. */
  label?: ReactNode;

  /** Optional icon shown before the label. */
  icon?: ReactNode;

  /** Optional shortcut or secondary metadata shown after the label. */
  shortcut?: ReactNode;

  /** Optional href to render the item as a link. */
  href?: string;

  /** Optional target attribute for linked items. */
  target?: AnchorHTMLAttributes<HTMLAnchorElement>["target"];

  /** Optional rel attribute for linked items. */
  rel?: AnchorHTMLAttributes<HTMLAnchorElement>["rel"];

  /** Whether the item is disabled and unavailable for selection. */
  disabled?: boolean;

  /** Whether the item should use destructive action styling. */
  destructive?: boolean;

  /** Whether the item content should be visually inset. */
  inset?: boolean;

  /**
   * Whether the item is checked when using checkbox or radio menu item roles.
   */
  checked?: boolean;

  /**
   * ARIA role for actionable items.
   *
   * @default "menuitem"
   */
  role?: "menuitem" | "menuitemcheckbox" | "menuitemradio";

  /** Optional id for the rendered item. */
  id?: string;

  /** Optional title/tooltip text. */
  title?: string;

  /** Optional class name merged onto the item. */
  className?: string;

  /**
   * Nested items rendered as a submenu.
   * Items with submenus behave as submenu triggers.
   */
  items?: MenuItem[];

  /**
   * Accessible label for the submenu panel.
   * Falls back to the parent item label when omitted.
   */
  submenuAriaLabel?: string;

  /** Optional id for the rendered submenu panel. */
  submenuId?: string;

  /** Selection handler receiving the original item click event. */
  onSelect?: (
    event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => void;

  /** Convenience click handler called when a non-submenu item is selected. */
  onClick?: () => void;

  /**
   * Accessible label override for the item.
   * Useful when the visible label is abbreviated or not textual.
   */
  "aria-label"?: string;

  /** Accessible description id(s) for the item. */
  "aria-describedby"?: string;

  /** Marks the current item when relevant, such as the current page/view. */
  "aria-current"?:
    | boolean
    | "page"
    | "step"
    | "location"
    | "date"
    | "time"
    | "true"
    | "false";

  /** Optional test ID for testing frameworks. */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;
}

/**
 * Props for the Menu component.
 */
export interface MenuProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onKeyDown"> {
  /** Array of menu items, labels, separators, and submenu triggers to render. */
  items: MenuItem[];

  /** Context target content. Used when opening by click or context menu. */
  children?: ReactNode;

  /** Optional explicit trigger content rendered as a button. */
  trigger?: ReactNode;

  /** Controlled open state. */
  open?: boolean;

  /**
   * Initial open state for uncontrolled usage.
   *
   * @default false
   */
  defaultOpen?: boolean;

  /** Controlled menu position in viewport coordinates. */
  position?: MenuPosition;

  /**
   * How the menu opens.
   * Defaults to "click" when `trigger` is provided, otherwise "contextmenu".
   *
   * @default trigger ? "click" : "contextmenu"
   */
  activation?: MenuActivation;

  /** Called whenever the open state changes. */
  onOpenChange?: (open: boolean) => void;

  /** Called whenever the menu position changes. */
  onPositionChange?: (position: MenuPosition) => void;

  /**
   * Whether the menu closes after selecting a non-submenu item.
   *
   * @default true
   */
  closeOnSelect?: boolean;

  /**
   * Whether focus moves to the first enabled item when the menu opens.
   *
   * @default true
   */
  focusFirstItemOnOpen?: boolean;

  /**
   * Theme for styling
   * ('primary' | 'secondary' | 'tertiary' | 'quaternary' | 'clear').
   *
   * @default configured default theme (fallback: "primary")
   */
  theme?: ThemeType;

  /**
   * Adds glass styling to the menu panel.
   *
   * @default configured default glass setting (fallback: false)
   */
  glass?: boolean;

  /**
   * Rounding style for the menu panel.
   *
   * @default configured default rounding (fallback: "medium")
   */
  rounding?: RoundingType;

  /**
   * Shadow style for the menu panel.
   *
   * @default configured default shadow (fallback: "light")
   */
  shadow?: ShadowType;

  /**
   * State styling for the menu.
   */
  state?: StateType;

  /** Optional class name for the outer wrapper. */
  className?: string;

  /** Optional class name for the context target wrapper. */
  targetClassName?: string;

  /** Optional class name for the trigger button. */
  triggerClassName?: string;

  /** Optional class name for the root menu panel. */
  menuClassName?: string;

  /** Optional class name merged onto every actionable menu item. */
  itemClassName?: string;

  /** Optional id for the outer wrapper. */
  id?: string;

  /** Optional id for the root menu panel. */
  menuId?: string;

  /**
   * Accessible label for the menu panel.
   *
   * @default "Context menu"
   */
  "aria-label"?: string;

  /** Accessible labelledby target for the menu panel. */
  "aria-labelledby"?: string;

  /** Accessible description id(s) for the menu panel. */
  "aria-describedby"?: string;

  /**
   * Optional test ID for testing frameworks.
   *
   * @default dataTestId ?? "menu"
   */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;

  /**
   * Extra props applied to the rendered trigger button.
   */
  triggerProps?: Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "children" | "aria-haspopup" | "aria-expanded" | "aria-controls"
  >;

  /**
   * Extra props applied to the root menu panel.
   */
  menuProps?: Omit<
    HTMLAttributes<HTMLDivElement>,
    "children" | "role" | "id" | "aria-label" | "aria-labelledby"
  >;

  /** Keydown handler for the outer wrapper, called before internal handling. */
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
}

/**
 * Base Menu props shared by the core and Next wrappers.
 */
export interface BaseMenuProps extends MenuProps {
  /** Framework-specific class name map supplied by the core or Next wrapper. */
  classMap: Record<string, string>;
}
