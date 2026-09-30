import { RefObject, useEffect, useRef } from "react";
import { registerModalLayer } from "../utils/modalLayerManager";

interface UseModalLayerOptions {
  active: boolean;
  layerRef: RefObject<HTMLElement | null>;
  focusScopeRef: RefObject<HTMLElement | null>;
  onEscape?: () => void;
  restoreFocus?: boolean;
}

export const useModalLayer = ({
  active,
  layerRef,
  focusScopeRef,
  onEscape,
  restoreFocus = true,
}: UseModalLayerOptions) => {
  const idRef = useRef<symbol>(Symbol("boreal-modal-layer"));
  const optionsRef = useRef({ onEscape, restoreFocus });
  optionsRef.current = { onEscape, restoreFocus };

  useEffect(() => {
    if (!active || typeof document === "undefined") return;

    return registerModalLayer(idRef.current, {
      getLayerElement: () => layerRef.current,
      getFocusScope: () => focusScopeRef.current,
      onEscape: () => optionsRef.current.onEscape?.(),
      restoreFocus: optionsRef.current.restoreFocus,
    });
  }, [active, focusScopeRef, layerRef]);
};

