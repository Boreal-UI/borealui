import { PositionType, SizeType } from "@/types/types";
import { ChipProps } from "../Chip.types";

/**
 * Minimal prop surface expected from child components that can be rendered
 * inside a ChipGroup when using children instead of a chips array.
 * @default "topCenter"
 */
export type ClosableChildProps = {
  /**
   * Optional size prop.
   */
  size?: unknown;

  /**
   * Optional placement prop.
   */
  placement?: unknown;

  /**
   * Optional close handler.
   */
  onClose?: (() => void) | undefined;

  /**
   * Optional remove handler.
   */
  onRemove?: (() => void) | undefined;
};

/**
 * Props that ChipGroup may inject into child components when rendering
 * in children mode.
 */
export type InjectedDefaults = {
  /**
   * Default size injected into the child chip if not already defined.
   */
  size?: unknown;

  /**
   * Default placement injected into the child chip if not already defined.
   */
  placement?: unknown;
};

/**
 * Shared base props for the ChipGroup component.
 *
 * These props apply regardless of whether the group is rendered using
 * a chips array or via children
 */
export interface ChipGroupCommon {
  /** Optional callback when a chip is removed. */
  onRemove?: (id: string) => void;
  /**
   * Default placement for chips in the group.
   *
   * @default "topCenter"
   */
  placement?: PositionType;
  /**
   * Default size for chips if not individually specified.
   *
   * @default configured default size (fallback: "medium")
   */
  size?: SizeType;
  /**
   * Optional class name for the chip group container.
   */
  className?: string;

  /**
   * Optional test ID for testing frameworks.
   *
   * @default dataTestId ?? "chip-group"
   */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;
}

export type ChipGroupProps =
  | (ChipGroupCommon & {
      /**
       * Array of chip definitions to render.
       */
      chips: ChipProps[];

      /**
       * Children are not allowed when using `chips`.
       */
      children?: never;
    })
  | (ChipGroupCommon & {
      /**
       * Custom chip elements rendered
       */
      children: React.ReactNode;

      /**
       * Chips array is not allowed when using children.
       */
      chips?: never;
    });

/**
 * Exposed methods via forwarded ref for ChipGroup.
 */
export interface ChipGroupRef {
  /** Closes all chips currently visible in the group. */
  closeAllChips: () => void;
}
