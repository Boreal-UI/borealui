import { RoundingType, ShadowType, StateType, ThemeType } from "@/types/types";
import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
} from "react";

export type MenuActivation = "contextmenu" | "click" | "both" | "manual";

export type MenuPosition = {
  x: number;
  y: number;
};

export interface MenuItem {
  type?: "item" | "separator" | "label";
  label?: ReactNode;
  icon?: ReactNode;
  shortcut?: ReactNode;
  href?: string;
  target?: AnchorHTMLAttributes<HTMLAnchorElement>["target"];
  rel?: AnchorHTMLAttributes<HTMLAnchorElement>["rel"];
  disabled?: boolean;
  destructive?: boolean;
  inset?: boolean;
  checked?: boolean;
  role?: "menuitem" | "menuitemcheckbox" | "menuitemradio";
  id?: string;
  title?: string;
  className?: string;
  items?: MenuItem[];
  submenuAriaLabel?: string;
  submenuId?: string;
  onSelect?: (
    event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => void;
  onClick?: () => void;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-current"?:
    | boolean
    | "page"
    | "step"
    | "location"
    | "date"
    | "time"
    | "true"
    | "false";
  testId?: string;
  "data-testid"?: string;
}

export interface MenuProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onKeyDown"> {
  items: MenuItem[];
  children?: ReactNode;
  trigger?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  position?: MenuPosition;
  activation?: MenuActivation;
  onOpenChange?: (open: boolean) => void;
  onPositionChange?: (position: MenuPosition) => void;
  closeOnSelect?: boolean;
  focusFirstItemOnOpen?: boolean;
  theme?: ThemeType;
  glass?: boolean;
  rounding?: RoundingType;
  shadow?: ShadowType;
  state?: StateType;
  className?: string;
  targetClassName?: string;
  triggerClassName?: string;
  menuClassName?: string;
  itemClassName?: string;
  id?: string;
  menuId?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  testId?: string;
  "data-testid"?: string;
  triggerProps?: Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "children" | "aria-haspopup" | "aria-expanded" | "aria-controls"
  >;
  menuProps?: Omit<
    HTMLAttributes<HTMLDivElement>,
    "children" | "role" | "id" | "aria-label" | "aria-labelledby"
  >;
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
}

export interface BaseMenuProps extends MenuProps {
  classMap: Record<string, string>;
}
