import { ShadowType, SizeType } from "@/types/types";

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
  /** Optional visible label above the color group. */
  label?: string;

  /** Array of color options to choose from. */
  colors: ColorOption[];

  /** Currently selected color value. */
  selected: string;

  /** Callback triggered when a color is selected. */
  onChange: (color: string) => void;

  /** Optional name attribute for the radio group. */
  name?: string;

  /** Whether the entire picker is disabled. */
  disabled?: boolean;

  /**
   * Size of the swatches
   * ('xs' | 'small' | 'medium' | 'large' | 'xl').
   */
  size?: SizeType;

  /**
   * Shape of the swatches
   * ('square' | 'round' | 'pill').
   */
  shape?: ShapeType;

  /**
   * Applies a shadow effect to the swatches
   * ('none' | 'light' | 'medium' | 'strong' | 'intense').
   */
  shadow?: ShadowType;

  /** If true, allows picking a custom color via a color input. */
  allowCustom?: boolean;

  /** Marks the group as required. */
  required?: boolean;

  /** Marks the group as invalid. */
  invalid?: boolean;

  /** Optional helper text shown below or associated with the picker. */
  helperText?: string;

  /** Optional error message shown when invalid. */
  errorText?: string;

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
   */
  customInputAriaLabel?: string;

  /**
   * Hide the visible legend visually while preserving it for screen readers.
   */
  hideLabel?: boolean;

  /** Custom class name for the component container. */
  className?: string;

  /** Optional test ID for testing frameworks. */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;
}

export interface ColorPickerBaseProps extends ColorPickerProps {
  classMap: Record<string, string>;
}
