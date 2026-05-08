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

  /** Optional interval (in milliseconds) at which to fetch more notifications. */
  pollInterval?: number;

  /** Whether to show a "Clear All" button if notifications are present. */
  showClearAll?: boolean;

  /** Maximum number of notifications to display. */
  maxNotifications?: number;

  /** If true, clears the oldest notifications when over the maximum. */
  clearOldOnOverflow?: boolean;

  /**
   * Rounding for the notification control.
   * One of: "none" | "small" | "medium" | "large" | "full"
   */
  controlRounding?: RoundingType;

  /**
   * Shadow for the notification control.
   * One of: "none" | "light" | "medium" | "strong" | "intense"
   */
  controlShadow?: ShadowType;

  /**
   * Rounding of the notification.
   * One of: "none" | "small" | "medium" | "large" | "full"
   */
  notificationRounding?: RoundingType;

  /**
   * Shadow of the notification.
   * One of: "none" | "light" | "medium" | "strong" | "intense"
   */
  notificationShadow?: ShadowType;

  /** Accessible label for the notification center region. */
  "aria-label"?: string;

  /** Optional ID of an external element that labels the notification center. */
  "aria-labelledby"?: string;

  /** Optional ID of an element that describes the notification center. */
  "aria-describedby"?: string;

  /** Accessible label for the notifications list when needed. */
  "list-aria-label"?: string;

  /** Live region politeness level for notification updates. */
  liveRegionPoliteness?: "off" | "polite" | "assertive";

  /** Which kinds of changes should be announced by assistive technology. */
  liveRegionRelevant?: React.AriaAttributes["aria-relevant"];

  /** Whether the live region should announce the entire region or only changed content. */
  liveRegionAtomic?: boolean;

  /** Accessible text announced when there are no notifications. */
  emptyMessage?: string;

  /** Prefix used to build dismiss button labels. */
  dismissButtonLabelPrefix?: string;

  /** Accessible label for the clear all button. */
  clearAllAriaLabel?: string;

  /** Optional test ID for testing frameworks. */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;
}

export interface BaseNotificationCenterProps extends NotificationCenterProps {
  Button: React.ComponentType<ButtonProps>;
  IconButton: React.ComponentType<IconButtonProps>;
  classMap: Record<string, string>;
}
