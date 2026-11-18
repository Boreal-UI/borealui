import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";

/** Run after an uncanceled reset of the control's actual associated form. */
export function useFormReset(
  control: RefObject<HTMLInputElement | HTMLButtonElement | null>,
  restore: () => void,
) {
  const restoreRef = useRef(restore);
  useLayoutEffect(() => { restoreRef.current = restore; });
  useEffect(() => {
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const document = control.current?.ownerDocument;
    const reset = (event: Event) => {
      if (event.target !== control.current?.form) return;
      // A task runs after propagation, cancellation, and the native reset action.
      const timer = setTimeout(() => {
        timers.delete(timer);
        if (!event.defaultPrevented) restoreRef.current();
      }, 0);
      timers.add(timer);
    };
    document?.addEventListener("reset", reset, true);
    return () => {
      timers.forEach(clearTimeout);
      document?.removeEventListener("reset", reset, true);
    };
  }, [control]);
}
