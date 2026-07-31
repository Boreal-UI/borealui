import {
  RoundingType,
  ShadowType,
  SizeType,
  StateType,
  ThemeType,
} from "@/types/types";
import { IconButtonProps } from "../IconButton/IconButton.types";
import { TextInputProps } from "../TextInput/TextInput.types";

/**
 * Props for the TagInput component.
 */
export interface TagInputProps {
  /**
   * Array of current tags.
   *
   * @default EMPTY_TAGS
   */
  tags?: string[];

  /**
   * Accessible label for the overall tag input group.
   * Used when no external aria-labelledby is provided.
   * Defaults to "Tag Input".
   *
   * @default "Tag Input"
   */
  "aria-label"?: string;

  /**
   * References the ID of an external element that labels the tag input group.
   * Takes precedence over "aria-label" when provided.
   */
  "aria-labelledby"?: string;

  /**
   * References the ID of an external element that describes the tag input group.
   * Merged with the internal accessibility description/status when provided.
   */
  "aria-describedby"?: string;

  /**
   * Optional screen reader description for the input behavior.
   * This is announced through an internally rendered description element.
   *
   * @default "Type a tag and press Enter or comma to add. Use arrow keys to navigate suggestions; Enter to select; Escape to close. Backspace removes the last tag when the field is empty."
   */
  "aria-description"?: string;

  /**
   * Optional accessible label for the text input itself.
   * Defaults to "Add new tag".
   *
   * @default "Add new tag"
   */
  inputAriaLabel?: string;

  /**
   * References the ID of an external element that labels the text input.
   * Takes precedence over inputAriaLabel when provided.
   */
  inputAriaLabelledBy?: string;

  /**
   * References the ID of an external element that describes the text input.
   * Merged with the internal description/status when provided.
   */
  inputAriaDescribedBy?: string;

  /**
   * Accessible label for the suggestions listbox.
   * Defaults to "Tag suggestions".
   *
   * @default "Tag suggestions"
   */
  suggestionsAriaLabel?: string;

  /**
   * Accessible label prefix for remove-tag buttons.
   * Example output: "Remove tag React".
   * Defaults to "Remove tag".
   *
   * @default "Remove tag"
   */
  removeTagButtonLabel?: string;

  /**
   * Callback fired when tags change.
   * Receives the new array of tags.
   */
  onChange?: (tags: string[]) => void;

  /**
   * Optional function to fetch autocomplete suggestions based on input query.
   * Should return a promise resolving to a string array.
   */
  fetchSuggestions?: (query: string) => Promise<string[]>;

  /**
   * Debounce time (ms) for suggestions/autocomplete fetches.
   *
   * @default 300
   */
  debounceMs?: number;

  /**
   * Placeholder text displayed in the input when empty.
   *
   * @default "Add a tag..."
   */
  placeholder?: string;

  /**
   * Theme for styling the input and tags.
   * One of: "primary" | "secondary" | "tertiary" | "quaternary" | "clear"
   *
   * @default configured default theme (fallback: "primary")
   */
  theme?: ThemeType;
  /**
   * Surface treatment; glassOutline combines glass and outline.
   *
   * @default configured default variant (fallback: "solid")
   */
  variant?: import("@/types/types").VariantType;
  /**
   * State of the input (for feedback/validation).
   * One of: "success" | "error" | "warning" | "disabled" | ""
   *
   */
  state?: StateType;

  /**
   * Size of the input and tags.
   * One of: "xs" | "small" | "medium" | "large" | "xl"
   *
   * @default configured default size (fallback: "medium")
   */
  size?: SizeType;

  /**
   * Rounding style for the input and tags.
   * One of: "none" | "small" | "medium" | "large" | "full"
   *
   * @default configured default rounding (fallback: "medium")
   */
  rounding?: RoundingType;

  /**
   * Shadow style for the input and tags.
   * One of: "none" | "light" | "medium" | "strong" | "intense"
   *
   * @default configured default shadow (fallback: "light")
   */
  shadow?: ShadowType;

  /**
   * Custom ID base for stable accessibility relationships.
   * Can be used to generate predictable ids for label, description,
   * listbox, input, and status elements.
   */
  idBase?: string;

  /**
   * Optional test ID for testing frameworks.
   *
   * @default dataTestId ?? "tag-input"
   */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;
  invalid?: boolean;
  helperText?: import("react").ReactNode;
  errorMessage?: import("react").ReactNode;
}

export type TagInputBaseProps = TagInputProps & {
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;
  /**
   * Icon Button component dependency injected by the wrapper.
   */
  IconButton: React.FC<IconButtonProps>;
  /**
   * Text Input component dependency injected by the wrapper.
   */
  TextInput: React.FC<TextInputProps>;
};
