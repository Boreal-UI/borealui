import { RoundingType, ShadowType } from "@/types/types";
import { ReactElement, ReactNode } from "react";
import { IconButtonProps } from "../IconButton/IconButton.types";

/**
 * Props for the Modal component.
 */
export interface ModalProps {
  /** Additional class names for custom styling the modal content. */
  className?: string;

  /** The content to be rendered inside the modal. Expected to be a single React element. */
  children?: ReactElement;

  /** Optional modal title used for accessible labelling and default header content. */
  title?: ReactNode;

  /** Optional custom header content. */
  header?: ReactNode;

  /** Optional footer content. */
  footer?: ReactNode;

  /**
   * Rounding of the modal corners.
   * One of: "none" | "small" | "medium" | "large" | "full"
   */
  rounding?: RoundingType;

  /**
   * Shadow of the modal.
   * One of: "none" | "light" | "medium" | "strong" | "intense"
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
   */
  closeButtonAriaLabel?: string;

  /** Optional test ID for testing frameworks. */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;
}

export type IconButtonRef = HTMLButtonElement | HTMLAnchorElement;

export type IconButtonComponent = React.ForwardRefExoticComponent<
  IconButtonProps & React.RefAttributes<IconButtonRef>
>;

export interface BaseModalProps extends ModalProps {
  IconButton: IconButtonComponent;
  classMap: Record<string, string>;
  portalId?: string;
}
