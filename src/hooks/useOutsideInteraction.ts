import { RefObject, useEffect, useRef } from "react";

export type OutsideInteractionRef = RefObject<Element | null>;

type UseOutsideInteractionOptions = {
  active: boolean;
  insideRefs: readonly OutsideInteractionRef[];
  onOutsideInteraction: (event: MouseEvent) => void;
};

export const isEventInsideElements = (
  event: Event,
  elements: Iterable<Element | null>,
) => {
  const target = event.target;
  if (!(target instanceof Node)) return false;

  for (const element of elements) {
    if (element?.contains(target)) return true;
  }

  return false;
};

/**
 * Reports bubble-phase document mousedown events outside the supplied elements.
 * State changes, focus restoration, Escape handling, and nested-surface policy
 * remain the responsibility of the consuming component.
 */
export const useOutsideInteraction = ({
  active,
  insideRefs,
  onOutsideInteraction,
}: UseOutsideInteractionOptions) => {
  const insideRefsRef = useRef(insideRefs);
  const onOutsideInteractionRef = useRef(onOutsideInteraction);

  insideRefsRef.current = insideRefs;
  onOutsideInteractionRef.current = onOutsideInteraction;

  useEffect(() => {
    if (!active || typeof document === "undefined") return;

    const handleMouseDown = (event: MouseEvent) => {
      const elements = insideRefsRef.current.map((ref) => ref.current);
      if (isEventInsideElements(event, elements)) return;

      onOutsideInteractionRef.current(event);
    };

    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [active]);
};
