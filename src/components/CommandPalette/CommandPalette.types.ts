import { RoundingType, ShadowType, StateType, ThemeType } from "@/types/types";
import type { AriaAttributes, HTMLAttributes, ReactNode } from "react";

/**
 * Represents an individual command in the command palette.
 */
export interface CommandItem {
  /** Unique identifier for the command. Useful for accessibility and selection state. */
  id?: string;

  /** Display label for the command. */
  label: string;

  /** Function to call when the command is selected. */
  action: () => void;

  /** Optional icon to display alongside the command label. */
  icon?: ReactNode;

  /** Optional accessible label override for the command item. */
  "aria-label"?: string;

  /** Optional accessible description for the command item. */
  "aria-description"?: string;

  /** Whether the command is disabled. */
  disabled?: boolean;

  /** Optional keywords to improve search/filtering. */
  keywords?: string[];
}

/**
 * Props for the CommandPalette component.
 */
export interface CommandPaletteProps
  extends
    Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "children">,
    Pick<
      AriaAttributes,
      | "aria-label"
      | "aria-labelledby"
      | "aria-describedby"
      | "aria-controls"
      | "aria-expanded"
      | "aria-activedescendant"
    > {
  /** Array of available command options. */
  commands: CommandItem[];

  /**
   * Optional placeholder for the input field.
   *
   * @default "Search..."
   */
  placeholder?: string;

  /** Custom classname for the command palette. */
  className?: string;

  /**
   * Theme style for the palette
   * ('primary' | 'secondary' | 'tertiary' | 'quaternary' | 'clear').
   *
   * @default configured default theme (fallback: "primary")
   */
  theme?: ThemeType;

  /**
   * If true, applies a translucent glass surface using the selected theme/state.
   * Defaults to `false`.
   *
   * @default configured default glass setting (fallback: false)
   */
  glass?: boolean;

  /**
   * Rounding style for the palette
   * ('none' | 'small' | 'medium' | 'large' | 'full').
   *
   * @default configured default rounding (fallback: "medium")
   */
  rounding?: RoundingType;

  /**
   * Shadow style for the palette
   * ('none' | 'light' | 'medium' | 'strong' | 'intense').
   *
   * @default configured default shadow (fallback: "light")
   */
  shadow?: ShadowType;

  /**
   * The state of the command palette
   * ('success' | 'error' | 'warning' | 'disabled' | '').
   */
  state?: StateType;

  /** Whether the command palette is currently open. */
  isOpen: boolean;

  /** Callback to close the command palette. */
  onClose: () => void;

  /** Callback to handle the search input asynchronously. */
  asyncSearch?: (query: string) => Promise<CommandItem[]>;

  /**
   * Optional debounce time (in ms) for the search input.
   *
   * @default 300
   */
  debounceMs?: number;

  /** Accessible label for the search input. */
  inputAriaLabel?: string;

  /** Accessible label reference for the search input. */
  inputAriaLabelledBy?: string;

  /** Accessible description reference for the search input. */
  inputAriaDescribedBy?: string;

  /** Optional visible or screen-reader-only label for the input. */
  inputLabel?: string;

  /** Optional ID for the input element. */
  inputId?: string;

  /** Optional ID for the listbox element. */
  listboxId?: string;

  /** Optional ID for the palette container/dialog. */
  paletteId?: string;

  /**
   * Accessible label for the command results list.
   *
   * @default "Command suggestions"
   */
  listAriaLabel?: string;

  /**
   * Message announced when there are no matching commands.
   *
   * @default "No matching results"
   */
  emptyMessage?: string;

  /**
   * Accessible live region message prefix for result count updates.
   *
   * @default "results available"
   */
  resultsAnnouncement?: string;

  /**
   * Whether the palette should behave like a modal dialog for assistive tech.
   *
   * @default true
   */
  modal?: boolean;

  /**
   * Whether focus should be trapped while the palette is open.
   *
   * @default false
   */
  trapFocus?: boolean;

  /**
   * Whether focus should return to the trigger element on close.
   *
   * @default true
   */
  restoreFocusOnClose?: boolean;

  /**
   * Optional test ID for testing frameworks.
   *
   * @default dataTestId ?? "command-palette"
   */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;
}

export interface CommandPaletteBaseProps extends CommandPaletteProps {
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;
  /**
   * Component implementation used to render the text input portion.
   */
  TextInputComponent: React.ElementType;
}
