import { ReactNode } from "react";
import { RoundingType, ShadowType, StateType, ThemeType } from "@/types/types";

export type AlertVariant = "solid" | "soft";

export interface AlertProps {
  children?: ReactNode;
  title?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
  theme?: ThemeType;
  state?: StateType;
  variant?: AlertVariant;
  glass?: boolean;
  outline?: boolean;
  rounding?: RoundingType;
  shadow?: ShadowType;
  dismissible?: boolean;
  onDismiss?: () => void;
  role?: "status" | "alert" | "note";
  className?: string;
  iconClassName?: string;
  contentClassName?: string;
  titleClassName?: string;
  messageClassName?: string;
  actionsClassName?: string;
  dismissButtonClassName?: string;
  dismissLabel?: string;
  testId?: string;
  "data-testid"?: string;
}

export interface AlertBaseProps extends AlertProps {
  classMap: Record<string, string>;
}
