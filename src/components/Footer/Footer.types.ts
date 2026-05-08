import React from "react";
import {
  AttachmentType,
  RoundingType,
  ShadowType,
  ThemeType,
} from "@/types/types";
import { IconButtonProps } from "../IconButton/IconButton.types";
import { ThemeSelectProps } from "../Select/Select.types";

export type FooterLayout = "inline" | "columns";

export interface FooterSection {
  /**
   * Heading displayed above this footer group.
   */
  title: React.ReactNode;

  /**
   * Links displayed in this section.
   */
  links: FooterLink[];

  /**
   * Accessible label for the section nav.
   * Defaults to `${title} links` when title is a string.
   */
  "aria-label"?: string;

  /**
   * Optional custom class name for this section nav.
   */
  className?: string;

  /**
   * Optional custom class name for this section heading.
   */
  titleClassName?: string;

  /**
   * Optional custom class name for this section link list.
   */
  listClassName?: string;

  /**
   * Optional custom class name applied to links in this section.
   */
  linkClassName?: string;

  /**
   * Optional test id suffix.
   */
  testId?: string;
}

/**
 * Represents a navigational link in the footer.
 */
export interface FooterLink {
  /** Text label of the link. */
  label: string;

  /** URL the link navigates to. */
  href: string;

  /**
   * Optional accessible label override.
   * Useful when the visible text is abbreviated or unclear.
   */
  "aria-label"?: string;

  /** Optional tooltip/title text. */
  title?: string;

  /**
   * Marks the link as the current page/location when applicable.
   */
  "aria-current"?: React.AriaAttributes["aria-current"];

  /**
   * Optional relationship metadata.
   */
  rel?: string;

  /**
   * Optional target, such as "_blank".
   */
  target?: React.HTMLAttributeAnchorTarget;

  /**
   * Whether the link should be treated as disabled/non-interactive.
   */
  disabled?: boolean;
}

/**
 * Represents a social media link with an icon and tracking metadata.
 */
export interface SocialLink {
  /**
   * Platform name.
   * Also commonly used as the accessible label.
   */
  title: string;

  /** Icon to display (React component). */
  icon: React.ComponentType<{
    className?: string;
    "aria-hidden"?: boolean;
    focusable?: boolean;
  }>;

  /** URL to open when clicked. */
  href: string;

  /**
   * Optional explicit accessible label.
   * Example: "Visit our GitHub profile".
   */
  "aria-label"?: string;

  /** Optional tooltip/title text. */
  tooltip?: string;

  /**
   * Optional relationship metadata.
   */
  rel?: string;

  /**
   * Optional target, such as "_blank".
   */
  target?: React.HTMLAttributeAnchorTarget;

  /**
   * Whether the link opens in a new tab/window.
   */
  isExternal?: boolean;

  /**
   * Whether this social action should be disabled.
   */
  disabled?: boolean;
}

export type LogoSource =
  | React.ReactNode
  | string
  | { src: string; width?: number; height?: number };

export type LogoImage = { src: string; width?: number; height?: number };

/**
 * Props for the Footer component.
 */
export interface FooterProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "children" | "title"
> {
  /**
   * Theme used for styling.
   * ('primary' | 'secondary' | 'tertiary' | 'quaternary' | 'clear')
   */
  theme?: ThemeType;

  /**
   * Applies a translucent frosted-glass treatment using the active theme palette.
   */
  glass?: boolean;

  /** Optional class name for custom styles. */
  className?: string;

  /**
   * Optional custom class name for the main footer content wrapper.
   */
  contentClassName?: string;

  /**
   * Optional custom class name for the inline layout left area.
   */
  leftClassName?: string;

  /**
   * Optional custom class name for the inline layout links nav.
   */
  linksClassName?: string;

  /**
   * Optional custom class name applied to inline footer links.
   */
  linkClassName?: string;

  /**
   * Optional custom class name for the logo wrapper/image.
   */
  logoClassName?: string;

  /**
   * Optional custom class name for the social links nav.
   */
  socialClassName?: string;

  /**
   * Optional custom class name for the theme selector wrapper.
   */
  themeToggleClassName?: string;

  /**
   * Optional custom class name for the columns layout brand area.
   */
  brandClassName?: string;

  /**
   * Optional custom class name for the brand link/wrapper.
   */
  brandLinkClassName?: string;

  /**
   * Optional custom class name for the brand title.
   */
  brandTitleClassName?: string;

  /**
   * Optional custom class name for the brand description.
   */
  brandDescriptionClassName?: string;

  /**
   * Optional custom class name for the grouped sections wrapper.
   */
  sectionsClassName?: string;

  /**
   * Optional custom class name for section titles in the columns layout.
   */
  sectionTitleClassName?: string;

  /**
   * Optional custom class name for the actions column.
   */
  actionsClassName?: string;

  /**
   * Optional custom class name for action groups, such as the Connect group.
   */
  actionGroupClassName?: string;

  /**
   * Optional custom class name for the bottom bar.
   */
  bottomClassName?: string;

  /**
   * Optional custom class name for the bottom copyright text.
   */
  bottomCopyrightClassName?: string;

  /**
   * Optional custom class name for the bottom-end content.
   */
  bottomEndClassName?: string;

  /**
   * Optional custom class name for copyright when rendered outside the bottom bar.
   */
  copyrightClassName?: string;

  /**
   * Attachment type for how the footer is positioned.
   * ('static' | 'fixed' | 'sticky')
   */
  attachment?: AttachmentType;

  /**
   * Shadow of the component.
   * ('none' | 'light' | 'medium' | 'strong' | 'intense')
   */
  shadow?: ShadowType;

  /**
   * Rounding of the component.
   * ('none' | 'small' | 'medium' | 'large' | 'full')
   */
  rounding?: RoundingType;

  /** Test ID for testing frameworks. */
  /** Optional test ID for testing frameworks. */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;

  /** Optional copyright text. */
  copyright?: string;

  /** Optional logo element (e.g., <img>, <Logo />). */
  logo?: LogoSource;

  /** Array of footer navigation links. */
  links?: FooterLink[];

  /** Array of social links with icons. */
  socialLinks?: SocialLink[];

  /** Whether to show the theme selector dropdown. */
  showThemeSelect?: boolean;

  /**
   * Footer layout style.
   * "inline" keeps the older compact layout.
   * "columns" supports brand, grouped sections, social links, and bottom bar.
   */
  layout?: FooterLayout;

  /**
   * Optional brand title displayed beside or below the logo.
   */
  brandTitle?: React.ReactNode;

  /**
   * Optional brand description text displayed in the brand column.
   */
  brandDescription?: React.ReactNode;

  /**
   * Optional href for the brand/logo area.
   */
  brandHref?: string;

  /**
   * Grouped footer link sections.
   * When omitted, the old `links` prop is still supported.
   */
  sections?: FooterSection[];

  /**
   * Content shown on the right side of the bottom bar.
   * Example: "Secure Environment"
   */
  bottomEnd?: React.ReactNode;

  /**
   * Whether copyright should render in the bottom bar.
   * Useful for column layouts.
   */
  copyrightInBottom?: boolean;

  /**
   * Accessible label for the overall footer landmark.
   * Use when multiple contentinfo landmarks may appear on the page.
   */
  "aria-label"?: string;

  /**
   * Accessible label reference for the overall footer landmark.
   */
  "aria-labelledby"?: string;

  /**
   * Describes the footer landmark via external element IDs.
   */
  "aria-describedby"?: string;

  /**
   * Accessible label for the site links navigation region.
   * Defaults can still be provided in the base component.
   */
  navAriaLabel?: string;

  /**
   * Accessible label for the social links navigation region.
   * Defaults can still be provided in the base component.
   */
  socialNavAriaLabel?: string;

  /**
   * Accessible label for the theme selector region/container.
   */
  themeSelectAriaLabel?: string;

  /**
   * Accessible name for the logo when it is rendered as an image or custom node.
   */
  logoAriaLabel?: string;

  /**
   * If true, the logo is decorative and should be hidden from assistive tech.
   */
  logoDecorative?: boolean;

  /**
   * Optional heading/label ID for the footer content.
   * Can be used with aria-labelledby.
   */
  labelId?: string;
}

export type LinkWrapperProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "children" | "className"
> & {
  href: string;
  className?: string;
  children: React.ReactNode;
};

export type LinkWrapperComponent = React.ComponentType<LinkWrapperProps>;

export type ImageLikeProps = {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  /** Optional test ID for testing frameworks. */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;
  "aria-hidden"?: boolean;
};

export type ImageComponent = React.ComponentType<ImageLikeProps>;

export interface BaseFooterProps extends FooterProps {
  IconButton: React.ComponentType<IconButtonProps>;
  ThemeSelect: React.ComponentType<ThemeSelectProps>;
  ImageComponent?: ImageComponent | "img";
  classMap: Record<string, string>;
  LinkWrapper?: LinkWrapperComponent;
}
