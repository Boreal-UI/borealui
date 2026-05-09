import { IconType } from "react-icons";
import type { AnchorHTMLAttributes, AriaRole, ReactNode } from "react";
import {
  OrientationType,
  RoundingType,
  ShadowType,
  SizeType,
  StateType,
  ThemeType,
  BorderType,
} from "../../types/types";

export interface StaticCardImage {
  src: string;
  width?: number;
  height?: number;
  blurDataURL?: string;
}

export type CardImageSource = string | StaticCardImage;

export type HtmlImgLikeProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
};

export type NextLikeImageProps = {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
};

export type CardImageComponentProps = {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
};

/**
 * Defines an action button rendered in the card footer.
 */
export interface ActionButton {
  /** Label for the button (used as visible text or accessible name fallback). */
  label: string;

  /** Function to call on button click. */
  onClick: () => void;

  /** Optional icon for the button (used with `useIconButtons`). */
  icon?: IconType;

  /**
   * Optional theme override for the button.
   * ('primary' | 'secondary' | 'tertiary' | 'quaternary' | 'clear').
   */
  theme?: ThemeType;

  /**
   * State of the action button.
   * ('success' | 'error' | 'warning' | 'disabled' | '').
   */
  state?: StateType;

  /** Optional URL to render the button as a link. */
  href?: string;

  /** Optional target attribute when the action renders as a link. */
  target?: AnchorHTMLAttributes<HTMLAnchorElement>["target"];

  /** Optional rel attribute when the action renders as a link. */
  rel?: AnchorHTMLAttributes<HTMLAnchorElement>["rel"];

  /**
   * Size for action buttons.
   * ('xs' | 'small' | 'medium' | 'large' | 'xl').
   */
  size?: SizeType;

  /** Optional loading state for the button. */
  loading?: boolean;

  /**
   * Rounding style for action button.
   * ('none' | 'small' | 'medium' | 'large' | 'full').
   */
  rounding?: RoundingType;

  /**
   * Shadow style for the button.
   * ('none' | 'light' | 'medium' | 'strong' | 'intense').
   */
  shadow?: ShadowType;

  /** Accessible label for screen readers. */
  "aria-label"?: string;

  /** Accessible description reference for the action. */
  "aria-describedby"?: string;

  /** Accessible label reference for the action. */
  "aria-labelledby"?: string;

  /** Marks the action as pressed for toggle-style actions. */
  "aria-pressed"?: boolean;

  /** Marks the action as expanded when it controls expandable content. */
  "aria-expanded"?: boolean;

  /** Identifies the controlled element for expandable/menu actions. */
  "aria-controls"?: string;

  /** Marks the action as current when appropriate. */
  "aria-current"?: boolean | "page" | "step" | "location" | "date" | "time";

  /** Optional role override for custom action semantics. */
  role?: AriaRole;

  /** Optional title for tooltip/browser hover text. */
  title?: string;

  /** Whether the action should be disabled semantically. */
  disabled?: boolean;
}

/**
 * Props for the customizable Card component.
 */
export interface CardProps {
  /**
   * Theme style to apply to the card
   * ('primary' | 'secondary' | 'tertiary' | 'quaternary' | 'clear').
   *
   * @default configured default theme (fallback: "primary")
   */
  theme?: ThemeType;

  /**
   * State of the card
   * ('success' | 'error' | 'warning' | 'disabled' | '').
   *
   * @default ""
   */
  state?: StateType;

  /**
   * Optional rounding style for the card
   * ('none' | 'small' | 'medium' | 'large' | 'full').
   *
   * @default configured default rounding (fallback: "medium")
   */
  rounding?: RoundingType;

  /**
   * Optional shadow style for the card
   * ('none' | 'light' | 'medium' | 'strong' | 'intense').
   *
   * @default configured default shadow (fallback: "light")
   */
  shadow?: ShadowType;

  /**
   * Optional border width for the card
   * ('none' | 'xs' | 'small' | 'medium' | 'large' | 'xl').
   *
   * @default configured default border width (fallback: "none")
   */
  border?: BorderType;

  /**
   * Optional card title displayed in the header.
   *
   * @default ""
   */
  title?: string;

  /**
   * Optional description displayed in the body.
   *
   * @default ""
   */
  description?: string;

  /**
   * Image URL or static asset used as the card's visual.
   * Can be a string or an object with { src, width, height }.
   */
  imageUrl?: CardImageSource;

  /** Image alt text. Use empty string for decorative images. */
  imageAlt?: string;

  /** Explicit width for the image (forwarded to next/image or <img>) */
  imageWidth?: number;

  /** Explicit height for the image (forwarded to next/image or <img>) */
  imageHeight?: number;

  /** Use fill layout for the image (next/image: fill; core: ratio-box render) */
  imageFill?: boolean;

  /**
   * Marks the image as decorative and forces empty alt text.
   *
   * @default false
   */
  imageDecorative?: boolean;

  /**
   * Custom class name for the card container.
   *
   * @default ""
   */
  className?: string;

  /**
   * Custom class name for the content wrapper.
   *
   * @default ""
   */
  contentClassName?: string;

  /**
   * Custom class name for the media/image wrapper.
   *
   * @default ""
   */
  mediaClassName?: string;

  /**
   * Custom class name for the image element.
   *
   * @default ""
   */
  imageClassName?: string;

  /**
   * Custom class name for the header section.
   *
   * @default ""
   */
  headerClassName?: string;

  /**
   * Custom class name for the title element.
   *
   * @default ""
   */
  titleClassName?: string;

  /**
   * Custom class name for the icon wrapper.
   *
   * @default ""
   */
  iconClassName?: string;

  /**
   * Custom class name for the description text.
   *
   * @default ""
   */
  descriptionClassName?: string;

  /**
   * Custom class name for the children wrapper.
   *
   * @default ""
   */
  childrenClassName?: string;

  /**
   * Custom class name for the actions wrapper.
   *
   * @default ""
   */
  actionsClassName?: string;

  /**
   * Custom class name for each action button.
   *
   * @default ""
   */
  actionButtonClassName?: string;

  /**
   * Custom class name for the body section.
   *
   * @default ""
   */
  bodyClassName?: string;

  /**
   * Custom class name for the footer section.
   *
   * @default ""
   */
  footerClassName?: string;

  /**
   * Outlines card instead of solid fill.
   *
   * @default configured default outline setting (fallback: false)
   */
  outline?: boolean;

  /**
   * Applies a translucent glass style to the card.
   *
   * @default configured default glass setting (fallback: false)
   */
  glass?: boolean;

  /**
   * Card size
   * ('xs' | 'small' | 'medium' | 'large' | 'xl').
   *
   * @default configured default size (fallback: "medium")
   */
  size?: SizeType;

  /**
   * Alignment of card content
   * ('left' | 'right' | 'center').
   *
   * @default "center"
   */
  align?: "left" | "right" | "center";

  /** Custom render function for the header section. */
  renderHeader?: () => ReactNode;

  /** Custom render function for the body/content section. */
  renderContent?: () => ReactNode;

  /** Custom render function for the footer section. */
  renderFooter?: () => ReactNode;

  /**
   * List of action buttons to render in the footer.
   *
   * @default []
   */
  actionButtons?: ActionButton[];

  /**
   * Whether to render action buttons as icon buttons.
   *
   * @default false
   */
  useIconButtons?: boolean;

  /**
   * Layout orientation of the card
   * ('horizontal' | 'vertical').
   *
   * @default "vertical"
   */
  layout?: OrientationType;

  /** Optional icon to display beside the title. */
  cardIcon?: IconType;

  /** Optional custom children passed into the body. */
  children?: ReactNode;

  /**
   * Whether the card is in a loading state (shows skeleton).
   *
   * @default false
   */
  loading?: boolean;

  /**
   * Optional test ID for testing frameworks.
   *
   * @default dataTestId ?? "card"
   */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;

  /** Optional id for the card root. */
  id?: string;

  /** Optional role override. Defaults to region when labeled. */
  role?: AriaRole;

  /** Optional tabindex for keyboard navigation scenarios. */
  tabIndex?: number;

  /** Optional ARIA label reference ID for accessibility. */
  "aria-labelledby"?: string;

  /** Optional ARIA description reference ID. */
  "aria-describedby"?: string;

  /** Optional ARIA label for the card. */
  "aria-label"?: string;

  /** Optional override for the generated header id. */
  headerId?: string;

  /** Optional override for the generated description id. */
  descriptionId?: string;

  /**
   * Marks the card as selectable.
   *
   * @default false
   */
  selectable?: boolean;

  /**
   * Indicates selected state for selectable cards.
   *
   * @default false
   */
  selected?: boolean;

  /**
   * Indicates disabled state for the card.
   *
   * @default false
   */
  disabled?: boolean;

  /** Indicates expanded state if the card controls collapsible content. */
  "aria-expanded"?: boolean;

  /** Indicates the controlled element id if the card acts as a controller. */
  "aria-controls"?: string;

  /** Indicates current item state when the card is used in navigation-like UIs. */
  "aria-current"?: boolean | "page" | "step" | "location" | "date" | "time";

  /** Live-region politeness, usually only useful for dynamic card content. */
  "aria-live"?: "off" | "polite" | "assertive";

  /** Marks the card as atomic for live region updates. */
  "aria-atomic"?: boolean;
}

export type ExtendedActionButton = ActionButton & {
  buttonComponent: React.ElementType;
  iconButtonComponent: React.ElementType;
};

export interface CardBaseProps extends CardProps {
  classMap: Record<string, string>;
  SkeletonComponent: React.FC<{
    width: string;
    height: string;
    ["data-testid"]?: string;
  }>;
  ImageComponent?: React.ComponentType<CardImageComponentProps>;
  actionButtons: ExtendedActionButton[];
}
