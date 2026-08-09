import { RoundingType, ShadowType } from "@/types/types";
import { ButtonProps } from "../Button/Button.types";
import { IconButtonProps } from "../IconButton/IconButton.types";
import React from "react";

type ButtonRef = HTMLButtonElement | HTMLAnchorElement;

export type ButtonComponent = React.ForwardRefExoticComponent<
  ButtonProps & { "data-testid"?: string } & React.RefAttributes<ButtonRef>
>;

export type IconButtonRef = HTMLButtonElement | HTMLAnchorElement;

export type IconButtonComponent = React.ForwardRefExoticComponent<
  IconButtonProps & React.RefAttributes<IconButtonRef>
>;

/**
 * Props for the MessagePopup component.
 */
export interface MessagePopupProps {
  /** The message to display inside the popup. */
  message: string;

  /** Optional title shown in the popup header. */
  title?: string;

  /** Callback fired when the popup is closed. */
  onClose: () => void;

  /** Callback fired when the confirm button is clicked. */
  onConfirm?: () => void;

  /** Callback fired when the cancel button is clicked. */
  onCancel?: () => void;

  /** Text for the confirm button. @default "Confirm" */
  confirmText?: string;

  /** Text for the cancel button. @default "Cancel" */
  cancelText?: string;

  /** Additional class name applied to the wrapper element. */
  className?: string;

  /** Additional class name applied to the dialog content element. */
  contentClassName?: string;

  /** Additional class name applied to the header element. */
  headerClassName?: string;

  /** Additional class name applied to the title element. */
  titleClassName?: string;

  /** Additional class name applied to the close button. */
  closeButtonClassName?: string;

  /** Additional class name applied to the body element. */
  bodyClassName?: string;

  /** Additional class name applied to the message element. */
  messageClassName?: string;

  /** Additional class name applied to the actions element. */
  actionsClassName?: string;

  /** Additional class name applied to the confirm button. */
  confirmButtonClassName?: string;

  /** Additional class name applied to the cancel button. */
  cancelButtonClassName?: string;

  /**
   * Rounding of the popup corners.
   * @default "medium"
   */
  rounding?: RoundingType;

  /**
   * Shadow of the popup.
   * @default "medium"
   */
  shadow?: ShadowType;

  /**
   * The ARIA role for the dialog element.
   * @default "dialog"
   */
  dialogRole?: "dialog" | "alertdialog";

  /** Accessible label for the dialog. */
  "aria-label"?: string;

  /** ID of an element that labels the dialog. */
  "aria-labelledby"?: string;

  /** ID of an element that describes the dialog. */
  "aria-describedby"?: string;

  /** aria-live value applied to the message element. */
  "aria-live"?: React.AriaAttributes["aria-live"];

  /** Accessible label for the close button. @default "Close" */
  "aria-label-close-button"?: string;

  /** Test ID for the root element. @default "message-popup" */
  testId?: string;

  /** Backward-compatible alias for testId. */
  "data-testid"?: string;
}

export interface BaseMessagePopupProps extends MessagePopupProps {
  /** Button component injected by the core or next wrapper. */
  Button: ButtonComponent;
  /** IconButton component injected by the core or next wrapper. */
  IconButton: IconButtonComponent;
  /** Framework-specific class name map. */
  classMap: Record<string, string>;
}
