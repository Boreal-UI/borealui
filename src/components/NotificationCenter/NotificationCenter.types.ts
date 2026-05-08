import { NotificationType, RoundingType, ShadowType } from "@/types/types";
import { ButtonProps } from "../Button/Button.types";
import { IconButtonProps } from "../IconButton/IconButton.types";

/**
 * Represents an individual notification to be displayed in the NotificationCenter.
 */
export interface Notification {
  /** Unique identifier for the notification. */
  id: string;

  /** The message text of the notification. */
  message: string;

  /**
   * The type of notification, used for styling and icon selection.
   * One of: "general" | "success" | "error" | "warning" | "info"
   */
  type?: NotificationType;

  /** Optional timestamp indicating when the notification was created. */
  timestamp?: Date;

  /** Optional duration (in milliseconds) after which the notification is automatically removed. */
  duration?: number;

  /** Optional accessible label for this specific notification item. */
  ariaLabel?: string;

  /** Optional accessible description for this specific notification item. */
  ariaDescription?: string;
}

/**
 * Props for the NotificationCenter component.
 */
export interface NotificationCenterProps {
  /** Array of notifications to display. */
  notifications: Notification[];

  /** Callback function to set the notifications array. */
  setNotifications?: React.Dispatch<React.SetStateAction<Notification[]>>;

  /** Callback function to remove a notification by its ID. */
  onRemove: (id: string) => void;

  /** Optional callback function to clear all notifications. */
  onClearAll?: () => void;

  /** Optional callback function to fetch more notifications. */
  fetchNotifications?: () => Promise<Notification[]>;

  /**
   * Optional interval (in milliseconds) at which to fetch more notifications.
   *
   * @default 5000
   */
  pollInterval?: number;

  /**
   * Whether to show a "Clear All" button if notifications are present.
   *
   * @default true
   */
  showClearAll?: boolean;

  /**
   * Maximum number of notifications to display.
   *
   * @default 10
   */
  maxNotifications?: number;

  /**
   * If true, clears the oldest notifications when over the maximum.
   *
   * @default true
   */
  clearOldOnOverflow?: boolean;

  /**
   * Rounding for the notification control.
   * One of: "none" | "small" | "medium" | "large" | "full"
   *
   * @default configured default rounding (fallback: "medium")
   */
  controlRounding?: RoundingType;

  /**
   * Shadow for the notification control.
   * One of: "none" | "light" | "medium" | "strong" | "intense"
   *
   * @default configured default shadow (fallback: "light")
   */
  controlShadow?: ShadowType;

  /**
   * Rounding of the notification.
   * One of: "none" | "small" | "medium" | "large" | "full"
   *
   * @default configured default rounding (fallback: "medium")
   */
  notificationRounding?: RoundingType;

  /**
   * Shadow of the notification.
   * One of: "none" | "light" | "medium" | "strong" | "intense"
   *
   * @default configured default shadow (fallback: "light")
   */
  notificationShadow?: ShadowType;

  /**
   * Accessible label for the notification center region.
   *
   * @default "Notification center"
   */
  "aria-label"?: string;

  /** Optional ID of an external element that labels the notification center. */
  "aria-labelledby"?: string;

  /** Optional ID of an element that describes the notification center. */
  "aria-describedby"?: string;

  /** Accessible label for the notifications list when needed. */
  "list-aria-label"?: string;

  /**
   * Live region politeness level for notification updates.
   *
   * @default "polite"
   */
  liveRegionPoliteness?: "off" | "polite" | "assertive";

  /**
   * Which kinds of changes should be announced by assistive technology.
   *
   * @default "additions text"
   */
  liveRegionRelevant?: React.AriaAttributes["aria-relevant"];

  /**
   * Whether the live region should announce the entire region or only changed content.
   *
   * @default false
   */
  liveRegionAtomic?: boolean;

  /**
   * Accessible text announced when there are no notifications.
   *
   * @default "No notifications."
   */
  emptyMessage?: string;

  /**
   * Prefix used to build dismiss button labels.
   *
   * @default "Dismiss notification"
   */
  dismissButtonLabelPrefix?: string;

  /**
   * Accessible label for the clear all button.
   *
   * @default "Clear all notifications"
   */
  clearAllAriaLabel?: string;


  /**
   * Optional test ID for testing frameworks.
   *
   * @default dataTestId ?? "notification-center"
   */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;
}

export interface BaseNotificationCenterProps extends NotificationCenterProps {
  Button: React.ComponentType<ButtonProps>;
  IconButton: React.ComponentType<IconButtonProps>;
  classMap: Record<string, string>;
}
