import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultRounding,
  getDefaultShadow,
} from "../../config/boreal-style-config";
import {
  Toast,
  ToastContextValue,
  ToastInput,
  ToastProviderBaseProps,
} from "./ToastProvider.types";

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider.");
  }
  return context;
};

const createToastId = () =>
  `toast-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

export default function ToastProviderBase({
  children,
  placement = "topRight",
  defaultDuration = 5000,
  rounding = getDefaultRounding(),
  shadow = getDefaultShadow(),
  className,
  toastClassName,
  testId,
  "data-testid": dataTestId,
  classMap,
}: ToastProviderBaseProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const resolvedTestId = testId ?? dataTestId ?? "toast-provider";

  const removeToast = useCallback((id: string) => {
    setToasts((items) => items.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (toast: ToastInput) => {
      const id = toast.id ?? createToastId();
      const nextToast = { ...toast, id };
      setToasts((items) => [...items, nextToast]);

      const duration = toast.duration ?? defaultDuration;
      if (duration > 0) {
        window.setTimeout(() => removeToast(id), duration);
      }

      return id;
    },
    [defaultDuration, removeToast],
  );

  const clearToasts = useCallback(() => setToasts([]), []);

  const value = useMemo(
    () => ({ toasts, addToast, removeToast, clearToasts }),
    [toasts, addToast, removeToast, clearToasts],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className={combineClassNames(
          classMap.viewport,
          classMap[placement],
          className,
        )}
        role="region"
        aria-label="Notifications"
        data-testid={resolvedTestId}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={combineClassNames(
              classMap.toast,
              toast.state && classMap[toast.state],
              shadow && classMap[`shadow${capitalize(shadow)}`],
              rounding && classMap[`round${capitalize(rounding)}`],
              toastClassName,
            )}
            role={toast.state === "error" ? "alert" : "status"}
            data-testid={`${resolvedTestId}-toast-${toast.id}`}
          >
            <div className={classMap.content}>
              {toast.title ? (
                <div className={classMap.title}>{toast.title}</div>
              ) : null}
              <div className={classMap.message}>{toast.message}</div>
            </div>
            <button
              type="button"
              className={classMap.dismissButton}
              aria-label="Dismiss notification"
              onClick={() => removeToast(toast.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
