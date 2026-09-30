import { useEffect } from "react";
import { useAnimationFrameCallback } from "./useAnimationFrameCallback";

type UseFloatingPanelSyncOptions = {
  open: boolean;
  updatePosition: () => void;
  shouldUpdate?: (event: Event) => boolean;
};

/**
 * Synchronizes an open floating panel with captured viewport scroll and resize
 * events while coalescing repeated updates into one animation frame.
 */
export const useFloatingPanelSync = ({
  open,
  updatePosition,
  shouldUpdate,
}: UseFloatingPanelSyncOptions) => {
  const scheduleUpdate = useAnimationFrameCallback(updatePosition);

  useEffect(() => {
    if (!open || typeof window === "undefined") return;

    const handleViewportChange = (event: Event) => {
      if (shouldUpdate && !shouldUpdate(event)) return;
      scheduleUpdate();
    };

    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);

    return () => {
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [open, scheduleUpdate, shouldUpdate]);
};
