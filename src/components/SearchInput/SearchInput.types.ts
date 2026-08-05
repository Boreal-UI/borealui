import {
  LabelPositionType,
  ShadowType,
  StateType,
  ThemeType,
} from "@/types/types";
import {
  ForwardRefExoticComponent,
  InputHTMLAttributes,
  ReactNode,
  RefAttributes,
} from "react";

type NativeSearchInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "onSubmit" | "size" | "type" | "value" | "defaultValue"
>;

export type SearchInputIconComponent = React.ComponentType<{
  className?: string;
  "aria-hidden"?: boolean;
  focusable?: boolean;
}>;

/**
 * Props for the SearchInput component.
 */
export interface SearchInputProps extends NativeSearchInputProps {
  /**
   * Current search query for controlled usage.
   */
  value?: string;

  /**
   * Initial search query for uncontrolled usage.
   */
  defaultValue?: string;

  /**
   * Callback fired whenever the search query changes.
   */
  onChange?: (
    value: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;

  /**
   * Callback fired when the user submits a search by pressing Enter or
   * activating the optional search button.
   */
  onSearch?: (
    value: string,
    event:
      | React.KeyboardEvent<HTMLInputElement>
      | React.MouseEvent<HTMLButtonElement>,
  ) => void;

  /**
   * Callback fired when the clear button is activated.
   */
  onClear?: (event: React.MouseEvent<HTMLButtonElement>) => void;

  /**
   * Visible label content for the search field.
   */
  label?: ReactNode;

  /**
   * Position of the label relative to the search field.
   *
   * @default "top"
   */
  labelPosition?: LabelPositionType;

  /**
   * Placeholder shown when the search field is empty and no visible label is present.
   *
   * @default "Search"
   */
  placeholder?: string;

  /**
   * Whether to show a clear button when the search query has a value.
   *
   * @default true
   */
  showClearButton?: boolean;

  /**
   * Whether to show a dedicated search submit button.
   *
   * @default false
   */
  showSearchButton?: boolean;

  /**
   * Accessible label for the clear button.
   *
   * @default "Clear search"
   */
  clearAriaLabel?: string;

  /**
   * Accessible label for the optional search button.
   *
   * @default "Search"
   */
  searchAriaLabel?: string;

  /**
   * Whether to show the field as loading or waiting for search results.
   *
   * @default false
   */
  loading?: boolean;
  /**
   * Theme used for styling.
   *
   * @default configured default theme (fallback: "primary")
   */
  theme?: ThemeType;

  /**
   * Visual state for styling.
   */
  state?: StateType;
  /**
   * Surface treatment; glassOutline combines glass and outline.
   *
   * @default configured default variant (fallback: "solid")
   */
  variant?: import("@/types/types").VariantType;
  /**
   * Rounding style for the search input.
   *
   * @default configured default rounding (fallback: "medium")
   */
  rounding?: import("@/types/types").RoundableRoundingType;

  /**
   * Shadow style for the search input.
   *
   * @default configured default shadow (fallback: "light")
   */
  shadow?: ShadowType;

  /**
   * Optional icon component to render inside the search input.
   * Pass null to hide the default search icon.
   *
   * @default SearchIcon
   */
  icon?: SearchInputIconComponent | null;

  /**
   * Position of the icon relative to the input text.
   *
   * @default "left"
   */
  iconPosition?: "left" | "right";

  /**
   * Additional class name for the icon wrapper.
   */
  iconWrapperClassName?: string;

  /**
   * Additional class name for the rendered icon.
   */
  iconClassName?: string;

  /**
   * Additional class name for the component root.
   */
  className?: string;

  /**
   * Additional class name for the outer label/input container.
   */
  containerClassName?: string;

  /**
   * Additional class name for the visible label.
   */
  labelClassName?: string;

  /**
   * Additional class name for the native search input.
   */
  inputClassName?: string;

  /**
   * Additional class name for the clear button.
   */
  clearButtonClassName?: string;

  /**
   * Additional class name for the optional search button.
   */
  searchButtonClassName?: string;

  /**
   * Optional content rendered for assistive technologies only.
   */
  srOnlyText?: ReactNode;

  /**
   * Additional class name for screen-reader-only content.
   */
  srOnlyClassName?: string;

  /**
   * Optional test ID for testing frameworks.
   *
   * @default dataTestId ?? "search-input"
   */
  testId?: string;

  /**
   * Backward-compatible alias for test ID attributes.
   */
  "data-testid"?: string;
  invalid?: boolean;
  helperText?: import("react").ReactNode;
  errorMessage?: import("react").ReactNode;
  size?: import("@/types/types").SizeType;
  autoComplete?: string;
}

export interface SearchInputBaseProps extends SearchInputProps {
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;
}

export type SearchInputComponent = ForwardRefExoticComponent<
  SearchInputProps & RefAttributes<HTMLInputElement>
>;
