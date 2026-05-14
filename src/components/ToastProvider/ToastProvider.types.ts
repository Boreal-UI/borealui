import { ReactNode } from "react";
import {
  PositionType,
  RoundingType,
  ShadowType,
  StateType,
} from "@/types/types";

export interface Toast {
  /**
   * Unique toast identifier.
   */
  id: string;
  /**
   * Optional toast title.
   */
  title?: ReactNode;
  /**
   * Main toast message content.
   */
  message: ReactNode;
  /**
   * Visual state applied to the toast.
   */
  state?: StateType;
  /**
   * Auto-dismiss duration in milliseconds.
   */
  duration?: number;
}

export interface ToastInput extends Omit<Toast, "id"> {
  /**
   * Optional id to use for the created toast.
   */
  id?: string;
}

export interface ToastContextValue {
  /**
   * Toasts prop for ToastContextValue.
   */
  toasts: Toast[];
  /**
   * Add Toast callback used by the component.
   */
  addToast: (toast: ToastInput) => string;
  /**
   * Remove Toast callback used by the component.
   */
  removeToast: (id: string) => void;
  /**
   * Clear Toasts callback used by the component.
   */
  clearToasts: () => void;
}

export interface ToastProviderProps {
  /**
   * Content rendered inside the component.
   */
  children?: ReactNode;
  /**
   * Placement.
   * @default "topRight"
   */
  placement?: PositionType;
  /**
   * Default Duration.
   * @default 5000
   */
  defaultDuration?: number;
  /**
   * Rounding.
   * @default configured default rounding (fallback: "medium")
   */
  rounding?: RoundingType;
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
   * Additional CSS class names for the toast section.
   */
  toastClassName?: string;
  /**
   * Test id used to identify the component in tests.
   */
  testId?: string;
  /**
   * Test id used to identify the component in tests.
   */
  "data-testid"?: string;
}

export interface ToastProviderBaseProps extends ToastProviderProps {
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;
}
