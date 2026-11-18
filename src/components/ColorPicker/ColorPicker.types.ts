import { ShadowType } from "@/types/types";

/**
 * Represents a color option available for selection.
 */
export interface ColorOption {
  /** Label to display as a tooltip or for screen readers. */
  label: string;

  /** Color value (e.g., `#ff0000`, `rgb(255,0,0)`, `red`). */
  value: string;

  /** Whether this specific option is disabled. */
  disabled?: boolean;
}

/**
 * Shape of the swatch:
 * - 'square'
 * - 'round'
 * - 'pill'
 */
export type ShapeType = "square" | "round" | "pill";

/**
 * Props for the ColorPicker component.
 */
export interface ColorPickerProps {
  /**
   * Optional visible label above the color group.
   *
   * @default "Choose a color"
   */
  label?: string;

  /** Array of color options to choose from. */
  colors: ColorOption[];

  /** Current controlled selection. Do not combine with defaultValue. */
  value?: string;

  /** Initial uncontrolled selection. Native form reset restores this value. */
  defaultValue?: string;

  /** Callback triggered when a color is value. */
  onValueChange?: (color: string) => void;

  /**
   * Native radio group and FormData key. Omit for an instance-specific,
   * SSR-safe name. Supply a stable name for a predictable submission key;
   * identical explicit names in the same form owner share one native group.
   *
   * @default generated per instance
   */
  name?: string;

  /**
   * Whether the entire picker is disabled.
   *
   * @default false
   */
  disabled?: boolean;
  /**
   * Shape of the swatches
   * ('square' | 'round' | 'pill').
   *
   * @default "round"
   */
  shape?: ShapeType;

  /**
   * Applies a shadow effect to the swatches
   * ('none' | 'light' | 'medium' | 'strong' | 'intense').
   *
   * @default configured default shadow (fallback: "light")
   */
  shadow?: ShadowType;

  /**
   * Adds a custom radio selection and native color input. Custom selections use
   * six-digit hexadecimal colors and submit through the same native radio group
   * as presets, so required validation and FormData have one current value.
   *
   * @default false
   */
  allowCustom?: boolean;

  /**
   * Marks the group as required.
   *
   * @default false
   */
  required?: boolean;

  /**
   * Marks the group as invalid.
   *
   * @default false
   */
  invalid?: boolean;

  /** Optional helper text shown below or associated with the picker. */
  helperText?: string;

  /** Optional error message shown when invalid. */
  errorMessage?: string;

  /**
   * Accessible name for the group when no visible label should be used
   * or when a more descriptive label is needed.
   */
  "aria-label"?: string;

  /**
   * References an external element that labels the group.
   * Prefer this when the visible label exists outside the component.
   */
  "aria-labelledby"?: string;

  /**
   * References one or more elements that describe the group.
   * This will be merged with helperText / errorText IDs when provided.
   */
  "aria-describedby"?: string;

  /**
   * Optional label for the custom color input.
   *
   * @default "Custom color picker"
   */
  customInputAriaLabel?: string;

  /** Accessible label for the custom selection radio. @default "Custom color" */
  customOptionLabel?: string;

  /**
   * Hide the visible legend visually while preserving it for screen readers.
   *
   * @default false
   */
  hideLabel?: boolean;

  /**
   * Custom class name for the component container.
   */
  className?: string;

  /**
   * Optional test ID for testing frameworks.
   *
   * @default dataTestId ?? "color-picker"
   */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;
  size?: import("@/types/types").SizeType;
}

export interface ColorPickerBaseProps extends ColorPickerProps {
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;
}
