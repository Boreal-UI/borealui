import { ReactNode } from "react";
import { RoundingType, ShadowType, StateType, ThemeType } from "@/types/types";

export type DrawerPlacement = "left" | "right" | "top" | "bottom";

export interface DrawerProps {
  open?: boolean;
  onClose: () => void;
  children?: ReactNode;
  title?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  placement?: DrawerPlacement;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  theme?: ThemeType;
  state?: StateType;
  glass?: boolean;
  rounding?: RoundingType;
  shadow?: ShadowType;
  className?: string;
  overlayClassName?: string;
  panelClassName?: string;
  headerClassName?: string;
  titleClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  closeButtonClassName?: string;
  closeButtonAriaLabel?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  testId?: string;
  "data-testid"?: string;
}

export interface DrawerBaseProps extends DrawerProps {
  classMap: Record<string, string>;
}
