import { RoundingType, ShadowType } from "@/types/types";
import { ReactElement, ReactNode } from "react";
import { IconButtonProps } from "../IconButton/IconButton.types";

/**
 * Props for the Modal component.
 */
export interface ModalProps {
  /**
   * Additional class names for custom styling the modal content.
   *
   */
  className?: string;

  /** Additional class names for the modal overlay/backdrop. */
  overlayClassName?: string;

  /** Additional class names for the modal header section. */
  headerClassName?: string;

  /** Additional class names for the modal header content wrapper. */
  headerContentClassName?: string;

  /** Additional class names for the modal title element. */
  titleClassName?: string;

  /** Additional class names for the modal close button. */
  closeButtonClassName?: string;

  /** Additional class names for the modal body section. */
  bodyClassName?: string;

  /** Additional class names for the modal footer section. */
  footerClassName?: string;

  /** The content to be rendered inside the modal. Expected to be a single React element. */
  children?: ReactElement;

  /**
   * Optional modal title used for accessible labelling and default header content.
   *
   * @default "Modal Dialog"
   */
  title?: ReactNode;

  /** Optional custom header content. */
  header?: ReactNode;

  /** Optional footer content. */
  footer?: ReactNode;

  /**
   * Rounding of the modal corners.
   * One of: "none" | "small" | "medium" | "large" | "full"
   *
   * @default configured default rounding (fallback: "medium")
   */
  rounding?: RoundingType;

  /**
   * Shadow of the modal.
   * One of: "none" | "light" | "medium" | "strong" | "intense"
   *
   * @default configured default shadow (fallback: "light")
   */
  shadow?: ShadowType;

  /**
   * Controls whether the modal is open.
   * - If omitted, the modal is considered open when rendered.
   * - If provided, the modal opens/closes based on this value.
   */
  open?: boolean;

  /** Callback function fired when the modal is closed. */
  onClose: () => void;

  /**
   * Accessible label for the modal dialog.
   * Use this when the modal does not have a visible title or when you want
   * to provide a custom accessible name for screen readers.
   */
  "aria-label"?: string;

  /**
   * The id of an element that labels the modal dialog.
   * Prefer this when a visible heading or custom header should act as the dialog label.
   */
  "aria-labelledby"?: string;

  /**
   * The id of an element that describes the modal dialog.
   * Useful for linking help text, instructions, or supporting content.
   */
  "aria-describedby"?: string;

  /**
   * Accessible label for the close button.
   * Defaults to "Close modal" in the base implementation.
   *
   * @default "Close modal"
   */
  closeButtonAriaLabel?: string;


  /**
   * Optional test ID for testing frameworks.
   *
   * @default dataTestId ?? "modal"
   */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;
}

export type IconButtonRef = HTMLButtonElement | HTMLAnchorElement;

export type IconButtonComponent = React.ForwardRefExoticComponent<
  IconButtonProps & React.RefAttributes<IconButtonRef>
>;

export interface BaseModalProps extends ModalProps {
  /**
   * Icon Button component dependency injected by the wrapper.
   */
  IconButton: IconButtonComponent;
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;
  /**
   * Portal Id.
   * @default "widget-portal"
   */
  portalId?: string;
}
