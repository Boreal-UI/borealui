import type {
  AnchorHTMLAttributes,
  AriaRole,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
} from "react";
import {
  BorderType,
  IconComponent,
  OrientationType,
  ShadowType,
  SizeType,
  StateType,
  ThemeType,
} from "../../types/types";

export interface StaticCardImage {
  /**
   * Static image source path.
   */
  src: string;
  /**
   * Intrinsic image width.
   */
  width?: number;
  /**
   * Intrinsic image height.
   */
  height?: number;
  /**
   * Optional blurred placeholder data URL.
   */
  blurDataURL?: string;
}

export type CardImageSource = string | StaticCardImage;

export type HtmlImgLikeProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  /**
   * Image or media source.
   */
  src: string;
  /**
   * Alternative text for the image.
   */
  alt: string;
};

export type NextLikeImageProps = {
  /**
   * Image or media source.
   */
  src: string;
  /**
   * Alternative text for the image.
   */
  alt: string;
  /**
   * Class Name.
   */
  className?: string;
  /**
   * Whether the image should fill its container.
   */
  fill?: boolean;
  /**
   * Responsive image sizes attribute.
   */
  sizes?: string;
  /**
   * Whether the image should be loaded with priority.
   */
  priority?: boolean;
};

export type CardImageComponentProps = {
  /**
   * Image or media source.
   */
  src: string;
  /**
   * Alternative text for the image.
   */
  alt: string;
  /**
   * Additional CSS class names for the component root.
   */
  className?: string;
  /**
   * Rendered width for the element.
   */
  width?: number;
  /**
   * Rendered height for the element.
   */
  height?: number;
  /**
   * Whether the image should fill its container.
   */
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
  icon?: IconComponent;

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
  rounding?: import("@/types/types").RoundableRoundingType;

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
   */
  state?: StateType;

  /**
   * Optional rounding style for the card
   * ('none' | 'small' | 'medium' | 'large' | 'full').
   *
   * @default configured default rounding (fallback: "medium")
   */
  rounding?: import("@/types/types").RoundableRoundingType;

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
   */
  title?: string;

  /**
   * Optional description displayed in the body.
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
   * Adds inset padding around the image instead of filling its entire block.
   *
   * @default "none"
   */
  imageInset?: SizeType | "none";

  /**
   * Marks the image as decorative and forces empty alt text.
   *
   * @default false
   */
  imageDecorative?: boolean;

  /**
   * Custom class name for the card container.
   */
  className?: string;

  /**
   * Custom class name for the content wrapper.
   */
  contentClassName?: string;

  /**
   * Custom class name for the media/image wrapper.
   */
  mediaClassName?: string;

  /**
   * Custom class name for the image element.
   */
  imageClassName?: string;

  /**
   * Custom class name for the header section.
   */
  headerClassName?: string;

  /**
   * Custom class name for the title element.
   */
  titleClassName?: string;

  /**
   * Custom class name for the icon wrapper.
   */
  iconClassName?: string;

  /**
   * Custom class name for the description text.
   */
  descriptionClassName?: string;

  /**
   * Custom class name for the children wrapper.
   */
  childrenClassName?: string;

  /**
   * Custom class name for the actions wrapper.
   */
  actionsClassName?: string;

  /**
   * Custom class name for each action button.
   */
  actionButtonClassName?: string;

  /**
   * Custom class name for the body section.
   */
  bodyClassName?: string;

  /**
   * Custom class name for the footer section.
   */
  footerClassName?: string;
  /**
   * Surface treatment; glassOutline combines glass and outline.
   *
   * @default configured default variant (fallback: "solid")
   */
  variant?: import("@/types/types").VariantType;
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
  align?: import("@/types/types").AlignmentType;

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
  cardIcon?: IconComponent;

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

  /** Handles pointer activation when the card is interactive. */
  onClick?: MouseEventHandler<HTMLDivElement>;

  /** Handles keyboard input before the card's default activation behavior. */
  onKeyDown?: KeyboardEventHandler<HTMLDivElement>;

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
  /**
   * Button component used to render the action.
   */
  buttonComponent: React.ElementType;
  /**
   * Icon button component used when the action renders icon-only.
   */
  iconButtonComponent: React.ElementType;
};

export interface CardBaseProps extends CardProps {
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;
  /**
   * Component implementation used to render the skeleton portion.
   */
  SkeletonComponent: React.FC<{
    width: string;
    height: string;
    ["data-testid"]?: string;
  }>;
  /**
   * Component implementation used to render the image portion.
   */
  ImageComponent?: React.ComponentType<CardImageComponentProps>;
  /**
   * Action Buttons prop for Card.
   */
  actionButtons: ExtendedActionButton[];
}
