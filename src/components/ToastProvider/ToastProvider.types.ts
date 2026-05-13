import { ReactNode } from "react";
import {
  PositionType,
  RoundingType,
  ShadowType,
  StateType,
} from "@/types/types";

export interface Toast {
  id: string;
  title?: ReactNode;
  message: ReactNode;
  state?: StateType;
  duration?: number;
}

export interface ToastInput extends Omit<Toast, "id"> {
  id?: string;
}

export interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: ToastInput) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export interface ToastProviderProps {
  children?: ReactNode;
  placement?: PositionType;
  defaultDuration?: number;
  rounding?: RoundingType;
  shadow?: ShadowType;
  className?: string;
  toastClassName?: string;
  testId?: string;
  "data-testid"?: string;
}

export interface ToastProviderBaseProps extends ToastProviderProps {
  classMap: Record<string, string>;
}
