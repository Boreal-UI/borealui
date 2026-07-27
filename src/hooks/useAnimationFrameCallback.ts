import { useCallback, useEffect, useRef } from "react";

export const useAnimationFrameCallback = <Args extends unknown[]>(
  callback: (...args: Args) => void,
) => {
  const callbackRef = useRef(callback);
  const frameRef = useRef<number | null>(null);
  const pendingArgsRef = useRef<Args | null>(null);

  callbackRef.current = callback;

  const schedule = useCallback((...args: Args) => {
    pendingArgsRef.current = args;
    if (frameRef.current !== null) return;

    if (typeof window === "undefined" || !window.requestAnimationFrame) {
      callbackRef.current(...args);
      return;
    }

    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;
      const pendingArgs = pendingArgsRef.current;
      pendingArgsRef.current = null;
      if (pendingArgs) callbackRef.current(...pendingArgs);
    });
  }, []);

  useEffect(
    () => () => {
      if (frameRef.current !== null && typeof window !== "undefined") {
        window.cancelAnimationFrame(frameRef.current);
      }
    },
    [],
  );

  return schedule;
};
