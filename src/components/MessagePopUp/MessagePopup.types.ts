import { RoundingType, ShadowType } from "@/types/types";
import { ButtonProps } from "../Button/Button.types";
import { IconButtonProps } from "../IconButton/IconButton.types";

/**
 * Props for the MessagePopup component.
 */
export interface MessagePopupProps {
  /**
   * Message text to be displayed within the popup dialog.
   */
  message: string;

  /**
   * Optional title shown in a top bar.
   * If provided, a header section is rendered above the message.
   */
  title?: React.ReactNode;

  /**
   * Callback function to execute when the popup is closed.
   */
  onClose: () => void;

  /**
   * Optional callback when the user confirms the message.
   */
  onConfirm?: () => void;

  /**
   * Optional callback when the user cancels the action.
   */
  onCancel?: () => void;

  /**
   * Optional rounding for controls in the message popup.
   * One of: "none" | "small" | "medium" | "large" | "full"
   */
  controlsRounding?: RoundingType;

  /**
   * Optional rounding for the message popup.
   * One of: "none" | "small" | "medium" | "large" | "full"
   */
  rounding?: RoundingType;

  /**
   * Optional shadow for the message popup.
   * One of: "none" | "light" | "medium" | "strong" | "intense"
   */
  shadow?: ShadowType;

  /**
   * Optional text for the confirm button (default: "Confirm").
   */
  confirmText?: string;

  /**
   * Optional text for the cancel button (default: "Cancel").
   */
  cancelText?: string;

  /**
   * Accessible label for the dialog when no visible title is available.
   * Prefer this when the popup does not render a heading.
   */
  "aria-label"?: string;

  /**
   * Optional ID of an external element that labels the dialog.
   * Overrides the internally generated label association when provided.
   */
  "aria-labelledby"?: string;

  /**
   * Optional ID of an external element that describes the dialog.
   * Useful when the popup description should point to custom content.
   */
  "aria-describedby"?: string;

  /**
   * Accessible label for the close button.
   * Defaults to "Close popup".
   */
  "aria-label-close-button"?: string;

  /**
   * Optional aria-live politeness setting for announcing popup content.
   * Only use when the popup message should be announced dynamically.
   */
  "aria-live"?: "off" | "polite" | "assertive";

  /**
   * Optional role for the popup container.
   * Defaults to "dialog". Use "alertdialog" for urgent confirmations.
   */
  dialogRole?: "dialog" | "alertdialog";

  /**
   * Optional additional class names for custom styling.
   */
  className?: string;

  /** Optional test ID for testing frameworks. */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;
}

export type ButtonRef = HTMLButtonElement;
export type IconButtonRef = HTMLButtonElement | HTMLAnchorElement;

export type ButtonComponent = React.ForwardRefExoticComponent<
  ButtonProps & React.RefAttributes<ButtonRef>
>;

export type IconButtonComponent = React.ForwardRefExoticComponent<
  IconButtonProps & React.RefAttributes<IconButtonRef>
>;

export interface BaseMessagePopupProps extends MessagePopupProps {
  Button: ButtonComponent;
  IconButton: IconButtonComponent;
  classMap: Record<string, string>;
}
