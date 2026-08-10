import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
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

type ToastTimer = {
  timer?: number;
  remaining: number;
  startedAt: number;
};

type ToastDrag = {
  pointerId: number;
  startX: number;
  startedAt: number;
};

const TOAST_EXIT_DURATION = 160;
const TOAST_SWIPE_DISTANCE = 80;
const TOAST_SWIPE_VELOCITY = 0.11;

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
  const [renderedToasts, setRenderedToasts] = useState<Toast[]>([]);
  const [exitingIds, setExitingIds] = useState<Set<string>>(new Set());
  const timersRef = useRef<Map<string, ToastTimer>>(new Map());
  const exitTimersRef = useRef<Map<string, number>>(new Map());
  const dragsRef = useRef<Map<string, ToastDrag>>(new Map());
  const resolvedTestId = testId ?? dataTestId ?? "toast-provider";

  const removeToast = useCallback((id: string) => {
    const timerState = timersRef.current.get(id);
    if (timerState?.timer !== undefined) {
      window.clearTimeout(timerState.timer);
    }
    timersRef.current.delete(id);
    setToasts((items) => items.filter((toast) => toast.id !== id));

    setRenderedToasts((items) => {
      if (!items.some((toast) => toast.id === id)) return items;

      setExitingIds((current) => new Set(current).add(id));
      const existingExitTimer = exitTimersRef.current.get(id);
      if (existingExitTimer !== undefined) {
        window.clearTimeout(existingExitTimer);
      }

      const exitTimer = window.setTimeout(() => {
        exitTimersRef.current.delete(id);
        setRenderedToasts((current) =>
          current.filter((toast) => toast.id !== id),
        );
        setExitingIds((current) => {
          const next = new Set(current);
          next.delete(id);
          return next;
        });
      }, TOAST_EXIT_DURATION);
      exitTimersRef.current.set(id, exitTimer);

      return items;
    });
  }, []);

  const scheduleToast = useCallback(
    (id: string, duration: number) => {
      if (duration <= 0) return;

      const timer = window.setTimeout(() => removeToast(id), duration);
      timersRef.current.set(id, {
        timer,
        remaining: duration,
        startedAt: Date.now(),
      });
    },
    [removeToast],
  );

  const pauseToast = useCallback((id: string) => {
    const timerState = timersRef.current.get(id);
    if (!timerState || timerState.timer === undefined) return;

    window.clearTimeout(timerState.timer);
    timerState.remaining = Math.max(
      0,
      timerState.remaining - (Date.now() - timerState.startedAt),
    );
    timerState.timer = undefined;
  }, []);

  const resumeToast = useCallback(
    (id: string) => {
      const timerState = timersRef.current.get(id);
      if (!timerState || timerState.timer !== undefined) return;

      const remaining = Math.max(1, timerState.remaining);
      timerState.startedAt = Date.now();
      timerState.timer = window.setTimeout(() => removeToast(id), remaining);
    },
    [removeToast],
  );

  const addToast = useCallback(
    (toast: ToastInput) => {
      const id = toast.id ?? createToastId();
      const nextToast = { ...toast, id };
      const existingTimer = timersRef.current.get(id);
      if (existingTimer !== undefined) {
        if (existingTimer.timer !== undefined) {
          window.clearTimeout(existingTimer.timer);
        }
        timersRef.current.delete(id);
      }
      const exitTimer = exitTimersRef.current.get(id);
      if (exitTimer !== undefined) {
        window.clearTimeout(exitTimer);
        exitTimersRef.current.delete(id);
      }
      setExitingIds((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });
      setToasts((items) => [
        ...items.filter((item) => item.id !== id),
        nextToast,
      ]);
      setRenderedToasts((items) => [
        ...items.filter((item) => item.id !== id),
        nextToast,
      ]);

      const duration = toast.duration ?? defaultDuration;
      scheduleToast(id, duration);

      return id;
    },
    [defaultDuration, scheduleToast],
  );

  const clearToasts = useCallback(() => {
    timersRef.current.forEach((timerState) => {
      if (timerState.timer !== undefined) {
        window.clearTimeout(timerState.timer);
      }
    });
    timersRef.current.clear();
    toasts.forEach((toast) => removeToast(toast.id));
  }, [removeToast, toasts]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const ids = Array.from(timersRef.current.keys());
      ids.forEach((id) => {
        if (document.hidden) pauseToast(id);
        else resumeToast(id);
      });
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [pauseToast, resumeToast]);

  useEffect(
    () => () => {
      timersRef.current.forEach((timerState) => {
        if (timerState.timer !== undefined) {
          window.clearTimeout(timerState.timer);
        }
      });
      timersRef.current.clear();
      exitTimersRef.current.forEach((timer) => window.clearTimeout(timer));
      exitTimersRef.current.clear();
    },
    [],
  );

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
        {renderedToasts.map((toast) => {
          const isExiting = exitingIds.has(toast.id);

          const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
            if (
              isExiting ||
              event.pointerType === "mouse" ||
              dragsRef.current.has(toast.id)
            ) {
              return;
            }
            dragsRef.current.set(toast.id, {
              pointerId: event.pointerId,
              startX: event.clientX,
              startedAt: Date.now(),
            });
            event.currentTarget.setPointerCapture(event.pointerId);
            event.currentTarget.style.transition = "none";
            pauseToast(toast.id);
          };

          const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
            const drag = dragsRef.current.get(toast.id);
            if (!drag || drag.pointerId !== event.pointerId) return;
            event.currentTarget.style.transform = `translateX(${event.clientX - drag.startX}px)`;
          };

          const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
            const drag = dragsRef.current.get(toast.id);
            if (!drag || drag.pointerId !== event.pointerId) return;

            dragsRef.current.delete(toast.id);
            const distance = event.clientX - drag.startX;
            const elapsed = Math.max(1, Date.now() - drag.startedAt);
            const velocity = Math.abs(distance) / elapsed;
            const wasCancelled = event.type === "pointercancel";
            event.currentTarget.style.transition = "";
            event.currentTarget.style.transform = "";

            if (
              !wasCancelled &&
              (Math.abs(distance) >= TOAST_SWIPE_DISTANCE ||
                velocity > TOAST_SWIPE_VELOCITY)
            ) {
              removeToast(toast.id);
            } else {
              resumeToast(toast.id);
            }
          };

          return (
          // Swipe dismissal supplements the native dismiss button.
          // eslint-disable-next-line jsx-a11y/no-static-element-interactions
          <div
            key={toast.id}
            className={combineClassNames(
              classMap.toast,
              isExiting && classMap.exiting,
              toast.state && classMap[toast.state],
              shadow && classMap[`shadow${capitalize(shadow)}`],
              rounding && classMap[`round${capitalize(rounding)}`],
              toastClassName,
            )}
            role={toast.state === "error" ? "alert" : "status"}
            aria-hidden={isExiting || undefined}
            data-testid={`${resolvedTestId}-toast-${toast.id}`}
            onMouseEnter={() => pauseToast(toast.id)}
            onMouseLeave={() => resumeToast(toast.id)}
            onFocusCapture={() => pauseToast(toast.id)}
            onBlurCapture={() => resumeToast(toast.id)}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
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
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
